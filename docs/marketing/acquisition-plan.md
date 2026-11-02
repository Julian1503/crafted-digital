# Plan de captación — juliandelgado.com.au

**Versión:** 1.0 · **Fecha:** 2026-11-01 · **Horizonte:** 2 de noviembre de 2026 a 30 de abril de 2027
**Meta:** 2 clientes directos bajo la marca Julian Delgado, sin poner en riesgo el trabajo con Rapid Ai4 Learning (AI4L).
**Fuente del contexto:** `.agents/product-marketing.md` (posicionamiento v5, presupuesto, CPA, voz).

## 1. Dónde estamos

- El sitio está listo para recibir gente: seis casos de estudio, precios, reservas con Cal.com y formulario protegido con Turnstile.
- Nadie lo visita todavía. No hay ninguna fuente de tráfico activa.
- **La medición no funciona.** El contenedor de GTM (`GTM-M7L3TVN4`) carga en producción, pero no tiene ninguna etiqueta. Los eventos del sitio (`cta_clicked`, `contact_form_started`, `contact_form_submitted`, `fit_call_booked`) llegan a la capa de datos y no salen hacia Google Analytics. Verificado el 2026-11-01 con un navegador real contra juliandelgado.com.au: cero peticiones a GA4. La "línea base cero" anotada antes no era un dato medido.

**La cuenta que guía el plan** (estimación, ajustar con datos):

| Paso | Cantidad en 6 meses |
|------|---------------------|
| Clientes buscados | 2 |
| Consultas calificadas necesarias, cerrando 1 de cada 4 | 8 |
| Consultas por mes | 1 a 2 |

Una consulta calificada es un negocio australiano con un proyecto real y presupuesto desde AUD 2.000. No cuentan reclutadores, agencias que venden servicios ni estudiantes.

## 2. Orden de los canales

Primero lo gratis y directo, después lo pago. La idea es que los anuncios solo amplifiquen algo que ya demostró funcionar.

| # | Canal | Costo | Para qué track | Por qué en este orden |
|---|-------|-------|----------------|-----------------------|
| 0 | Arreglar la medición | 0 | Los dos | Sin esto no se puede saber qué canal trae consultas |
| 1 | Red propia y referidos | 0 | Los dos | Es lo que más rápido convierte: gente que ya confía en vos |
| 2 | Contacto directo a negocios del nicho | 0 | Software | El nicho (NDIS, salud, contadores) se puede listar y contactar uno por uno |
| 3 | LinkedIn orgánico | 0 | Software | Le da contexto a cada mensaje directo: quien recibe un mail te busca ahí |
| 4 | Comunidad de Toowoomba | 0 a bajo | Websites | Eventos gratuitos primero; membresías pagas solo si decidís |
| 5 | Prueba de anuncios en Meta | AUD 1.000 a 2.000 total | Websites | Solo con medición verificada y después de 4 semanas de los canales 1 a 3 |

## 3. Paso 0: medición (esta semana, ~1 hora tuya)

> **Hecho el 2026-11-02.** Propiedad GA4 521071327, flujo 13343434356, ID `G-D8NF51B2B8`. GTM publicado con `GA4 base`, `GA4 eventos`, el activador `Eventos del sitio` y las variables `location`, `label`, `plan` y `source`. Eventos clave: `contact_form_submitted` (valor 600) y `fit_call_booked` (valor 800). Verificado en producción con un navegador real: llegan `page_view`, `cta_clicked` y `contact_form_started`. La propiedad duplicada 521093442 no se usa.

Esto se hace en las cuentas de Google, que solo vos podés abrir.

**3.1 Crear la propiedad de GA4** (si no existe): analytics.google.com, Admin, Crear propiedad "juliandelgado.com.au", zona horaria Brisbane, moneda AUD. Agregar un flujo de datos web con `https://juliandelgado.com.au` y copiar el ID que empieza con `G-`.

**3.2 Configurar GTM** en tagmanager.google.com, contenedor `GTM-M7L3TVN4`:

