# Plan de acción aplicado

**Base:** auditoría del 22/07/2026.

**Objetivo:** resolver SEO técnico, rapidez móvil, UI, confianza, conversión, accesibilidad y despliegue sin introducir datos comerciales no verificados.

## Fase 1 — SEO técnico y rastreo

**Estado:** aplicado en el repositorio.

- Canonical, Open Graph, Twitter Card y JSON-LD usan `https://edenloteamientos.com/`.
- Tarjeta social propia de 1200 × 630 px con texto verificado.
- `robots.txt`, `sitemap.xml` y manifest añadidos.
- Un solo `h1`, contenido local claro y unidades corregidas a `m²`.
- Lotes ficticios eliminados; la disponibilidad se comunica como dato a confirmar.
- FAQ visible sin depender de JavaScript y schema `FAQPage` coherente.

## Fase 2 — Despliegue, caché y seguridad

**Estado:** aplicado en código; requiere publicar la nueva versión.

- Salida pública aislada en `public/`.
- Worker para redirigir HTTP y `www` al HTTPS canónico.
- Previews bajo otro hostname reciben `noindex`.
- Activos versionados con caché inmutable anual.
- HTML con revalidación y documentos auxiliares con caché corta.
- CSP, HSTS, `nosniff`, política de referencia, permisos y protección contra iframes.
- README, configuración y restos históricos quedan fuera del artefacto publicado.

## Fase 3 — UI, conversión y confianza

**Estado:** aplicado con la información disponible.

- Hero más corto y propuesta precisa.
- Aclaración visible de que Gs. 800.000 es una referencia comercial cuyos términos deben confirmarse.
- CTA principal, flotante y contextuales abren WhatsApp directamente.
- Teléfono y correo accionables.
- Flujo reducido a información, ubicación, cuatro pasos, compra remota, FAQ y contacto.
- Esquema visual rotulado como referencial para no simular un plano real.
- Mensajes técnicos y de demostración eliminados.
- Solicitud explícita de plano, fotos actuales, identificación, condiciones y documentos.

## Fase 4 — Rapidez y móvil

**Estado:** aplicado.

- Eliminadas las siete variantes de Google Fonts; se usan fuentes del sistema.
- Mapa cargado únicamente por interacción.
- Secciones inferiores usan `content-visibility`.
- CSS y JS propios siguen sin frameworks ni dependencias.
- Botones táctiles de 44–56 px y CTA flotante compatible con áreas seguras.
- Menú con Escape, cierre exterior y devolución de foco.
- Diseño apilado y simplificado para 320–430 px.
- Movimiento reducido respetado.

## Fase 5 — Medición y control de calidad

**Estado:** aplicado parcialmente; la captura de datos depende de la herramienta analítica elegida.

- Eventos preparados para WhatsApp, llamada, correo, mapa y FAQ mediante `dataLayer` y Cloudflare Zaraz si está habilitado.
- Script local comprueba estructura, referencias, SEO y archivos públicos.
- Objetivos: LCP ≤ 2,5 s, INP ≤ 200 ms y CLS ≤ 0,1 en percentil 75 móvil.

## Acciones externas pendientes

Estas acciones no pueden completarse sin activos reales o acceso a servicios:

1. Publicar la nueva versión y asociar `edenloteamientos.com` y `www.edenloteamientos.com` al mismo Worker.
2. Habilitar Always Use HTTPS o confirmar la redirección del Worker desde HTTP.
3. Añadir fotografías actuales y plano aprobado cuando el propietario los entregue; no se usaron imágenes falsas.
4. Reemplazar Gmail por un correo `@edenloteamientos.com` cuando exista.
5. Completar razón social, RUC, responsable y documentación solo con datos verificados.
6. Conectar Search Console, Bing Webmaster Tools y Google Business Profile; enviar el sitemap.
7. Activar Zaraz o GA4 para consumir los eventos ya definidos.
8. Medir Core Web Vitals reales después de acumular tráfico.

## Criterios de cierre

- Validación local sin errores.
- Ninguna referencia a `example.com` ni textos de demostración.
- Archivos internos inaccesibles tras el despliegue.
- HTTP y `www` redirigen permanentemente al host canónico.
- OG image, sitemap y robots responden `200`.
- CTAs abren el destino esperado.
- Prueba móvil y teclado sin bloqueos.
