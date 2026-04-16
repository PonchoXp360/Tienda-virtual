import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

// Las rutas de auth son siempre dinámicas
export const dynamic = 'force-dynamic';

export const { GET, POST } = toNextJsHandler(auth);
