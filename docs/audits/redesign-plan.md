# Plan de rediseño — juliandelgado.com.au

**Versión:** 1 (2026-11-01). **Base:** el sitio ya auditado y optimizado (`action-plan.md` v2.3), la revisión de diseño de Work hecha con Fable y la evaluación de UI/UX del 2026-11-01.
**Objetivo de negocio:** 2 clientes directos antes del 2027-04-30 (`.agents/product-marketing.md`). El rediseño existe para eso: que un dueño de negocio entienda en 5 segundos qué ofrecés, confíe en vos y reserve una llamada.

## 1. Diagnóstico en una frase por problema

1. **El hero cuenta otra historia.** Lo más grande es el nombre sobre un render de arquitectura; la oferta está en letra chica. Parece un estudio de arquitectura.
2. **Demasiados sistemas de animación.** Carrusel, título flotante, scroll secuestrado, vista previa que sigue al cursor, tarjeta con inclinación 3D, letras animadas una por una, contadores, canvas animados en precios, marquee y video detrás del formulario. Juntos hacen ruido y cuestan rendimiento.
3. **Scroll secuestrado** en Servicios y Proceso (desktop): varias pantallas de scroll para leer cuatro ítems.
4. **Dos lenguajes visuales.** Las páginas nuevas (servicios, precios, case studies) son limpias; la home es mucho más cargada. Precios oscuros dentro de una sección clara, formulario oscuro con video.
5. **Falta tu cara** en la home, siendo una marca personal.

## 2. Principios del rediseño

- **Mensaje primero.** Cada pantalla responde una pregunta del visitante, en orden: qué hacés, para quién, prueba de que funciona, cuánto cuesta, cómo empiezo.
- **Pocas animaciones, con intención.** Tres patrones propios del sitio, el resto quieto. Movimiento que guía la lectura, nunca que la retrasa.
- **Un solo sistema visual.** Mismos tokens, componentes y ritmo en todas las páginas, tomando como base el estilo de las páginas nuevas.
- **Rendimiento y accesibilidad como restricciones, no como extras.** Presupuestos medibles (sección 6) que bloquean el merge si se rompen.
- **Se conserva lo que funciona:** DM Serif + Fira Sans, el rojo como acento, el ritmo oscuro/claro, el tono honesto del copy.

## 3. Decisiones que necesito de vos antes de empezar

| ID | Decisión | Opciones | Mi recomendación |
|----|----------|----------|------------------|
| R-01 | Foto para el hero | `profile_dark.webp` (fondo bordó, serio) / `julian-profile.webp` (claro, sonriendo) / sesión nueva | La oscura en el hero: encaja con la paleta. La clara junto al formulario de contacto, donde importa la cercanía. |
| R-02 | Fondo del hero | Oscuro (como hoy) / claro | Oscuro: es lo que hace reconocible al sitio. |
| R-03 | Titular del hero | Mantener "Custom software, AI automation and websites for Australian small businesses." / reescribir orientado al problema ("Software that takes the admin off your team's plate") | Probar el orientado al problema con el actual como subtítulo. Lo resuelvo con la skill de copywriting y te paso 3 opciones. |
| R-04 | Escenas de scroll de Servicios y Proceso | Eliminar / conservar solo en desktop con scroll normal | Eliminar el secuestro de scroll; dejar una animación de aparición por tarjeta. |
| R-05 | Canvas animados de precios | Eliminar / dejar estáticos | Dejar un degradado estático por plan (mismo look, cero costo). |

## 4. Fases

Cada fase termina con build de producción, tests unitarios y e2e en verde, banco de rendimiento móvil y revisión visual en 320, 768, 1024 y 1440 px. Cada fase es un commit (o PR) independiente y desplegable.

### Fase 0 — Fundaciones (½ día)

