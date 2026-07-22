# Plan de acción — Éden Loteamiento

**Actualizado:** 22 de julio de 2026
**Estado:** fases locales completadas

## Fase 1 — SEO técnico y seguridad — Completada

- Host canónico, HTTPS e `/index.html` consolidados con redirecciones 308.
- `title`, descripción, canonical, Open Graph, Twitter Card, robots, sitemap y JSON-LD válidos.
- Un solo `h1` con la búsqueda local “Terrenos en María Auxiliadora”.
- 404 no indexable, headers de seguridad y caché inmutable para activos.
- CSP estricta sin `unsafe-inline`.
- `Cache-Control: no-transform` en HTML para evitar la inyección automática de Cloudflare que causaba errores CSP y `ERR_BLOCKED_BY_CLIENT`.

## Fase 2 — Contenido y conversión — Completada

- Medidas, superficie, ubicación y referencia comercial visibles.
- Acceso a agua, energía eléctrica y caminos comunicado para el 100% del loteamiento.
- CTAs directos a WhatsApp, llamada y Google Maps con mensajes contextuales.
- Correo y envío por email omitidos por decisión actual.
- FAQ visible y datos estructurados sincronizados.

## Fase 3 — UI, móvil y accesibilidad — Completada

- Hero más corto, keyword visible y CTA principal adelantado.
- Diseño responsive sin dependencias visuales externas.
- Controles táctiles de al menos 44 px, foco visible, menú con Escape/cierre exterior y navegación por teclado.
- Mapa cargado solo por interacción y secciones fuera de pantalla diferidas.
- Botón flotante abre WhatsApp directamente.

## Fase 4 — Rendimiento y calidad — Completada

- HTML, CSS y JavaScript integrado con hash CSP; sin frameworks ni fuentes externas.
- CSS versionado para evitar caché obsoleta.
- Script de validación para archivos, enlaces, JSON-LD, SEO, servicios, correo omitido y CSP.
- Worker compilado con Wrangler y respuesta local verificada con CSP y `no-transform` correctos.
- El script propio no genera falsos positivos en la política `report-only` de Continuous script monitoring.

## Acciones externas deliberadamente pospuestas

- Fotografías reales, galería y plano aprobado: incorporar solo cuando el propietario entregue activos verificables y optimizados.
- Correo bajo dominio y formularios de email: omitidos por ahora.
- Search Console, perfil de Google Business y medición de Core Web Vitals reales: requieren acceso a cuentas externas.
- Despliegue: debe realizarse después del commit; no forma parte de este cambio local.
