# Plan de acción — juliandelgado.com.au

**Versión:** 2.3 (2026-10-31). Consolida la auditoría del 2026-10-30 y la batería de análisis del 2026-10-31.
**Fuentes:** `docs/audits/site-audit-2026-10-30.md` (design-audit, web-design-guidelines, cro, seo-audit, ai-seo) + 13 análisis adicionales listados en la sección 6.
**Contexto de negocio:** `.agents/product-marketing.md` (v8). Objetivo: 2 clientes directos antes del 2027-04-30.

## Cómo usar este archivo

- Cada ítem tiene un ID estable. Los de sprint son `S0-NN`, `S1-NN`, `S2-NN`, `S3-NN`. Los hallazgos de cada análisis conservan su prefijo (`SEC-`, `TS-`, `PERF-`, `A11Y-`, `DB-`, `SF-`, `DEAD-`, `TYPO-`, `UX-`, `COPY-`, `IA-`, `SCHEMA-`, `MEAS-`, `E2E-`) y viven en la sección 6; cuando un hallazgo ya está cubierto por un ítem de sprint, lo dice entre paréntesis.
- Estado: `[ ]` pendiente · `[~]` en curso · `[x]` hecho · `[-]` descartado (anotar por qué).
- Nada se implementa sin aprobación explícita. Se ejecuta por sprint y se revisa antes de pasar al siguiente.
- Los análisis se hicieron en modo solo lectura sobre el código (`next dev`, Chromium). Los números de rendimiento son de desarrollo; los de producción se anotan en S3-13.

---

## 0. Lo que cambió con la batería completa

Los cinco bloqueos del informe original siguen siendo los primeros. La batería agregó cuatro cosas que suben al Sprint 0 o 1 porque son de seguridad o pérdida de datos, no de pulido:

| Prioridad | Hallazgo nuevo | Origen |
|-----------|----------------|--------|
| Crítico | **El formulario de contacto muestra "Message sent!" aunque la API devuelva 400, 429 o 500**, y la ruta de API nunca lee el `{error}` que devuelve Resend: un lead puede perderse en silencio por los dos lados. | SF-01, SF-03, TS-06 |
| Crítico | **El seed, si se corre contra la base remota, pisa la contraseña del admin** con `admin123` si falta la variable, resetea `active`, y sobrescribe todos los campos de case studies, planes y media (incluido `deleted`, lo que resucita borrados). Hay que arreglarlo **antes** de correr `npm run db:seed` (decisión D-05). | SEC-02, DB-23, DB-24 |
| Alto | **La API de admin devuelve el hash bcrypt de cada usuario** en `GET /api/admin/users` y `/users/[id]`, también al rol `viewer`. | SEC-01 |
| Alto | **Las páginas públicas de case study y blog sirven borradores y soft-deleted** por slug (`findUniqueOrThrow` sin filtro de `status`/`deleted`), y cualquier caída de la base se convierte en un 404 que se cachea. | DB-01, SF-10 |

Otros resultados relevantes: Work y Pricing renderizan vacíos ante una falla de base sin registrar nada (SF-08, SF-09); hay dos migraciones iniciales idénticas que rompen un `migrate deploy` limpio (DB-20); no existe **ningún** evento de analítica en el código, solo el pageview de GA4 y GTM cargados a la vez (MEAS-01); el gestor de fuentes y la paleta están bien elegidos pero mal implementados (4 familias, 12 archivos); y hay 25 hallazgos de rendimiento con ahorro estimado de ~1,2 MB en la carga inicial.

Una nota de higiene: el agente de seguridad leyó `.env` y `.env.local` durante la revisión. Los valores no salieron de esta sesión, pero el propio informe recomienda rotar `AUTH_SECRET`, la contraseña de la base y las claves de ImageKit, Cloudinary y Resend si el transcript se comparte en algún lado (SEC-11).

---

## 1. Sprint 0 — Antes de tocar nada (medio día)

| ID | Estado | Ítem | Archivos | Origen |
|----|--------|------|----------|--------|
| S0-01 | [x] | Tests Playwright de regresión (sección 6.11) para: navegación sin 404, CTA → formulario → éxito, menú móvil, 320/768/1440. Se escriben antes del Sprint 1. | `tests/e2e/*.spec.ts` | E2E |
| S0-02 | [x] | Seed seguro: exigir `SEED_ADMIN_PASSWORD` (≥ 12 caracteres, sin fallback), sacar `hashedPassword` y `active` del `update` del admin, `update: {}` (create-only) o campos mínimos para case studies, planes, media, integraciones y settings; nunca `id` en `update`; negarse a correr si el host no es local salvo `ALLOW_PROD_SEED=1`. | `src/lib/db/seed.ts` | SEC-02, DB-23, DB-24 |
| S0-03 | [ ] | Una sola migración baseline: comparar `_prisma_migrations` con `prisma migrate status` contra una base descartable (no producción) y borrar la carpeta duplicada o resolver con `migrate resolve`. | `prisma/migrations/0_init_postgresql`, `20260311210645_init_postgresql` | DB-20 |
| S0-04 | [x] | `.gitignore`: agregar `*.db`, `prisma_*output.txt`, `.playwright-mcp/`, `.idea/`; borrar `dev.db`, `prisma_output.txt`, `prisma_migrate_output.txt` del root; agregar `dotenv` a devDependencies (lo usan `prisma.config.ts` y el seed y no está listado). Confirmar que `prisma/migrations` se commitea (hoy está untracked). | `.gitignore`, `package.json` | SEC-23, DB-21, DEAD-29 |
| S0-05 | [x] | Base de datos de desarrollo separada de la remota (hoy `.env` y `.env.local` apuntan a db.prisma.io para dev, seed y migraciones). | `.env.local` | SEC-11, DB-25 |
| S0-06 | [-] | Rotar secretos como higiene tras la revisión: `AUTH_SECRET`, password de la base, ImageKit, Cloudinary, Resend. | host / proveedores | SEC-11 |
| S0-07 | [x] | Decidir D-01…D-10 (sección 5). | — | — |
| S0-08 | [x] | Baseline de medición: anotar sesiones y usuarios de GA4 de los últimos 30 días (solo pageviews, no hay eventos) para comparar después. | GA4 | MEAS-07 |

## 2. Sprint 1 — Destrabar conversión y cerrar agujeros (2–3 días)

| ID | Estado | Ítem | Archivos | Origen |
|----|--------|------|----------|--------|
| S1-01 | [x] | CTA "Start a project" apunta a `/contact` (404). Crear `/contact` real (ver IA-03) o apuntar a `/#contact`. | `header/_components/DesktopCTA.tsx:30`, `MobileMenu.tsx:106` | audit / cro |
| S1-02 | [x] | Logo apunta a `/public` (404). Cambiar a `/`. | `header/_components/HeaderLogo.tsx:12` | audit |
| S1-03 | [x] | Crear `/privacy` y `/terms` (404 hoy; necesarios para Meta Ads y confianza del formulario). | `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` | seo / cro |
| S1-04 | [x] | Hero: un solo `<h1>` con propuesta de valor, **expuesto** (hoy el h1 real está `visibility:hidden` y el visible dentro de `aria-hidden`, así que la home no tiene h1 accesible); `FloatingTitle` pasa a `<div aria-hidden>`; tags de slide alineados a la oferta. Copy según D-03. | `Hero/HeroSection.tsx:313,343`, `Hero/FloatingTitle.tsx:57`, `hero.constants.ts` | cro / seo / A11Y-01 / COPY-01, COPY-13 |
| S1-05 | [x] | CTA primario "Book a 30-minute fit call"; repetirlo tras Work, tras Pricing y en el footer. Depende de D-06 (herramienta de reserva). | header, `Work.tsx`, `Pricing.tsx`, `Footer.tsx` | cro |
| S1-06 | [x] | Contacto en móvil: no montar el `<video>` en `< lg` ni con reduced motion; formulario en la primera pantalla tras el título. | `Contact/ContactSection.tsx:100` | audit / PERF-13 |
| S1-07 | [x] | `/api/contact`: honeypot (`hp` con valor → 200 falso sin enviar, logueado); rate limit por IP (5/h) con `RateLimitError`; leer `{error}` de cada `resend.emails.send` y lanzar `ServiceUnavailableError`; auto-reply best-effort (try/catch, warning); `validateRequestBody` para 400 con errores de campo; `.max()` en todos los campos, `topics` acotado, `website` solo http(s). | `src/app/api/contact/route.ts`, `Contact/contact-data.ts` | SEC-03/04/05/06, SF-03/04/05/06 |
| S1-08 | [x] | `ContactForm`: ramificar en `res.ok`; toast de error con el email como enlace y los valores conservados; capturar `err: unknown` y reportarlo; `aria-live`. Disparar el evento de analítica solo en la rama de éxito (MEAS-04). | `Contact/ContactForm.tsx:44-51` | SF-01/02, TS-06/07 |
| S1-09 | [x] | Headers de seguridad en `next.config`: CSP con nonce (GTM/GA, Cloudinary, ImageKit), HSTS, nosniff, `frame-ancestors 'none'`, Referrer-Policy, Permissions-Policy; `poweredByHeader: false`. | `next.config.ts` | SEC-10 |
| S1-10 | [x] | `GET /api/admin/users*`: `omit: { hashedPassword: true }` en todas las consultas de usuario y listado solo para admin. | `src/lib/services/users.ts:28-45` | SEC-01 |
| S1-11 | [x] | Lecturas públicas filtradas: `getPublishedCaseStudyBySlug` / `getPublishedBlogPostBySlug` con `findFirst({ slug, status: 'published', deleted: false })`; `notFound()` solo cuando el registro no existe; cualquier otro error se loguea y se relanza. Lo mismo en `generateMetadata`. | `lib/services/case-studies.ts:47`, `blog.ts:55`, `case-studies/[slug]/page.tsx:25-45`, `blog/[slug]/page.tsx:49-68` | DB-01, SF-10/11, TS-10 |
| S1-12 | [x] | `WorkSection` y `PricingSection`: no tragar errores; loguear y relanzar para que ISR conserve la última versión buena, o renderizar "temporarily unavailable". `getActivePlans()` con `where: { active: true }`. | `Work/WorkSection.tsx:11`, `Pricing/PricingSection.tsx:12`, `lib/services/plans.ts:4` | SF-08/09, DB-03 |
| S1-13 | [x] | Sitemap generado desde la base (case studies y posts publicados, `updatedAt` real). | `src/app/sitemap.ts` | seo / SF-14 |
| S1-14 | [x] | `/login` con `robots: noindex` y título propio; `robots.ts` con `Disallow /admin/`, `/login`. | `src/app/login/page.tsx`, `src/app/robots.ts` | seo |
| S1-15 | [x] | `/blog` fuera del nav y del sitemap hasta tener posts (D-02). | header, `footer.data.ts`, `sitemap.ts` | seo |
| S1-16 | [x] | Favicon: PNG 32/180/512 + manifest; `layout.tsx` apunta hoy a un `/favicon.png` inexistente. | `src/app/layout.tsx`, `public/` | audit |
| S1-17 | [x] | Quitar "40+ Projects" de About; métricas verificables; año en una constante. | `about-me/_components/AboutHero.tsx:10,86` | cro / COPY-09 |
| S1-18 | [x] | JSON-LD: helper `safeJsonLd()` que escape `<` como `<` en todos los `dangerouslySetInnerHTML`. | `components/seo/*.tsx`, `blog/[slug]/page.tsx:217` | SEC-18 |
| S1-19 | [x] | Sesión: en el callback `jwt`, invalidar el token si el usuario no existe o `!active`; acortar `maxAge`; rate limit en login y `bcrypt.compare` contra un hash dummy cuando el usuario no existe. | `src/lib/auth/auth.ts:18-46` | SEC-07, SEC-09 |
| S1-20 | [x] | `GoogleAnalytics` solo si el ID no está vacío; un único camino de medición (GTM con el tag de GA4 adentro) para no duplicar pageviews. | `src/app/layout.tsx:95-116` | SF-15, MEAS-01 |
| S1-21 | [x] | Eventos mínimos de analítica (MEAS-02): `cta_clicked`, `contact_form_submitted` (solo éxito), `contact_form_failed`, `fit_call_booked`; marcar los dos últimos como key events en GA4 y verificar en DebugView con un email de prueba identificable. | `ContactForm.tsx`, CTAs, GTM | MEAS-02/03/04 |

## 3. Sprint 2 — Legibilidad, accesibilidad y confianza (3–4 días)

