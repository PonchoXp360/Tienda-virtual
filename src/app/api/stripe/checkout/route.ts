import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';

    if (!rateLimit(ip, 20, 60 * 1000)) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Espera un momento.' },
        { status: 429 }
      );
    }

    const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);

    const body = await request.json();
    const clientItems: Array<{ id: string; quantity: number }> = body.items;

    if (!clientItems || clientItems.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío.' }, { status: 400 });
    }

    // Fetch real prices from DB — never trust client-provided prices
    const productIds = [...new Set(clientItems.map((i) => i.id))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, description: true, price: true },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: 'Uno o más productos no existen.' }, { status: 400 });
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    const lineItems = clientItems.map((item) => {
      const product = productMap.get(item.id)!;
      return {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: product.name,
            description: product.description.slice(0, 200),
            metadata: { productId: product.id },
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: Math.max(1, Math.min(item.quantity, 99)),
      };
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:9002';

    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${appUrl}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/carrito?cancelled=true`,
      customer_email: session?.user?.email ?? undefined,
      metadata: {
        userId: session?.user?.id ?? 'guest',
      },
      payment_method_types: ['card'],
      locale: 'es',
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('[Stripe Checkout]', error);
    return NextResponse.json(
      { error: 'Error al crear la sesión de pago. Intenta de nuevo.' },
      { status: 500 }
    );
  }
}