1. **Etiqueta "GA4 base":** tipo Google tag, ID `G-…`, activador All Pages.
2. **Variables de capa de datos:** crear `location`, `label`, `plan`, `source`, `reason`, `question` y `network` (tipo Data Layer Variable). Son los parámetros que mandan los eventos del sitio.
3. **Activador "Eventos del sitio":** tipo Custom Event, nombre de evento con expresión regular:
   ```
   ^(cta_clicked|plan_cta_clicked|contact_form_started|contact_form_submitted|contact_form_failed|fit_call_booked|faq_opened|outbound_clicked|email_clicked)$
   ```
4. **Etiqueta "GA4 eventos":** tipo GA4 Event, ID `G-…`, nombre del evento `{{Event}}`, activador "Eventos del sitio". En parámetros del evento, agregar cada variable del punto 2 con su mismo nombre.
5. **Vista previa** con Tag Assistant: abrir el sitio, tocar el botón de la llamada y empezar el formulario. Tienen que aparecer `cta_clicked` y `contact_form_started`.
6. **Publicar** el contenedor.

**3.3 Marcar conversiones:** en GA4, Admin, Eventos clave, marcar `contact_form_submitted` y `fit_call_booked`.

**3.4 Avisarme** cuando esté publicado. Lo verifico desde un navegador real como hice hoy, y dejo anotada la línea base de verdad.

## 4. Canal 1: red propia y referidos (semanas 1 y 2)

Cinco conversaciones, todas por mensaje directo, en este orden:

1. **AI4L.** Proponer por escrito el acuerdo de derivación: lo educativo que te llegue va para ellos, y lo no educativo que les llegue a ellos viene para vos. El porcentaje de comisión, si hay, lo decidís vos.
2. **The Better Day.** Pedir una presentación a dos o tres proveedores NDIS que conozcan. También pedir una recomendación en LinkedIn.
3. **Lourdes Ynigo.** Pedir una presentación a otros estudios de arquitectura o diseño, que es el track de websites.
4. **Ex compañeros de Sovos y mDEVZ que viven en Australia.** Contarles que trabajás por tu cuenta y qué tipo de proyecto buscás.
5. **Contactos personales en Toowoomba.** La misma idea, en una línea.

**Plantilla para pedir una presentación** (adaptar a cada persona):

> Hi Zoe, hope things are going well at The Better Day.
>
> I'm taking on a couple of new projects this summer, mostly internal tools for small providers: rostering, shift notes, incident reports, the admin that ends up in spreadsheets.
>
> Do you know one or two other providers who might be stuck with that? I'd be grateful for an introduction, and happy to have a no-obligation chat with them. If it's easier, here's a short write-up you can forward: https://juliandelgado.com.au/services/custom-software
>
> Thanks either way,
> Julian

**Plantilla para AI4L:**

> Hi Mohammed,
>
> Now that the case studies are live, I'd like to put our referral arrangement in writing so neither of us steps on the other's toes.
>
> My proposal: any education or training lead that reaches me goes straight to you, and any non-education lead you come across (small businesses, health, professional services) you send my way. Happy to talk about a referral fee in both directions if that suits you.
>
> Could we talk it through for 15 minutes this week?
>
> Julian

## 5. Canal 2: contacto directo al nicho (desde la semana 2, 10 por semana)

**A quién**, en este orden de prioridad:

1. Proveedores NDIS y de salud aliada en Darling Downs y Brisbane, con 5 a 50 empleados.
2. Estudios contables y de bookkeeping en el interior de Queensland.
3. Negocios de servicios en Toowoomba con sitios viejos o lentos, para el track de websites.

**Dónde armar la lista, gratis:**

- El buscador de proveedores de la NDIS Commission y el NDIS Provider Finder.
- Healthdirect para salud aliada.
- El directorio de CPA Australia y la búsqueda "bookkeeper Toowoomba" en Google Maps.
- LinkedIn, para encontrar el nombre del dueño o gerente.

**Cómo registrarlo:** una planilla con negocio, contacto, fecha de envío, respuesta, seguimiento y estado. Cada respuesta positiva se carga como lead en el admin del sitio.

