# Eden Loteamiento - Landing estatica

Este repositorio mantiene una landing 100% estatica con:

- `index.html`
- `assets/css/styles.css`
- `assets/js/main.js`

No usa Django, backend, frameworks ni build tools para la salida publica.

## Flujo de contacto

Todos los CTAs comerciales llevan al bloque final en `#contacto`.

El bloque final tiene solo dos acciones principales:

- `Consultar por WhatsApp`
- `Enviar correo`

El WhatsApp y el correo se configuran en [assets/js/main.js](/C:/Users/MaSch/Documents/EdenLoteamiento/assets/js/main.js:1):

```js
const WHATSAPP_NUMBER = "595971141032";
const CONTACT_EMAIL = "alemateo07@gmail.com";
```

## Mapa

La landing usa Google Maps embebido, no Leaflet ni OpenStreetMap.

Constantes editables:

```js
const GOOGLE_MAPS_EMBED_URL = "https://www.google.com/maps?q=-26.494759,-55.273071&z=15&output=embed";
const GOOGLE_MAPS_SHARE_URL = "https://maps.app.goo.gl/tpnS1MzXkLu2Yi1o7";
```

## Colores, fuentes y espaciados

La identidad visual vive en [assets/css/styles.css](/C:/Users/MaSch/Documents/EdenLoteamiento/assets/css/styles.css:1).

Variables principales:

- `--space-1`
- `--space-2`
- `--space-3`
- `--space-4`
- `--space-5`
- `--space-6`
- `--space-7`
- `--color-primary`
- `--color-primary-2`
- `--color-accent`
- `--color-agro`
- `--color-earth`
- `--color-maize`
- `--font-heading`
- `--font-body`

## Lotes

Los lotes demo se editan en el arreglo `LOTES` dentro de [assets/js/main.js](/C:/Users/MaSch/Documents/EdenLoteamiento/assets/js/main.js:1).

## Como probar la landing

Opcion 1:

- abrir `index.html` con doble clic

Opcion 2:

- servirlo con cualquier servidor estatico

Ejemplo:

```bash
python -m http.server 8000
```

Luego abrir:

```text
http://127.0.0.1:8000/
```

## Nota

Cualquier carpeta historica del proyecto anterior queda fuera del flujo de ejecucion. La landing actual solo necesita los archivos estaticos listados arriba.
