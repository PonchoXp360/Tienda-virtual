# CLAUDE.md — Tienda Virtual (ChAcHaRiTaS)
# ejemplotienda.rpyasociados.tech · RP & Asociados

---

## Identidad del Proyecto

| Propiedad | Valor |
|-----------|-------|
| Nombre app | ChAcHaRiTaS |
| Tipo | E-commerce + IA conversacional |
| URL producción | https://ejemplotienda.rpyasociados.tech |
| Repositorio | git@github.com:PonchoXp360/Tienda-virtual.git (rama: main) |
| Contenedor | `g44qs46l2t30w7wy3nt4rwgw-160232040893` |
| Puerto interno | 3000 |
| Deploy | Automático vía Coolify al hacer push a `main` (Nixpacks, Node 22) |
| Base de datos | PostgreSQL 18 — contenedor `jlutr66806weg5xq6g4bvpo0` · red `coolify` |
| Última auditoría | 2026-04-16 |

---

## Stack Tecnológico (verificado en código)

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js App Router | 15.5.9 |
| Lenguaje | TypeScript | ^5 |
| Estilos | Tailwind CSS + shadcn/ui + Radix UI | ^3.4 |
| ORM | Prisma | ^5.22 |
| Base de datos | PostgreSQL | 18 |
| Autenticación | Better Auth | ^1.6.5 |
| Pagos | Stripe | ^22 |
| IA | Google Gemini vía Genkit (`@genkit-ai/google-genai`) | ^1.28 |
| Estado global | Zustand | ^4.5 |
| Formularios | React Hook Form + Zod | — |
| Gráficas | Recharts | ^2.15 |

---

## Flujo Multi-Agente (ver detalle en `~/CLAUDE.md`)

| Rol | Herramienta | Responsabilidad |
|-----|------------|-----------------|
| UI/UX | Google Antigravity / Gemini | Diseño visual, prototipos, componentes |
| Backend / DevSecOps | Claude Code (Sonnet) | Lógica, API, DB, seguridad, commits |
| Fuente de verdad | GitHub (`PonchoXp360/Tienda-virtual`) | Todo cambio pasa por git |
| Deploy | Coolify (auto) | Push a `main` → build → producción |

> Claude Code **no rediseña UI** sin autorización. **Nunca edita código directo en producción.**

---

## Arquitectura — Mapa de Archivos

```
src/
├── app/                          ← Next.js App Router (server-first)
│   ├── page.tsx                  ← Home: Hero + CategoryGrid + FeaturedProducts
│   ├── productos/                ← Catálogo con filtro por categoría
│   ├── producto/[id]/            ← Detalle + botón "Agregar al carrito"
│   ├── carrito/                  ← Carrito (client component, Zustand)
│   ├── dashboard/                ← Panel usuario: pedidos + perfil (PROTEGIDO)
│   ├── login/ registro/          ← Auth (Better Auth)
│   ├── pago-exitoso/             ← Redirect post-Stripe
│   ├── pago-cancelado/           ← Redirect post-Stripe
│   └── api/
│       ├── auth/[...all]/        ← Handler de Better Auth
│       └── stripe/
│           ├── checkout/         ← POST: crea Stripe Checkout Session
│           └── webhook/          ← POST: recibe eventos Stripe firmados
├── ai/
│   ├── genkit.ts                 ← Instancia Genkit con plugin Google AI
│   └── flows/
│       ├── ai-customer-support-chatbot.ts   ← Chatbot: usa tool getProductDetails
│       └── ai-product-recommendations.ts   ← Recomendaciones de producto
├── components/
│   ├── layout/                   ← Header, Footer
│   ├── home/                     ← Componentes de la portada
│   └── dashboard/                ← Gráfica de gastos mensuales
├── hooks/                        ← use-mobile, use-debounce, use-toast
├── lib/
│   ├── actions/products.ts       ← Server Actions: searchProducts, getAllProducts
│   ├── auth.ts                   ← Configuración Better Auth (server)
│   ├── auth-client.ts            ← Cliente Better Auth (browser)
│   ├── prisma.ts                 ← Singleton PrismaClient
│   ├── stripe.ts                 ← Singleton Stripe (lazy init)
│   ├── images.ts                 ← Helper getPlaceholderImage()
│   ├── seed.ts                   ← Siembra de datos (npm run db:seed)
│   └── types.ts                  ← Tipos compartidos
├── store/
│   └── cart-store.ts             ← Zustand: carrito del usuario
└── middleware.ts                 ← Protege /dashboard — redirige a /login sin sesión
```

---

## Modelos de Base de Datos (Prisma)