**Reglas del envío:**

- Usar solo direcciones publicadas por el negocio y escribir sobre algo relacionado con su trabajo. Cada mail lleva tu nombre, tu sitio y una forma clara de pedir que no le escribas más. Es lo que exige la Spam Act 2003 para mails comerciales.
- Nunca escribir a RTOs, colleges ni institutos de formación. Ese es el sector de AI4L.
- Un seguimiento a los 7 días si no hay respuesta, y nada más.

**Plantilla NDIS y salud aliada.** El gancho es SupportLegend, tu app propia que busca un primer proveedor piloto:

> Subject: Shift notes at {Provider}
>
> Hi {Name},
>
> I'm Julian, a software engineer in Toowoomba. I build internal tools for small care providers.
>
> I've built a support-worker app for NDIS teams. It covers shifts, client context, incident reports and AI-drafted shift summaries that a manager reviews before anything is saved. It's ready for a first pilot provider, and I'd set it up around how your team already works.
>
> Here's how it works: https://juliandelgado.com.au/case-studies/supportlegend-ndis-support-worker-app
>
> If shift notes or incident paperwork take more of your week than they should, would a 30-minute call be useful? If it's not a fit, I'll tell you.
>
> Julian Delgado
> juliandelgado.com.au
> If you'd rather not hear from me again, just reply "no thanks".

**Plantilla contadores y bookkeepers:**

> Subject: Chasing client documents at {Firm}
>
> Hi {Name},
>
> I'm Julian, a software engineer in Toowoomba. Before working for myself I spent five years building tax-compliance software at Sovos.
>
> These days I build small internal tools for professional-services firms: client onboarding, document requests with automatic reminders, and email drafts that a person approves before they go out. One example is a CRM I built where nothing is sent without approval: https://juliandelgado.com.au/case-studies/ai4l-crm-consent-safe-campaigns
>
> If chasing clients for paperwork eats into your team's week, would a 30-minute call be worth it? If it's not a fit, I'll say so.
>
> Julian Delgado
> juliandelgado.com.au
> If you'd rather not hear from me again, just reply "no thanks".

**Seguimiento a los 7 días:**

> Hi {Name}, just bringing this back to the top of your inbox. If the timing's wrong, no problem at all. Julian

## 6. Canal 3: LinkedIn orgánico (desde la semana 1, 2 posts por semana)

- Actualizar el titular del perfil: "Custom software and AI automation for Australian small businesses · Toowoomba".
- Poner el enlace al sitio y fijar como destacado el caso de estudio del CRM.
- Publicar martes y jueves. Cada post cuenta un problema concreto y cómo lo resolviste, sin vender.
- Comentar con algo útil en 3 posts por semana de dueños de negocios del nicho.

**Primeros cuatro posts** (borradores para que ajustes con tu voz):

**1. El CRM que nunca envía sin aprobación**
> A client asked me for a CRM that could send marketing emails. The rule I built in first: nothing goes out until a person approves it, and the database enforces that, not just the screen.
>
> It means a tired Friday-afternoon click can't email the wrong list. It also means the team trusts the tool enough to actually use it.
>
> If you run a small business and the idea of AI sending things on your behalf makes you nervous, that's a reasonable instinct. Build the approval step in from day one.

**2. Notas de turno**
> In a lot of NDIS teams I've seen, shift notes get written twice: once on paper or a phone note during the shift, then again into the system at the end of the day.
>
> I've been building an app where the support worker jots rough notes and the AI turns them into a proper progress note against the participant's goals. A manager reviews it before it's saved.
>
> The AI does the typing. The person keeps the judgement. That's the split I think works for care work.

**3. Lo que aprendí en cinco años de software tributario**
> Five years building tax-compliance software taught me one thing that applies to every small business tool: the regulator will eventually ask "who did this, and when?"
>
> So every tool I build now keeps an audit trail by default. It's boring until the day it saves you.

