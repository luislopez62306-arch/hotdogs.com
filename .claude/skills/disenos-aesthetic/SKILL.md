---
name: disenos-aesthetic
description: Use when the user asks for "aesthetic", pretty, Canva-, Pinterest- or Instagram-style designs, or work that should look made by an illustrator or graphic designer — posts, carruseles, stories, flyers, publicidad, invitaciones, mockups de papelería (moño, etiqueta, sobre), portafolios, contenido para redes — or shares an Instagram/Pinterest post as a reference ("hazlo como este", "que no se vea de IA", "mejora el diseño").
---

# Diseños Aesthetic (estilo Pinterest / Instagram / Canva)

Objetivo: que el resultado parezca hecho a mano por un ilustrador o diseñador de Canva, NO una plantilla genérica de web.

**Rol:** actúa como **diseñador gráfico senior + creador de contenido**. No solo decoras: defines un brief, investigas tendencias del momento, propones un concepto, aplicas fundamentos (retícula, jerarquía, tipografía) y entregas piezas finales cuidadas **con su caption, hashtags y alt text**. Lee `references/oficio.md` al iniciar cualquier proyecto y `references/instagram.md` si el cliente tiene perfil de Instagram.

## 00. Antes que nada: prompt maestro
Lee y sigue **`references/prompt-maestro.md`** en cada encargo: rol de creador de contenido viral, formatos virales para negocios de eventos, banco de ganchos, rúbrica de autocrítica (rehacer si < 8), diagnóstico cuando el cliente dice "no me gusta" y paquete de entrega final (PNG + caption + hashtags + alt + idea de reel).

## 0. Proceso profesional (resumen de `references/oficio.md`)
1. **Brief** de 5 líneas: objetivo, público, mensaje único, formato/canal, material real.
2. **Tendencias**: 2–3 búsquedas web del mes en el nicho + abrir las referencias del usuario. Cita fuentes al entregar.
3. **Concepto** con nombre; si el pedido es abierto, 2–3 direcciones en una portada cada una.
4. **Producción** con el flujo de abajo y las recetas.
5. **Acabado**: revisión slide por slide a tamaño real, ortografía, datos reales, archivos ordenados.
6. **Entrega** como creador de contenido: slides en orden + caption + hashtags + alt text + qué confirmar.

## 1. Flujo de trabajo
1. **Formato**: post IG 1080×1080, carrusel 1080×1350, story/reel 1080×1920, Pinterest pin 1000×1500, flyer A4/carta, banner web.
2. **Elige UN estilo** de la sección 2 (o pregunta si no está claro). No mezcles más de dos.
3. **Paleta** de 3–5 colores (sección 3) + 1–2 tipografías (sección 4).
4. **Composición** (sección 5) y **decoración** (sección 6).
5. Parte de una plantilla de `templates/` (panorámico o etiqueta-foto) o construye en HTML/CSS con SVG inline.
6. Renderiza: `node scripts/render.js archivo.html salida 1080 1350 N [selector]`.
7. **Mira cada PNG a tamaño real**, no solo la vista completa: textos encimados o cortados, halos de recorte, objetos tapando texto. Corrige y vuelve a renderizar.
8. Pasa el checklist (§8) y entrega las slides en orden con una lista corta de lo que hay que confirmar (datos de clientes, textos de ejemplo).

### Atajos según lo que pida
| Pide… | Usa |
|---|---|
| link a un **perfil** de IG del cliente | `node scripts/ig_perfil.js usuario carpeta` → ficha de estilo (instagram.md §1) → replicar sus formatos con `templates/posts-estilo-ig.html` |
| "como este post" + link de IG | Abrir el post (recetas.md) → copiar el formato → R1/R2 con fotos IA |
| carrusel / contar una historia | R3 panorámico (`templates/carrusel-panoramico.html`) |
| mockup de papelería, catálogo, temporada | R1 moño + etiqueta o R2 invitación abierta (`templates/etiqueta-foto.html`) |
| publicidad de invitación digital | R6 celular + secciones reales recortadas |
| "que no se vea de IA" | §7b + imprimir sobre foto real |