- **Tokens de diseño** en `globals.css`: escala tipográfica fluida (5 tamaños con `clamp()`), escala de espaciado de secciones, radios (2 valores), sombras (2 valores), y colores semánticos para superficies oscuras y claras (`--surface-dark`, `--surface-light`, `--text-muted-on-dark`, etc.). Reemplaza los `rgba(...)` sueltos repetidos en decenas de componentes.
- **Tokens de movimiento:** `--ease-out` (`cubic-bezier(0.16,1,0.3,1)`), duraciones `--dur-fast` 150 ms, `--dur-base` 300 ms, `--dur-slow` 600 ms. Ninguna animación fuera de esa escala.
- **Componentes base** en `src/components/ui/`: `Section` (fondo, espaciado, `aria-labelledby`), `Eyebrow` (el label numerado actual, unificado), `Button` (primario, secundario y texto, con hover, focus y active diseñados), `Card`, `Reveal`.
- **`Reveal` sin JavaScript de animación:** CSS *scroll-driven animations* (`animation-timeline: view()`) para la aparición al entrar en pantalla, con `@supports` y fallback a contenido visible. Funciona en Chrome, Edge y Safari 26; en Firefox el contenido simplemente aparece sin animación. Respeta `prefers-reduced-motion`.

### Fase 1 — Hero nuevo (1 día)

- **Composición:** a la izquierda, eyebrow ("Toowoomba, QLD · Australia-wide"), titular grande (R-03), una línea de para quién es y qué incluye, CTA primario "Book a 30-minute call" y secundario "See the work". A la derecha, tu foto (R-01) recortada con radio grande y una tarjeta flotante chica con prueba social (cita corta de un cliente o "6 case studies").
- **Fuera:** el carrusel de 4 slides, el nombre gigante, la franja roja inclinada, el título flotante que viaja al header, los contadores 01/04 y el botón de pausa (ya no hacen falta).
- **Animación de entrada:** el titular aparece por líneas (máscara + `translateY`, 600 ms, una sola vez); la foto con fade y escala de 0,98 a 1. Todo con CSS, sin framer-motion.
- **LCP:** el titular es texto renderizado en el servidor y visible sin JavaScript. La foto con `priority` y tamaños correctos.
- **Móvil:** titular primero, foto debajo más chica, CTA siempre visible sin scroll en 390 × 844.

### Fase 2 — Secciones de la home (2 días)

- **Prueba social arriba:** una franja debajo del hero con "Built with Rapid Ai4 Learning" y 2 o 3 datos verificables (años de experiencia, case studies publicados, tiempo de respuesta). Sin logos de clientes que no lo sean.
- **Work:** se mantiene el rediseño reciente; se quitan la inclinación 3D de la tarjeta destacada y la animación letra por letra de las filas (queda subrayado y flecha en hover).
- **Servicios (R-04):** grilla de 3 tarjetas (Websites, Custom software & AI, Ongoing partner) con precio desde, plazo y enlace a su página. Sin scroll secuestrado ni videos.
- **Proceso (R-04):** línea de tiempo de 4 pasos, horizontal en desktop y vertical en móvil, con aparición escalonada.
- **Precios (R-05):** tarjetas claras sobre fondo claro con el plan destacado en oscuro; degradados estáticos en lugar de canvas.
- **FAQ:** se mantiene (ya es accesible); solo pasa al nuevo sistema de componentes.
- **Contacto:** formulario en tarjeta clara, con tu foto clara (R-01) y "Respondo yo, en 24 h" al lado. Sin video de fondo. El calendario de Cal.com en la misma sección como alternativa ("¿Preferís hablar? Elegí un horario").
- **Footer:** sin cambios de estructura; solo tokens.

### Fase 3 — Movimiento moderno (1 día)

Tres patrones propios del sitio, y nada más:

1. **Aparición al entrar en pantalla** (`Reveal`, fase 0): fade + 12 px de desplazamiento, escalonado en listas.
2. **Transiciones entre páginas** con View Transitions: el título de un case study viaja desde la tarjeta del listado hasta el encabezado del estudio. Next 16 lo trae detrás de `experimental.viewTransition`; se activa con el componente `ViewTransition` de React. Si en la prueba resulta inestable, se deja apagado y no bloquea el resto.
3. **Micro-interacciones** en botones y enlaces: hover (desplazamiento de la flecha, cambio de fondo), focus visible diseñado y active con escala de 0,98.

