// Renderiza slides a PNG. Uso:
//   node render.js archivo.html salida-prefijo [ancho=1080] [alto=1350] [n=1] [selector]
// - Con selector (p. ej. ".s"): captura cada elemento que coincida.
// - Sin selector: trata la página como lienzo panorámico de n slides y lo corta.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [file, out, W = 1080, H = 1350, n = 1, sel] = process.argv.slice(2);
  const w = +W, h = +H, N = +n;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: w * Math.max(N, 1) + 60, height: h + 60 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.resolve(file));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1500);
  if (sel) {
    const els = await p.$$(sel);
    for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: `${out}-${i + 1}.png` });
    console.log(els.length, 'slides');
  } else {
    await p.screenshot({ path: `${out}-full.png`, clip: { x: 0, y: 0, width: w * N, height: h } });
    for (let i = 0; i < N; i++) await p.screenshot({ path: `${out}-${i + 1}.png`, clip: { x: i * w, y: 0, width: w, height: h } });
    console.log(N, 'slides');
  }
  await b.close();
})();
