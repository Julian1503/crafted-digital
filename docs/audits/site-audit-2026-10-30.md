# Auditoría completa del sitio — juliandelgado.com.au

**Fecha:** 2026-10-30
**Entorno auditado:** `next dev` local (Next.js 16.1.6, Turbopack) contra la base de datos remota. Los pesos de JS incluyen las devtools de Next, así que las cifras de performance son orientativas; las conclusiones estructurales no cambian.
**Método:** recorrido con Playwright de `/`, `/about-me`, `/case-studies`, `/case-studies/ai4l-automation-and-web-platform`, `/blog`, `/login` a 320, 768 y 1440 px, con `prefers-color-scheme` light y dark. Diagnóstico por página (overflow, encabezados, metadatos, JSON-LD, imágenes, targets táctiles, formularios), axe-core 4.10 (WCAG 2.0/2.1 AA + best practice), medición de recursos con la Performance API y revisión estática del código contra las Web Interface Guidelines de Vercel, más las skills design-audit, cro, seo-audit y ai-seo.
**Capturas:** `.playwright-mcp/audit/*.jpg` (20 archivos).

---

## Resumen ejecutivo

El sitio tiene una dirección visual fuerte y poco común (editorial, serif grande, secciones cinemáticas) y una base técnica correcta: semántica, skip link, JSON-LD, canonicals, en-AU. Pero hoy **la acción de conversión principal está rota** y el mensaje del hero no dice qué vendés ni a quién. Antes de cualquier refinamiento visual o de SEO, hay cinco cosas que bloquean resultados:

| # | Hallazgo | Impacto |
|---|----------|---------|
| 1 | El botón **"Start a project"** del header (desktop y menú móvil) enlaza a `/contact`, que devuelve **404**. El logo enlaza a `/public`, también 404. | Crítico. Es el CTA primario en todas las páginas. |
| 2 | El **H1 de la home es "Julian Delgado"** (dos veces) y el subtítulo es "Crafting digital experiences that connect brands with people — from concept to pixel". No dice qué hacés, para quién ni dónde. | Crítico para conversión y SEO. |
| 3 | En **móvil (320 px) la sección de contacto muestra ~700 px en blanco** antes del formulario: el panel de video de fondo ocupa 1.102 px pero no se pinta. El formulario queda fuera de la primera pantalla y parece que la página terminó. | Crítico en móvil. |
| 4 | El **endpoint `/api/contact` no tiene rate limiting ni valida el honeypot**, y envía un email automático a cualquier dirección que se le pase. Es un relé de spam abierto. | Crítico (seguridad). |
| 5 | **`sitemap.xml` está hardcodeado con slugs que no existen** (`ai-contract-automation`, `tradie-booking-platform`, 4 posts de blog) y omite los case studies reales. `/blog` está vacío e indexable. `/login` es indexable con el canonical de la home. | Alto (SEO). |

Además: **no existe modo oscuro**. Hay un variant `.dark` en `globals.css` pero nada lo activa; `prefers-color-scheme: dark` renderiza exactamente igual que light (`colorScheme: normal`, mismo fondo `rgb(249,250,251)`). No es un bug, es una decisión no tomada. Recomendación abajo.

---

## Fase 1 — Crítico (bloquea conversión, usabilidad o confianza)

### 1.1 Rutas rotas en la navegación principal
- **Evidencia:** `curl /contact` → 404, `/public` → 404, `/privacy` → 404, `/terms` → 404. El CTA está en `src/components/layout/header/_components/DesktopCTA.tsx:30` y `MobileMenu.tsx:106`; el logo en `HeaderLogo.tsx:12`; Privacy y Terms en `Footer.tsx`.
- **Fix:** CTA → `/#contact` (o una ruta `/contact` real que renderice la sección). Logo → `/`. Crear `/privacy` y `/terms` (necesarios además para Meta Ads y para la confianza del formulario) o quitar los enlaces hasta tenerlos.