```
Product     → id(cuid), name, description, price(Float), imageId, stock, category
Category    → id(cuid), name(unique), imageId
User        → id(cuid), name, email(unique), emailVerified, image?  [Better Auth]
Session     → token(unique), expiresAt, ipAddress, userAgent        [Better Auth]
Account     → providerId+accountId(unique)                          [OAuth]
Verification → identifier+value(unique)                            [email verify]
Order       → userId, status(PENDING|PAID|SHIPPED|DELIVERED|CANCELLED), total, stripeSessionId(unique)
OrderItem   → orderId, productId, quantity, price
```

---

## Flujo de Pago Stripe

```
1. Usuario en /carrito → POST /api/stripe/checkout
2. Server crea Stripe Checkout Session con line_items en MXN
3. Usuario redirigido a Stripe (externo)
4. Stripe redirige a /pago-exitoso?session_id=... o /pago-cancelado
5. Stripe envía evento a /api/stripe/webhook (firma HMAC verificada)
6. Webhook actualiza Order a PAID en BD ✅ (handleCheckoutCompleted activo desde 2026-04-17)
```

---

## Variables de Entorno (gestionadas en Coolify — NUNCA en código)

| Variable | Propósito | Estado |
|----------|-----------|--------|
| `DATABASE_URL` | Conexión PostgreSQL | ✅ Configurada |
| `BETTER_AUTH_SECRET` | Firma de sesiones | ✅ Configurada |
| `NEXT_PUBLIC_APP_URL` | URL pública (cliente + baseURL auth) | ✅ Configurada |
| `STRIPE_SECRET_KEY` | Stripe server-side (sk_test_...) | ✅ Modo test |
| `STRIPE_WEBHOOK_SECRET` | Verificar firma webhook | ✅ `whsec_CxzU...` — real |
| `GEMINI_API_KEY` | Gemini AI (server-side) | ✅ Configurada |
| `RESEND_API_KEY` | Emails transaccionales | ✅ Configurada |
| `GOOGLE_CLIENT_ID` | OAuth Google login | ⚠️ Ausente — botón Google en UI pero no funciona |
| `GOOGLE_CLIENT_SECRET` | OAuth Google login | ⚠️ Ausente — requiere Google Cloud Console |
| ~~`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`~~ | ~~Stripe cliente~~ | ❌ No necesaria — checkout es server-side redirect |
| ~~`BETTER_AUTH_URL`~~ | ~~URL auth~~ | ❌ No existe — usar `NEXT_PUBLIC_APP_URL` |
| ~~`GOOGLE_GENAI_API_KEY`~~ | ~~Gemini~~ | ❌ Nombre incorrecto — es `GEMINI_API_KEY` |

---

## ═══ REGLAS DE ARQUITECTURA INQUEBRANTABLES ═══

### 1. Nunca leer ni imprimir secretos
- Ninguna IA, script o log debe imprimir `process.env.STRIPE_SECRET_KEY`,
  `BETTER_AUTH_SECRET`, `DATABASE_URL` ni ninguna variable que contenga contraseñas o tokens.
- Si necesitas verificar que una variable existe, usa `!!process.env.VAR_NAME`.

### 2. Toda comunicación con Stripe va por el servidor
- Los endpoints `/api/stripe/*` son Server Routes (no Client Components).
- `getStripe()` (lib/stripe.ts) es el único punto de instanciación — no crear
  instancias directas de `new Stripe(...)` en ningún otro archivo.
- El webhook SIEMPRE debe verificar la firma con `stripe.webhooks.constructEvent()`.
  Nunca procesar un evento de Stripe sin verificación de firma.

### 3. Prisma: singleton obligatorio
- Usar siempre `import { prisma } from '@/lib/prisma'`.
- Nunca instanciar `new PrismaClient()` directamente en componentes o rutas.
- Migraciones: solo con `npm run db:migrate` — nunca `db:push` en producción.

### 4. Server Actions y Server Components son la regla
- Los datos del catálogo se obtienen vía Server Actions (`src/lib/actions/`).
- Solo usar `'use client'` cuando sea estrictamente necesario (interactividad de UI).
- El estado del carrito vive en Zustand (cliente) — no en la BD hasta el checkout.

### 5. Autenticación: Better Auth, sin atajos
- No implementar lógica de autenticación custom. Todo pasa por `auth` (server) 
  o `authClient` (cliente).
- La cookie de sesión se llama `better-auth.session_token` — el middleware la valida.
- `requireEmailVerification` está en `false` — cambiar a `true` cuando Resend esté configurado.
- El middleware solo protege `/dashboard`. Si se añaden rutas sensibles (ej. `/admin`),
  agregarlas a `PROTECTED_ROUTES` en `middleware.ts`.

### 6. TypeScript estricto en lógica nueva
- `next.config.ts` tiene `ignoreBuildErrors: true` y `ignoreDuringBuilds: true`
  como workaround temporal de build. NO es permiso para escribir código mal tipado.
