# Éden Loteamiento

Landing estática optimizada para SEO local, rapidez móvil y contacto directo.

## Estructura

```text
public/                         Único directorio publicado
  index.html                    Contenido y metadatos
  404.html                      Error personalizado no indexable
  robots.txt                    Directivas para buscadores
  sitemap.xml                   URL indexable
  site.webmanifest              Metadatos de instalación
  assets/css/styles.20260722.css
  assets/js/main.20260722.js
  assets/img/og-eden-loteamiento.jpg
src/index.js                    Redirecciones, caché, 404 y seguridad
scripts/validate-site.ps1       Validación local
wrangler.jsonc                  Configuración de Cloudflare Workers
```

## Contacto y ubicación

Las constantes comerciales están en `public/index.html`; el mapa embebido se configura en `public/assets/js/main.20260722.js`.

- WhatsApp: `+595 971 141032`
- Correo: `alemateo07@gmail.com`
- Coordenadas: `-26.494759, -55.273071`

## Validación

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\validate-site.ps1
```

## Vista local

```powershell
python -m http.server 8000 --directory public
```

Abrir `http://127.0.0.1:8000/`.

## Despliegue

Wrangler publica únicamente `public/`. El Worker consolida `www`, HTTP e `/index.html` hacia `https://edenloteamientos.com/`, aplica headers de seguridad, sirve un 404 propio y usa caché inmutable para `/assets/`.

Antes de producción, comprobar que ambos hostnames estén asociados al Worker en Cloudflare y ejecutar la validación local.