### 1.2 Hero sin propuesta de valor
- **Evidencia:** `HeroSection.tsx:313` H1 = nombre; `FloatingTitle.tsx:57` segundo `<h1>` (aria-hidden, pero sigue siendo un H1 en el DOM). Copy en `:343`. La etiqueta de slide ("Creative Direction", "Brand Identity") describe servicios que no ofrecés.
- **Fix (diseño):** mantener el nombre como marca visual (puede seguir en serif grande) pero el `<h1>` semántico debe ser la propuesta. El `FloatingTitle` pasa a `<div aria-hidden>`. Tags de slide alineados a la oferta real: Websites / Web apps / AI automation / Product design.
- **Copy propuesto** (en-AU, alineado a `.agents/product-marketing.md` v7):
  - **A (recomendada):** H1 "Custom software, AI automation and websites for Australian small businesses." Sub: "Built end to end by one senior engineer in Toowoomba. Fixed quotes in AUD, weekly demos, 30 days of support after launch."
  - **B:** H1 "Websites and internal tools that take the busywork off your plate." Sub: "For Queensland service businesses and small teams that have outgrown spreadsheets and template sites."
  - **C:** H1 "A senior engineer for your business, without the agency." Sub: "You talk to the person who designs and builds it. Websites from AUD 2,450, software from AUD 8,000."
  - **CTA primario:** "Book a 20-minute fit call" (en vez de "Start a project", que suena a compromiso). Secundario: "See the work".

### 1.3 Sección de contacto vacía en móvil
- **Evidencia:** capturas `home-320-contact.jpg` y `home-320-contact-2.jpg` (dos cargas distintas, misma pantalla en blanco). `#contact` mide 1.802 px; el formulario empieza a 693 px; el `<video>` (lights_bfoa7s.webm, 1,6 MB) tiene `readyState 4` y 1.102 px de alto pero no se ve.
- **Fix:** en `ContactSection.tsx`, en `< lg` no renderizar el panel de video (o darle `aspect-ratio` fijo y fondo oscuro sólido como fallback). El formulario debe empezar dentro de la primera pantalla tras el título. No cargar el webm en móvil (`media` query en `<source>` o render condicional).

### 1.4 Endpoint de contacto sin protección
- **Evidencia:** `src/app/api/contact/route.ts` parsea con Zod y envía dos emails (notificación + auto-reply al email del remitente). `contact-data.ts:31` acepta `hp` pero nunca se comprueba. No hay rate limit ni en el handler ni en `src/proxy.ts`. `next.config` no define headers de seguridad.
- **Fix:** rechazar silenciosamente si `hp` tiene valor (responder 200 sin enviar); rate limit por IP (p. ej. 5/hora) con Upstash o un KV simple; no enviar el auto-reply hasta validar que el envío principal funcionó; agregar `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` y HSTS en `next.config`.

### 1.5 Header en tablet (768 px)
- **Evidencia:** `DesktopNav.tsx:20` y `DesktopCTA.tsx:21` usan `md:flex`; `MobileToggle.tsx:15` `md:hidden`. A 768 px el nav de 7 ítems más el CTA no caben: el CTA queda cortado fuera de pantalla (`right=812` en un viewport de 768). Captura `home-768-services.jpg`.
- **Fix:** mover el breakpoint de nav de escritorio a `lg` (1024) o reducir el nav a 4 ítems (Work, Services, Pricing, About) con el resto en el footer.

### 1.6 Header ilegible sobre secciones oscuras
- **Evidencia:** solo Contact, Pricing y Services declaran `data-header-theme="light"`. Sobre la sección Work (fondo negro + foto), los enlaces del nav quedan en gris oscuro sobre imagen oscura (`home-1440-work.jpg`). axe reporta contraste 2.83:1 en enlaces del nav y 1.66:1 en labels del footer.
- **Fix:** declarar `data-header-theme="dark"` en Work, Case studies, About hero y footer; o hacer que el header detecte luminancia. Subir los grises del footer y del nav a ≥ 4.5:1.