## 1b. Preferencias aprendidas del usuario (respétalas siempre)
- **Tras dos "no me gusta" seguidos, no adivines otra vez**: haz la pregunta de diagnóstico (prompt-maestro §7) y muestra 3 miniaturas muy distintas.
- **Cada pieza lleva una idea viral** (POV, antes/después, "mándaselo a…", esto o aquello, she said yes), no solo foto + título decorativo.
- **Si el cliente tiene perfil, iguala SU estilo** (sus formatos, fuentes, pills, polaroids, estampillas, emojis) antes de proponer estilos propios. Propuestas editoriales/genéricas fueron rechazadas.
- **Texto mínimo**: foto + título de 2–6 palabras. No agregar slides de ventas, listas, párrafos ni numeración salvo que lo pida.
- **Fotos reales del cliente** (sin personas) por encima de IA; nada de ilustraciones caricaturescas.
- **Detalle a tamaño real**: revisar encimados, cortes, texto ajeno en las fotos (instagram.md §4).
- **Edita las imágenes**: nada de pegar capturas planas. Recorta elementos, compón, sombra real, que parezca impreso.
- **Muestra el diseño de la invitación abierta**, no solo el logo o monograma suelto.
- **Fotorrealismo** cuando pida "como el ejemplo": mockups con moño de terciopelo, papel de envolver, sobres (ver `references/recetas.md` R1/R2).
- **El moño/objeto protagonista debe verse completo**; agrandar la etiqueta no debe cortarlo.
- Evitar rosa chicle/fucsia; preferir burdeos, vino, marfil, champaña, plata, negro.
- **Nunca usar fotos de clientas/personas**; solo secciones gráficas.
- No inventar datos (horarios, lugares, precios, estadísticas); si falta, usar plantilla "TU NOMBRE AQUÍ" o preguntar.
- Español de México (§4c). Si da un link de referencia, ábrelo y cópiale el formato, no las ilustraciones.

## 1c. Recetas y herramientas
Lee `references/recetas.md` antes de un carrusel o mockup: recetas probadas (moño + etiqueta, invitación abierta, panorámico, galería de marcos, portada editorial, celular), cómo capturar invitaciones web, recortar elementos (`python3 scripts/recortar.py entrada salida.png [tolerancia] [erosion]`, requiere `pip install scipy`), imprimir diseño sobre foto y generar fotos con IA.

## 2. Estilos de tendencia (lo que más se ve en Pinterest/Instagram)
| Estilo | Claves visuales |
|---|---|
| **Soft girl / coquette** | Rosas empolvados, moños/lazos, perlas, corazones, serif elegante + script, mucho aire |
| **Clean girl / minimal beige** | Beige, crema, taupe, tipografía serif fina, fotos con grano, líneas finas, simetría |
| **Y2K / cyber** | Cromo, degradados iridiscentes, estrellas de 4 puntas ✦, mariposas, fuentes bubble/pixel |
| **Retro 70s groovy** | Naranja, mostaza, marrón, verde oliva; fuentes gruesas redondeadas (tipo Cooper), ondas, flores daisy, sol |
| **Brutalismo / neo-brutalist** | Colores planos saturados, bordes negros gruesos, sombras duras desplazadas, grids visibles |
| **Scrapbook / collage** | Papel rasgado, cinta washi, stickers, recortes, letras tipo nota de rescate, polaroids rotadas ±3–6° |
| **Hand-drawn / doodle** | Trazos irregulares, garabatos, flechas a mano, subrayados tipo marcador, fuente manuscrita |
| **Pastel kawaii** | Pastel menta/lavanda/durazno, formas redondas, caritas, nubes, bordes gruesos redondeados |
| **Dark academia** | Verde bosque, burdeos, marrón, papel envejecido, serif clásica, marcos ornamentales |
| **Boho / terracota** | Terracota, arena, salvia, arcos, formas orgánicas tipo Matisse, hojas, sol minimalista |
| **Editorial / magazine** | Titular gigante serif, texto pequeño en mayúsculas espaciadas, números grandes, mucho blanco |
| **Gradiente aura / blur** | Manchas de color difuminadas (blur 80–120px), grano encima, texto blanco limpio |

