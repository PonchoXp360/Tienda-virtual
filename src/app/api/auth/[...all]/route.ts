import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { rateLimit } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';

// Las rutas de auth son siempre dinámicas
export const dynamic = 'force-dynamic';

const handlers = toNextJsHandler(auth);

export const GET = handlers.GET;

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  // 10 intentos por minuto por IP en endpoints de autenticación
  if (!rateLimit(ip, 10, 60 * 1000)) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Espera un momento.' },
      { status: 429 }
    );
  }

  return handlers.POST(request);
}
