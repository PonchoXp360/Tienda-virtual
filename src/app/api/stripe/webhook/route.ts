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
  const userId = session.metadata?.userId;
  const stripeSessionId = session.id;
  const total = (session.amount_total ?? 0) / 100;

  try {
    const stripe = getStripe();
    const { prisma } = await import('@/lib/prisma');

    // Expandir line_items para obtener productId de cada ítem
    const sessionWithItems = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items.data.price.product'],
    });

    const order = await prisma.order.upsert({
      where: { stripeSessionId },
      update: {
        status: 'PAID',
        stripePaymentId: session.payment_intent as string,
      },
      create: {
        userId: userId ?? 'guest',
        status: 'PAID',
        total,
        stripeSessionId,
        stripePaymentId: session.payment_intent as string,
      },
    });
    console.log('[Stripe] Orden guardada:', { stripeSessionId, userId, total });

    // Crear OrderItems — productId viene de product_data.metadata.productId
    const lineItems = sessionWithItems.line_items?.data ?? [];
    for (const item of lineItems) {
      const product = item.price?.product as Stripe.Product | null;
      const productId = product?.metadata?.productId;
      if (productId) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId,
            quantity: item.quantity ?? 1,
            price: (item.amount_total ?? 0) / 100,
          },
        });
      }
    }
    console.log('[Stripe] OrderItems creados:', lineItems.length, 'ítems');

    // Enviar email con detalle de ítems
    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name ?? 'Cliente';
    if (customerEmail) {
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
        customerName,
        orderId: order.id,
        total,
        items: itemsForEmail,
      });
    }
  } catch (err) {
    console.error('[Stripe] Error guardando orden:', err);
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
