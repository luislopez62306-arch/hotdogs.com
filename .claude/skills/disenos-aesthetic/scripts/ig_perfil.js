// Descarga el grid público de un perfil de Instagram (≈12 posts) con caption y foto en HD.
// Uso: node scripts/ig_perfil.js <usuario> <carpeta-salida>
// 1) Abre el perfil como iPhone (sin login) y lee <img> del grid: srcset + alt (= caption).
// 2) Decodifica ig_cache_key → media id → shortcode.
// 3) Abre /p/<shortcode>/embed/captioned/ y baja la imagen más grande (720–3024 px).
// Si el perfil sale vacío (muro de login), vuelve a correrlo: suele cargar al 2º o 3er intento.
const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const [user, out = 'ig'] = process.argv.slice(2);
const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const code = (id) => { let n = BigInt(id), s = ''; while (n > 0n) { s = A[Number(n % 64n)] + s; n /= 64n; } return s; };
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  let posts = [];
  for (let t = 0; t < 3 && posts.length < 3; t++) {
    const c = await b.newContext({ ...devices['iPhone 13'] }); const p = await c.newPage();
    await p.goto(`https://www.instagram.com/${user}/`, { timeout: 45000 }).catch(() => {});
    await p.waitForTimeout(5000);
    const bio = await p.innerText('body').catch(() => '');
    fs.writeFileSync(path.join(out, 'perfil.txt'), bio.slice(0, 1500));
    await p.screenshot({ path: path.join(out, 'perfil.png') });
    posts = await p.$$eval('img', a => a.map(i => ({ src: i.src, alt: i.alt, w: i.naturalWidth })).filter(x => x.w >= 200));
    const logo = await p.$$eval('img', a => (a.find(i => /profile picture|foto del perfil/i.test(i.alt)) || {}).src);
    if (logo) fs.writeFileSync(path.join(out, 'logo.jpg'), Buffer.from(await (await p.request.get(logo)).body()));
    await c.close();
  }
  const p = await b.newPage(); const meta = [];
  for (let i = 0; i < posts.length; i++) {
    const k = decodeURIComponent((posts[i].src.match(/ig_cache_key=([^&]+)/) || [])[1] || '').split('.')[0];
    const raw = Buffer.from(k, 'base64').toString(); const id = (raw.match(/^\d+/) || [''])[0].slice(0, 19);
    const sc = id ? code(id) : null; const f = `post${String(i + 1).padStart(2, '0')}`;
    let best = posts[i].src, bw = posts[i].w;
    if (sc) try {
      await p.goto(`https://www.instagram.com/p/${sc}/embed/captioned/`, { timeout: 30000 }); await p.waitForTimeout(2500);
      const r = await p.$$eval('img', a => { let u = null, w = 0; for (const x of a) for (const [s, ww] of (x.srcset || '').split(',').map(t => t.trim().split(' '))) { const n = parseInt(ww); if (n > w) { w = n; u = s; } } return [u, w]; });
      if (r[0] && r[1] > bw) { best = r[0]; bw = r[1]; }
    } catch (e) {}
    fs.writeFileSync(path.join(out, f + '.jpg'), Buffer.from(await (await p.request.get(best)).body()));
    meta.push({ file: f + '.jpg', shortcode: sc, ancho: bw, caption: posts[i].alt });
    console.log(f, sc, bw);
  }
  fs.writeFileSync(path.join(out, 'posts.json'), JSON.stringify(meta, null, 1));
  await b.close();
})();
