# Éden Loteamiento

Landing estática optimizada para SEO local, rapidez móvil y contacto directo.

## Estructura

```text
public/                              Único directorio publicado
  index.html                         Contenido y metadatos
  404.html                           Error personalizado no indexable
  robots.txt                         Directivas para buscadores
  sitemap.xml                        URL indexable
  site.webmanifest                   Metadatos de instalación
  assets/css/styles.20260722b.css
  assets/img/og-eden-loteamiento.jpg
src/index.js                         Redirecciones, caché, CSP y 404
scripts/validate-site.ps1            Validación local
wrangler.jsonc                       Configuración de Cloudflare Workers
```

## Datos públicos

- WhatsApp/teléfono: `+595 971 141032`
- Coordenadas: `-26.494759, -55.273071`
- Servicios: acceso a agua, energía eléctrica y caminos en el 100% del loteamiento

No se publica correo ni se incorporan fotografías exteriores por ahora.

## Validación

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\validate-site.ps1
```

## Vista local

```powershell
npx wrangler dev
```

## Cloudflare

El Worker consolida `www`, HTTP e `/index.html`, aplica headers de seguridad y caché. El HTML usa `Cache-Control: no-transform` para impedir inyecciones automáticas. El JavaScript mínimo está integrado con un hash CSP exacto para evitar falsos avisos del monitoreo `report-only` de Cloudflare y ahorrar una solicitud móvil.
