import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { sendOrderConfirmation } from '@/lib/email';
import type Stripe from 'stripe';

/**
 * Webhook de Stripe — recibe eventos de pago y actualiza la BD.
 *
 * Para probar localmente:
 *   stripe listen --forward-to localhost:9002/api/stripe/webhook
 *
 * En producción: configurar en dashboard.stripe.com/webhooks
 * con el endpoint: https://tudominio.com/api/stripe/webhook
 *
 * Eventos manejados:
 *   - checkout.session.completed → orden PAID
 *   - payment_intent.payment_failed → orden CANCELLED (TODO)
 */
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Firma de Stripe faltante.' }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET no configurado.');
    return NextResponse.json({ error: 'Webhook no configurado.' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[Stripe Webhook] Firma inválida:', err);
    return NextResponse.json({ error: 'Firma inválida.' }, { status: 400 });
  }

  // ─── Manejar eventos ─────────────────────────────────────────
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentFailed(paymentIntent);
      break;
    }

    default:
      // Evento no manejado — ignorar silenciosamente
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metaUserId = session.metadata?.userId;
  const userId = metaUserId && metaUserId !== 'guest' ? metaUserId : null;
  const stripeSessionId = session.id;
  const total = (session.amount_total ?? 0) / 100;
  const customerEmail = session.customer_details?.email ?? session.customer_email ?? null;
  const paymentId = typeof session.payment_intent === 'string' ? session.payment_intent : null;

  let order: { id: string };
  let created = false;
  let lineItems: Stripe.LineItem[] = [];

  try {
    const stripe = getStripe();
    const { prisma } = await import('@/lib/prisma');

    const sessionWithItems = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items.data.price.product'],
    });
    lineItems = sessionWithItems.line_items?.data ?? [];

    const orderItems = lineItems.flatMap((item) => {
      const product = item.price?.product as Stripe.Product | null;
      const productId = product?.metadata?.productId;
      return productId
        ? [{ productId, quantity: item.quantity ?? 1, price: (item.amount_total ?? 0) / 100 }]
        : [];
    });

    // Items y stock sólo se tocan cuando la orden se crea por primera vez:
    // los reintentos de Stripe caen en la rama "ya existe".
    const result = await prisma
      .$transaction(async (tx) => {
        const existing = await tx.order.findUnique({ where: { stripeSessionId } });
        if (existing) {
          const updated = await tx.order.update({
            where: { id: existing.id },
            data: { status: 'PAID', stripePaymentId: paymentId, customerEmail: existing.customerEmail ?? customerEmail },
          });
          return { order: updated, created: false };
        }

        const createdOrder = await tx.order.create({
          data: {
            userId,
            customerEmail,
            status: 'PAID',
            total,
            stripeSessionId,
            stripePaymentId: paymentId,
            items: { create: orderItems },
          },
        });
        for (const it of orderItems) {
          await tx.$executeRaw`UPDATE "Product" SET stock = GREATEST(stock - ${it.quantity}, 0) WHERE id = ${it.productId}`;
        }
        return { order: createdOrder, created: true };
      })
      .catch(async (err: unknown) => {
        // Reintento concurrente que ganó la carrera del unique(stripeSessionId)
        if (typeof err === 'object' && err && (err as { code?: string }).code === 'P2002') {
          const winner = await prisma.order.findUnique({ where: { stripeSessionId } });
          if (winner) return { order: winner, created: false };
        }
        throw err;
      });

    order = result.order;
    created = result.created;
    console.log('[Stripe] Orden guardada:', { stripeSessionId, userId, total, created, items: orderItems.length });
  } catch (err) {
    console.error('[Stripe] Error guardando orden:', err);
    return;
  }

  if (!created) return;

  // Email y n8n son independientes: si Resend falla, n8n igual se notifica.
  if (customerEmail) {
    try {
      const itemsForEmail = lineItems
        .map((item) => {
          const prod = item.price?.product as Stripe.Product | null;
          return prod
            ? { name: prod.name, quantity: item.quantity ?? 1, price: (item.amount_total ?? 0) / 100 }
            : null;
        })
        .filter(Boolean) as Array<{ name: string; quantity: number; price: number }>;

      await sendOrderConfirmation({
        to: customerEmail,
        customerName: session.customer_details?.name ?? 'Cliente',
        orderId: order.id,
        total,
        items: itemsForEmail,
      });
    } catch (err) {
      console.error('[Stripe] Error enviando email de confirmación:', err);
    }
  }

  if (process.env.N8N_NUEVA_ORDEN_WEBHOOK_URL) {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (process.env.N8N_WEBHOOK_TOKEN) headers['x-rp-token'] = process.env.N8N_WEBHOOK_TOKEN;
      await fetch(process.env.N8N_NUEVA_ORDEN_WEBHOOK_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          orderId: order.id,
          total,
          customerEmail: customerEmail ?? '',
          itemCount: lineItems.length,
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      console.error('[Stripe] Aviso a n8n falló (la tienda no depende de n8n):', err);
    }
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { prisma } = await import('@/lib/prisma');
    await prisma.order.updateMany({
      where: { stripePaymentId: paymentIntent.id },
      data: { status: 'CANCELLED' },
    });
    console.log('[Stripe] Orden cancelada por pago fallido:', paymentIntent.id);
  } catch (err) {
    console.error('[Stripe] Error cancelando orden:', err);
  }
}
