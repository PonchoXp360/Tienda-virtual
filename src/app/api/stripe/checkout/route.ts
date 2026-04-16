import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';
import type { CartItem } from '@/store/cart-store';

export async function POST(request: Request) {
  try {
    // Obtener sesión de usuario (opcional — checkout funciona sin login)
    const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);

    const body = await request.json();
    const items: CartItem[] = body.items;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío.' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:9002';

    // Construir line_items para Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: item.name,
          description: item.description.slice(0, 200),
          // Stripe acepta imágenes públicas; aquí las omitimos para evitar URLs de placehold.co no permitidas
        },
        unit_amount: Math.round(item.price * 100), // Stripe usa centavos
      },
      quantity: item.quantity,
    }));

    // Crear sesión de pago en Stripe
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