**Se eliminan:** título flotante, carrusel, scroll secuestrado, vista previa que sigue al cursor (se reemplaza por la foto dentro de la fila en hover), inclinación 3D, letras animadas una por una, contadores (salvo números de 10 o más), canvas de precios, video de contacto, y el marquee pasa a lista estática.

**Resultado esperado:** framer-motion deja de cargarse en la home y en las páginas de servicios; solo lo usan About y los case studies hasta la fase 4.

### Fase 4 — About y case studies (1 día)

- **About:** pasa al sistema de componentes; se reemplazan sus animaciones de framer-motion por `Reveal`; foto clara arriba con 3 líneas sobre vos y qué tipo de proyectos tomás.
- **Case studies:** encabezado y figuras ya rediseñados; se pasan sus secciones a componentes de servidor con `Reveal`, lo que saca framer-motion de todo el sitio y cierra el ítem S3-23 del plan de auditoría.

### Fase 5 — QA y lanzamiento (½ día)

- Revisión visual con capturas de Playwright en 320, 768, 1024 y 1440 px, y comparación contra las de antes.
- Accesibilidad: axe sin violaciones serias ni críticas (gate actual), navegación por teclado completa, `prefers-reduced-motion` verificado.
- Rendimiento: banco local de la sección 6 y PageSpeed Insights en producción.
- Revisión de código con un agente antes del merge.

**Total estimado:** 6 a 7 días de trabajo, entregables por fase.

## 5. Qué se conserva, qué cambia, qué se va

| Se conserva | Cambia | Se va |
|-------------|--------|-------|
| DM Serif + Fira Sans, rojo de acento, ritmo oscuro/claro | Hero (mensaje primero + foto) | Carrusel y título flotante |
| Copy y posicionamiento actuales | Servicios y Proceso (sin scroll secuestrado) | Scroll secuestrado y sus videos |
| Work y case studies recién rediseñados | Precios (claros, degradado estático) | Canvas animados |
| Cal.com, Turnstile, analítica, SEO, JSON-LD | Contacto (tarjeta clara + foto + calendario) | Video de fondo, cursor que persigue, inclinación 3D |
| Accesibilidad y gates de tests | Todos los colores pasan a tokens | Letras animadas una por una, contadores pequeños |

## 6. Cómo sabremos que funcionó

| Métrica | Hoy | Objetivo |
|---------|-----|----------|
| JS descargado en la home (banco local, móvil) | 1.339 KB | < 900 KB |
| Tiempo bloqueado (banco local, CPU ×4) | 1.405 ms | < 600 ms |
| LCP (banco local) | 700 ms | < 700 ms (no empeorar) |
| Lighthouse móvil, rendimiento (producción) | 34–66 | ≥ 85 |
| Accesibilidad (Lighthouse / axe) | 100 / 0 serias | 100 / 0 serias |
| Nodos del DOM en la home | ~1.200 | < 800 |
| Primer pantallazo móvil | nombre + render | titular con la oferta + CTA visibles sin scroll |

Y la métrica que importa de verdad, una vez que haya tráfico: proporción de visitas que hacen clic en "Book a call" o envían el formulario (eventos `cta_clicked`, `contact_form_submitted` y `fit_call_booked`, ya instrumentados).

## 7. Riesgos

- **View Transitions es experimental en Next 16.** Mitigación: detrás de un flag, fuera del camino crítico; si falla, se apaga.
- **Las animaciones scroll-driven no funcionan en Firefox.** Mitigación: el fallback es el contenido visible sin animación, que es el comportamiento correcto.
- **Cambiar el hero puede bajar el "efecto wow".** Mitigación: la foto, la tipografía grande y la entrada por líneas mantienen el carácter; y el objetivo es convertir, no impresionar.
- **Regresiones visuales en páginas ya pulidas.** Mitigación: capturas antes/después por fase y tests e2e existentes.