| ID | Estado | Ítem | Archivos | Origen |
|----|--------|------|----------|--------|
| S2-01 | [x] | Header: nav de escritorio desde `lg` (a 768 px el CTA queda cortado) o nav de 4 ítems: Work · Services · Pricing · About + CTA. | `DesktopNav.tsx:20`, `DesktopCTA.tsx:21`, `MobileToggle.tsx:15` | audit / IA-05 |
| S2-02 | [x] | `data-header-theme="dark"` en Work, Case studies, About hero y footer; o detección de luminancia. | `Work.tsx`, `case-studies/page.tsx`, `AboutHero.tsx` | audit |
| S2-03 | [x] | Contraste ≥ 4.5:1 en todo el texto funcional: footer (#383838, #5a5a5a), nav, labels rojos sobre foto, h2 "Case studies" (white/0.18), labels de sección 0.2–0.22, FAQ cerradas y respuesta, descripción del hero, `fgDim` de pricing, cuerpo de Services (0.45); skip link y `--secondary` sobre blanco. Regla: ≥ white/0.7 sobre #0c0c0c, ≥ rgba(10,10,10,0.65) sobre claro; opacidad baja solo en ghost decorativo `aria-hidden`. | `Footer.tsx`, header, `Work.tsx:91`, `FAQ.tsx`, `HeroSection.tsx`, `PlanCard.tsx:26-27`, `Services/ContentPanel.tsx:9-12`, `globals.css:141` | axe / UX-02 / A11Y-15/24 |
| S2-04 | [x] | Formulario accesible: `<label htmlFor>` en `FieldWrap`; `name`/`id` en `LineSelect`; chips con `role="group"` + `aria-pressed`; errores con `aria-describedby`; resumen de errores enfocable al fallar el envío; foco al primer error; "required" transmitido además del ✦; **quitar `outline-none` de `BASE`** (hoy ningún campo muestra foco). | `Contact/FieldWrap.tsx`, `LineInputs.tsx`, `ContactForm.tsx`, `contact.constants.ts:15` | guidelines / axe / UX-07 / A11Y-02/14/16/27 |
| S2-05 | [x] | Topics del formulario alineados a la oferta: Website · Web app / portal · Custom software & automation · Design / UX · Fix or improve existing site · Other. Opciones de presupuesto en AUD. | `Contact/contact-data.ts` | cro / COPY-08 |
| S2-06 | [x] | Versión corta del formulario (D-04). | `ContactForm.tsx`, `contact-data.ts`, `route.ts` | cro |
| S2-07 | [x] | Solapamientos sticky: barra de métricas de About sobre el header; chips de tecnologías bajo el header en case study; contador "01 — 04" sobre la hamburguesa. `scroll-margin-top` igual a la altura del header en todas las anclas. | `WhatIBuilt.tsx`, `Case-study/*.tsx`, `HeroSection.tsx`, `globals.css` | audit / UX-06 |
| S2-08 | [x] | Galería del case study: `scroll-snap`, `padding-inline`, indicio de scroll, alt descriptivo en vez de `alt=""`. | `Case-study/ImageBreak.tsx` | audit |
| S2-09 | [x] | Pricing: fila "Best for…" por plan; features en Fira Sans 14 px (no mono); una sola señal "from"; `tabular-nums` en el precio animado; CTA "Get a fixed quote". | `Pricing/PlanCard.tsx`, `AnimatedPrice.tsx`, `Pricing.tsx` | cro / TYPO-05/08 |
| S2-10 | [x] | Testimonios reales junto al formulario y bajo el hero (patrón "Hero + Testimonials + CTA"). | `ContactSection.tsx`, nueva sección | cro / UX-04 |
| S2-11 | [x] | FAQ: añadir "¿Y si no sé qué necesito?", "¿Qué pasa si desaparecés?", precio de software, IA con aprobación humana. Unificar plazos (FAQ 4–8 semanas vs. plan 4–6 vs. Process 1–6). | `faq-data.ts`, `plans`, `process-data.ts` | cro / COPY-07 |
| S2-12 | [x] | Targets táctiles ≥ 44 px: puntos de slide, nav, "Not sure which plan?", email del footer; 8 px entre chips. | hero, header, `Pricing.tsx`, `Footer.tsx` | guidelines |
| S2-13 | [x] | Texto mínimo 11 px en labels decorativos y 14 px en texto legible (112 nodos < 11 px a 320). | global | audit / TYPO-10 |
| S2-14 | [x] | Footer: "ContactSection" → "Contact"; tagline alineado al posicionamiento; un solo `<footer>`; `aria-label` por `<nav>`; `role="listitem"` fuera de los `<a>`; iconos SVG inline en vez de react-icons. | `footer.data.ts:8`, `Footer.tsx:10` | axe / COPY-10 / PERF-01 |
| S2-15 | [x] | Services y Process en stack vertical en `< lg` y con reduced motion; sticky solo en desktop; `100svh`; pausar el spring fuera de pantalla. | `Services.tsx`, `Process.tsx`, `use-scroll-step.ts` | audit / UX-01 / PERF-20 |
| S2-16 | [x] | Tipografía: dos familias (DM Serif Text 400 + Fira Sans 400/500/600, sin itálicas salvo una), logo en DM Serif, `--font-sans`/`--font-serif` apuntando a las variables de next/font; `font-feature-settings: "kern" 1`, `text-wrap: balance` en H1/H2, `hyphens: none` en títulos; apóstrofos y comillas curvas en todo el copy; sin "!" en UI; tracking 0.06–0.12em en los 20 labels en mayúscula que no lo tienen; nunca bold+italic. | `layout.tsx:9-24`, `globals.css:27`, `HeaderLogo.tsx:22`, `ResultsSection.tsx:164`, varios | TYPO-01…13, PERF-11/12 |
| S2-17 | [x] | Copy: contacto, servicios, FAQ, estados y microcopy según COPY-02…12 (sin AI tells, en-AU, plazos coherentes). | `ContactSection.tsx`, `services-data.ts`, `faq-data.ts`, `SuccessState.tsx`, `Marquee.tsx` | COPY |
| S2-18 | [~] | Consistencia visual: botones azules de Blog y Login al sistema (rojo ladrillo/negro); un solo token para labels de sección ("004 — PRICING" vs. "#1 EDUCATION"). | `blog/page.tsx`, `login/page.tsx`, `ChapterLabel`, labels | UX-09 |
| S2-19 | [x] | Hover-only: el preview que sigue al cursor y el tilt 3D de Work necesitan equivalente táctil/teclado (tap abre el case study; sin preview en touch). Carrusel del hero con botón de pausa y prev/next accesibles. | `Work/Work.tsx`, `FloatingPreview.tsx`, `HeroSection.tsx` | UX-04/05, A11Y |
| S2-20 | [x] | Accesibilidad por teclado y lector de pantalla según 6.6: menú móvil como disclosure (`nav`/`ul`, sin `role=menu`, cerrar al perder foco, `max-height` con scroll); FAQ con `h3` + `aria-controls` + `inert` al cerrar; Services/Process con la lista completa en el DOM y `aria-current="step"`; skip link en el root layout; nombres de enlace en Work y FeaturedCard; `section aria-labelledby` + h2 en cada sección; marquee estático con reduced motion; `scrollIntoView` según `matchMedia`; foco gestionado tras éxito del formulario y tras navegar desde el menú. | `MobileMenu.tsx`, `FAQ.tsx`, `Services.tsx`, `Process.tsx`, `layout.tsx`, `ProjectRow.tsx`, `FeaturedCard.tsx`, `Marquee.tsx`, `lib/utils.ts`, `SuccessState.tsx` | A11Y-07/10/11/12/14/17/18/21/23/26/29 |
| S2-21 | [x] | Proxy y admin: 401 JSON para `/api/admin/*` sin sesión; chequeo de rol centralizado en el layout de admin; `sortBy` con allowlist por entidad; `limit` acotado a 100. | `src/proxy.ts`, `admin/layout.tsx`, `lib/validations/utils.schema.ts`, servicios | SEC-12/13/14, DB-10/11 |

## 4. Sprint 3 — Rendimiento, SEO, datos y estructura (3–4 días)

| ID | Estado | Ítem | Archivos | Origen |
|----|--------|------|----------|--------|
| S3-01 | [x] | Eliminar Cormorant, DM Sans y pesos/itálicas no usados (ahorro 6–8 archivos, ~100–150 KB). Cubierto por S2-16; aquí solo la limpieza de dependencias. | `layout.tsx` | PERF-11 |
| S3-02 | [x] | Quitar de `package.json`: `react-icons`, `three`, `@react-three/fiber`, `@react-three/drei`, `@imagekit/next`, `@types/bcryptjs`, `@radix-ui/react-accordion` y `embla-carousel-react` (con sus archivos ui), y tras verificar: `critters`, `pg`/`@types/pg`. Registrar `eslint-plugin-jsx-a11y` en vez de quitarlo. | `package.json`, `eslint.config.*` | PERF-01/03, DEAD-10…16/20 |
| S3-03 | [~] | Video de contacto: < 400 KB (VP9/AV1 720p) o gradiente; `preload="none"` + poster; montar solo visible. Videos de Services: posters correctos (el 1 reutiliza el del 3), posters para Process, precargar solo el siguiente paso, pausar fuera de pantalla. | `ContactSection.tsx`, `Services/ImagePanel.tsx:20`, `Process/FullBleedMedia.tsx` | PERF-13/14 |
| S3-04 | [x] | Imágenes: quitar `priority` de Process/Services (compite con el LCP); `priority` solo en el primer slide; `sizes` reales en `ImagePanel`; un solo optimizador para Cloudinary (loader custom o `unoptimized`, `q ≤ 75`); `preconnect` a `res.cloudinary.com` en vez de Unsplash; `aspect-ratio` en contenedores `fill`. | `FullBleedMedia.tsx:28`, `HeroSection.tsx:193`, `layout.tsx:104`, `BlogCard.tsx:45` | PERF-15…18 |
| S3-05 | [x] | `transition: all` → propiedades explícitas (13 elementos). | `button.tsx`, `accordion.tsx`, `Header.tsx`, `Footer.tsx`, `ContactForm.tsx`, `BlogCard.tsx`, `case-studies/page.tsx`, `globals.css` | guidelines |
| S3-06 | [~] | Framer Motion: no animar `hsl(var(--hero-accent))`; `LazyMotion` + `m.*` en secciones públicas; `optimizePackageImports` para lucide/framer. | `about-constants.ts:11`, `next.config.ts:4`, secciones | PERF-02/04/24 |
| S3-07 | [~] | Scroll: `useScrollStep` con estado solo al cambiar el paso entero (`useMotionValueEvent`); `useScrollState` y hero con rAF y `ResizeObserver`; `CaseStudyView` con `useScroll().scrollYProgress`; quitar `will-change` permanentes y `left/top` animados. | `use-scroll-step.ts:37`, `use-scroll-state.ts:28`, `HeroSection.tsx:58-154`, `CaseStudyView.tsx:39`, `FloatingPreview.tsx:21` | PERF-19/21/23, TS-02…05/13 |
| S3-08 | [x] | Hero SSR: título en su posición final sin esperar a JS (hoy `ready:false` retrasa el texto LCP); `FloatingTitle` solo después de hidratar. | `HeroSection.tsx:106`, `FloatingTitle.tsx` | PERF-22 |
| S3-09 | [x] | Datos: `unstable_cache`/`"use cache"` con tags para `getPublishedCaseStudies` y `getActivePlans`; `revalidateTag` en cada escritura admin; `select` ligero para listas y prev/next; `Promise.all` + `React.cache` en el detalle; `take` en listas públicas. | servicios, páginas, rutas admin | PERF-08/09/10, DB-02/04/05, TS-11 |
| S3-10 | [x] | Índices: `(status, deleted, sortOrder)` en CaseStudy, `(status, deleted, publishedAt)` en BlogPost, `(active, sortOrder)` en Plan, FK sin índice (customerId, authorId, leadId, bookingId, roleId…); quitar `@@index([slug])` redundante. | `prisma/schema.prisma` | DB-06…09 |
| S3-11 | [ ] | Transacciones: mutación + `logAudit` en un `$transaction`; `sortOrder` calculado dentro; borrado uniforme (soft) y `renormalize` en una sola sentencia. | `lib/services/*.ts` | DB-14/15/16, SF-18 |
| S3-12 | [~] | Validar `body`/`features` con Zod (V1/V2 discriminado) al guardar y al leer; loguear slug en los fallbacks; evaluar migración a `Json` (`jsonb`) con `USING col::jsonb`. | `lib/mappers/case-study.mappers.ts:128-189`, `prisma/schema.prisma:184-189` | TS-09, SF-12/13, DB-17 |
| S3-13 | [~] | PageSpeed Insights en producción y anotar LCP/INP/CLS aquí. | — | seo |
| S3-14 | [x] | `og:image` global y por case study; `theme-color`; títulos sin marca duplicada. | `opengraph-image.tsx`, `layout.tsx`, metadata | seo |
| S3-15 | [x] | JSON-LD según 6.9: `@graph` con `Person`, `ProfessionalService` (email del dominio, `priceRange` real), `Service` ×3 con `Offer` por plan, `Article` + `BreadcrumbList` en case studies; FAQPage se mantiene por semántica aunque Google ya no muestre rich results. | `components/seo/StructuredData.tsx`, case study page | SCHEMA |
| S3-16 | [x] | Arquitectura según 6.8: páginas `/services`, `/services/websites`, `/services/custom-software`, `/pricing`, `/contact`; nav de 4 ítems; footer en 3 columnas; breadcrumbs; enlaces cruzados case study ↔ servicio ↔ pricing. | nuevas rutas, header, footer | IA |
| S3-17 | [x] | `/llms.txt`, `/pricing.md`, bloques de respuesta directa, fechas visibles, autor en case studies. | `public/`, secciones | ai-seo |
| S3-18 | [-] | Google Business Profile en Toowoomba; alinear LinkedIn e Instagram (`crafteddigital_`) con el About y con `sameAs`. | externo | ai-seo / SCHEMA-02 |
| S3-19 | [x] | Declarar light explícito y borrar el variant `.dark` sin uso (D-01). | `globals.css`, `layout.tsx` | audit / DEAD |
| S3-20 | [~] | Admin: subida de media con tamaño máximo, conteo, magic bytes y nombre regenerado; tokens de ImageKit con `expire` y restricciones; `remotePatterns` con `pathname`; `config` de integraciones cifrado y enmascarado; Origin check en mutaciones; guardas de último admin; `withErrorHandling` en todas las rutas. | `api/admin/media/*`, `next.config.ts:8-38`, `lib/services/integrations.ts`, `users.ts:98-125`, `api-handler.ts:93` | SEC-08/15/16/17/19/20/21/22 |
| S3-21 | [x] | `exportLeadsCsv`: paginar y escapar celdas (`=`, `+`, `-`, `@`) y comillas. | `lib/services/leads.ts:157` | DB-12 |
| S3-22 | [x] | Pool y SSL de Prisma: `max`, `idleTimeoutMillis`, `connectionTimeoutMillis` en el adapter; `sslmode=verify-full` explícito; `log: ['error','warn']`; fallar al arrancar si falta `DATABASE_URL`. | `src/lib/db/prisma.ts:15`, `prisma.config.ts:11` | DB (nota), SF-17 |
| S3-23 | [~] | Refactor: `HeroSection` (493 líneas) en `useSlideshow`, `useGhostMetrics`, `HeroSlide`; `case-studies/page.tsx` en `CaseStudyCard` + grid; un solo `useCountUp` con reduced motion; `Footer` como server component con botón cliente; secciones de case study con markup en servidor y `motion` en hojas. | varios | TS-14/15/18/19/20 |
| S3-24 | [x] | Código muerto según 6.12: borrar `case-study.mapper.ts`, `CaseStudyHeroSection.tsx`, `ChallengeSection.tsx`, `ContextSection.tsx`, `Contact/ContentPanel.tsx`, `hero.types.ts`, `validations/common.ts`, `ui/{accordion,card,carousel,textarea,RevealSection,RotatingWord}.tsx`, `hooks/{use-mobile,use-scroll-animation}`; quitar `useScroll`, `toCaseStudyDetailProps`, exports sin uso (conservando `RateLimitError`, `ServiceUnavailableError`, `requireRole`, `MAX_PAGE_SIZE`, que se usan en S1-07/S2-21); keyframes sin uso y `optimizeCss`; mover los README de `public/img/projects/*` a `docs/projects/`; revisar `julian-profile.webp`. | varios | DEAD-01…28, TS-08/12, PERF-25 |
| S3-25 | [x] | `.gitignore` y limpieza del repo (si no se hizo en S0-04). | — | — |

## 5. Decisiones pendientes (de Julian)

| ID | Decisión | Recomendación | Estado |
|----|----------|---------------|--------|
| D-01 | Modo oscuro: declarar light explícito o implementarlo. | Declarar light; borrar `.dark`. | pendiente |
| D-02 | Blog: publicar 2–3 posts o sacarlo del nav/sitemap. | Sacarlo hasta tener posts; el primero puede ser el de WRCC. | pendiente |
| D-03 | Hero: opción A, B o C del informe. | A. | pendiente |
| D-04 | Formulario corto vs. actual. | Corto (nombre, email, qué querés construir, presupuesto opcional). | pendiente |
| D-05 | Correr `npm run db:seed` contra la base remota. | **No** hasta completar S0-02 y S0-05. Después sí, o cargar los 5 case studies y el plan desde el admin. | pendiente |
| D-06 | Herramienta para "Book a 30-minute fit call": Calendly embebido, Cal.com, o el módulo de Bookings propio del admin. | Calendly o Cal.com (menos código, evento de conversión conocido); el módulo propio queda para gestionar. | hecho 2026-10-31: Cal.com embebido en `/contact#book` (evento `julian-delgado-3z9y4u/30min`), evento `fit_call_booked` |
| D-07 | Rate limit: Upstash Redis, Vercel KV, o memoria en proceso (no sirve en serverless). | Upstash (plan gratis alcanza). | pendiente |
| D-08 | CAPTCHA en el formulario: Cloudflare Turnstile sí/no. | Sí, invisible; honeypot + rate limit solos no frenan bots con JS. | hecho 2026-10-31: Turnstile en el formulario (`interaction-only`) y verificación en `/api/contact`; se omite si no hay `TURNSTILE_SECRET_KEY` |
| D-09 | Migrar columnas JSON de `String` a `Json` (`jsonb`) con migración. | Sí, pero en Sprint 3, después de validar que todas las filas parsean. | pendiente |
| D-10 | Rotar secretos ahora (S0-06). | Sí, es barato. | pendiente |

## 6. Backlog por análisis

Formato: `ID · hallazgo · archivo:línea · severidad · fix`. Cuando el ítem ya está en un sprint, se indica.

### 6.1 Seguridad (agente `security-reviewer`)
- SEC-01 · `getUsers`/`getUser` devuelven `hashedPassword`, también al rol viewer · `src/lib/services/users.ts:28-45`, `api/admin/users/*` · HIGH · `omit: { hashedPassword: true }` y listado solo admin (S1-10)
- SEC-02 · Seed resetea contraseña y `active` del admin con fallback `admin123` · `src/lib/db/seed.ts` · HIGH · exigir variable, sacar del `update`, bloquear en producción (S0-02)
- SEC-03 · `/api/contact` sin rate limit ni CAPTCHA; relé de email abierto · `api/contact/route.ts:16-53` · HIGH · rate limit + Turnstile + tope por destinatario (S1-07, D-07, D-08)
- SEC-04 · Honeypot `hp` nunca se comprueba · `contact-data.ts:31`, `route.ts:20` · MEDIUM · 200 falso sin enviar (S1-07)
- SEC-05 · Sin `.max()` ni validación de URL en el schema de contacto · `contact-data.ts:11-32` · MEDIUM · límites, `topics` acotado, `website` http(s) (S1-07)
- SEC-06 · `req.json()` sin try/catch → 500; errores de config llegan al cliente · `route.ts:17,12,23` · LOW · `validateRequestBody` y mensaje genérico (S1-07)
- SEC-07 · Usuario desactivado/borrado conserva acceso hasta expirar el JWT · `src/lib/auth/auth.ts:31-46` · HIGH · invalidar token en `jwt`, acortar `maxAge` (S1-19)
- SEC-08 · Upload de media confía en `file.type`, sin tope de tamaño/conteo ni magic bytes · `api/admin/media/upload/route.ts:36-55` · MEDIUM · (S3-20)
- SEC-09 · Login sin rate limit; enumeración de usuarios por timing · `auth.ts:18-27` · MEDIUM · (S1-19)
- SEC-10 · Sin headers de seguridad; `poweredByHeader` activo · `next.config.ts:3-48` · MEDIUM · (S1-09)
- SEC-11 · Secretos de producción en `.env` local, misma base para dev y prod; valores vistos durante la revisión · `.env` · MEDIUM · base de dev separada y rotación (S0-05, S0-06)
- SEC-12 · `/admin/*` protegido solo por "hay sesión"; ninguna página de admin llama `requireRole` · `src/proxy.ts:9` · MEDIUM · rol centralizado, default deny (S2-21)
- SEC-13 · `/api/admin/*` sin sesión redirige 302 a `/login` en vez de 401 · `proxy.ts:9-11` · LOW · (S2-21)
- SEC-14 · `sortBy` sin allowlist llega a `orderBy` en 7 servicios · `utils.schema.ts:7`, `users.ts:32` … · MEDIUM · `z.enum` por entidad (S2-21)
- SEC-15 · `Integration.config` en texto plano y devuelto completo; `status` libre · `lib/services/integrations.ts:5-23` · MEDIUM · cifrar, enmascarar, enum (S3-20)
- SEC-16 · Tokens de ImageKit sin restricción de carpeta/tipo/tamaño · `api/admin/media/upload-auth/route.ts:22-30` · LOW · (S3-20)
- SEC-17 · `mediaAssetSchema` acepta cualquier URL y carpeta · validación de media · LOW · https + hosts permitidos (S3-20)
- SEC-18 · JSON-LD con `JSON.stringify` sin escapar `<` → XSS almacenado desde el admin · `blog/[slug]/page.tsx:217`, `components/seo/*` · MEDIUM · `safeJsonLd()` (S1-18)
- SEC-19 · `remotePatterns` abiertos por host completo (Cloudinary sin cloud name, actian.com, zpesystems.com, jsdelivr) · `next.config.ts:8-38` · LOW · `pathname` y quitar hosts (S3-20)
- SEC-20 · Mutaciones admin sin CSRF/Origin check, `req.json()` ignora Content-Type · `api-handler.ts:93-99` · LOW · (S3-20)
- SEC-21 · Un admin puede desactivarse a sí mismo o quitar el último admin · `users.ts:98-125` · LOW · (S3-20)
- SEC-22 · Rutas con try/catch manual; `findUniqueOrThrow` → 500 en vez de 404 · `api/admin/integrations/[id]/route.ts:7-44` · LOW · (S3-20)
- SEC-23 · `dev.db`, `prisma_*output.txt`, `.claude/`, `.agents/`, `.playwright-mcp/` no ignorados · `.gitignore` · LOW · (S0-04)
- SEC-24 · `next-auth` en beta; sin `npm audit` en CI · `package.json:51` · LOW · pin + audit en CI
- Verificado OK: 43 rutas admin con `auth()` + `checkApiAuth`; Zod en casi todas; sin IDOR fuera del alcance de rol; `media/sign` con parámetros fijos; MIME de upload excluye SVG/HTML; bcrypt; sin open redirect; sin SSRF hoy; sin SQL raw; `.env*` nunca commiteado; blog renderiza texto escapado.

### 6.2 Calidad React/TypeScript (agente `typescript-reviewer`)
- TS-01 · `dynamic()` dentro del server component `Home`, recreado por render y sin beneficio real · `src/app/page.tsx:14-31` · HIGH · imports estáticos o `dynamic` a nivel de módulo; quitar `async` (S3-07 vecino, SF-16)
- TS-02 · `CaseStudyView` setea estado en cada scroll sin rAF y lee `scrollHeight` · `CaseStudyView.tsx:39-46` · HIGH · `useScroll().scrollYProgress` (S3-07)
- TS-03 · `useScrollState` tres `setState` + `querySelector` por evento de scroll · `hooks/use-scroll-state.ts:28-51` · HIGH · rAF, cache, estado solo al cambiar (S3-07)
- TS-04 · Hero: `resize` con `getBoundingClientRect` sin throttle, scroll sin rAF, eslint-disable con `goNext` stale · `HeroSection.tsx:58-154` · HIGH · rAF, `ResizeObserver`, `useCallback` (S3-07)
- TS-05 · `FloatingTitle` duplica el handler de scroll del hero · `FloatingTitle.tsx:17-46` · MEDIUM · hook compartido (S3-07)
- TS-06 · `ContactForm` llama `onSuccess()` aunque `!res.ok` · `ContactForm.tsx:44-48` · HIGH · (S1-08)
- TS-07 · `catch {}` vacío en `ContactForm` · `ContactForm.tsx:49-51` · MEDIUM · (S1-08)
- TS-08 · `case-study.mapper.ts` sin importadores, API divergente · `lib/mappers/case-study.mapper.ts:1` · MEDIUM · borrar (S3-24)
- TS-09 · Doble cast `as unknown as BodyV2` sin validar · `case-study.mappers.ts:128-153` · HIGH · Zod discriminado (S3-12)
- TS-10 · `catch` → `notFound()` para cualquier error en el detalle y en metadata · `case-studies/[slug]/page.tsx:25-45` · MEDIUM · (S1-11)
- TS-11 · Waterfall + fetch duplicado en el detalle · `[slug]/page.tsx:41-48` · MEDIUM · `React.cache` + `Promise.all` (S3-09)
- TS-12 · `useScroll` importado sin usar · `Services.tsx:23` · LOW · (S3-24)
- TS-13 · `useScrollStep` setea estado en cada tick del spring; dependencia faltante · `use-scroll-step.ts:36-44` · MEDIUM · (S3-07)
- TS-14 · `HeroSection` 493 líneas · `HeroSection.tsx:1` · MEDIUM · (S3-23)
- TS-15 · `case-studies/page.tsx` 352 líneas · · LOW · (S3-23)
- TS-16 · `Header` lee `window.location` en efecto · `Header.tsx:29-38` · LOW · `useSearchParams`
- TS-17 · `cardRef.current!` puede lanzar tras desmontar · `Work/FeaturedCard.tsx:18` · LOW · guard
- TS-18 · `useCountUp` duplicado y sin reduced motion · `ResultsSection.tsx:8`, `Work.tsx` · LOW · (S3-23)
- TS-19 · `Footer` client por `scrollTo` y el año; riesgo de mismatch · `Footer.tsx:87` · LOW · (S3-23)
- TS-20 · Secciones de case study "use client" solo por animaciones · `ProblemSection.tsx:1` … · MEDIUM · (S3-23)
- TS-21 · `Pricing`/`Work` reciben payloads completos como props · `Pricing.tsx:1` · LOW · pasar solo campos usados
- Verificado OK: MotionValues sin re-render en case study y About; listeners pasivos con cleanup; `useCountUp` cancela rAF; sin `any` ni `@ts-ignore`; un solo eslint-disable.

### 6.3 Rendimiento (agente `performance-optimizer`)
- PERF-01 · react-icons/fa para 2 iconos (~441 KB en dev) · `Footer.tsx:10` · HIGH · SVG inline (S2-14, S3-02)
- PERF-02 · Sin `optimizePackageImports` · `next.config.ts:4` · MEDIUM · (S3-06)
- PERF-03 · `three`, `@react-three/*` instalados sin uso (~1 MB) · `package.json:38` · LOW · (S3-02)
- PERF-04 · `motion.*` completo en ~30 archivos; solo `RotatingWord` usa `LazyMotion` · `Services.tsx:24` · MEDIUM · (S3-06)
- PERF-05 · zod v4 completo en el formulario público · `contact-data.ts:5` · LOW · `zod/mini` o lazy
- PERF-06 · @dnd-kit solo en admin · · LOW · OK
- PERF-07 · `dynamic()` en el server component sin diferir nada · `page.tsx:14` · MEDIUM · (TS-01)
- PERF-08 · Home: dos consultas sin caché cada 60 s, include de 6 tablas · `WorkSection.tsx:7` · MEDIUM · (S3-09)
- PERF-09 · Detalle: waterfall de 2 consultas, la segunda con todas las relaciones · `[slug]/page.tsx:40` · MEDIUM · (S3-09)
- PERF-10 · `getPublishedCaseStudies` repetido en params, metadata y body · `[slug]/page.tsx:15` · LOW · (S3-09)
- PERF-11 · 4 familias, 12 archivos de fuente; Cormorant y DM Sans sin `display` · `layout.tsx:9` · HIGH · (S2-16, S3-01)
- PERF-12 · `--font-sans` hardcodeado a 'Fira Sans' en vez de la variable de next/font; Cormorant solo en el logo · `globals.css:27`, `HeaderLogo.tsx:22` · MEDIUM · (S2-16)
- PERF-13 · Video de contacto 1,6 MB sin `preload`, sin gate de visibilidad ni reduced motion · `ContactSection.tsx:100` · HIGH · (S1-06, S3-03)
- PERF-14 · Videos de Services/Process sin `preload="none"`; poster 1 incorrecto; Process sin posters · `ImagePanel.tsx:20` · MEDIUM · (S3-03)
- PERF-15 · `priority` en imágenes bajo el fold (Process/Services) · `FullBleedMedia.tsx:28` · HIGH · (S3-04)
- PERF-16 · Hero: Cloudinary + optimizador de Next a la vez; `q_85` fuera de `qualities`; `buildSrcSet` sin uso · `HeroSection.tsx:193` · MEDIUM · (S3-04)
- PERF-17 · `preconnect` a Unsplash en vez de Cloudinary; no hay preload del LCP · `layout.tsx:104` · MEDIUM · (S3-04)
- PERF-18 · Contenedores `fill` sin aspect-ratio (BlogCard) · `BlogCard.tsx:45` · LOW · (S3-04)
- PERF-19 · `useScrollStep` re-renderiza Services/Process ~60 veces/s · `use-scroll-step.ts:37` · HIGH · (S3-07)
- PERF-20 · Scroll-jack con spring y video montado; sin `svh` ni pausa fuera de pantalla · `Process.tsx:63` · MEDIUM · (S2-15)
- PERF-21 · Dos listeners de scroll en el hero sin rAF; `will-change` permanente · `FloatingTitle.tsx:55` · LOW · (S3-07)
- PERF-22 · El título del hero espera a `getBoundingClientRect` tras hidratar (LCP de texto retrasado) · `HeroSection.tsx:106` · MEDIUM · (S3-08)
- PERF-23 · `will-change` estáticos; `left/top` animados en `FloatingPreview` · `FloatingPreview.tsx:21` · LOW · (S3-07)
- PERF-24 · Framer anima `hsl(var(--hero-accent))` · `about-constants.ts:11` · MEDIUM · (S3-06)
- PERF-25 · `optimizeCss`/critters obsoleto; `tw-animate-css` completo; ~8 keyframes sin uso · `globals.css:2` · LOW · (S3-24)
- Ahorro estimado: fuentes 100–150 KB y 6–8 requests; media ~1,2 MB en la carga inicial; JS 20–40 KB gzip en producción; INP: elimina ~60 re-renders/s al hacer scroll (estimado, no medido).

### 6.4 Tipografía (`typography`, modo auditoría)
- TYPO-01 · Cuatro familias (regla: máximo dos) · `layout.tsx:9-24` · HIGH · DM Serif Text + Fira Sans (S2-16)
- TYPO-02 · Apóstrofos mezclados: 13 rectos (`I'll`, `we're`) y 7 curvos/`&apos;` en el mismo sitio · secciones y About · MEDIUM · unificar a ’ (carácter real en JSX) (S2-16)
- TYPO-03 · Signos de exclamación en UI: "Message sent!" y "Yes!" en FAQ · `ContactForm.tsx:46`, `faq-data.ts:27` · LOW · punto (S2-17)
- TYPO-04 · 20 de 99 labels en mayúscula sin letterspacing · `ApproachSection.tsx:52,116`, `CaseStudyHeroSection.tsx:51,60,82` … · MEDIUM · `tracking 0.06–0.12em` (S2-16)
- TYPO-05 · Monospace en 46 usos, incluidas las listas de features de pricing (texto de lectura) · `PlanCard.tsx` y labels · MEDIUM · mono solo para códigos/contadores (S2-09)
- TYPO-06 · Bold + italic combinados · `ResultsSection.tsx:164` · LOW · uno u otro (S2-16)
- TYPO-07 · Un solo `text-balance` en todo el sitio; H1/H2 serif enormes sin balance ni `hyphens: none` · varios · MEDIUM · (S2-16)
- TYPO-08 · Precio animado y contadores sin `tabular-nums` (3 usos en el sitio) · `AnimatedPrice.tsx`, `useCountUp` · LOW · `font-variant-numeric: tabular-nums` (S2-09)
- TYPO-09 · Medida de línea: tagline de plan a 30ch es demasiado estrecha; prosa de case study sin `max-w` en ch (verificar a 1440) · `PlanCard.tsx:149`, `Case-study/*` · LOW · 45–75ch
- TYPO-10 · 112 textos < 11 px a 320 px · global · MEDIUM · (S2-13)
- TYPO-11 · Guiones largos en copy corto (subtítulo del hero, nota de pricing) · `HeroSection.tsx:343`, `Pricing.tsx:148` · LOW · reescribir sin em dash (S2-17)
- TYPO-12 · Sin `font-feature-settings: "kern" 1` ni `text-rendering: optimizeLegibility` globales · `globals.css` · LOW · (S2-16)
- TYPO-13 · Base de cuerpo: Tailwind por defecto (16 px / 1.5), correcto; mantener ≥ 15 px en texto de lectura

### 6.5 Sistema visual y UX (`ui-ux-pro-max`, `design:design-critique`)
- UX-01 · La base de patrones devuelve "Scroll-Triggered Storytelling" para este producto con esta regla: la narrativa debe entenderse sin los efectos de scroll, simplificar en móvil, orden de lectura completo en el DOM, estado final legible con reduced motion · Services, Process, hero · HIGH · (S2-15)
- UX-02 · Acento rojo ladrillo usado como color de texto sobre fotos oscuras ("CREATIVE DIRECTION", "AI4L") probablemente < 4.5:1; la paleta de referencia (negro cálido + un acento) reserva el acento para rellenos con texto blanco · hero, case study · MEDIUM · acento en fondos, tinte claro para texto (S2-03)
- UX-03 · El pairing de referencia valida serif display + sans humanista (equivalente a DM Serif + Fira); Cormorant solo en el logo rompe la regla de dos familias · `HeaderLogo.tsx:22` · MEDIUM · (S2-16)
- UX-04 · Patrón "Hero + Testimonials + CTA": prueba social antes del CTA; carruseles con prev/next, pausa, detener en hover/focus/reduced motion y anunciar posición · hero slider, testimonios · HIGH · (S2-10, S2-19)
- UX-05 · Interacciones solo hover (preview que sigue al cursor, tilt 3D) sin equivalente táctil · `Work.tsx`, `FloatingPreview.tsx` · HIGH · (S2-19)
- UX-06 · Nav sticky tapa contenido al navegar por anclas · global · MEDIUM · `scroll-margin-top` (S2-07)
- UX-07 · Formulario: resumen de errores enfocable + errores inline; hoy solo toast · `ContactForm.tsx` · HIGH · (S2-04)
- UX-08 · Primera impresión (2 s): el ojo cae en el nombre, no en la oferta; el CTA compite con el contador de slides; en móvil no hay nada de servicios ni precios en las primeras 8.000 px · home · CRITICAL · (S1-04, S1-05, resumen móvil)
- UX-09 · Inconsistencias: botones azules en Blog y Login vs. píldoras rojo ladrillo; dos estilos de label de sección ("004 — PRICING" / "#1 EDUCATION"); radios y sombras distintos entre tarjetas · varios · MEDIUM · (S2-18)
- UX-10 · Línea azul (`--secondary`) visible sobre el menú móvil abierto y bajo el header: parece un foco residual o un token fuera de paleta · `MobileMenu.tsx` · LOW · verificar y unificar con el acento
- UX-11 · Lo que funciona y se conserva: dirección editorial, serif grande, secciones oscuras como recurso, tarjetas de pricing con fondo animado, FAQ de foco único, case studies con capítulos. No rediseñar; corregir.

### 6.6 Accesibilidad (agente `a11y-architect`, WCAG 2.2 AA)
- A11Y-01 · La home no tiene ningún h1 expuesto: el h1 real está `visibility:hidden` y el visible está dentro de un wrapper `aria-hidden`; quitar el duplicado sin más dejaría cero h1 · `HeroSection.tsx:313-322`, `FloatingTitle.tsx:52-57` · 1.3.1, 2.4.6 · CRITICAL · h1 real transparente pero expuesto; FloatingTitle como `div aria-hidden` (S1-04)
- A11Y-02 · `outline-none` en `BASE` de todos los campos del formulario anula el `:focus-visible` global; el único foco es un borde inferior de 1 px · `Contact/contact.constants.ts:15` · 2.4.7, 2.4.11 · CRITICAL · quitar `outline-none`, `focus-visible:outline-2 outline-offset-4` (S2-04)
- A11Y-03 · Éxito falso tras POST no-2xx · `ContactForm.tsx:44-46` · 3.3.1, 4.1.3 · CRITICAL · (S1-08)
- A11Y-04 · Hero auto-avanza cada 5 s sin pausa; el timer ignora reduced motion · `HeroSection.tsx:58-74` · 2.2.2, 2.3.3 · HIGH · botón pausa, detener en focus/hover, sin autoplay con `useReducedMotion` (S2-19)
- A11Y-05 · Selectores de slide son `div onClick`, no enfocables ni nombrados · `HeroSection.tsx:356-360` · 2.1.1, 4.1.2 · HIGH · `<button aria-label aria-current>` ≥ 24 px (S2-12, S2-19)
- A11Y-06 · Carrusel sin semántica (`region`/`aria-roledescription`), contador "00 — 03" leído como texto, dots sin `aria-current` · `HeroSection.tsx:168,257-278`, `MobileDots.tsx:14-18` · 1.3.1, 4.1.2 · MEDIUM · (S2-19)
- A11Y-07 · Services/Process solo renderizan el paso activo (`aria-hidden` o desmontado): un lector de pantalla no puede llegar a los pasos 2..N; nada enfocable; sin fallback estático · `Services/ContentPanel.tsx:46`, `Process/BottomPanel.tsx:17-25`, `Process.tsx:66-108` · 1.3.1, 2.1.1, 1.4.10 · HIGH · lista `ol` completa en el DOM (sr-only o layout reduced motion), `aria-current="step"` (S2-15)
- A11Y-08 · Escenas sticky 100vh con `overflow-hidden` recortan contenido al 400 % de zoom; `100vh` ignora el chrome móvil · `Services.tsx:103-105,139`, `Process.tsx:61-63` · 1.4.10, 1.4.4 · HIGH · `min-height:100svh`, layout estático bajo `max-height:500px` (S2-15)
- A11Y-09 · `<video autoPlay loop>` en Services, Process y Contact sin pausa ni reduced motion (CSS no detiene video) · `ImagePanel.tsx:20-30`, `FullBleedMedia.tsx:23`, `ContactSection.tsx:100` · 2.2.2, 2.3.3 · HIGH · poster con reduced motion, botón de pausa, `aria-hidden` en decorativos (S1-06, S3-03, S2-20)
- A11Y-10 · Enlace de proyecto en Work pierde el nombre (letras `aria-hidden`, `aria-label` en un `span`) y lee solo "01 Category 2024" · `Work/ProjectRow.tsx:55-75` · 4.1.2, 2.4.4 · HIGH · `aria-label` en el `Link` (S2-20)
- A11Y-11 · Menú móvil con `role="menu"`/`menuitem` sin manejo de flechas; Tab se escapa del menú abierto · `MobileMenu.tsx:37,76,92,107`, `MobileToggle.tsx:21`, `use-mobile-menu.ts:20-38` · 4.1.2, 2.1.1 · HIGH · patrón disclosure con `nav`/`ul`/`a`, cerrar al perder foco (S2-20)
- A11Y-12 · FAQ: `aria-expanded` sin `aria-controls`; respuestas colapsadas siguen en el árbol; preguntas fuera de headings · `FAQ.tsx:50-54,132-171` · 4.1.2, 1.3.1 · HIGH · `h3` + `aria-controls` + `hidden`/`inert` al cerrar (S2-20)
- A11Y-13 · "Get a quote" con el mismo nombre en cada tarjeta; `scrollToId` mueve el viewport pero no el foco · `PlanCard.tsx:172-193,52-64` · 2.4.3, 2.4.6 · MEDIUM · `aria-label` con el plan, enfocar el heading de contacto (S2-09)
- A11Y-14 · Cambios dinámicos pierden el foco: éxito del formulario desmonta el botón, `SuccessState` sin `role="status"`, menú móvil desmonta el ítem enfocado · `ContactSection.tsx:107-110`, `SuccessState.tsx:7`, `Header.tsx:41-49` · 2.4.3, 4.1.3 · MEDIUM · (S2-04, S2-20)
- A11Y-15 · Contraste muy por debajo de 4.5:1 en texto funcional más allá del footer: h2 "Case studies" white/0.18 (~1.7:1), labels 0.2–0.22, FAQ cerradas 0.22, respuesta FAQ 0.4, descripción del hero 0.28–0.42, `fgDim` de pricing 0.22–0.24, cuerpo de Services rgba(10,10,10,0.45) (~3.3:1) · `Work.tsx:91`, `FAQ.tsx:40,105,118,160`, `HeroSection.tsx:248,304,340`, `PlanCard.tsx:26-27`, `Services/ContentPanel.tsx:9-12` · 1.4.3, 1.4.11 · HIGH · ≥ white/0.7 sobre #0c0c0c y ≥ rgba(10,10,10,0.65) sobre claro; `aria-hidden` solo para ghost decorativo (S2-03 ampliado)
- A11Y-16 · "Required" solo con ✦ `aria-hidden`; errores en `span` sin id ni `role="alert"`; `FormMessage` `display:none` · `FieldWrap.tsx:14-24`, `ContactForm.tsx:71,81,224` · 3.3.2, 3.3.1 · MEDIUM · (S2-04)
- A11Y-17 · Marquee infinito sin pausa; ítems duplicados leídos dos veces · `Services/Marquee.tsx:7,12-17`, `Services.tsx:228-240` · 2.2.2, 1.3.1 · MEDIUM · lista estática con reduced motion, `aria-hidden` en la copia, pausa en hover/focus (S2-20)
- A11Y-18 · `/blog/[slug]` y `/case-studies/[slug]` sin skip link; el `main` del post sin `id="main-content"` · `blog/[slug]/page.tsx:163-165`, `case-studies/[slug]/page.tsx:52` · 2.4.1 · HIGH · `SkipLink` en el root layout (S2-20)
- A11Y-19 · Logo → `/public` · `HeaderLogo.tsx:12` · 2.4.4 · HIGH · (S1-02)
- A11Y-20 · Header fijo de 64 px tapa el elemento enfocado; sin `scroll-padding-top`; el CTA invisible sigue siendo enfocable · `Header.tsx:59-62`, `DesktopCTA.tsx:20-28`, `globals.css` · 2.4.11, 2.4.7 · MEDIUM · `html{scroll-padding-top:5rem}`, `inert` en el CTA oculto (S2-07)
- A11Y-21 · `aria-label` en `div` (ignorado) en Services/Process; sin h2 en esas secciones (salto h1→h3); labels "00N — LABEL" leídos como ruido · `Services.tsx:99`, `Process.tsx:57`, `ContentPanel.tsx:50-52`, `Work.tsx:77-86`, `FAQ.tsx:208-217` · 1.3.1, 2.4.6 · MEDIUM · `section aria-labelledby` + h2, `aria-hidden` en índices (S2-20)
- A11Y-22 · Contenido solo-hover sin equivalente de foco: teaser y CTA de `NavSlice`, highlight y preview de Work · `NavSlice.tsx:88-118`, `ProjectRow.tsx:27-28`, `Work.tsx:129-130` · 2.4.7, 1.4.13 · MEDIUM · `group-focus-visible:`, `onFocus/onBlur` (S2-19)
- A11Y-23 · `FeaturedCard`: toda la tarjeta es un enlace con nombre interminable; "↗" sin `aria-hidden`; alt repite el heading · `FeaturedCard.tsx:47,63-67,112-126` · 2.4.4, 1.1.1 · MEDIUM · h3 como enlace (stretched), `alt=""`, flechas `aria-hidden` (S2-20)
- A11Y-24 · Skip link y botones primarios con pares < 4.5:1: blanco sobre #3b82f6 (~3.7:1); blanco sobre el acento en 0.75 rem mayúsculas, al límite · `globals.css:141,63-64` · 1.4.3 · MEDIUM · oscurecer `--secondary` para fondos de texto (S2-03)
- A11Y-25 · Honeypot: `Input` enfocable dentro de `aria-hidden`, sin nombre · `ContactForm.tsx:229-237` · 4.1.2 · LOW · `hidden`/`inert`, `tabIndex=-1` (S1-07)
- A11Y-26 · `scrollIntoView({behavior:"smooth"})` ignora reduced motion · `src/lib/utils.ts:36-41` · 2.3.3 · LOW · elegir `behavior` por `matchMedia` (S2-20)
- A11Y-27 · Radiogroup de contacto preferido solo maneja ←/→; grupos sin `aria-labelledby` al label visible · `ContactForm.tsx:111-112,177-199` · 2.1.1 · LOW · (S2-04)
- A11Y-28 · Imágenes del hero con `alt={slide.tag}` duplicando el texto; "← swipe →" como texto · `HeroSection.tsx:194,482-489` · 1.1.1, 2.5.1 · LOW · `alt=""`, hint `aria-hidden` + botones prev/next (S2-19)
- A11Y-29 · Menú móvil sin `max-height`/scroll al 400 % · `MobileMenu.tsx:34-45` · 1.4.10 · LOW · `max-h-[calc(100svh-64px)] overflow-y-auto` (S2-20)
- A11Y-30 · Texto de 0.48–0.56 rem ("Best value", monos de pricing, NavSlice) · `PlanCard.tsx:112,129,209`, `NavSlice.tsx:66` · 1.4.4 · LOW · piso de 0.75 rem (S2-13)
- Verificado OK: `:focus-visible` global 3 px pasa 1.4.11 en ambos fondos (salvo donde `outline-none` lo pisa); Escape cierra el menú y devuelve el foco; `MobileToggle` con `aria-expanded`/`aria-controls`; skip link en `/`, `/about-me`, `/blog`, `/case-studies`; `lang="en-AU"`; chips de topics con `role=checkbox`/`aria-checked` en grupo; autocomplete y `required` nativos; Sonner anuncia; tilt y transforms respetan reduced motion; ornamentos `aria-hidden`.

### 6.7 Microcopy y copy (`design:ux-copy`, `copy-editing`)
- COPY-01 · Hero: "Crafting digital experiences that connect brands with people — from concept to pixel" falla el swap test y no nombra servicio, audiencia ni lugar · `HeroSection.tsx:343` · CRITICAL · (S1-04, D-03)
- COPY-02 · Dos versiones del mismo H2: "Ready to build something extraordinary?" (contacto) y "…that lasts?" (About); "extraordinary" es un superlativo sin respaldo · `ContactSection.tsx`, `AboutCTA.tsx` · MEDIUM · usar "that lasts" en ambos o "Tell me what you're building" (S2-17)
- COPY-03 · Intro de contacto con apertura stock "Whether you have X or just Y —" · `ContactSection.tsx` · MEDIUM · "Tell me what you're trying to build. I'll reply within 24 hours with the best next step, even if that step isn't me." (S2-17)
- COPY-04 · Servicios: "a site that works hard for them", "stand out from the competition", "Launch your idea faster with expert guidance" son vagos · `services-data.ts` · MEDIUM · sumar hechos: plazos, "from AUD", demos semanales (S2-17)
- COPY-05 · Ortografía mixta: "SEO Optimization" (US) junto a "Speed Optimisation" (AU) en el marquee; "enrollments" en un case study · `Services.tsx` ADD_ONS, seed · LOW · en-AU en todo (S2-17)
- COPY-06 · Pricing: CTA "Get a quote" genérico; "STARTING AT" redundante con "+" · `PlanCard.tsx` · LOW · "Get a fixed quote" (S2-09)
- COPY-07 · FAQ: "Yes!" y "Absolutely." como aperturas; plazos distintos en FAQ (4–8 semanas), plan Growth (4–6) y Process (1–6) · `faq-data.ts`, planes, `process-data.ts` · MEDIUM · una sola fuente de plazos (S2-11)
- COPY-08 · Formulario: marcador ✦ sin explicar; "Select budget…" sin rangos en AUD; "Message sent!" → "Message sent. I'll reply within 24 hours."; error → "Couldn't send your message. Try again or email julianedelgado@hotmail.com." con el email como enlace · `ContactForm.tsx`, `FieldWrap.tsx` · MEDIUM · (S1-08, S2-04, S2-05)
- COPY-09 · About: "40+ Projects"; stats "/03 Day 0 Since line one" crípticos; "Graduate of Architect" en el testimonio · `AboutHero.tsx:10`, `WhatIBuilt.tsx`, seed · MEDIUM · métricas verificables, "Architecture graduate" (S1-17)
- COPY-10 · Footer tagline "Web development for Australian service businesses." no refleja el posicionamiento v7 · `Footer.tsx` · LOW · "Custom software, AI automation and websites for Australian small businesses." (S2-14)
- COPY-11 · Estado vacío del blog "No blog posts found." en una caja · `blog/page.tsx` · LOW · ocultar la ruta o "Articles are on the way. Meanwhile, read the case studies." con enlace (S1-15)
- COPY-12 · Email de contacto en Hotmail en footer, JSON-LD y formulario; resta credibilidad al dominio propio · varios · MEDIUM · `hello@juliandelgado.com.au` (requiere buzón; D nueva si hace falta)
- COPY-13 · Tags del hero ("Creative Direction", "Brand Identity", "Digital Design") describen servicios no ofrecidos · `hero.constants.ts` · HIGH · (S1-04)
- COPY-14 · Instagram `crafteddigital_` en `sameAs` y footer con nombre de marca abandonado · `StructuredData.tsx`, `Footer.tsx` · LOW · (S3-18)

### 6.8 Arquitectura del sitio (`site-architecture`)
Hoy: 5 rutas públicas + anclas. Services y Pricing viven solo como `#services` y `#pricing` en la home, así que no pueden rankear ni recibir enlaces propios. Propuesta (profundidad 2, sin redirecciones de URLs existentes):

```
/                                   Home
├── /services                       Hub (3 tarjetas + proceso)
│   ├── /services/websites          Starter + Growth, FAQ de sitios, 2 case studies
│   └── /services/custom-software   Software a medida + IA con aprobación humana, retainer, 3 case studies
├── /pricing                        4 planes + "Best for" + FAQ de precios + /pricing.md
├── /case-studies  →  /case-studies/[slug]   (sin cambios; + breadcrumbs y "related service")
├── /about-me                       (mantener URL; es la que ya está indexada)
├── /contact                        Formulario + reserva de llamada + email (la URL ya está enlazada desde el header)
├── /blog  →  /blog/[slug]          oculto hasta D-02
├── /privacy, /terms
└── /llms.txt, /pricing.md, /sitemap.xml, /robots.txt
```

- IA-01 · Nav header (4 + CTA): Work · Services · Pricing · About · [Book a 30-minute call] · header · HIGH · (S2-01)
- IA-02 · Footer en 3 columnas: Services (Websites, Custom software, Pricing) · Company (About, Case studies, Blog, Contact) · Legal (Privacy, Terms) + redes · `footer.data.ts` · MEDIUM · (S2-14, S3-16)
- IA-03 · `/contact` como página real (el header ya enlaza ahí): formulario corto, bloque de reserva, email, "Based in Toowoomba, serving Australia-wide" · nueva ruta · HIGH · (S1-01)
- IA-04 · Breadcrumbs en `/services/*` y `/case-studies/[slug]` con `BreadcrumbList` · · MEDIUM · (S3-15, S3-16)
- IA-05 · Enlaces internos: cada case study → su servicio y a pricing; cada servicio → 2 case studies + pricing; pricing → servicios + FAQ; About → case studies. Hoy los case studies no enlazan a nada más que prev/next · · MEDIUM · (S3-16)
- IA-06 · Sin páginas huérfanas salvo `/login` (correcto). `/about-me` conserva la URL para no perder indexación · · LOW
- IA-07 · Patrón de URL: minúsculas, guiones, sin fechas; consistente con lo actual · · OK

### 6.9 Datos estructurados (`schema`)
- SCHEMA-01 · `FAQPage` es correcto pero Google dejó de mostrar rich results de FAQ el 2026-05-07; mantenerlo por semántica y motores de IA, sin esperar snippet · `FAQSchema.tsx` · INFO
- SCHEMA-02 · `ProfessionalService`: email de Hotmail, `priceRange "$$"`, sin `image`/`logo`, `sameAs` con el Instagram de la marca vieja · `StructuredData.tsx` · MEDIUM · email del dominio, `priceRange: "AUD 2,450–8,000+"`, logo, `sameAs` corregido (S3-15)
- SCHEMA-03 · Falta `Person` (Julian Delgado) con `jobTitle`, `sameAs` LinkedIn, `knowsAbout`, `worksFor` enlazado por `@id` al negocio · · MEDIUM · (S3-15)
- SCHEMA-04 · `Service` solo para web y MVP; falta "Custom software & AI automation"; sin `Offer` (precio, `priceCurrency: AUD`, `unitText` project/month) · · MEDIUM · (S3-15)
- SCHEMA-05 · Case studies sin `Article`/`CreativeWork` (headline, image, datePublished, author, `about` = cliente) ni `BreadcrumbList` · `case-studies/[slug]/page.tsx` · MEDIUM · (S3-15)
- SCHEMA-06 · Blog ya tiene `Article`; unificar `author` con el `Person` por `@id` · `blog/[slug]/page.tsx` · LOW
- SCHEMA-07 · Consolidar en un `@graph` por página con `@id` estables y escapar `<` (SEC-18) · · MEDIUM · (S1-18, S3-15)
- SCHEMA-08 · Validar en Rich Results Test y validator.schema.org tras el cambio; no hace falta `SearchAction` · · LOW

### 6.10 Medición (`analytics`, `conversion-tracking`)
- MEAS-01 · No existe ningún evento en el código (`gtag`/`dataLayer`: 0 resultados). GA4 (`@next/third-parties`) y GTM se cargan a la vez: si el contenedor GTM también tiene un tag de GA4, los pageviews se duplican. Verificar en GTM Preview y dejar un solo camino · `layout.tsx:95-116` · HIGH · (S1-20)
- MEAS-02 · Plan de eventos (object_action, snake_case): `cta_clicked {location: header|hero|work|pricing|footer|about, label}` · `plan_cta_clicked {plan}` · `contact_form_started` (primer foco) · `contact_form_submitted {topics, budget}` solo en la rama de éxito confirmada · `contact_form_failed {reason}` · `fit_call_booked {tool}` · `faq_opened {question}` · `case_study_cta_clicked {slug}` · `outbound_clicked {network}` · `email_clicked` · HIGH · (S1-21)
- MEAS-03 · Key events en GA4: `contact_form_submitted` y `fit_call_booked`, contados una vez por sesión; después se importan a Google Ads y Meta. Nunca marcar `cta_clicked` como conversión (es intención, no resultado) · GA4 admin · HIGH
- MEAS-04 · Implementación: `dataLayer.push` desde la rama `res.ok` de `ContactForm` (depende de S1-08); trigger de evento personalizado en GTM; verificación con email de prueba identificable en DebugView y GTM Preview; registrar "observado" vs. "reportado" · `ContactForm.tsx`, GTM · HIGH · (S1-21)
- MEAS-05 · Momento de conversión de la llamada: si se usa Calendly, el `postMessage` `calendly.event_scheduled`; si Cal.com, su evento `bookingSuccessful`; si el módulo propio, la respuesta 200 del booking · depende de D-06 · MEDIUM
- MEAS-06 · UTM para posts propios: `utm_source=linkedin|instagram|facebook`, `utm_medium=social`, `utm_campaign=wrcc-content-studio-2026-11`, `utm_content=post-1`; todo en minúsculas y guiones; grupo de canal personalizado para referrers de asistentes de IA · docs · LOW
- MEAS-07 · Baseline: no hay eventos históricos; anotar sesiones/usuarios de 30 días antes del Sprint 1 y la fecha de activación de eventos · GA4 · MEDIUM · (S0-08)
- MEAS-08 · Pixel de Meta y Google Ads: no instalar hasta tener `/privacy` (S1-03) y consent mode configurado (Australia no exige banner para analítica, pero sí política visible) · · MEDIUM
- MEAS-09 · Los 200 falsos del honeypot no deben contar: el bot no ejecuta el cliente, pero en tests manuales con `hp` relleno el cliente dispararía `contact_form_submitted`; devolver un flag `{ok:true, skipped:true}` y no disparar · `route.ts`, `ContactForm.tsx` · LOW

### 6.11 Pruebas E2E (agente `e2e-runner`, pendiente de escribir en S0-01)
- E2E-01 · Navegación: todos los `href` internos de header, footer y home responden 200 (hoy fallan `/contact`, `/public`, `/privacy`, `/terms`) · `tests/e2e/navigation.spec.ts`
- E2E-02 · Formulario feliz: completar, enviar, ver el estado de éxito; la API se mockea con `page.route` para 200 · `contact.spec.ts`
- E2E-03 · Formulario con error: API 500 y 429 → toast de error, valores conservados, sin estado de éxito (hoy fallaría: SF-01) · `contact.spec.ts`
- E2E-04 · Honeypot: `hp` relleno → la API responde 200 sin enviar (mock de Resend) · API test
- E2E-05 · Menú móvil a 320: abre, cierra con Escape y con el botón, foco vuelve al botón, enlaces navegan · `mobile-menu.spec.ts`
- E2E-06 · Sin overflow horizontal a 320/768/1440 en las 6 páginas; captura de referencia por página y viewport para regresión visual · `visual.spec.ts`
- E2E-07 · SEO: una sola `<h1>` por página, `canonical` propio, `noindex` en `/login`, sitemap sin 404 · `seo.spec.ts`
- E2E-08 · Accesibilidad automática: `@axe-core/playwright` sin violaciones `serious`/`critical` en las 6 páginas · `a11y.spec.ts`
- E2E-09 · Reduced motion: con `reducedMotion: 'reduce'` no hay `<video autoplay>` reproduciéndose ni marquee animado · `motion.spec.ts`

### 6.12 Código muerto y simplificación (agente `refactor-cleaner`; knip 6.44 + depcheck, sin borrar nada)
- DEAD-01 · `useScroll` importado sin usar · `Services.tsx:23` · SAFE · quitar (S3-24)
- DEAD-02 · `DM_Sans` declarada y aplicada al body; `font-dm-sans` y `--font-dm-sans` sin consumidores · `layout.tsx:2,10,111`, `globals.css:30` · SAFE · borrar (S2-16)
- DEAD-03 · `Cormorant_Garamond` solo en `HeaderLogo`; el token `--font-cormorant` es un string de familia, no la variable de next/font, así que el logo puede estar cayendo a Georgia · `layout.tsx:9`, `HeaderLogo.tsx:22` · VERIFY · logo en DM Serif y quitar la fuente (S2-16)
- DEAD-04 · Bloque `.dark {}` y `@custom-variant dark` sin nada que active la clase; las utilidades `dark:` en ui/*, admin y enums son inertes · `globals.css:4,93-121` · VERIFY · borrar (S3-19, D-01)
- DEAD-05 · `case-study.mapper.ts` (singular) sin importadores · `lib/mappers/case-study.mapper.ts` · SAFE · borrar (S3-24)
- DEAD-06 · `CaseStudyHeroSection.tsx` sin referencias (reemplazado por `HeroSection.tsx`) · `Case-study/CaseStudyHeroSection.tsx` · SAFE · borrar (S3-24)
- DEAD-07 · `ChallengeSection.tsx` sin referencias (reemplazado por `ProblemSection`) · · SAFE · borrar (S3-24)
- DEAD-08 · `ContextSection.tsx` sin referencias (reemplazado por `OverviewSection`) · · SAFE · borrar (S3-24)
- DEAD-09 · `C` exportado sin uso externo · `case-study.constants.ts:30` · VERIFY · quitar `export`
- DEAD-10 · `@react-three/fiber`, `@react-three/drei`, `three` sin uso · `package.json` · SAFE · desinstalar (S3-02)
- DEAD-11 · `@imagekit/next` sin uso (solo se usa el SDK `imagekit` de servidor) · `package.json:30` · SAFE · desinstalar (S3-02)
- DEAD-12 · `critters` sin import ni referencia en config (`optimizeCss` sí está activo: verificar antes) · `package.json:44` · VERIFY · (S3-24, PERF-25)
- DEAD-13 · `@radix-ui/react-accordion` solo usado por `ui/accordion.tsx`, que no se usa · `package.json:34` · SAFE · desinstalar con el archivo (S3-02)
- DEAD-14 · `embla-carousel-react` solo usado por `ui/carousel.tsx`, que no se usa · `package.json:45` · SAFE · desinstalar (S3-02)
- DEAD-15 · `eslint-plugin-jsx-a11y` no registrado en ningún config de ESLint · `package.json:46` · VERIFY · registrarlo (conviene para el Sprint 2) o quitarlo
- DEAD-16 · `pg` y `@types/pg` sin import directo (`@prisma/adapter-pg` lo trae) · `package.json:53,70` · VERIFY · probar quitar + build
- DEAD-17 · Primitivas UI sin uso: `accordion.tsx`, `card.tsx`, `carousel.tsx`, `textarea.tsx`, `RevealSection.tsx`, `RotatingWord.tsx` · `src/components/ui/` · SAFE · borrar (S3-24)
- DEAD-18 · Hooks sin uso: `use-mobile.tsx`, `use-scroll-animation.ts` · `src/hooks/` · SAFE · borrar (S3-24)
- DEAD-19 · Archivos sin uso: `Contact/ContentPanel.tsx`, `Hero/hero.types.ts`, `lib/validations/common.ts` · · VERIFY · borrar tras build (S3-24)
- DEAD-20 · `@types/bcryptjs` innecesario (bcryptjs v3 trae tipos) · `package.json:68` · SAFE · desinstalar (S3-02)
- DEAD-21 · Exports sin uso en auth/errores/http: `requireAuth`, `requireRole`, `getUserRoles`, `hasPermission`, `ConflictError`, `ServiceUnavailableError`, `RateLimitError`, `errorResponse`, `paginatedResponse`, `signIn`/`signOut` · `rbac.ts:6-26`, `api-error.ts:158-192`, `api-handler.ts:32,127`, `auth.ts:7` · VERIFY · **conservar**: S1-07 usa `RateLimitError`/`ServiceUnavailableError` y S2-21 usa `requireRole`
- DEAD-22 · Exports de servicios sin uso: `assignRolesToUser`, `getSetting`, `upsertSetting`, `toggleUser` · `roles.ts:75`, `settings.ts:11,15`, `users.ts:127` · VERIFY
- DEAD-23 · Enums sin uso: `LeadStatus`, `BookingStatus`, `UserRole`, `DEFAULT_PAGE_SIZE`, `MAX_PAGE_SIZE`, `MediaProvider`, `AuditAction` · `lib/types/enums.ts:37-151` · VERIFY · `MAX_PAGE_SIZE` sirve para DB-10
- DEAD-24 · `toCaseStudyDetailProps` sin uso · `case-study.mappers.ts:233` · SAFE · quitar (S3-24)
- DEAD-25 · `LocalBusinessSchema`, `WebDevelopmentServiceSchema`, `MVPDevelopmentServiceSchema`, `WebSiteSchema` marcados sin uso por knip (se renderizan vía `StructuredData()`; falso positivo parcial) · `StructuredData.tsx` · VERIFY · se reescriben en S3-15
- DEAD-26 · Exports sin uso: `FormSkeleton`, `SortableItem`, `buildSrcSet`, `BLOBS_*`, `CARD_CONFIGS`, `buttonVariants`, `useFormField`, `FormDescription`, `ToasterProps`, `Tooltip*`, `toastApiError` · varios · VERIFY · quitar `export` salvo primitivas shadcn
- DEAD-27 · `public/img/julian-profile.webp` sin referencias en src ni seed · · VERIFY · revisar en la base antes de borrar
- DEAD-28 · Los README de `public/img/projects/*` se sirven como estáticos; `compliance-platform/` solo tiene README · `public/img/projects/*/README.md` · SAFE · mover a `docs/projects/` (S3-24)
- DEAD-29 · Artefactos en el root: `prisma_output.txt`, `prisma_migrate_output.txt`, `dev.db`, `.idea/*`, `.playwright-mcp/` · · SAFE · (S0-04)
- DEAD-30 · Migraciones duplicadas · `prisma/migrations/` · VERIFY · (S0-03)
- `dotenv` está sin listar en `package.json` pero lo usan `prisma.config.ts` y `seed.ts` · SAFE · agregar a devDependencies (S0-04)
- Verificado en uso: `@dnd-kit/*` (admin), `react-icons` (2 iconos, reemplazar igual), `tw-animate-css`, tooling de Tailwind y Vitest, `NavSlice`/`ApproachSection`/`SolutionSection`/`TestimonialSection`, `Services/ContentPanel.tsx`, `imagekit` y `cloudinary`, todas las imágenes de `public/img` salvo `julian-profile.webp`.

### 6.13 Base de datos (agente `database-reviewer`)
- DB-01 · Lecturas públicas por slug sin filtro de `status`/`deleted` · `case-studies.ts:47`, `blog.ts:55` · HIGH · (S1-11)
- DB-02 · Ningún `revalidatePath`/`revalidateTag` tras escrituras admin · páginas con `revalidate = 60` · MEDIUM · (S3-09)
- DB-03 · `getPlans()` sin filtro `active` · `plans.ts:4` · MEDIUM · (S1-12)
- DB-04 · `getPublishedCaseStudies` carga body + 6 relaciones en home, lista, params y detalle · `case-studies.ts:54` · MEDIUM · (S3-09)
- DB-05 · Listas públicas sin `take`; blog incluye `content` en la lista · `blog.ts:62` · MEDIUM · (S3-09)
- DB-06 · Índices no coinciden con las consultas públicas; `@@index([slug])` redundante · `schema.prisma:209-211` · MEDIUM · (S3-10)
- DB-07 · Flags de soft-delete sin índice · `schema.prisma:343-374` · LOW · (S3-10)
- DB-08 · `featured` y `publishedAt` sin índice · · LOW · (S3-10)
- DB-09 · 13 FK sin índice · `schema.prisma:347-386` · MEDIUM · (S3-10)
- DB-10 · `limit` sin tope en listas admin · `leads.ts:36` · MEDIUM · (S2-21)
- DB-11 · `sortBy` sin allowlist · · MEDIUM · (S2-21)
- DB-12 · Export CSV sin paginar ni escapar · `leads.ts:157` · MEDIUM · (S3-21)
- DB-13 · Búsqueda `contains` sin trgm · · LOW · aceptable por ahora
- DB-14 · Mutación y auditoría no atómicas; `sortOrder` con carrera · `blog.ts:158`, `case-studies.ts:92` · MEDIUM · (S3-11)
- DB-15 · Borrado inconsistente (hard en planes, soft en el resto) · `plans.ts:69` · LOW · (S3-11)
- DB-16 · `renormalizeIfNeeded` N updates · `case-studies.ts:61` · LOW · (S3-11)
- DB-17 · JSON en columnas `String` sin validar · `schema.prisma:184-189` · MEDIUM · (S3-12, D-09)
- DB-18 · `tags` como string con `contains` · · LOW · `String[]`
- DB-19 · `Customer` y joins de industria/tool/tech nunca se escriben; includes siempre vacíos · `schema.prisma:203` · LOW · enlazar en el seed o quitar includes
- DB-20 · Dos migraciones iniciales idénticas (difieren solo en `CREATE SCHEMA`); `migrate deploy` limpio falla · `prisma/migrations/` · HIGH · (S0-03). Verificado: el diff muestra solo esas 3 líneas.
- DB-21 · `dev.db` y `prisma_*output.txt` en el root · · LOW · (S0-04)
- DB-22 · Sospecha de `prisma/` ignorado en `.gitignore` · · **descartado**: verificado con `git check-ignore`, `schema.prisma` está trackeado; las migraciones están untracked pero no ignoradas (commitear en S0-04)
- DB-23 · Seed sobrescribe todo, incluido `id` y `deleted` · `seed.ts` · HIGH · (S0-02)
- DB-24 · Seed resetea admin, integraciones y settings · `seed.ts` · HIGH · (S0-02)
- DB-25 · IDs hardcodeados, `Plan` sin clave única de negocio, posible colisión de `sortOrder` 3 · `seed.ts:989` · LOW · `slug` único en `Plan`
- Nota · Pool sin límites ni timeouts; aviso `sslmode=require` · `prisma.ts:15` · (S3-22)

## 7. Duplicados y conflictos resueltos
- `transition: all`, fuentes, video de contacto, `dynamic()` en la home y los handlers de scroll aparecieron en 2–4 análisis; se consolidaron en un ítem cada uno (S3-05, S2-16, S1-06/S3-03, TS-01/PERF-07, S3-07).
- DB-22 (gitignore) se descartó tras verificar; S0-04 cubre lo que sí falta.
- El agente de seguridad y el de errores silenciosos coinciden en el formulario (SEC-03…06 y SF-01…06); S1-07 y S1-08 los cubren juntos.

## 8. Fuera de alcance por ahora
- Rediseño del sistema visual (la dirección editorial se mantiene; UX-11).
- Modo oscuro completo (salvo D-01 en contra).
- UX del panel de admin (solo seguridad y datos).

## 10. Estado de ejecución (2026-10-31)

Rama: `audit/sprint-0-1` (sin commits todavía). Verificación: `tsc` limpio, lint limpio en los archivos tocados (los 9 errores restantes de ESLint son previos, en `Experience.tsx`, `not-found.tsx`, `case-studies/page.tsx`, `use-prefers-reduced-motion.ts`, `provider-cloudinary.ts`), 168 tests unitarios y 83 end-to-end en verde (desktop 1440, tablet 768, móvil 320).

**Sprint 0**
- S0-01 hecho: `tests/e2e/*` (navegación, formulario con API mockeada, API real con honeypot/400, menú móvil, SEO, headers, axe, reduced motion). `npm run test:e2e`.
- S0-02 hecho: el seed exige `SEED_ADMIN_PASSWORD` (≥ 12), es create-only para admin, media, case studies, planes, integraciones y settings, y se niega a correr contra un host no local salvo `ALLOW_PROD_SEED=1`.
- S0-03 diferido: `prisma migrate status` reporta las dos migraciones como aplicadas en la base remota. Borrar una carpeta haría que Prisma la marque como "falta en el repo"; se resuelve con un baseline cuando haya base de staging (S0-05).
- S0-04 hecho: `.gitignore`, artefactos borrados, `dotenv` en devDependencies. Falta commitear `prisma/migrations`.
- S0-05 pendiente de Julian: hace falta una base de desarrollo (Prisma Postgres gratis o Docker local).
- S0-06 descartado por decisión de Julian (los secretos no importan).
- S0-08 pendiente de Julian: anotar sesiones/usuarios de GA4 de los últimos 30 días.

**Sprint 1**: 21 de 21 ítems implementados; S1-05 queda parcial porque el CTA "Book a 30-minute call" lleva a `/contact` con el formulario; falta la herramienta de reserva (D-06). Además se adelantaron del Sprint 2: labels reales en el formulario, resumen de errores enfocable, `outline-none` eliminado, topics y presupuesto alineados a la oferta (S2-04, S2-05), menú móvil como `<nav>` sin roles de menú, skip link en las páginas de detalle (S2-20 parcial), label "Contact" y tagline del footer (S2-14 parcial).

**Gate de accesibilidad**: `tests/e2e/a11y.spec.ts` bloquea toda violación serious/critical de axe en las diez páginas públicas y tres viewports. Las tres excepciones (`color-contrast`, `target-size`, `scrollable-region-focusable`) se quitaron el 2026-10-31 tras una corrida completa en verde y un pase final de contraste (ver Sprint 3).

**Decisiones tomadas por defecto** (Julian pidió "ponerlo en marcha"): D-01 light explícito (pendiente de implementar en S3-19), D-02 blog fuera del nav y del sitemap mientras no haya posts, D-03 hero opción A, D-04 formulario corto queda para S2-06, D-05 no correr el seed hasta tener base de dev, D-06 pendiente (Calendly o Cal.com), D-07 rate limiter en memoria (sirve en un proceso único; Upstash si hay varias instancias), D-08 Turnstile pendiente, D-09 queda para S3-12, D-10 descartado.

**Sprint 2 (2026-10-31, rama `audit/sprint-0-1`)**: 20 de 21 ítems implementados en un solo pase; S2-18 queda parcial (botón del blog al acento; los labels de sección siguen con dos estilos). Resumen de lo que cambió:
- Header con fondo translúcido y blur al hacer scroll, nav de escritorio desde 1024 px, colores de nav legibles, menú móvil como `<nav>` con cierre al perder foco y alto máximo con scroll.
- Contraste subido en Work, FAQ, Pricing, Services, Process, About, footer y hero; `--secondary` oscurecido para el skip link; piso de 0.7 rem (11 px) en los labels de toda la UI pública; `scroll-padding-top` global; contador del hero bajo la hamburguesa en móvil.
- Hero: slides como botones con nombre y `aria-current`, botón de pausa, autoplay detenido con reduced motion, hover y foco, región con `aria-roledescription="carousel"` y anuncio en vivo solo cuando está pausado; CTA acortado en móvil.
- Work y NavSlice: estados de hover replicados en foco; nombres de enlace completos; alt vacíos en imágenes repetidas; flechas decorativas ocultas.
- FAQ: `h3` por pregunta, `aria-controls`/`region`, `inert` al cerrar, evento `faq_opened`; seis preguntas nuevas (qué necesito, qué pasa si desaparecés, precio de software, IA con aprobación humana) y plazos coherentes con los planes.
- Services y Process: lista lineal (`StaticSteps`) en móvil, tablet y reduced motion; en desktop la escena sticky queda `aria-hidden` y una copia `sr-only` expone todos los pasos; `100svh`.
- Pricing: "Best for" por plan (con defaults por nombre, sobrescribibles desde el admin con `bestFor` en el JSON de features), CTA "Get a fixed quote" con nombre del plan, foco al heading de contacto tras el scroll, features en Fira Sans, sin "starting at", `tabular-nums`.
- Contacto: testimonio real junto al formulario; campos opcionales plegados bajo "Add project details (optional)" para que la primera pantalla pida solo nombre, email, qué querés construir y mensaje.
- Tipografía: dos familias (DM Serif Text + Fira Sans 300–600 sin itálicas), tokens apuntando a las variables de next/font, logo en DM Serif, `kern`/`liga`, `text-wrap: balance` en títulos y `pretty` en párrafos, tracking en los labels en mayúscula que no lo tenían, apóstrofos curvos en el copy, sin signos de exclamación, marquee estático con reduced motion y con la copia duplicada oculta a AT.
- Copy: servicios con plazos y precios concretos, en-AU ("SEO optimisation"), "Architecture graduate" en el seed.
- Admin: 401 JSON en `/api/admin/*` sin sesión, `callbackUrl` en el redirect a login, `requireRole` en el layout de admin (deny por defecto), `sortBy` con lista blanca, redirect de forbidden a `/login` para evitar bucles.
- Base: pool de Prisma con `max`, `idleTimeoutMillis`, `connectionTimeoutMillis` y `keepAlive` tras ver `P1017` en desarrollo (S3-22 adelantado).
- Lecturas públicas (`getPublishedCaseStudies`, `getPublishedCaseStudyBySlug`, `getActivePlans`, `getPublishedBlogPosts`, `getPublishedBlogPostBySlug`) cacheadas con `unstable_cache` (60 s, tags `case-studies`/`plans`/`blog`) y fechas restauradas con `reviveDates`; la home pasó de 5–13 s a ~1 s por render en desarrollo. Pendiente S3-09: llamar `revalidateTag` desde las escrituras del admin (S3-09).
- Bug corregido durante la verificación: la versión estática de Services/Process devolvía antes de montar el contenedor de `useScroll` y framer-motion lanzaba "Target ref is defined but not hydrated" en móvil; la escena sticky ahora vive en `ServicesScene`/`ProcessScene`, montados solo en desktop.
- Verificación: `tsc` limpio, 170 tests unitarios en verde, lint sin errores nuevos. La suite end-to-end completa **no pudo terminar en esta máquina**: la corrida fue detenida por falta de memoria (había ~46 procesos de node/Chromium abiertos de sesiones anteriores). Las corridas parciales dieron 76/83 y 45/50 con fallos atribuibles a timeouts de la base remota (5–20 s por página, un `P1017`), no a regresiones; cuatro de esos tests pasaron al repetirlos con la base respondiendo. Queda pendiente una corrida completa en verde antes de mergear, y recién entonces quitar las tres excepciones del gate de axe (`color-contrast`, `target-size`, `scrollable-region-focusable`).

**Sprint 3 (2026-10-31, rama `audit/sprint-0-1`)**: 17 ítems cerrados, 5 parciales (S3-03, S3-06, S3-07, S3-12, S3-20), 3 pendientes de Julian (S3-13, S3-18 y aplicar la migración) y 2 diferidos a propósito (S3-11 transacciones, S3-23 refactors grandes). Antes del sprint se relanzó la suite end-to-end completa: 83/83 en verde; luego se quitaron las tres excepciones de axe y se corrigieron los contrastes que quedaban (labels 0.5/0.55 → 0.62 sobre claro, acento claro `--hero-accent-light` para texto de acento sobre oscuro en nav y StaticSteps, labels de 8 px del About y de los case studies subidos al piso de 0.7 rem, marca de agua de Principles movida a `::before`, textos del listado de case studies a 0.6+). Resumen:
- Dependencias y código muerto (S3-02/24/25): fuera `react-icons`, `three`, `@react-three/*`, `@imagekit/next`, `@radix-ui/react-accordion`, `embla-carousel-react`, `critters`, `@types/bcryptjs` (80 paquetes menos); borrados 15 archivos sin importadores y los keyframes `workFloat`, `slideUp`, `dialogIn`, `slideIn`; READMEs de proyectos movidos a `docs/projects/`; `optimizeCss` → `optimizePackageImports`. Light explícito (`color-scheme: light`) y sin `.dark` (S3-19).
- Rendimiento (S3-03/04/05/06/07): videos de Services con `preload="none"` y poster 1 correcto; `priority` fuera de Process/Services, `sizes` reales, `loading="lazy"`; hero con `loader` de Cloudinary (q ≤ 75) y `preconnect` a `res.cloudinary.com`; `transition-all` reemplazado; acento concreto para framer en Services; `useScrollStep` solo re-renderiza al cambiar el paso o cada 1 % de progreso; `useScrollState` con rAF y estado solo al cambiar; `CaseStudyView` con `useScroll().scrollYProgress`; `FloatingPreview` con `translate3d`. Quedan `LazyMotion`/`m.*` (S3-06), rAF+`ResizeObserver` del hero y el video de contacto más liviano (S3-03).
- Datos (S3-09/10/12/21): `revalidateTag(tag, "max")` en todas las escrituras admin de case studies, blog y planes; migración `20261031160000_content_indexes` generada con `prisma migrate diff` (índices compuestos `(status, deleted, sortOrder)`, `(status, deleted, publishedAt)`, `(active, sortOrder)` y todas las FK sin índice; quita los índices redundantes de `slug`). **No se aplicó a la base remota**: correr `npx prisma migrate deploy` cuando Julian decida. `exportLeadsCsv` pagina de a 500 y escapa celdas con `csvCell` (fórmulas `= + - @`, comillas, saltos). `parseCaseStudyBody` loguea el error de parseo.
- SEO y estructura (S3-14/15/16/17): `opengraph-image.tsx` (1200×630), `themeColor`, título absoluto en About, título del layout alineado a la oferta y sin `<title>` duplicado en el `<head>`; JSON-LD en `@graph` (`Person`, `ProfessionalService` con `makesOffer`, `WebSite`, `Service` ×3 con `Offer` por plan) desde `src/lib/content/offers.ts`; `Article` + `BreadcrumbList` en cada case study y fecha de publicación visible en el hero. Páginas nuevas `/services`, `/services/websites`, `/services/custom-software` y `/pricing` (hero con breadcrumbs, para quién es, qué incluye, paquetes, proceso, prueba social con enlaces solo a case studies publicados, FAQs por página con `FAQPage`, CTA); nav de 4 ítems (Work, Services, Pricing, About) + CTA; footer en columnas Services/Company/Contact; `/llms.txt` y `/pricing.md`; sitemap con las cuatro páginas. Bug encontrado al verificar: un slug inexistente de case study devolvía 200 porque `loading.tsx` emitía el shell antes del `notFound()`; se quitaron los dos `loading.tsx` de case studies y ahora es 404 (test nuevo en `seo.spec.ts`).
- Admin (S3-20): subida de media con tope de 10 archivos y 10 MB, tipo decidido por magic bytes y nombre regenerado (`validate-upload.ts`); Origin/Referer/Sec-Fetch-Site check para mutaciones en `/api/admin/*` (`isTrustedOrigin`, en `proxy.ts`); guardas de último admin y de auto-desactivación en `users.ts`; `config` de integraciones enmascarado en las respuestas y rutas de integraciones con `withErrorHandling` + 404 real. Pendiente: cifrar `config` (hace falta una clave en el entorno), restringir tokens de ImageKit, allowlist de hosts en `mediaAssetSchema`, y pasar las otras 21 rutas admin con try/catch manual a `withErrorHandling`.
- Lint: los 9 errores previos quedaron en 0 (`Experience.tsx` con `useInView once`, `not-found.tsx`, `AdminShell` con `useLocalStorageState` sobre `useSyncExternalStore`, `usePrefersReducedMotion` sobre `useMediaQuery`, `UploadApiResponse` en Cloudinary). Quedan 26 warnings previos.
- Verificación: `tsc` limpio, 190 tests unitarios (20 nuevos: CSV, Origin, validación de subida), suite end-to-end completa con las cuatro páginas nuevas en los tres viewports (resultado en la línea siguiente).

**Reservas y anti-bots (2026-10-31)**: D-06 y D-08 cerrados. `/contact` suma la sección "Book a call" con el calendario inline de Cal.com (`@calcom/embed-react`, enlace de respaldo a cal.com, `fit_call_booked` al confirmar) y un enlace "Prefer to talk? Pick a time" bajo la intro; CSP ampliado a `app.cal.com`, `cal.com` y `challenges.cloudflare.com`. Turnstile (`@marsidev/react-turnstile`, apariencia `interaction-only`) entrega un token que el formulario espera hasta 6 s antes de enviar y que `/api/contact` verifica con `verifyTurnstileToken` (falla cerrado; se omite cuando no hay secreto, como en los e2e). Política de privacidad actualizada con Cal.com y Cloudflare. Claves en `.env.local`; faltan en el hosting. Pendiente de Julian: el evento de Cal.com dura 30 min y el copy dice 20 (cambiar la duración del evento o el copy). S3-18 (Google Business Profile) descartado por decisión de Julian; S0-08 cerrado con línea base cero.

**Hosting y base (2026-11-01)**: Vercel bloqueó el equipo por fair use (otro proyecto consumió la cuota) y el sitio pasó a Netlify gratis (`juliandelgado-com-au`, build desde GitHub `master`, `netlify.toml` + `@netlify/plugin-nextjs`). Para que compile ahí: middleware con configuración de Auth.js sin Prisma (`auth.config.ts`) y corrección de `reviveDates`, que rompía el prerender de case studies en producción. DNS en Cloudflare con CNAME a Netlify; `AUTH_URL` al dominio real. S0-05 cerrado: Postgres 17 local en Docker (`crafted-digital-db`, puerto 5433) con copia de producción; `.env.local` y `prisma.config.ts` apuntan ahí, así que ni Next.js ni la CLI de Prisma tocan producción en local. Seed probado sobre la copia y aplicado en producción (create-only): +1 plan (Custom Software & AI Automation) y +5 case studies (4 publicados, compliance en borrador); nada existente cambió. Ongoing Tech Partner pasó a `sortOrder` 4. Respaldo de producción previo en `pg_dump`.

**Medición en producción (2026-11-01, S3-13)**: la API de PageSpeed agotó su cupo anónimo, así que se midió con Lighthouse 12.8 (el mismo motor) desde la máquina de desarrollo contra juliandelgado.com.au; las corridas móviles varían mucho en esta máquina (34–66 en la misma URL). Antes de los arreglos: home móvil 43 (TBT 1.150 ms, hilo principal 25 s), home desktop 79, `/services/custom-software` 80/97, `/contact` desktop 91; accesibilidad 100 en todas, SEO 92. Arreglos publicados (`f8b2d83`): barra de progreso del hero por CSS en vez de estado por cuadro, canvases de precios pausados fuera de pantalla y DPR ≤ 1,5, precarga de la foto del siguiente slide, CSP para el beacon de Cloudflare. Después: home desktop 82–90 (TBT 10 ms), móvil 66 en la corrida estable (TBT 310 ms, hilo principal 5,9 s). Lo que queda en móvil es retardo de render del texto del hero bajo throttling (render delay ~4,4 s con TTFB ~1,3 s) e hidratación de una home casi toda cliente: es el refactor S3-23 (secciones en servidor, `LazyMotion`). SEO 92 y parte de best-practices vienen del proxy de Cloudflare (nube naranja): robots.txt gestionado con `Content-Signal` (Lighthouse lo marca inválido; además bloquea crawlers de entrenamiento de IA), script de desafío con APIs obsoletas y ofuscación de email. Con DNS only (nube gris) desaparecen. Pendiente: repetir con PageSpeed Insights cuando haya cupo y con datos de campo (CrUX) cuando haya tráfico.

**Rendimiento móvil, segunda pasada (2026-11-01, `d4dd1be`)**: formulario de contacto (zod, react-hook-form, Turnstile) cargado al acercarse la sección; escenas de scroll de Services y Process separadas (`ServicesScene`, `ProcessScene`) y cargadas solo en desktop, así framer-motion no se descarga en el teléfono; footer sin framer-motion; GTM con `lazyOnload`; sin `will-change` permanente en las ~290 letras de Work; sin `backdrop-blur` sobre los canvas de precios. Banco local reproducible (build de producción, 390×844, CPU ×4, mediana de 7, mismo momento para ambas versiones): JS 2.014 → 1.339 KB, bloqueo 1.761 → 1.405 ms, LCP 1.068 → 700 ms. El perfil de CPU muestra que lo que queda es sobre todo trabajo nativo de estilo, layout y pintado de una home de ~1.200 nodos, no JavaScript propio; bajarlo más implica simplificar el diseño de la home. El chunk de framer-motion que todavía aparece en móvil llega por el prefetch de enlaces a About y case studies, no lo ejecuta la home.

## 9. Registro de cambios de este plan
- 2026-10-31 v2.3 — Sprint 3 ejecutado (17 cerrados, 5 parciales) en `audit/sprint-0-1`; gate de axe sin excepciones; ver sección 10.
- 2026-10-31 v2.2 — Sprint 2 ejecutado (20/21) y commits `89cd5bd`, `0fa3e6a`, `0465c47` en `audit/sprint-0-1`; ver sección 10.
- 2026-10-31 v2.1 — Sprint 0 y Sprint 1 ejecutados en la rama `audit/sprint-0-1`; ver sección 10.
- 2026-10-31 v2 — Batería completa de 13 análisis: 24 SEC, 21 TS, 25 PERF, 30 A11Y, 25 DB, 18 SF, 30 DEAD, 13 TYPO, 11 UX, 14 COPY, 7 IA, 8 SCHEMA, 9 MEAS, 9 E2E (244 hallazgos, consolidados en 8 ítems de Sprint 0, 21 de Sprint 1, 21 de Sprint 2 y 25 de Sprint 3). Decisiones D-06…D-10. DB-22 descartado tras verificación.
- 2026-10-31 v1 — Creado a partir del informe del 2026-10-30. 43 ítems en 3 sprints, 5 decisiones, 13 análisis pendientes.