## 2b. Tendencias 2026 (investigadas: Pinterest Predicts 2026 + Canva Design Trends 2026)
Gran giro: **adiós al beige/minimal, hola maximalismo e "imperfecto a propósito"**. Prioriza estos estilos si el usuario quiere algo actual:
| Tendencia | Cómo aplicarla |
|---|---|
| **Imperfect by Design** (Canva) | Toques humanos sobre lo pulido: trazos a mano, texto ligeramente torcido, garabatos, bordes irregulares |
| **Collage / scrapbook táctil** (Canva: búsquedas DIY/collage +90%) | Texturas realistas de papel, cinta, cartón, recortes superpuestos, sombras de objeto físico |
| **Notes App Chic** (Canva) | Captura de pantalla tipo app de Notas/iMessage, tipografía de sistema, look espontáneo |
| **Lo-fi / retro-tech** (Canva "Prompt Playground", lo-fi +527%) | Ventanas de Windows 95, píxeles, cursores, barras de carga, pantallas CRT con scanlines |
| **Reality Warp** (Canva, liminal/uncanny +220%) | Mezcla real + surreal: objetos gigantes, cielos imposibles, distorsiones tipo sueño |
| **Neo Deco** (Pinterest) | Art Deco moderno: abanicos, arcos escalonados, líneas doradas/latón, simetría, serif geométrica (Poiret One, Limelight) |
| **Opera / glamour** (Pinterest) | Terciopelo rojo, dorado, cortinas, marcos ornamentados, lujo dramático |
| **Extra Celestial / alien-core** (Pinterest) | Holográfico, iridiscente, cromo, planetas, verde ácido + plata |
| **Gummy / jelly** (Pinterest) | Formas infladas brillantes 3D, texturas gelatinosas, colores dulces saturados (gradientes radiales + brillo especular) |
| **Afrohemian** (Pinterest) | Textiles africanos (kente, mudcloth) + boho: patrones geométricos, ratán, tierra |
| **Mystic Outlands / cool blues** (Pinterest) | Azules fríos, niebla, bosques oscuros, ruinas, ambiente misterioso |

Paletas 2026: Neo Deco `#0F3D3E #C9A227 #F3E9D2 #1B1B1B #8C2F39` · Celestial `#0B0B2B #7DF9FF #C77DFF #E0E0E0 #B6FF3B` · Gummy `#FF5FA2 #FFB627 #7BDFF2 #B2F7EF #6A4C93` · Mystic `#1F3A4D #5B7B8C #A9BCC4 #2E3B2F #E6E9EA`

## 3. Paletas listas
- Coquette: `#F7D6E0 #F2B5D4 #FFF5F7 #C9184A #5E3A45`
- Beige clean: `#F5EFE6 #E8DFCA #CBB89D #8B7E74 #3E3A36`
- Groovy 70s: `#F4A259 #E76F51 #F6D186 #6A994E #5B3A29`
- Kawaii pastel: `#CDEAC0 #FFD6E0 #E4C1F9 #FFF1C1 #A9DEF9`
- Boho: `#D27D56 #E9C46A #EADBC8 #87A878 #4A3B32`
- Dark academia: `#2F3E33 #6B2D2D #A68A64 #EDE0C8 #1C1C1C`
- Neo-brutal: `#FFE14D #FF6B9D #4DD4FF #FFFFFF #111111`
- Y2K: `#C0C0FF #FF9CEE #B5FFFC #E0E0E0 #1A1A2E`
Regla 60/30/10: 60% fondo, 30% secundario, 10% acento.

## 4. Tipografías (Google Fonts)
- Serif elegante: Playfair Display, Cormorant Garamond, DM Serif Display, Fraunces (itálica = muy "Canva")
- Retro/groovy: Shrikhand, Righteous, Bagel Fat One, Rubik Mono One
- Manuscrita/script: Caveat, Pacifico, Dancing Script, Homemade Apple, Gloria Hallelujah, Sacramento
- Sans limpia: Poppins, DM Sans, Outfit, Space Grotesk (brutal)
- Combo clásico: titular serif itálica + subtítulo sans en MAYÚSCULAS con `letter-spacing: .2em` + una palabra en script.
Jerarquía: titular 3–5× el tamaño del texto. Máx. 3 tamaños.

