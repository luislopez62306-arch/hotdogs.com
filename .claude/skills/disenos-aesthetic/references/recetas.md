# Recetas de diseño probadas

Cada receta: cuándo usarla, estructura, medidas y errores que ya pasaron. Formato base 1080×1350 (post / carrusel IG).

---

## R1. Mockup "moño de terciopelo + etiqueta" (estilo papercuts)
**Cuándo:** catálogos, promos de temporada, portafolio de invitaciones. Es el formato que más gustó.
**Estructura:** foto realista cenital → papel de envolver con patrón (rayas finas, cuadros gingham, damasco, rayas anchas) → listón horizontal arriba → **moño grande de terciopelo** que domina la mitad superior → etiqueta colgando del nudo con lazo corto.
**Prompt base (IA de imagen):**
> Photorealistic close-up top-down product photo. [color] wrapping paper with [patrón]. A huge lush [color] velvet ribbon crosses horizontally, tied in a very large plush [color] velvet bow filling the top half of the frame, long tails flowing down both sides. A large blank portrait rectangular gift tag in plain textured cream paper hangs right below the knot by a short [color] satin loop through a punched hole, centered. The tag is completely blank with no text or graphics. Soft daylight, realistic shadows, luxury editorial stationery photography, 4:5 portrait.
- Pide SIEMPRE la etiqueta "completely blank" y luego imprime tú el diseño encima.
- **El moño debe verse completo** (las dos lazadas, nudo y colas). Si acercas para agrandar la etiqueta, no cortes el moño: recorte ~930px de ancho sobre 1024 desde arriba (T=0) es buen punto medio.
- Combinaciones que funcionan: negro/rayas finas crema · rojo + listón a rayas/gingham verde · vino/rayas anchas · marfil sobre damasco vino · vino sobre rayas azul cielo.
- Última slide: misma foto con etiqueta de cierre (marca + CTA) impresa en tinta.

## R2. Mockup "invitación abierta" (sobre + tarjeta)
**Cuándo:** mostrar una invitación como objeto de papelería fina.
**Prompt base:** sobre abierto [color] con la solapa arriba, tarjeta en blanco crema sacada del sobre, de frente, ocupando el centro; moño de terciopelo/satín; props al borde (rosas secas, eucalipto, perlas, llave antigua, pluma, lacre, piñas y esferas en Navidad). "The card is completely blank".
- Sobre la tarjeta va **una sección real de la invitación** (portada, mensaje, calendario), no un logo suelto.

## R3. Carrusel panorámico continuo
**Cuándo:** contar una historia en 6–7 slides (antes/después, proceso, portafolio).
- Lienzo de ancho N×1080 y se corta en N piezas.
- Un elemento conductor cruza todo: listón con costura punteada, línea fina doble, riel de galería, franja de textura (encaje/damasco).
- Objetos **cruzando el corte** entre slides (celular, tarjetas, marcos) para invitar a deslizar.
- Estructura: portada con gancho → antes (nota de papel con tachados) → ahora (celular) → números grandes → detalles en abanico → 3 pasos → cierre con CTA.
- Numerar "01 / 07" y repetir logo en cada slide.

## R4. Galería de marcos colgando
Riel horizontal + hilos verticales + marcos recortados (ovalado con moño, espejo plateado, placa con candelabro), cada uno con un tipo de evento escrito dentro. Muy "editorial de lujo".

## R5. Portada editorial
Mayúsculas espaciadas pequeñas arriba ("INVITTO PRESENTA") + titular enorme serif en 3 líneas alternando normal / *itálica en color acento* / bold + texto corto + un objeto recortado gigante que se sale del borde (sello de cera, corazón de encaje).

## R6. Celular como mockup
Marco negro `border-radius:58px; padding:12px`, isla dinámica, rotación 4–7°, sombra larga. Captura real de la invitación a 390×844 @3x. Ocultar elementos `position:fixed` (botones de música) antes de capturar.

## R7. Posts virales de texto
Ver SKILL.md §4b (gancho de carrusel, frase tipográfica, Notes App, esto o aquello, WhatsApp chat).

---

## Técnicas de producción

### Capturar invitaciones web (Playwright)
1. `viewport 390×844, deviceScaleFactor 3`; esperar `networkidle`; clic forzado al botón de abrir (`#abrirBtn`, `{force:true}`).
2. Recorrer el scroll en pasos de 300px para disparar animaciones/lazy-load.
3. Ocultar `position:fixed`; `fullPage` screenshot.
4. Secciones exactas: leer `getBoundingClientRect()` de `section/header` y recortar con esas Y (×3). No adivinar coordenadas.
5. Las imágenes originales suelen venir **embebidas en base64** en el HTML: extraer con regex `data:image/...;base64,` → son mejores que capturas.

### Recortar elementos (sin fondo)
`python3 scripts/recortar.py entrada salida.png` (numpy + scipy; `pip install scipy` si falta): distancia de color al fondo del borde → `binary_opening` → componente mayor → `binary_fill_holes` → erosión 1–2px → blur 1px en alfa.
- Fondo azul/verde que se cuela: máscara por canal (`B-R>umbral`) en lugar de distancia.
- Sello de cera: máscara por "rosado" (`R-G>14`).
- Revisa SIEMPRE el recorte sobre fondo verde chillón para ver halos.

### Imprimir diseño sobre foto (que no se vea pegado)
1. Detectar la etiqueta/tarjeta en blanco: color de referencia en el centro → máscara `dist<20` → componente conectado → bbox por percentiles 0.5–99.5.
2. Margen interno 6–10%, empezar debajo del orificio.
3. Tinta oscura sobre papel claro: `mix-blend-mode:multiply`. Tinta clara sobre papel oscuro: convertir la gráfica a capa con alfa = luminancia y color crema.
4. Arte a color: esquinas 3–4px, `box-shadow inset` suave, degradado de luz 135°, grano `feTurbulence` en multiply (~0.35).
5. Escalar tipografías con el mismo factor que el zoom de la foto.

### IA de imagen
- Figma `generate_image` (gasta créditos del plan; avisar). Descargar el PNG enseguida: el link expira en 7 días (requiere `www.figma.com` permitido).
- Instagram: abre el post con user-agent de iPhone; solo cargan ~2 slides sin login. Necesita `www.instagram.com` + hosts `scontent-*.cdninstagram.com`.
