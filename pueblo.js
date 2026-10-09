// Pueblito de Elara: los 6 brontos pasean por el camino (versión web del pueblo de la app).
(() => {
  const cv = document.getElementById("pueblo"); if (!cv) return;
  const ctx = cv.getContext("2d"), W = 1796, H = 1072, B = "img/pueblo/";
  const PATH = [[224,671],[226,678],[227,684],[228,690],[228,696],[229,702],[230,708],[231,714],[232,720],[235,727],[238,733],[243,738],[249,744],[257,750],[266,755],[276,760],[287,765],[298,770],[311,774],[323,778],[337,782],[350,786],[365,790],[380,793],[395,796],[411,799],[427,802],[444,804],[461,805],[478,806],[496,808],[513,809],[531,810],[548,810],[566,811],[584,811],[602,811],[620,811],[637,810],[655,810],[673,810],[690,810],[708,810],[726,810],[744,810],[762,810],[779,810],[797,810],[815,810],[832,810],[850,810],[868,810],[886,810],[904,810],[921,810],[939,810],[957,810],[975,810],[992,810],[1010,810],[1028,810],[1046,810],[1063,810],[1081,810],[1099,810],[1117,810],[1134,810],[1152,810],[1170,810],[1188,810],[1205,810],[1223,810],[1241,810],[1259,810],[1276,810],[1294,809],[1312,808],[1329,808],[1346,806],[1363,804],[1380,802],[1396,799],[1411,796],[1426,793],[1440,789],[1454,785],[1466,781],[1478,776],[1489,771],[1499,766],[1508,761],[1516,755],[1523,750],[1528,744],[1533,738],[1536,732],[1539,726],[1540,720],[1540,714],[1539,708],[1536,701],[1533,695],[1528,689],[1522,684],[1516,678],[1508,672],[1499,667],[1489,662],[1478,657],[1466,653],[1453,648],[1440,644],[1426,641],[1411,637],[1395,634],[1379,632],[1363,629],[1346,627],[1329,626],[1311,625],[1294,624],[1276,624],[1258,624],[1240,623],[1223,623],[1205,623],[1187,624],[1169,624],[1152,624],[1134,624],[1116,624],[1098,624],[1081,624],[1063,624],[1045,624],[1027,624],[1010,624],[992,624],[974,624],[956,624],[938,624],[921,624],[903,624],[885,624],[868,624],[850,624],[832,624],[814,624],[796,624],[779,624],[761,624],[743,624],[725,624],[708,624],[690,624],[672,624],[654,624],[637,624],[619,625],[601,625],[583,625],[566,625],[548,624],[530,624],[513,623],[495,622],[477,622],[460,621],[442,619],[426,618],[409,615],[393,612],[379,609],[365,605],[352,601],[339,597],[327,592],[316,587],[306,582],[296,577],[288,572],[280,566],[274,560],[268,554],[264,549],[260,543],[256,537],[254,530],[252,524],[251,518],[251,512],[252,506],[254,500],[257,494],[260,488],[264,482],[268,476],[271,470],[275,464],[278,458]];
  // [sprite, casa, y de la puerta, índice del camino]
  const AG = [["Rosy", 1, 724, 32], ["Marine", 2, 723, 53], ["Lila", 3, 723, 79], ["Steve", 4, 562, 113], ["Naranja", 5, 537, 132], ["Menta", 6, 537, 152]];
  const HOUSES = [[458, 488], [791, 485], [1162, 485], [1380, 323], [976, 299], [604, 300]];
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const img = s => { const i = new Image(); i.src = B + s; return i; };
  const cum = [0]; for (let i = 1; i < PATH.length; i++) cum.push(cum[i - 1] + Math.hypot(PATH[i][0] - PATH[i - 1][0], PATH[i][1] - PATH[i - 1][1]));
  const LEN = cum[cum.length - 1];
  function at(s) {
    const d = Math.min(Math.max(s, 0), 1) * LEN; let i = 1;
    while (i < cum.length - 1 && cum[i] < d) i++;
    const k = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
    return [PATH[i - 1][0] + (PATH[i][0] - PATH[i - 1][0]) * k, PATH[i - 1][1] + (PATH[i][1] - PATH[i - 1][1]) * k];
  }
  const BG = img("bg.webp");
  const dinos = AG.map(([n, h, by, pi], i) => {
    const f = cum[pi] / LEN, p = at(f);
    return {spr: img(n + ".webp"), house: img("house_" + h + ".webp"), hx: HOUSES[i][0], hy: HOUSES[i][1], by, f, s: f, dest: f, px: p[0], py: p[1], dir: 1, ph: 0, walk: false, wait: 1 + Math.random() * 4, hop: 0, seed: Math.random() * 9};
  });
  const all = [BG, ...dinos.flatMap(d => [d.spr, d.house])];
  const SP = 85;                                   // px por segundo
  function update(dt) {
    dinos.forEach(d => {
      if (d.hop > 0) d.hop -= dt;
      if (d.walk) {
        const step = SP * dt / LEN, diff = d.dest - d.s;
        if (Math.abs(diff) <= step) { d.s = d.dest; d.walk = false; d.wait = 2 + Math.random() * 5; }
        else { d.s += Math.sign(diff) * step; d.ph += SP * dt / 90 * 8; }
      } else if ((d.wait -= dt) <= 0) {
        const r = Math.random();
        if (r < .6) { const m = (Math.random() < .5 ? -1 : 1) * (.012 + Math.random() * .03); d.dest = Math.min(d.f + .05, Math.max(d.f - .05, d.s + m)); d.walk = true; }
        else if (r < .8) { d.dir = -d.dir; d.wait = 1.5 + Math.random() * 3; }
        else { d.hop = .6; d.wait = 1.5 + Math.random() * 3; }
      }
      const p = at(d.s); if (d.walk && Math.abs(p[0] - d.px) > .05) d.dir = p[0] > d.px ? 1 : -1;
      d.px = p[0]; d.py = p[1];
    });
  }
  function drawDino(d, t) {
    const fr = d.walk ? Math.floor(d.ph) % 8 : 0;
    const hop = d.hop > 0 ? Math.sin((1 - d.hop / .6) * Math.PI) * 24 : 0;
    const breathe = d.walk ? 1 : 1 + Math.sin(t * 2 + d.seed) * .014, sway = d.walk ? 0 : Math.sin(t * 1.6 + d.seed) * .012;
    ctx.save(); ctx.translate(d.px, d.py);
    ctx.fillStyle = "rgba(60,70,50,.20)"; ctx.beginPath(); ctx.ellipse(0, -12, 84, 26, 0, 0, 7); ctx.fill();
    ctx.fillStyle = "rgba(50,55,40,.34)"; ctx.beginPath(); ctx.ellipse(0, -7, 56, 15, 0, 0, 7); ctx.fill();
    ctx.translate(0, -hop); ctx.scale(d.dir < 0 ? -1 : 1, breathe); ctx.rotate(sway);
    ctx.drawImage(d.spr, fr * 256, 0, 256, 256, -133, -211, 256, 256);
    ctx.restore();
  }
  function draw(t) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#ffc2de"); g.addColorStop(1, "#e3c9ff");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(255,255,255,.6)";
    for (let k = 0; k < 3; k++) { const x = ((t * (14 + k * 5) + k * 700) % 2300) - 250, y = 168 + k * 60; ctx.beginPath(); ctx.ellipse(x, y, 90, 28, 0, 0, 7); ctx.ellipse(x - 50, y - 10, 44, 28, 0, 0, 7); ctx.ellipse(x + 40, y - 18, 50, 32, 0, 0, 7); ctx.fill(); }
    ctx.drawImage(BG, 0, 0);
    const items = [];
    dinos.forEach(d => { items.push({y: d.by, f: () => ctx.drawImage(d.house, d.hx, d.hy)}); items.push({y: d.py + 1, f: () => drawDino(d, t)}); });
    items.sort((a, b) => a.y - b.y).forEach(o => o.f());
  }
  let visible = true, last = 0, running = false;
  function loop(ts) {
    if (!visible) { running = false; return; }
    const t = ts / 1000, dt = Math.min(.05, t - (last || t)); last = t;
    update(dt); draw(t); requestAnimationFrame(loop);
  }
  function start() { if (!running && visible) { running = true; last = 0; requestAnimationFrame(loop); } }
  Promise.all(all.map(i => i.decode ? i.decode().catch(() => {}) : Promise.resolve())).then(() => {
    cv.classList.add("ready");
    if (quieto) { draw(0); return; }
    new IntersectionObserver(e => { visible = e[0].isIntersecting; start(); }).observe(cv);
    start();
  });
})();
