# Instagram: replicar el estilo del cliente con detalle

Lección aprendida: cuando el cliente **ya tiene perfil**, sus posts SON el brief visual. Propuestas "editoriales" o de "ventas" con mucho texto fueron rechazadas. Lo que gustó: **foto protagonista + 1 título + 1–2 elementos nativos de IG**, idéntico a lo que ya publica.

## 1. Auditar el perfil (antes de diseñar)
```
node scripts/ig_perfil.js <usuario> <scratchpad>/ig
```
Baja bio (`perfil.txt`), logo (`logo.jpg`), ~12 posts en HD y `posts.json` con captions. Arma una hoja de contacto y llena esta ficha:

| Campo | Qué anotar |
|---|---|
| Formatos | Cuántos usa y cuáles (pills, polaroid, estampilla, foto + título, collage) |
| Tipografías | Por post: script, serif, sans, condensada; color; tamaño relativo; mayúsculas |
| Paleta | 3–5 colores reales muestreados con PIL (no inventados) |
| Elementos | Emojis, dibujos de línea, estrellas, burbujas, etiquetas, sellos |
| Texto | Idioma (mezcla inglés/español), palabras por post (normalmente 2–6) |
| Fotos | Cuáles no tienen personas → reutilizables. Las que tienen texto encima: recortar o no usar |
| Captions | Servicios reales, teléfonos, ciudad, hashtags → datos confirmados para el copy |

Regla: **si un formato existe en su perfil, se reproduce con sus mismas proporciones antes de proponer algo nuevo.** No agregues numeración de slides, párrafos, CTA ni listas si sus posts no los tienen.

## 2. Componentes nativos de IG (CSS listo en `templates/posts-estilo-ig.html`)
| Componente | Medidas en 1080×1350 | Detalle que lo hace creíble |
|---|---|---|
| **Pill iOS** (barra blanca) | padding 24×56, radio 28, Poppins 600 40–46px | Blanco 95%, sombra `0 6px 20px rgba(60,20,30,.14)`, logo circular 70px a la izquierda |
| **Burbuja de chat** | radio 999, Poppins 600 30–34px | Amarillo mantequilla `#FFF1BF`, texto rosa, 2 burbujas apiladas (texto + emojis) |
| **Polaroid** | padding 26/26/100 | Rotar 0° y 6–9°, sombra `0 18px 40px rgba(0,0,0,.32)`, se encima una sobre otra |
| **Estampilla** | padding 24 | Máscara `linear-gradient content-box` + `radial-gradient(circle 10px)` cada 28px (solo perfora el borde) |
| **Rayas de toldo** | franjas 92px | Crema `#FBF7F1` / beige `#E5DACC` |
| **Etiqueta gris** | Poppins 600, tracking .34em | Fondo `#B7AA9E`, texto blanco, bajo el título script |
| **Dibujo de línea** | trazo 3.5–4px redondeado | Pastel con moño, corazones dobles, estrellas; rosa sobre claro, blanco sobre foto |
| **Emojis sticker** | 60–70px | 🩷💍🤍🥂🧺💌; en filas (🤍🤍🤍) o par en esquina superior |
| **Título sobre foto** | script 150–170px | `text-shadow:0 2px 16px rgba(0,0,0,.25)` + degradado oscuro solo donde va el texto |

## 3. Tipografías: Canva / IG → Google Fonts equivalentes
| Estilo que se ve en IG/Canva | Usar (Google Fonts) | Uso |
|---|---|---|
| Script lujo (Brightina, Reynolds, Candice, "Signature" de IG) | **Pinyon Script**, Great Vibes, Alex Brush, Monsieur La Doulaise, Parisienne | Títulos tipo "Be My Girlfriend", "Save the Date" |
| Inicial caligráfica gigante | **Great Vibes** a 1.6–2× del resto | "**B**irthday", "**H**az especial" |
| Serif display (Prata, Versailles, "Editor" de IG) | Instrument Serif, Prata, Playfair Display, Gilda Display, Della Respira | "styled to celebrate" |
| Serif alta condensada en mayúsculas ("Squeeze") | **Bodoni Moda** con `transform:scaleX(.74)` en un `inline-block` centrado | "HAZ ESPECIAL SU CUMPLEAÑOS" |
| Sans redondeada de pills | **Poppins 600**, Quicksand, Nunito, Montserrat | Barras y burbujas |
| Condensada bold ("Poster") | Bebas Neue, Oswald | Precios, fechas grandes |
| Manuscrita casual | Caveat, Homemade Apple, Reenie Beanie | Notas, solo 1 palabra |
Reglas: máx. **2 familias + 1 script** por post; el script nunca en párrafos; en Bodoni condensada ajusta la inicial script con `margin-right` negativo para que no choque; nunca `position:absolute` en la inicial (se desalineó).

## 4. Nivel de detalle exigido (revisar a tamaño real)
- [ ] El título no tapa el objeto principal de la foto (toldo, mesa, pastel) y no queda sobre zonas muy cargadas.
- [ ] Ningún texto encimado: inicial script vs. resto, dibujos vs. letras, burbujas vs. polaroids.
- [ ] Nada cortado por el borde salvo intención (revisa títulos largos como "Birthday").
- [ ] Fotos sin texto ajeno visible (pizarras, letreros con frases personales, títulos del post original).
- [ ] Sin personas; si el post original tiene personas, usa otra foto del mismo montaje.
- [ ] Sombras coherentes (misma dirección de luz en polaroids/estampillas).
- [ ] Logo real del perfil, no redibujado, cuando se tenga.
- [ ] Ortografía y mezcla de idiomas igual a la del cliente (si escribe en inglés los títulos, se respeta).
- [ ] Si una foto es IA, decirlo y ofrecer cambiarla por una real.
