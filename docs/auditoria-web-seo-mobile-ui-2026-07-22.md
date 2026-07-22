# Auditoría web: Éden Loteamiento

**Fecha:** 22 de julio de 2026

**Sitio:** https://edenloteamientos.com/

**Alcance:** repositorio, despliegue público, SEO técnico y de contenido, rapidez móvil, UI/UX, accesibilidad, conversión y seguridad básica.

## Diagnóstico ejecutivo

La landing tiene una base técnica liviana y ordenada: HTML semántico, una sola hoja CSS, JavaScript pequeño, navegación accesible, diseño responsive y Cloudflare como CDN. La descarga propia es muy baja y el contenido local está bien orientado a búsquedas como “terrenos en María Auxiliadora” y “lotes en Tomás Romero Pereira”.

El principal problema no es la velocidad sino el SEO técnico: la versión publicada declara `https://example.com/` como URL canónica, Open Graph y URL del negocio. Además, la imagen social apunta a un archivo inexistente, no existe `sitemap.xml`, y las variantes HTTP, HTTPS, con `www` y sin `www` responden `200` en vez de consolidarse con redirecciones. Esto puede impedir que Google atribuya correctamente la página al dominio real.

En UI y conversión, el sitio transmite orden, pero parece una demostración: no contiene fotografías reales, plano del loteamiento, infraestructura, información comercial completa ni pruebas suficientes de confianza. El texto es largo y repetitivo en móvil. Varias llamadas “WhatsApp” primero desplazan al bloque de contacto en vez de abrir WhatsApp, agregando fricción.

### Evaluación heurística

| Área | Estado | Motivo principal |
|---|---:|---|
| SEO técnico | Crítico | Canónica, OG y JSON-LD apuntan a `example.com`; duplicación de hosts; sin sitemap |
| Rendimiento base | Bueno | HTML/CSS/JS propios muy pequeños y mapa con carga diferida |
| Rendimiento recurrente | Mejorable | CSS y JS usan `max-age=0`; fuentes externas con siete pesos |
| Experiencia móvil | Aceptable | Breakpoints y controles táctiles correctos, pero página extensa y CTA flotante invasivo |
| UI y confianza | Débil | Cero imágenes reales, copy de demostración y datos comerciales/documentales incompletos |
| Accesibilidad | Buena base | Landmarks, foco, skip link, ARIA, reduced motion y tamaños táctiles |
| Conversión y medición | Mejorable | CTAs indirectos y sin eventos de conversión visibles |

> No se publica una puntuación Lighthouse: la API pública de PageSpeed respondió `429 Too Many Requests`. Las métricas incluidas son observaciones directas y mediciones HTTP, no una simulación de Lighthouse.

## Estructura actual del repositorio

La salida pública real depende únicamente de:

```text
index.html                 Landing completa y metadatos
assets/css/styles.css      Diseño, componentes y breakpoints
assets/js/main.js          Navegación, FAQ, lotes, mapa y enlaces de contacto
wrangler.jsonc             Despliegue de activos estáticos en Cloudflare
```

También existen restos del proyecto Django anterior: carpetas `apps/`, `config/`, `templates/`, `static/`, `media/`, un `db.sqlite3` vacío y numerosos `__pycache__`, pero no hay fuentes Python ejecutables. Están fuera del flujo actual y generan ruido.

### Hallazgos estructurales

- La arquitectura estática es apropiada para esta landing: reduce superficie de fallos y coste de ejecución.
- `wrangler.jsonc` publica `assets.directory: "."`. Esto mezcla código/configuración con archivos públicos. En producción están accesibles `/README.md` y `/wrangler.jsonc` con respuesta `200`.
- `.env`, `db.sqlite3` y archivos bajo `apps/` no se encontraron públicos, pero depender del filtrado implícito del despliegue es menos seguro que publicar una carpeta dedicada.
- `nodejs_compat` no aporta valor visible a una entrega puramente estática.
- No hay pruebas automáticas, validación HTML, verificación de enlaces, presupuesto Lighthouse ni control de regresiones.
- El README contiene rutas absolutas de otra máquina y está publicado accidentalmente.

