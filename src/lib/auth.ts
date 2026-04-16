import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  // ─── Email + contraseña ───────────────────────────────────
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // cambiar a true en producción con Resend
  },

  // ─── OAuth Google ─────────────────────────────────────────
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    },
  },

  // ─── Config de sesión ─────────────────────────────────────
  session: {
    expiresIn: 60 * 60 * 24 * 7,        // 7 días
    updateAge: 60 * 60 * 24,            // renovar si queda < 1 día
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,                   // cache cookie 5 min
    },
  },

  // ─── Configuración de la app ──────────────────────────────
  appName: 'ChAcHaRiTaS',
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:9002',
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:9002',
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