### 1.7 Solapamientos en móvil
- **About (320 px, `about-320-mid.jpg`):** la barra sticky de métricas ("1 click / Hours / Day 0") se dibuja encima del logo y la hamburguesa.
- **Case study (320 px, `casestudy-320-mid.jpg`):** los chips de tecnologías pasan por debajo del header sticky; la galería horizontal recorta las tarjetas sin indicio de scroll ni padding de borde.
- **Home hero (320 px):** el contador "01 — 04" se superpone con el botón de menú.
- **Fix:** `scroll-margin-top`/`padding-top` igual a la altura del header en secciones sticky; z-index del header por encima de cualquier barra sticky de contenido; en la galería, `scroll-snap`, `padding-inline` y un hint visible.

### 1.8 Formulario sin etiquetas accesibles
- **Evidencia:** 8 campos sin `<label for>` ni `aria-label` (`FieldWrap.tsx` renderiza el label como `<span>`); los dos `<select>` (budget, timeline) no tienen `name`; los chips de topics y contacto son botones sin `role="group"` ni `aria-pressed`.
- **Fix:** `FieldWrap` renderiza `<label htmlFor={id}>` y pasa `id` al control; `LineSelect` recibe `name` e `id`; grupos de chips con `fieldset`/`legend` o `role="group"` + `aria-pressed`; errores con `aria-describedby`; toast con `aria-live="polite"`.

### 1.9 Afirmaciones no sostenibles
- **Evidencia:** `AboutHero.tsx:10` muestra "40+ Projects" mientras `/case-studies` dice "2 projects" y el contexto de marketing registra cero clientes directos. El año del hero de About es "2025" (`:86`) y el de la home "2026".
- **Fix:** cambiar a métricas verificables: "5+ years", "SE III", "3 industries" o "6 products shipped in 2026". Unificar el año desde una constante.

---

## Fase 2 — Refinamiento (eleva la experiencia)

| # | Hallazgo | Evidencia | Fix |
|---|----------|-----------|-----|
| 2.1 | **Cuatro familias tipográficas** (Cormorant 3 pesos, DM Sans 3, DM Serif 1, Fira Sans 5 = 12 archivos) | `layout.tsx:9-24`; `document.fonts` carga 8 variantes solo en la home | Quedarse con DM Serif Text (display) + Fira Sans (texto, 3 pesos). Quitar Cormorant y DM Sans si no se usan en superficie pública. |
| 2.2 | **Texto por debajo de 11 px** en 112 nodos a 320 px (labels 9,3 px, "← swipe →" 8,8 px, "Scroll to explore") | diagnóstico 320 | Mínimo 11 px para labels decorativos y 14 px para cualquier texto que se deba leer. |
| 2.3 | **Targets táctiles chicos**: puntos de slide 12×2 px, enlaces de nav 20 px de alto, "Not sure which plan?" 226×16, email del footer 15 px | diagnóstico 320/1440 | Área mínima 44×44 (padding, no tamaño de fuente). Los puntos de slide necesitan un hit-area invisible. |
| 2.4 | **Secciones scroll-jacked dejan huecos en tablet**: a 768 px el panel de imagen de Services se oculta y el contenido flota en el 40 % superior con el resto vacío | `home-768-services.jpg` | En `< lg` convertir Services y Process en scroll normal (stack vertical) y reservar el sticky para desktop. |
| 2.5 | **Pricing: "STARTING AT ✦" con el precio ya marcado "+"** duplica la idea; la lista de features en monospace 10 px es difícil de leer | `home-1440-pricing.jpg` | Una sola señal ("from"), features en Fira Sans 14 px. Añadir una fila "Best for…" por plan para resolver "¿cuál me corresponde?". |
| 2.6 | **Chips de topic del formulario no coinciden con la oferta** ("New SaaS", "E-commerce") y falta "Website" y "Custom software / automation" | `home-1440-contact.jpg` | Topics: Website, Web app / portal, Custom software & automation, Design / UX, Fix or improve existing site, Other. |
| 2.7 | **`transition: all`** en 13 elementos renderizados (button.tsx, accordion.tsx, Header.tsx, Footer.tsx, ContactForm.tsx, BlogCard.tsx, case-studies/page.tsx, globals.css) | grep + computed styles | Listar propiedades (`transition-[color,background-color,transform,opacity]`). |
| 2.8 | **Framer Motion anima `hsl(var(--hero-accent))`** y lanza decenas de warnings por scroll | consola | Pasar el color resuelto (hex) o animar `opacity` de un overlay. |
| 2.9 | **Imágenes sin `width`/`height`** en todas las páginas (3 en home, 7 en About, 4 en case study) y 1 imagen lazy por encima del fold | diagnóstico | `next/image` con dimensiones o `fill` + `sizes` correcto; `priority` en la hero. El `sizes="100vw"` del panel de Services no corresponde al ancho real. |
| 2.10 | **react-icons/fa** importa un chunk de 441 KB solo para LinkedIn e Instagram | Performance API, `Footer.tsx:10` | Dos SVG inline o `lucide-react`. |
| 2.11 | **Video de fondo del contacto: 1,6 MB** (44 % del peso total de la home) | Performance API | Comprimir a < 400 KB, `preload="none"`, `poster`, no cargar en móvil ni con `prefers-reduced-motion`. |
| 2.12 | **Footer con "ContactSection" como texto visible** | `footer.data.ts:8` | Label "Contact". |
| 2.13 | **Dos `<footer>` y tres `<nav>`** anidados | landmarks | Un solo `<footer>`; `aria-label` distinto en cada `<nav>`. |
| 2.14 | **Enlaces sociales con `role="listitem"`** | axe `aria-allowed-role` | Rol en el `<li>` contenedor, no en el `<a>`. |