**Recomendación:** mover la salida a `public/` y configurar Wrangler para publicar exclusivamente esa carpeta. Mantener fuera del artefacto final README, configuración, cachés, entorno y restos históricos.

## SEO

### Correcto actualmente

- Un único `h1`, descriptivo y orientado a intención local.
- `<html lang="es-PY">`, `title`, meta description y `meta robots` presentes.
- Jerarquía `h1`/`h2`/`h3` coherente.
- Contenido textual suficiente para entender ubicación, medida, financiación y proceso.
- Datos de contacto visibles y enlaces a Google Maps.
- JSON-LD básico de `RealEstateAgent`.

### Problemas críticos

1. **Canónica incorrecta.** `link[rel=canonical]` apunta a `https://example.com/`. Google puede considerar el dominio real como duplicado y seleccionar otra URL.
2. **Open Graph incorrecto.** `og:url`, `og:image` y `twitter:image` apuntan a `example.com`; la imagen declarada devuelve `404`.
3. **Datos estructurados incorrectos.** La propiedad `url` del JSON-LD también apunta a `example.com`.
4. **Hosts duplicados.** `http://edenloteamientos.com/`, `https://edenloteamientos.com/` y `https://www.edenloteamientos.com/` responden `200`. Debe existir una única versión, recomendada: `https://edenloteamientos.com/`, con redirecciones `301/308` desde las demás.
5. **Sin sitemap.** `/sitemap.xml` devuelve `404`.
6. **robots.txt incompleto.** Existe un archivo generado por Cloudflare con señales de uso de contenido, pero no contiene `User-agent`, `Allow` ni referencia a sitemap.

### Problemas de contenido y autoridad

- El sitio dice “560 m”; debe ser **560 m²** en HTML, JavaScript, mensajes y datos estructurados.
- “Planes desde Gs. 800.000” no aclara si es cuota mensual, entrega inicial o precio. La ambigüedad reduce confianza y puede generar consultas de baja calidad.
- “Lotes modelo”, “Opciones editables desde JavaScript” y “sin base de datos ni backend” son mensajes internos, no comerciales. Hacen que el proyecto parezca ficticio.
- No hay fotos, plano, calles de acceso, servicios, hitos cercanos, estado de obras, disponibilidad real ni información concreta de documentación.
- Falta identidad comercial completa: razón social o responsable, RUC si corresponde, dirección o área de atención, correo bajo dominio y enlaces sociales verificables.
- Una sola URL limita el posicionamiento de intenciones distintas. Cuando exista contenido real suficiente, conviene crear páginas específicas para ubicación, financiación, lotes disponibles y compra desde el exterior, evitando páginas delgadas o duplicadas.

### Implementación SEO recomendada

- Sustituir todas las URLs de ejemplo por `https://edenloteamientos.com/`.
- Crear una imagen OG real de 1200 × 630 px, comprimida, con URL absoluta, `og:image:alt`, ancho y alto.
- Añadir `sitemap.xml` y un `robots.txt` propio con la URL del sitemap.
- Consolidar HTTPS y host canónico mediante redirecciones de Cloudflare.
- Completar JSON-LD solo con información verificable: URL, logo, imagen, teléfono, correo, coordenadas, área atendida y perfiles oficiales.
- Mantener lotes principales en HTML estático; ahora se inyectan mediante JavaScript. Google puede ejecutarlo, pero el HTML directo es más robusto para otros rastreadores y compartidores.
- Configurar Google Search Console y Bing Webmaster Tools, enviar sitemap y revisar indexación después de corregir la canónica.
- Crear o completar Google Business Profile con el mismo nombre, teléfono y zona usados en el sitio.

## Rapidez y experiencia móvil

### Mediciones directas del 22/07/2026

| Recurso | Estado | Transferencia comprimida observada | TTFB de muestra |
|---|---:|---:|---:|
| `/` | 200 | 7.591 B | 0,184 s |
| CSS | 200 | 4.222 B | 0,170 s |
| JS | 200 | 2.713 B | 0,374 s |

Son mediciones puntuales desde una sola red; no sustituyen datos de usuarios reales. La carga propia inicial ronda solo 14,5 KB comprimidos, sin contar fuentes, mapa ni beacon de Cloudflare.

### Fortalezas

