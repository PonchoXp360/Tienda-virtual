import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
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
      console.log('[Stripe] Pago fallido:', paymentIntent.id);
      // TODO: marcar orden como CANCELLED en BD
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
  const total = (session.amount_total ?? 0) / 100; // convertir de centavos

  console.log('[Stripe] Pago completado:', { stripeSessionId, userId, total });

  // TODO: cuando DATABASE_URL esté configurada, crear la orden en BD:
  //
  // const { prisma } = await import('@/lib/prisma');
  // await prisma.order.upsert({
  //   where: { stripeSessionId },
  //   update: { status: 'PAID', stripePaymentId: session.payment_intent as string },
  //   create: {
  //     userId: userId ?? 'guest',
  //     status: 'PAID',
  //     total,
  //     stripeSessionId,
  //     stripePaymentId: session.payment_intent as string,
  //   },
  // });
}