---

## Fase 3 — Polish

- **Modo oscuro:** no existe. Opción A (recomendada hoy): declarar explícitamente el sitio como light (`color-scheme: light` en `<html>`, `theme-color` `#f9fafb`) y quitar el variant `.dark` muerto para que nadie asuma que funciona. Opción B: implementarlo con `next-themes` y tokens revisados; las secciones ya oscuras (Work, About, case studies) pasarían a necesitar una variante light para no duplicar.
- **`<meta name="theme-color">`** ausente en todas las páginas.
- **`og:image`** ausente en home, About, Case studies y Blog (solo el detalle de case study lo tiene). Generar una con `opengraph-image.tsx`.
- **Favicon:** `layout.tsx` declara `/favicon.png`, que no existe (404 en consola); sí existe `favicon.ico`. Agregar PNG 32/180/512 y `manifest`.
- **Tipografía fina:** usar `text-balance` en los H1/H2 grandes; `tabular-nums` en precios y contadores; comillas tipográficas en los testimonios (ya se usan) y en el hero.
- **Estados:** la página `/blog` muestra "No blog posts found." en una caja: o se publican 2–3 artículos o la ruta se retira del nav y del sitemap hasta entonces. El botón azul "Get in touch" en Blog y el azul del login rompen la paleta (rojo ladrillo + negro).
- **`/login`:** fuera de la paleta pública y sin `noindex`.
- **Reduced motion:** `globals.css` lo respeta globalmente. Verificar que el hero autoplay, el marquee de add-ons y el video del contacto también se detengan (los `<video autoplay loop>` no se ven afectados por la regla CSS).

---

## SEO técnico y on-page