## 4a. Tipografías de Instagram/Canva
Ver `references/instagram.md` §3: equivalencias Canva/IG → Google Fonts (Pinyon Script, Great Vibes, Bodoni Moda condensada, Poppins 600, Instrument Serif) y reglas de uso.

## 4b. Formatos virales de Instagram (2026)
El algoritmo premia **guardados y compartidos** más que likes. Los carruseles (7–10 slides) son el formato estático que más alcance tiene. La **primera slide lo es todo**: gancho de máx. 8 palabras con curiosidad que obligue a deslizar.
| Formato | Receta |
|---|---|
| **Gancho de carrusel** | Número gigante (Unbounded/Bricolage 800) + titular bold con 1 palabra en serif itálica + frase subrayada con marcador + "desliza →" + nota a mano "guárdalo" |
| **Frase tipográfica** | Fondo oscuro o crema; cada línea en una fuente distinta (serif normal / sans MAYÚS bold / serif itálica en color acento). Texto enorme, alineado a la izquierda |
| **Notes App Chic** | Captura falsa de la app Notas: fuente del sistema, checks amarillos, tachados, fecha real; tarjeta blanca sobre fondo pastel con nota a mano |
| **Esto o aquello** | Pares en pastillas redondeadas, el elegido resaltado en color ácido; CTA "dime los tuyos" (genera comentarios) |
| **Lista / tips** | "X cosas que…", numeración grande, 1 idea por slide |
| **Antes / después**, **mitos vs realidad**, **POV**, **cosas que nadie te dice** | Contraste en dos columnas o pregunta provocadora en la portada |
Siempre: @usuario abajo, márgenes ≥80px, títulos 90–170px en 1080 de ancho, cuerpo ≥34px.

**Tipografías de tendencia 2026** (Google Fonts): Instrument Serif (la serif de moda, úsala en itálica), Bricolage Grotesque 800 (titulares con tracking negativo −0.04em), Unbounded (números/display), Fraunces, DM Serif Display, Caveat / Gochi Hand (notas a mano). Combinación ganadora: **sans ultra bold + serif itálica en la misma frase**.

## 4c. Idioma: español de México
Todo el texto va en **español mexicano** natural, como habla la gente en Instagram:
- Usa "tú" (nunca "vos" ni "vosotros"); "celular", "mándanos mensaje/DM", "pa’", "¿te late?", "qué flojera", "ya quedó", "padrísimo", "mesa de regalos", "XV años".
- Evita españolismos ("guay", "móvil", "vale", "ordenador", "coger") y frases neutras de traductor.
- Fechas dd/mm/aaaa, horas tipo "9 pm", precios en $ MXN.

## 5. Composición
- Márgenes generosos (≥6% del ancho). El espacio vacío es lo que lo hace "aesthetic".
- Usa un eje: centrado simétrico (minimal, invitaciones) o asimetría intencional (editorial, collage).
- Superpón capas: texto que se monta sobre una forma o imagen da profundidad.
- Rota elementos sueltos levemente (−4° a 6°) para efecto hecho a mano.
- Arcos y marcos (`border-radius: 999px 999px 0 0`) para fotos = muy Pinterest.

## 6. Recursos decorativos (CSS/SVG)
- **Grano/ruido**: SVG `feTurbulence` encima con `opacity:.08–.15; mix-blend-mode:multiply`.
- **Formas orgánicas (blobs)**: `path` SVG con curvas suaves o `border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%`.
- **Trazo a mano**: SVG con filtro `feDisplacementMap` leve sobre líneas y subrayados.
- **Estrellas ✦, chispas ✧, corazones, flores daisy, moños, nubes, sol con rayos** dibujados en SVG.
- **Cinta washi**: rectángulo semitransparente rotado con bordes en zigzag (`clip-path`).
- **Sombra dura** (brutal): `box-shadow: 6px 6px 0 #111; border: 3px solid #111`.
- **Sticker**: texto con contorno blanco grueso (`-webkit-text-stroke` o `paint-order: stroke`) + sombra suave.
- **Aura**: 2–3 círculos de color con `filter: blur(100px)`.

