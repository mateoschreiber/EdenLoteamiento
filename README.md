# Eden Loteamiento - Landing estatica

Este repositorio ya no usa Django como parte funcional de la landing publica. La salida principal es una web 100% estatica hecha con:

- `index.html`
- `assets/css/styles.css`
- `assets/js/main.js`

La landing esta enfocada en captar leads para compradores de terrenos/lotes en Tomas Romero Pereira / Maria Auxiliadora, Itapua, con foco en:

- parejas jovenes o familias que buscan su primer terreno
- compradores remotos o paraguayos fuera de la ciudad o del pais

## Estructura activa

```text
EdenLoteamiento/
|- index.html
|- assets/
|  |- css/
|  |  |- styles.css
|  |- js/
|     |- main.js
|- legacy-django/         # solo referencia historica, no se usa para ejecutar la landing
|- README.md
```

## Como ejecutar

No hace falta instalar Django, base de datos ni backend.

Opcion 1:

- abrir `index.html` con doble clic

Opcion 2:

- servirlo con cualquier servidor estatico

Ejemplo opcional:

```bash
python -m http.server 8000
```

Luego abrir:

```text
http://127.0.0.1:8000/
```

Ese comando solo sirve archivos estaticos. No es una dependencia del proyecto.

## Que hace la landing

- muestra la propuesta comercial con H1, ubicacion, lotes y FAQ
- usa botones de WhatsApp con mensaje prearmado
- renderiza lotes demo desde un arreglo editable en JavaScript
- arma consultas desde formularios frontend sin backend
- guarda una copia del lead en `localStorage`
- captura parametros `utm_*` de la URL y los agrega al mensaje de WhatsApp
- muestra mapa interactivo con Leaflet y fallback a Google Maps

## Datos comerciales actuales

- ubicacion comercial base: `https://maps.app.goo.gl/tpnS1MzXkLu2Yi1o7`
- coordenadas reutilizadas del repo original: `-26.494759, -55.273071`
- lote tipo: `14 x 40 m`
- superficie comunicada: `560 m`
- planes desde: `Gs. 800.000`

## Como cambiar el numero de WhatsApp

Editar en [assets/js/main.js](/C:/Users/MaSch/Documents/EdenLoteamiento/assets/js/main.js:1):

```js
const WHATSAPP_NUMBER = "595XXXXXXXXX";
```

Usar formato internacional, sin `+`, espacios ni guiones.

## Como cambiar la ubicacion

Editar en [assets/js/main.js](/C:/Users/MaSch/Documents/EdenLoteamiento/assets/js/main.js:2):

```js
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/tpnS1MzXkLu2Yi1o7";
```

Y, si cambia el punto del mapa, editar tambien:

```js
const MAP_COORDINATES = {
    lat: -26.494759,
    lng: -55.273071,
};
```

No reemplazar esas coordenadas por valores inventados. Confirmar primero el punto real.

## Como editar lotes

Editar el arreglo `LOTES` en [assets/js/main.js](/C:/Users/MaSch/Documents/EdenLoteamiento/assets/js/main.js:15).

Cada objeto controla:

- identificador visible
- tamano
- superficie
- plan desde
- estado
- resumen comercial

## Como publicar

### Cloudflare Pages

1. Subir el repositorio a GitHub.
2. Crear un proyecto nuevo en Cloudflare Pages.
3. Conectar el repositorio.
4. Configurar:

```text
Build command: (vacio)
Build output directory: /
```

5. Publicar.

### Netlify

1. Importar el repositorio.
2. Dejar vacio el comando de build.
3. Publicar el directorio raiz.

### GitHub Pages

1. Subir el repositorio.
2. Ir a `Settings > Pages`.
3. Elegir `Deploy from a branch`.
4. Publicar desde la rama principal y la carpeta raiz.

## Checklist antes de produccion

- reemplazar el numero real de WhatsApp
- confirmar coordenadas reales del proyecto
- reemplazar o agregar imagenes reales si se van a usar
- revisar textos de disponibilidad y condiciones
- revisar documentacion legal y estado documental antes de publicar
- conectar dominio
- probar formularios y CTAs en movil
- validar que Google Maps y WhatsApp abran correctamente

## Nota sobre Django

La landing actual no necesita:

- `manage.py`
- apps Django
- templates
- models
- forms
- views
- migrations
- settings
- URLs
- base de datos

Si existe una carpeta `legacy-django/`, queda solo como referencia historica y no forma parte de la ejecucion publica de la landing.