| Issue | Impacto | Evidencia | Fix | Prioridad |
|-------|---------|-----------|-----|-----------|
| Sitemap con URLs inventadas y sin las reales | Alto | `sitemap.ts` lista 3 case studies y 4 posts que devuelven 404; faltan `ai4l-automation-and-web-platform` y `architect-portfolio-website` | Generar el sitemap desde la base (`getCaseStudies`, `getBlogPosts`) con `lastModified` real | 1 |
| `/blog` vacío e indexable; en nav y sitemap | Alto | "No blog posts found.", `robots: index, follow` | Publicar contenido o `noindex` + quitar del nav hasta tenerlo | 1 |
| `/login` indexable con título y canonical de la home | Medio | `title` = home, `canonical` = `https://juliandelgado.com.au/` | `metadata: { robots: { index: false } }` y título propio; `Disallow: /login` y `/admin/` en robots | 1 |
| Dos H1 en la home, ambos "Julian Delgado" | Alto | `h1` ×2 | Ver 1.2 | 1 |
| Títulos con marca duplicada | Bajo | About: "About Julian Delgado | … | Julian Delgado" (86 caracteres) | Usar `title: { absolute }` o quitar el nombre del título de página | 3 |
| Sin `og:image` en 4 de 6 páginas | Medio | diagnóstico | `opengraph-image.tsx` global + por case study | 2 |
| `theme-color` ausente | Bajo | diagnóstico | `viewport.themeColor` | 3 |
| Imágenes sin dimensiones, 1 lazy sobre el fold | Medio (CLS/LCP) | diagnóstico | `next/image` con `priority` en hero | 2 |
| JSON-LD: `ProfessionalService` usa un email de Hotmail y `priceRange "$$"`; falta `Person` propio con `sameAs`, `knowsAbout`; falta `Service` para "Custom software & AI automation" | Medio | `StructuredData.tsx` | Email del dominio; `Person` + `Organization`; `Offer` por plan con precio en AUD; `BreadcrumbList` en case studies; `Article`/`CreativeWork` en cada case study | 2 |
| FAQ schema correcto | — | 7 preguntas, HTML y JSON-LD coinciden | Agregar 2 preguntas sobre precio de software y sobre IA con aprobación humana | 3 |
| Robots: permite `/admin` | Bajo | `robots.ts` | `Disallow: /admin/`, `/login` | 2 |
| Keywords del `<head>` y copy apuntan a "tradies" pero el hero no lo dice | Medio | `layout.tsx` keywords | El H1 y el primer párrafo deben contener la frase objetivo ("custom software and websites for Australian small businesses, Toowoomba") | 1 |
| Sin página `/services` ni `/pricing` propias: todo vive en anclas de la home | Medio | solo 5 rutas públicas | Crear `/services/custom-software`, `/services/websites`, `/pricing` con copy propio; hoy no hay dónde rankear por "custom software developer Queensland" | 2 |
| TTFB 2,9 s en dev | n/a | Performance API | Medir en producción con PageSpeed; el `revalidate = 60` ayuda, pero la home hace consultas a DB en cada regeneración | — |
| Core Web Vitals reales | Pendiente | no medible en dev | Correr PageSpeed Insights sobre producción y pegar los números en este documento | 1 |

---

## AI-SEO y legibilidad por agentes

- **Lo que está bien:** HTML semántico, contenido renderizado en servidor, FAQ en texto y en schema, case studies con problema/approach/solución/resultados (estructura extraíble), en-AU.
- **Faltantes concretos:**
  1. **`/llms.txt`** (404). Propuesta mínima: quién es Julian, qué ofrece (3 líneas), a quién, dónde, precios con fecha, enlaces a case studies, About y contacto.
  2. **`/pricing.md`** con los 4 planes, inclusiones, moneda, condiciones de pago (50/50) y fecha de vigencia. Hoy el precio está dentro de un canvas animado y un contador; un agente lee "AUD 2,286+" si llega a mitad de la animación.
  3. **Bloques de respuesta directa** de 40–60 palabras al inicio de cada sección: "What does a custom website cost in Australia?", "How long does an MVP take?", "What is a human-in-the-loop AI tool?". Hoy las respuestas existen pero enterradas en las FAQ.
  4. **Hechos con fecha:** "Updated October 2026" en precios y en About.
  5. **Autoría:** los case studies no muestran autor ni fecha visible; agregar "By Julian Delgado · Published March 2026" y `Article` schema.
  6. **Presencia externa:** el perfil de LinkedIn y el de Instagram (`crafteddigital_`, nombre que ya no es la marca) deben describir lo mismo que el About. Crear Google Business Profile en Toowoomba (categoría "Website designer" / "Software company"); es el activo local que más pesa en AI Overviews para búsquedas con ciudad.
- **Robots para crawlers de IA:** el `User-agent: *` actual permite todo, correcto. No bloquear `OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot`. Decidir aparte si se bloquean `GPTBot`/`ClaudeBot` (entrenamiento).

---

## CRO