- Todo código nuevo debe compilar sin errores de TypeScript.
- No usar `any` — si el tipo es desconocido, usar `unknown` y hacer type guard.

### 7. Imágenes: solo de dominios autorizados en next.config.ts
- Dominios permitidos: `placehold.co`, `images.unsplash.com`, `picsum.photos`.
- Al integrar MinIO, agregar su hostname a `remotePatterns` antes de usarlo.
- No hardcodear URLs de imágenes externas en componentes — usar `getPlaceholderImage()`.

### 8. IA (Genkit/Gemini): solo en Server-side
- Los flows de Genkit (`src/ai/flows/`) son `'use server'` — nunca ejecutarlos en cliente.
- No exponer la `GOOGLE_GENAI_API_KEY` al browser bajo ninguna circunstancia.
- El chatbot tiene acceso solo a datos de catálogo público — no a datos de usuarios ni órdenes.

### 9. Límites que ninguna IA debe cruzar sin confirmación explícita del usuario
- Ejecutar `prisma migrate` en producción
- Modificar `STRIPE_WEBHOOK_SECRET` o cualquier variable en Coolify
- Hacer `git push` a `main` (dispara deploy automático)
- Borrar o resetear la base de datos PostgreSQL del contenedor `jlutr66806weg5xq6g4bvpo0`
- Modificar `middleware.ts` (puede dejar rutas protegidas expuestas)
- Cambiar `mode` de Stripe de `test` a `live`

### 10. Convenciones de código
- **Componentes**: PascalCase, un componente por archivo
- **Server Actions**: camelCase, prefijo de verbo (`getProducts`, `createOrder`)
- **Rutas API**: `route.ts` con métodos HTTP explícitos (`GET`, `POST`)
- **Tipos**: definidos en `src/lib/types.ts` o inline con Zod schemas
- **Imports**: alias `@/` para `src/` — nunca rutas relativas largas `../../..`
- **Español**: nombres de rutas y UI en español; código (variables, funciones) en inglés

---

## Estado actual (verificado 2026-04-20)

| Item | Estado |
|------|--------|
| Stripe webhook secret real | ✅ `whsec_CxzU...` activo |
| handleCheckoutCompleted() | ✅ activo — órdenes persisten en BD |
| Productos en DB | ✅ 10 productos, 6 categorías |
| TypeScript | ✅ 0 errores |
| Stripe API version | ✅ `2026-03-25.dahlia` |
| Security headers | ✅ X-Frame, HSTS, CSP, nosniff |
| Price validation | ✅ checkout valida precios contra BD (commit 2fad27f) |
| Rate limiting | ✅ auth (10/min) + checkout (20/min) |
| Google OAuth button | ✅ eliminado — credenciales ausentes. Reactivar al agregar GOOGLE_CLIENT_ID |
| Último commit | `2fad27f` — en producción |

## Pendientes activos

| Prioridad | Tarea | Impacto |
|-----------|-------|---------|
| 🟡 | Implementar `payment_intent.payment_failed` en webhook | Órdenes fallidas no se cancelan |
| 🟡 | Configurar Resend DNS (SPF/DKIM) + activar `requireEmailVerification: true` | Sin emails de confirmación |
| 🟡 | Conectar MinIO como storage de imágenes | Imágenes son placeholders externos |
| 🟡 | Implementar panel admin `/admin` (User.role ya en schema) | Gestión de productos y órdenes |
| 🟢 | Agregar `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` en Coolify para reactivar OAuth | Google login opcional |
| 🟢 | Switch Stripe de test a live (cuando aplique) | Pagos reales |

---

## Comandos Útiles

```bash
# Desarrollo local
npm run dev              # http://localhost:9002

# Base de datos
npm run db:migrate       # Aplicar migraciones pendientes
npm run db:studio        # GUI de Prisma (localhost:5555)
npm run db:seed          # Sembrar datos de prueba

# Build y verificación
npm run build            # Build de producción
npm run typecheck        # Verificar tipos sin compilar

# Docker — producción
docker logs -f g44qs46l2t30w7wy3nt4rwgw-160232040893   # Logs app
docker exec -it jlutr66806weg5xq6g4bvpo0 psql -U postgres  # DB shell
```

---

## Notas de Arquitectura

- `apphosting.yaml` y `.idx/` son remanentes de Firebase Studio — no se usan en producción
- El build usa Nixpacks con Node 22 (aunque el VPS tiene Node 18 nativo — no confundir)
- La BD PostgreSQL 18 está en la red Docker `coolify`, accesible por hostname del contenedor
- El carrito persiste en Zustand (localStorage) — se pierde al limpiar el browser
- Genkit corre en modo dev con `genkit:dev` — en producción los flows se llaman directamente