## 7. Qué evitar (lo que lo hace ver "de IA" o genérico)
- Minimalismo beige "perfecto" sin personalidad (en 2026 se ve anticuado).
- Degradado morado-azul por defecto, Inter/Arial en todo, tarjetas con sombra difusa idénticas.
- Demasiados elementos decorativos compitiendo; más de 2 fuentes display.
- Texto con poco contraste sobre foto (usa overlay o caja).
- Emojis como decoración en lugar de ilustraciones SVG.

## 7b. Regla de oro: que NO parezca hecho por IA
Un diseño "de IA" es perfecto, simétrico, limpio, genérico y plano. Un ilustrador real deja huellas del proceso. Aplica **mínimo 5** de estas técnicas en cada diseño:

**Material e impresión (lo más importante)**
- **Textura de papel real**: fibras con `feTurbulence` baja frecuencia + manchas suaves; el fondo nunca es un color plano.
- **Tinta imperfecta**: filtro `feDisplacementMap` (scale 2–4) sobre trazos y letras → bordes que "sangran" como serigrafía/letterpress.
- **Desregistro**: duplica un elemento en otro color desplazado 2–4px con `mix-blend-mode:multiply` (efecto risografía).
- **Foil / metal creíble**: el dorado NO es un degradado liso; usa ruido + degradado con varios brillos y zonas apagadas.
- **Tinta gastada**: máscara de ruido que quite 5–15% de la tinta en zonas al azar.
- **Viñeta y luz**: degradado radial sutil para simular luz real sobre el papel.

**Composición humana**
- Rompe la simetría en al menos un elemento (un sello girado, un texto en vertical, una nota al margen).
- Elementos que se salen del marco o se cortan con el borde.
- Variación de grosor en las líneas (no todas a 2px).
- Detalles pequeños que premian mirar de cerca: numeración "Nº 047", microtexto, sellos, firmas, notas a mano.

**Tipografía de oficio**
- Ajusta `letter-spacing` por palabra, usa ligaduras, versalitas, números de estilo antiguo, comillas tipográficas (« » “ ”).
- Mezcla un texto a mano (script o trazo) con la tipografía formal.
- Nada de textos genéricos ("Lorem", "Tu texto aquí", "Edición especial"): escribe copy concreto y con personalidad.

**Presentación**
- Muestra el diseño como objeto físico cuando aplique (mockup sobre mesa/tela con sombra realista, ligera rotación).
- Paleta limitada como si fueran tintas reales (2–4 tintas), no colores infinitos.

**Señales de IA a eliminar**: degradados perfectos, todo centrado, líneas del mismo grosor, ornamentos repetidos idénticos, brillos plásticos, textos vagos, fondo plano sin textura.

## 8. Checklist final
- [ ] Un solo estilo claro, reconocible a primera vista
- [ ] Paleta ≤5 colores aplicada con 60/30/10
- [ ] Jerarquía: se lee el titular en 1 segundo
- [ ] Al menos un detalle "hecho a mano" (grano, rotación, trazo, sticker)
- [ ] Márgenes amplios y alineación coherente
- [ ] Contraste legible (WCAG AA en texto pequeño)
- [ ] Pasa la regla 7b: textura, imperfección de tinta, asimetría, detalles concretos
- [ ] Sin textos encimados ni cortados (revisar cada slide a tamaño real)
- [ ] Sin fotos de personas; sin datos inventados
- [ ] Retícula y márgenes consistentes en todas las slides; jerarquía clara (prueba de 1 segundo)
- [ ] Ortografía, acentos y signos ¿ ¡ revisados; sin viudas en titulares
- [ ] Concepto nombrado y fuentes de tendencias citadas
- [ ] Caption, hashtags y alt text entregados junto a las slides
- [ ] Tamaño correcto para la red social y renderizado revisado en PNG