### Quick wins
1. Arreglar el CTA roto (1.1). Es el único cambio con impacto garantizado.
2. H1 y subtítulo con propuesta de valor (1.2). Hoy un visitante frío tarda más de 5 segundos en saber qué se vende.
3. Formulario visible en móvil (1.3).
4. Reemplazar "Start a project" por "Book a 20-minute fit call" y repetirlo tras Work, tras Pricing y en el footer. El texto de About ya promete "No commitment. Just a 20-minute call… I'll be honest if we're not [the right fit]": ese es el mejor copy del sitio y está escondido.
5. Mover un testimonio con nombre y rol al lado del formulario (hoy el formulario no tiene prueba social cerca).
6. "Response within 24 hours" junto al botón de envío (ya está en gris 10 px; subirlo).

### Cambios de alto impacto
- **Página de precios con guía de elección:** añadir a cada tarjeta "Best for: a tradie or clinic that needs a credible site in two weeks" / "a business that wants a CMS and to grow" / "teams replacing spreadsheets with a tool" / "anyone who wants a developer on call". Hoy las cuatro tarjetas compiten sin jerarquía más allá del "Best value".
- **Prueba social honesta:** tres testimonios reales existen (AI4L, The Better Day, Lourdes Ynigo) pero solo uno aparece en la home. Fila de citas cortas bajo el hero o sobre Pricing. Nada de logos inventados ni "40+ projects".
- **Objeciones en el flujo:** las FAQ responden plazos, pagos y ubicación, pero no "¿y si no sé qué necesito?" ni "¿qué pasa si desaparecés?" (retainer, código en tu cuenta, 30 días de soporte). Añadirlas.
- **Formulario:** 9 campos y dos grupos de chips es mucho para un primer contacto. Versión corta (nombre, email, "what are you trying to build", presupuesto opcional) y dejar el resto para la llamada. Mantener el honeypot.
- **Ruta móvil:** en 320 px el visitante ve el nombre, un párrafo abstracto y un botón; no ve servicios ni precios hasta 8.000 px más abajo (la página mide 14.779 px). Resumen de servicios con precio "from" dentro de las dos primeras pantallas en móvil.

### Ideas para testear (cuando haya tráfico)
- Hero A vs. C (propuesta de valor vs. "sin agencia").
- CTA "Book a 20-minute fit call" vs. "Get a fixed quote".
- Pricing con 3 tarjetas (sin retainer) vs. 4.
- Formulario corto vs. actual.

---

## Web Interface Guidelines — hallazgos por archivo

