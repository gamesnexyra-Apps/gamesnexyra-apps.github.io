# Web NEXYRA GAMES

Web estática (HTML + CSS + JavaScript). No necesita compilación: se sube tal cual.

Estilo cálido y profesional (papel crema, terracota, miel y salvia; tipografías Fraunces y
Nunito Sans). Movimiento con **GSAP 3.15** (ScrollTrigger y SplitText), scroll suave con
**Lenis 1.3** y efectos de **React Bits** pasados a JavaScript sin React (`js/effects.js`).

## Estructura

```
index.html            Estructura de la página
css/styles.css        Estilos (colores en :root, tarjetas, timeline, formulario…)
js/data.js            ← CONTENIDO EDITABLE: enlaces, juegos, estado, roadmap, redes
js/i18n.js            ← TEXTOS DE LA INTERFAZ en 7 idiomas
js/main.js            Interactividad (menú, idiomas, filtros, estado, roadmap, formulario)
js/effects.js         Animaciones: Lenis + GSAP y los efectos de React Bits
licenses/             Licencia de React Bits (obligatorio conservarla)
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
4. **Juegos**: añade objetos a `games`. `status`: `"online"`, `"maintenance"` o `"soon"` (anunciado, aún sin publicar: insignia «Próximamente» y no cuenta en el monitor de estado). `cover` se muestra como icono de app (si está vacío se genera uno con las iniciales) y `color` (opcional) es el fondo de su tarjeta. Si `playUrl` está vacío el botón aparece como «Muy pronto».
5. **Estado en tiempo real**: sube un JSON como `status.example.json` (al mismo hosting, un Gist raw, etc.) y pon su URL en `config.statusEndpoint`. La web lo vuelve a leer cada `statusRefreshSeconds` y actualiza tarjetas y monitor sin recargar.
6. **Roadmap**: entradas en `roadmap` con `date` en formato `AAAA-MM-DD`; la cuenta atrás y el orden se calculan solos. Con `date: ""` la entrada sale al final como «Sin fecha» / «fecha por anunciar»; `progress` es opcional.
7. **Redes**: cambia las URL en `social`.

## Idiomas

Español, English, Português (BR), Français, Deutsch, Italiano y 日本語.

- **Detección automática**: `?lang=xx` en la URL → idioma elegido antes (se guarda en el navegador) → idioma del navegador → español.
- Al elegir un idioma la URL cambia a `?lang=xx`, así puedes compartir enlaces directos (p. ej. `index.html?lang=ja` en la ficha japonesa de Play Store).
- **Textos de la interfaz**: `js/i18n.js`. `{{texto}}` = cursiva con subrayado a mano, `[[texto]]` = marcador amarillo, `{n}` = variable.
- **Textos de juegos y roadmap**: en `js/data.js` cualquier campo de texto puede ser `"texto"` o `{ es: "...", en: "...", ... }`. Si falta un idioma se muestra el español.
- **Añadir otro idioma**: copia el bloque `en` de `i18n.js`, tradúcelo y añádelo a `languages` (código, nombre nativo y locale para las fechas).
- El japonés carga la fuente Noto Sans JP solo cuando se selecciona (Fraunces y Nunito Sans no tienen caracteres japoneses).

## Publicar

Sirve tal cual en GitHub Pages, Netlify, Cloudflare Pages o Firebase Hosting (arrastra la carpeta).

## Diseño y animaciones

- **Colores**: al principio de `css/styles.css` (`:root`). Cambia un color y cambia en toda la web.
- **Librerías** (en `index.html`, desde jsDelivr y con versión fija para que nada cambie solo):
  `gsap@3.15.0` (`gsap.min.js`, `ScrollTrigger.min.js`, `SplitText.min.js`) y `lenis@1.3.26`
  (`lenis.min.js` + `lenis.css`). Para actualizarlas, cambia el número de versión en las cuatro
  etiquetas `<script>` y en el `<link>` de Lenis, y prueba la web en local.
- **Efectos de React Bits** (en `js/effects.js`, sin React):
  - *SplitText*: el título de la portada entra letra a letra.
  - *ScrollReveal*: el manifiesto («Creemos que una pantalla…») se aclara palabra a palabra al bajar.
  - *CountUp*: los números de la portada cuentan hasta su valor.
  - *SpotlightCard*: luz cálida que sigue al ratón en las tarjetas de juegos.
  - *Magnet*: los dos botones de la portada se acercan un poco al ratón.
  - *ScrollVelocity*: la cinta de palabras se mueve sola y acelera al hacer scroll.
  - *AnimatedContent*: cada bloque aparece suavemente al llegar a él (`data-reveal`, `data-stagger`).
- **Accesibilidad**: si el móvil u ordenador tiene activado «reducir movimiento», no se anima
  nada y el scroll es el normal. Si las librerías no cargan, la web se ve completa igualmente.
- **Licencia de React Bits** (MIT + Commons Clause): se puede usar en una web, también comercial,
  pero no vender ni redistribuir los componentes por separado. Conserva `licenses/react-bits.md`.

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