- No hay framework, hidratación ni paquetes pesados.
- JavaScript propio pequeño y colocado al final del documento.
- CSS compacto y sin animaciones costosas.
- Google Maps usa `loading="lazy"`.
- No hay imágenes que bloqueen LCP ni provoquen desplazamiento de diseño.
- `prefers-reduced-motion` está contemplado.
- Breakpoints en 1080, 768 y 640 px; botones principales ocupan todo el ancho en pantallas pequeñas.

### Mejoras de rendimiento

1. **Caché de activos:** CSS y JS responden `Cache-Control: public, max-age=0, must-revalidate`. Usar nombres versionados por hash y `max-age=31536000, immutable`; conservar HTML con revalidación corta.
2. **Fuentes:** Google Fonts solicita Inter 400/500/600/700/800 y Merriweather 700/900. Reducir pesos, usar fuente variable o alojar WOFF2 recortados; una pila del sistema sería todavía más rápida.
3. **Mapa:** ofrecer primero una imagen estática o botón “Cargar mapa” y crear el iframe solo por interacción o proximidad real. Así se evita trabajo de terceros en móviles que no consultan ubicación.
4. **Contenido bajo el pliegue:** aplicar `content-visibility:auto` con tamaño intrínseco a secciones largas, después de verificar accesibilidad y saltos de ancla.
5. **Nueva fotografía principal:** no sacrificar velocidad. Usar AVIF/WebP responsive, dimensiones explícitas, variante móvil y presupuesto aproximado menor a 120 KB; precargar solo la imagen LCP real.
6. **Headers:** añadir HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` y una CSP compatible con fuentes, mapa y analítica.

### Problemas específicos en móvil

- Al apilar todas las tarjetas, el recorrido se vuelve excesivamente largo y repetitivo.
- El botón fijo de WhatsApp puede tapar contenido; no usa `env(safe-area-inset-bottom)`.
- El botón flotante muestra “WhatsApp” en escritorio, pero solo desplaza a `#contacto`; en móvil se oculta el texto, quedando un icono que tampoco abre WhatsApp directamente.
- `overflow-x:hidden` puede ocultar errores de desborde en lugar de hacerlos visibles durante pruebas.
- El menú móvil cambia `aria-expanded`, pero no gestiona Escape, devolución de foco ni cierre al hacer clic fuera.

**Objetivos de control:** LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 en percentil 75 móvil; medir con Search Console/CrUX y complementar con Lighthouse en CI.

## UI, UX y conversión

### Lo que funciona

- Paleta verde/naranja consistente con terreno y naturaleza.
- Jerarquía tipográfica clara y CTA visualmente reconocible.
- Navegación sticky, enlace para saltar contenido y foco visible.
- Tarjetas, FAQ y pasos mantienen patrones consistentes.
- Los controles principales tienen altura mínima de 44–50 px.
- La comunicación evita afirmar estados documentales no comprobados.

### Lo que más limita la conversión

1. **Ausencia total de imágenes.** El sitio no muestra el producto. Para un inmueble, fotos reales, plano y acceso aportan más confianza que otra tarjeta de texto.
2. **Hero genérico.** Debe mostrar ubicación/proyecto real y una propuesta precisa: medida, tipo de cuota, acceso y disponibilidad.
3. **Exceso de repetición.** “Ubicación verificable”, “carpeta digital”, “atención remota” y “planes desde” aparecen demasiadas veces. Reducir la página a una secuencia más directa.
4. **CTAs indirectos.** Cada “Consultar” debería abrir WhatsApp con contexto del lote o acción seleccionada. El correo puede quedar como alternativa secundaria.
5. **Lotes ficticios o genéricos.** Los tres lotes tienen la misma medida, plan y textos genéricos; mostrarlos como unidades numeradas sugiere disponibilidad real sin plano o identificador verificable.
6. **Prueba de confianza insuficiente.** Faltan responsable comercial, proceso documental concreto, fotografías fechadas, referencias del entorno, testimonio verificable o avance del proyecto.
7. **Correo Gmail.** Un correo `@edenloteamientos.com` fortalecería credibilidad y coherencia de marca.

### Flujo recomendado