```
src/components/layout/header/_components/DesktopCTA.tsx:30 - href="/contact" → 404; apuntar a /#contact o crear la ruta
src/components/layout/header/_components/MobileMenu.tsx:106 - mismo enlace roto
src/components/layout/header/_components/HeaderLogo.tsx:12 - href="/public" → 404; debe ser "/"
src/components/layout/header/_components/DesktopNav.tsx:20 - nav visible desde md (768) pero no cabe con el CTA; usar lg
src/components/layout/header/_components/MobileToggle.tsx:15 - md:hidden; alinear con el cambio anterior
src/components/layout/header/_components/MobileMenu.tsx - role="menu" en un contenedor de enlaces; usar <nav> con <ul>; focus no va al primer ítem al abrir
src/components/layout/footer/footer.data.ts:8 - label "ContactSection" visible; debe ser "Contact"
src/components/layout/footer/Footer.tsx:10 - react-icons/fa carga 441 KB para 2 iconos
src/components/layout/footer/Footer.tsx - enlaces /privacy y /terms a páginas inexistentes
src/components/layout/footer/Footer.tsx - labels #383838 sobre negro (1.66:1); enlaces #5a5a5a (2.83:1)
src/components/layout/footer/Footer.tsx - <a role="listitem"> en redes sociales; rol inválido
src/components/sections/Hero/FloatingTitle.tsx:57 - segundo <h1>; usar <div aria-hidden>
src/components/sections/Hero/HeroSection.tsx:313 - H1 es el nombre; falta propuesta de valor
src/components/sections/Hero/HeroSection.tsx - botones de slide 12×2 px; hit-area ≥ 44 px
src/components/sections/Hero/HeroSection.tsx - carrusel autoplay > 5 s sin control de pausa
src/components/sections/Contact/FieldWrap.tsx - label como <span>; usar <label htmlFor>
src/components/sections/Contact/LineInputs.tsx - <select> sin name ni id
src/components/sections/Contact/ContactForm.tsx - chips sin aria-pressed ni grupo; toast sin aria-live; transition-all
src/components/sections/Contact/ContactSection.tsx - panel de video 1,6 MB sin poster ni condición de media; en 320 px deja ~700 px vacíos
src/app/api/contact/route.ts - sin rate limit; honeypot hp no se comprueba; auto-reply a email arbitrario
src/components/sections/Services/ImagePanel.tsx - fill + sizes="100vw" en un panel de ~45 % del ancho
src/components/sections/Services/Services.tsx:23 - useScroll importado sin usar
src/components/sections/Pricing/PlanCard.tsx - features en monospace 10 px; "STARTING AT" redundante con "+"
src/components/sections/Pricing/Pricing.tsx - botón "Not sure which plan?" de 16 px de alto
src/components/sections/Work/Work.tsx - header sin data-header-theme="dark" sobre fondo negro
src/app/about-me/_components/AboutHero.tsx:10 - "40+ Projects" sin respaldo; :86 año 2025
src/app/about-me/_components/WhatIBuilt.tsx - barra sticky de métricas se superpone al header en 320 px
src/components/sections/Case-study/*.tsx - galería horizontal sin scroll-snap ni padding de borde; chips bajo el header sticky; 3 imágenes con alt=""
src/app/login/page.tsx - sin metadata propia ni noindex; paleta azul fuera del sistema
src/app/blog/page.tsx - estado vacío indexable; botón azul fuera de paleta
src/app/sitemap.ts - slugs hardcodeados e inexistentes; generar desde la base
src/app/robots.ts - falta Disallow /admin/ y /login
src/app/layout.tsx - icons apunta a /favicon.png (404); 4 familias tipográficas; sin themeColor; sin og:image global
src/app/globals.css - transition: all en reglas globales; variant .dark sin uso
src/components/ui/button.tsx, accordion.tsx - transition-all
```

---

## Plan de ejecución propuesto

**Sprint 1 (1–2 días): destrabar conversión**
1. Enlaces rotos (CTA, logo, privacy, terms).
2. Hero: H1 + sub + CTA nuevos, un solo H1.
3. Contacto en móvil: sin video en `< lg`, formulario en la primera pantalla.
4. `/api/contact`: honeypot, rate limit, headers de seguridad.
5. Sitemap dinámico, `noindex` en login, `/blog` fuera del nav hasta tener posts, favicon PNG.

**Sprint 2 (2–3 días): legibilidad y confianza**
6. Header: breakpoint `lg`, tema oscuro en secciones oscuras, contraste del footer.
7. Formulario accesible (labels, selects con name, grupos).
8. Solapamientos sticky en About y case studies.
9. Pricing: "Best for", tipografía de features, cuarto plan ya seedado.
10. Testimonios cerca del formulario y bajo el hero; quitar "40+ projects".

**Sprint 3 (2–3 días): rendimiento y SEO**
11. Fuentes a dos familias; quitar react-icons; comprimir video; dimensiones en imágenes; `priority` en LCP.
12. `og:image`, `theme-color`, JSON-LD ampliado (Person, Offer, Article, Breadcrumb).
13. `/llms.txt`, `/pricing.md`, páginas `/services/*` y `/pricing` propias.
14. Correr PageSpeed en producción y anotar CWV aquí.

**Decisión pendiente:** modo oscuro (declarar light explícito, o implementarlo). Recomendación: declarar light ahora; el sitio ya usa secciones oscuras como recurso editorial y un toggle duplicaría el trabajo de diseño sin beneficio para el objetivo de dos clientes.

---

## Lo que no se pudo medir en este entorno
- Core Web Vitals reales (LCP, INP, CLS) y TTFB de producción.
- Datos de Search Console (indexación, consultas, CTR).
- Comportamiento del scroll-jacking con mouse real y trackpad (solo se verificó por scroll programático).
- Safari/WebKit y Firefox (solo Chromium).
