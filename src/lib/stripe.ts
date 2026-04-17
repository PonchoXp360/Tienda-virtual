import Stripe from 'stripe';

// Inicialización lazy: solo se instancia cuando se llama getStripe(),
// no durante el build. Esto evita el error en producción cuando la
// variable de entorno se inyecta en runtime (Firebase, Coolify, Vercel).
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      'STRIPE_SECRET_KEY no está configurada. Agrégala en las variables de entorno.'
    );
  }
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-03-25.dahlia',
      typescript: true,
    });
  }
  return _stripe;
}