**4. El agente que pide permiso**
> I built an AI agent that watches local Facebook groups, finds posts where someone is asking for a course, and drafts a helpful reply.
>
> It never posts on its own. Every draft goes into a review queue, it follows each group's rules, and there's a kill switch.
>
> Agents that act alone make good demos. In a real business I'd rather have one that asks first.

## 7. Canal 4: comunidad de Toowoomba (desde la semana 3)

- Ir a un evento gratuito por mes: los de Toowoomba Region Council para negocios, meetups de tecnología y los eventos abiertos de la Toowoomba Chamber of Commerce.
- Llevar una sola cosa para mostrar en el celular: el sitio y un caso de estudio.
- La membresía de la Chamber y grupos como BNI cuestan dinero. No entran hasta que decidas pagarlos.

## 8. Canal 5: prueba de anuncios en Meta (no antes de la semana 6)

**Condiciones para empezar, todas a la vez:**

- La medición del paso 0 está verificada.
- El Meta Pixel está instalado y su evento de consulta está probado. Te paso los pasos cuando llegue el momento.
- Pasaron 4 semanas de los canales 1 a 3, para comparar contra algo.
- Confirmaste el presupuesto. Esto es plata nueva, y la decisión es tuya.

**Diseño de la prueba** (de `product-marketing.md`):

| Parámetro | Valor |
|-----------|-------|
| Objetivo | Consultas para el track de websites |
| Zona | Toowoomba, Darling Downs y Brisbane |
| Gasto | AUD 10 por día, unos AUD 300 por mes |
| Destino | Página de websites o la reserva de llamada |
| Costo máximo por consulta calificada | AUD 150 |
| Pausar si | AUD 400 gastados sin ninguna consulta calificada, o más de AUD 300 por consulta después de 5 consultas |

## 9. Calendario

| Semanas | Fechas | Qué se hace |
|---------|--------|-------------|
| 1 | 2 al 8 nov | Paso 0 (medición). Perfil de LinkedIn. Mensajes a AI4L y The Better Day. Primer post. |
| 2 | 9 al 15 nov | Resto de la red propia. Armar la lista de 40 negocios del nicho. Primeros 10 mails. |
| 3 a 5 | 16 nov al 6 dic | 10 mails por semana más seguimientos. 2 posts por semana. Primer evento en Toowoomba. |
| 6 | 7 al 13 dic | Revisión: qué canal trajo respuestas. Decisión sobre los anuncios. |
| 7 a 9 | 14 dic al 3 ene | Ritmo bajo por las fiestas: solo posts y seguimientos. |
| 10 a 17 | 4 ene al 28 feb | Ritmo completo. Anuncios si se aprobaron. Revisión mensual. |
| 18 a 26 | 1 mar al 30 abr | Duplicar lo que funcionó y cortar lo que no. |

## 10. Qué se mide cada viernes (15 minutos)

| Métrica | Dónde se ve |
|---------|-------------|
| Mails enviados, respuestas y llamadas agendadas | Planilla de contacto |
| Visitas al sitio y de dónde vienen | GA4, Adquisición |
| Formularios enviados y llamadas reservadas | GA4, Eventos clave, y el admin del sitio |
| Propuestas enviadas y clientes cerrados | Admin del sitio, leads |

Cada mes se anota en la tabla de aprendizajes de `product-marketing.md` qué funcionó y qué no.

## 11. Decisiones pendientes de Julian

| # | Decisión | Recomendación |
|---|----------|---------------|
| C-01 | Comisión por derivación con AI4L | Proponer un acuerdo recíproco y dejar el porcentaje para la charla |
| C-02 | Ofrecer SupportLegend como piloto a proveedores NDIS | Sí. Es el mejor gancho que tenés para el nicho, y un piloto con un proveedor real vale más que otro caso de estudio |
| C-03 | Precio del piloto de SupportLegend | Gratis o a costo los primeros 3 meses, a cambio de feedback y permiso para contar el caso |
| C-04 | Presupuesto de anuncios en Meta | Confirmar en la semana 6, con datos de los canales gratuitos |
| C-05 | Membresía de la Chamber of Commerce | Esperar a ir a dos eventos abiertos |
