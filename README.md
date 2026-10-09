# Web NEXYRA GAMES

Web estática (HTML + Tailwind CDN + JavaScript sin dependencias). No necesita compilación.

## Estructura

```
index.html            Estructura de la página
css/styles.css        Estilos propios (neón, animaciones, tarjetas, timeline…)
js/data.js            ← CONTENIDO EDITABLE: enlaces, juegos, estado, roadmap, redes
js/i18n.js            ← TEXTOS DE LA INTERFAZ en 7 idiomas
js/main.js            Interactividad (partículas, menú, idiomas, filtros, estado, formulario)
assets/img/           Emblema y portadas
status.example.json   Ejemplo de JSON de estado remoto
```

## Ver en local

Abre `index.html` con doble clic, o sirve la carpeta (recomendado, necesario para `statusEndpoint`):

```bash
python -m http.server 8080
```

y visita http://localhost:8080

## Personalizar (todo en `js/data.js`)

1. **Perfil de Play Store**: `config.playStoreProfile` → `https://play.google.com/store/apps/dev?id=TU_ID`.
2. **Correo de soporte**: `config.supportEmail`.
3. **Formulario**: sin backend abre el correo del usuario con el ticket relleno. Para recibirlo directamente, crea un formulario en Formspree (o similar) y pon su URL en `config.formEndpoint`.
4. **Juegos**: añade objetos a `games`. `status`: `"online"`, `"maintenance"` o `"soon"` (anunciado, aún sin publicar: insignia «Próximamente» y no cuenta en el monitor de estado). Si `cover` está vacío se genera una portada neón automática. Si `playUrl` está vacío el botón aparece como «Muy pronto».
5. **Estado en tiempo real**: sube un JSON como `status.example.json` (al mismo hosting, un Gist raw, etc.) y pon su URL en `config.statusEndpoint`. La web lo vuelve a leer cada `statusRefreshSeconds` y actualiza tarjetas y monitor sin recargar.
6. **Roadmap**: entradas en `roadmap` con `date` en formato `AAAA-MM-DD`; la cuenta atrás y el orden se calculan solos. Con `date: ""` la entrada sale al final como «Sin fecha» / «fecha por anunciar»; `progress` es opcional.
7. **Redes**: cambia las URL en `social`.

## Idiomas

Español, English, Português (BR), Français, Deutsch, Italiano y 日本語.

- **Detección automática**: `?lang=xx` en la URL → idioma elegido antes (se guarda en el navegador) → idioma del navegador → español.
- Al elegir un idioma la URL cambia a `?lang=xx`, así puedes compartir enlaces directos (p. ej. `index.html?lang=ja` en la ficha japonesa de Play Store).
- **Textos de la interfaz**: `js/i18n.js`. `{{texto}}` = degradado neón, `[[texto]]` = verde, `{n}` = variable.
- **Textos de juegos y roadmap**: en `js/data.js` cualquier campo de texto puede ser `"texto"` o `{ es: "...", en: "...", ... }`. Si falta un idioma se muestra el español.
- **Añadir otro idioma**: copia el bloque `en` de `i18n.js`, tradúcelo y añádelo a `languages` (código, nombre nativo y locale para las fechas).
- El japonés carga la fuente Noto Sans JP solo cuando se selecciona (Orbitron no tiene caracteres japoneses).

## Publicar

Sirve tal cual en GitHub Pages, Netlify, Cloudflare Pages o Firebase Hosting (arrastra la carpeta).
Para producción puedes sustituir el CDN de Tailwind por un build con Tailwind CLI si quieres eliminar el aviso de consola.

> El catálogo tiene PetMath y Pintipop (este como «Próximamente», con sus futuras actualizaciones sin fecha en el roadmap). PetMath (nombre provisional: etiqueta `tag: "workingTitle"`). Las entradas del roadmap y las URL de redes sociales son **de ejemplo**: sustitúyelas por las reales antes de publicar. Con un único juego se ocultan automáticamente los filtros y la tarjeta se centra.

## Editar la web cuando ya está publicada

Casi todo se cambia en dos archivos: `js/data.js` (juegos, estado, roadmap, enlaces) y
`js/i18n.js` (textos de la interfaz). El flujo es siempre: **editar → probar en local →
subir de nuevo**.

1. Edita los archivos en esta carpeta (o pídeselo a Claude).
2. Pruébalo en local: `python -m http.server 8080` y abre http://localhost:8080.
3. Súbelo:
   - **GitHub Pages**: en github.com entra en el repositorio → *Add file → Upload files* y
     arrastra los archivos cambiados (o edita `js/data.js` directamente con el lápiz ✏️ de
     GitHub). Si usas git: `git add . && git commit -m "Actualizo la web" && git push`.
     La web se actualiza sola en 1-2 minutos.
   - **Netlify**: en tu sitio → *Deploys* → arrastra otra vez la carpeta entera. Cada subida
     sustituye a la anterior (y puedes volver a una anterior desde la lista).

Cambios típicos en `js/data.js`:
- **Un juego sale a la venta**: `status: "online"`, `tag: "new"` y en `playUrl` su enlace de
  Google Play.
- **Mantenimiento**: `status: "maintenance"` (y `"online"` al terminar).
- **Nueva actualización en el roadmap**: añade una entrada en `roadmap` (con `date: ""` si
  aún no tiene fecha).

**Sin volver a subir la web**: el estado de los juegos se puede cambiar con un JSON remoto
(por ejemplo un Gist de GitHub) puesto en `config.statusEndpoint`; la web lo relee cada minuto.