1. Hero con foto real, propuesta precisa y CTA directo a WhatsApp.
2. Resumen de 4 datos: ubicación, superficie, cuota claramente definida y estado.
3. Plano/listado real de lotes o un único bloque “Consultar disponibilidad” si aún no hay inventario verificable.
4. Galería optimizada y accesos/servicios cercanos.
5. Documentación y proceso, explicados de forma concreta.
6. Mapa bajo demanda.
7. FAQ breve.
8. Contacto final con WhatsApp, llamada y correo de dominio.

## Accesibilidad

La base es superior a la media para una landing pequeña: landmarks semánticos, `aria-labelledby`, skip link, foco visible, botones FAQ con `aria-expanded`/`aria-controls`, textos alternativos implícitos para iconos decorativos y soporte para movimiento reducido.

Mejoras:

- Probar contraste con una herramienta automatizada en todos los estados hover/focus.
- Cambiar el nombre accesible del flotante a “Consultar por WhatsApp” y hacer que la acción coincida con el nombre.
- Gestionar Escape y foco en el menú móvil.
- Evitar `aria-live="polite"` en la cuadrícula de lotes si el contenido solo se carga una vez al iniciar; puede producir un anuncio extenso innecesario.
- Añadir `title` o enlace alternativo claro al mapa si el iframe falla.
- Verificar teclado completo y lector de pantalla en cada despliegue.

## Despliegue y seguridad

- Cloudflare entrega HTTP/3 y compresión efectiva; el TTFB puntual fue bueno.
- No se observaron HSTS, CSP, `X-Content-Type-Options`, `Referrer-Policy` ni `Permissions-Policy` en la respuesta principal.
- HTTP sirve contenido sin redirigir a HTTPS.
- `www` y dominio raíz sirven el mismo contenido sin consolidación.
- `/README.md` y `/wrangler.jsonc` están públicamente accesibles.
- El beacon de Cloudflare está activo, pero no se observan eventos de negocio para WhatsApp, correo, mapa o lote.

## Plan priorizado

### P0 — corregir antes de invertir en contenido o anuncios

- Corregir canónica, OG, Twitter Card y JSON-LD al dominio real.
- Crear y publicar la imagen OG; comprobar respuesta `200`.
- Redirigir HTTP y `www` al HTTPS canónico.
- Publicar `sitemap.xml` y `robots.txt` propio.
- Publicar solo una carpeta `public/`.
- Cambiar `560 m` por `560 m²`.
- Eliminar textos de implementación/demostración y aclarar qué significa Gs. 800.000.

### P1 — impacto directo en confianza y conversión

- Añadir foto hero real, galería optimizada y plano verificable.
- Convertir CTAs principales y flotante en enlaces directos a WhatsApp con mensaje contextual.
- Simplificar la versión móvil y eliminar bloques repetidos.
- Añadir datos comerciales/documentales verificables y correo del dominio.
- Versionar activos, configurar caché larga y headers de seguridad.
- Reducir o autoalojar fuentes y retrasar el mapa.

### P2 — crecimiento medible

- Instrumentar clics de WhatsApp, llamada, correo, mapa y lote.
- Conectar Search Console, Bing Webmaster Tools y Google Business Profile.
- Crear páginas locales/temáticas solo cuando haya contenido único suficiente.
- Añadir CI con validación HTML, enlaces rotos, accesibilidad, Lighthouse móvil y presupuesto de peso.
- Recoger Core Web Vitals reales y optimizar según percentil 75, no solo pruebas de laboratorio.

## Criterios de aceptación

- Ninguna referencia a `example.com` en HTML publicado.
- Una sola URL devuelve `200`; variantes redirigen permanentemente.
- Canonical, OG, JSON-LD, sitemap y robots usan el mismo origen HTTPS.
- Imagen OG devuelve `200` y se previsualiza correctamente en WhatsApp/Facebook/X.
- Ningún archivo interno del repositorio queda expuesto.
- CSS/JS versionados usan caché inmutable.
- CTA flotante abre WhatsApp directamente y no tapa controles en 320–430 px.
- Contenido principal y lotes útiles existen aun si JavaScript falla.
- Página operable por teclado y sin errores críticos de accesibilidad.
- Core Web Vitals móviles cumplen los objetivos definidos con datos de usuarios reales.
