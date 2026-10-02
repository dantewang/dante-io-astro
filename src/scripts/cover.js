// Cover page behaviour: title reveal, link hovers, uptime, and the heap view.
import './theme.js';

const GLYPHS = '<>{}[]/\\=+*#%&$01;:~';

function splitChars(el) {
  const text = [...el.textContent];
  el.textContent = '';
  return text.map(c => {
    const s = document.createElement('span');
    s.className = 'ch';
    s.textContent = c;
    el.append(s);
    return s;
  });
}

// Cycle each character through random glyphs before settling on the real one.
function scramble(chars, { delay = 0, stagger = 40, cycles = 5, tick = 45, hide = false } = {}) {
  chars.forEach((c, i) => {
    if (!c.textContent.trim()) return;
    clearTimeout(c._t);
    if (hide) c.dataset.g = '';
    let n = 0;
    const run = () => {
      if (n++ < cycles) {
        c.dataset.g = GLYPHS[Math.random() * GLYPHS.length | 0];
        c._t = setTimeout(run, tick);
      } else {
        delete c.dataset.g;
      }
    };
    c._t = setTimeout(run, delay + i * stagger);
  });
}

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== links: scramble the label on hover / focus ===== */
document.querySelectorAll('.link').forEach(a => {
  const chars = splitChars(a.querySelector('.label'));
  const shuffle = () => scramble(chars, { stagger: 22, cycles: 3, tick: 35 });
  a.addEventListener('pointerenter', shuffle);
  a.addEventListener('focus', shuffle);
});

/* ===== title reveal ===== */
{
  const parts = [...document.querySelectorAll('.title [data-split]')].map(splitChars);
  if (!reduceMotion) {
    let delay = 300;
    for (const chars of parts) {
      scramble(chars, { delay, stagger: 55, cycles: 7, tick: 42, hide: true });
      delay += chars.length * 55 + 60;
    }
    document.querySelector('.title').addEventListener('pointerenter', () =>
      parts.forEach(chars => scramble(chars, { stagger: 18, cycles: 3, tick: 35 })));
  }
}

/* ===== misc chrome ===== */
document.getElementById('year').textContent = new Date().getFullYear();

const T0 = performance.now();
{
  const el = document.getElementById('uptime');
  const pad = n => String(n).padStart(2, '0');
  setInterval(() => {
    const s = (performance.now() - T0) / 1000 | 0;
    el.textContent = `${pad(s / 3600 | 0)}:${pad((s / 60 | 0) % 60)}:${pad(s % 60)}`;
  }, 1000);
}

/* =====================================================================
   Hatsune Miku as a sparse constellation — outline, colour boundaries and
   a thin interior fill, sampled from the classic V2 illustration (by KEI,
   (c) Crypton Future Media) into ~500 points. No image is shipped; only
   these points: per point 2+2 base-36 digits of grid x/y, a colour key
   (h hair, s skin, k dark, g light grey, p pink) and a kind (o outline,
   b boundary, f fill).
   ===================================================================== */
const MIKU_POINTS =
  '1k00ko1901ho1d01ho1h01po1i01pb1602ho1103ko1803hf1e03hf1n03ho1g04pb1105hb1n05hf1j06pb1p06ho0z07ho' +
  '1307hf1b08hf1q09ho0y0aho150ahb1h0akb1l0ahb0y0bhf180csb1m0chf1s0cho0x0eho140esb1b0ehb1f0ehf1n0ehb' +
  '1i0fpb1l0fho1t0fho110ghf0v0hho170hsb1n0hho170isf1c0igb1g0ihb1j0iho140jsb1s0jhf1v0jho190ksb1h0kho' +
  '0u0lho0y0lhf1o0lho120mho170mso1d0msb1x0mho140nhb1d0nsf1i0nho140oho1b0oko1p0oho0t0pho1z0pho180qgo' +
  '1j0qgo100rho1h0rsb1q0rho1u0rhf0s0sho160sko190shf1a0shb200sho120tgo1l0tgf140usb1k0usb1m0ugo0r0vho' +
  '0v0vhf130vsf1e0vsb1r0vho170whb1f0wsf110xsb1h0xsb1u0xhf200xhf230xho1l0yso1r0yho0q0zho1e0zsb1410hb' +
  '1a10sb1k10sf2410ho0r11hf1011sb1211gf1s11ho1812gf1j12sb1l12ho0o13ho0y14kb1214hb1614kb1c14gb1e14kf' +
  '1v14hf2414hf2514hb1l15ko1t15ho2715go1916kb0o17hb0u17hf1e17go0m18go0y18gb1l18ko2518hb2818go1119hf' +
  '1219hb1619gb1b19gf1c19go1g19ko1i19kf0v1akb1u1aho201ahf0l1bgo0o1bhb0p1bhf1l1bko1a1cgo1g1cko0t1dhb' +
  '111dkb161dgf231dgb291dgf2b1dgo0y1ehf151egb1m1eko1v1eho0k1fgo0n1fhb191fgb1g1fko1i1fkf0w1gkb1b1ggo' +
  '231ghf251ghb2c1ggo0o1hhf0s1hgb121hkb1m1hko0i1igo0j1ihb161ikb1g1iko1w1iho1x1ihf281igb0z1jhb191jgf' +
  '2d1jgf0m1khb1b1kgb1n1kko2e1kgo0h1lho131lgb1d1lgo1l1lkf1x1lho0q1mkb131mgf171mgb1l1mkb0h1nhf0o1ngf' +
  '0v1nhf1f1ngo1n1nko201nhf261nhf2c1nhb0g1oho0y1ohb1g1okb2g1ogo0k1phb131pkb0r1qkb0v1qhb1c1qgf1d1qgb' +
  '1i1qkf1l1qgb1y1qho0f1rho2h1rho0o1shb0r1skf111sgb151sgf191skb1o1sko2e1shf0h1thb0j1tkf0t1tkb0x1tkf' +
  '1n1tkb0e1uho0l1uhb1j1ukb281uhf2i1uho171vgb1z1vho221vhf1b1wkf1h1wkf1p1wko121xkb1f1xkb1n1xgb0c1yho' +
  '0g1ykb0n1yhb0p1yhf1e1yho1o1ykf2j1yho0d1zhf0v1zkf111zkf171zkb1c1zhb1k1zkb2h1zhf0t20kb1p20kb1q20ko' +
  '2020ho0b21ho0i21kb0k21kf0x21kb1f21ko2421hf2a21hf2k21ho1122hb1a22sb1b22sf1c22so0n23sb0r23sb1523hb' +
  '1l23hb1r23ko0924ho0v24sb0y24hf0z24ho1224ho1e24ko1n24gf2024ho2l24ho0i25sb0s25sf1825sb1c25sb1h25kf' +
  '1o25kb2f25hf0x26ho1426go1g26kb1r26ho0b27hf0i27hf0p27sb1h27ko2727hf0728ho0t28sb1628sb1e28ko1j28hb' +
  '1k28ho1n28ho2028ho2l28ho0l29hb0x29ho1a29kb2129hf162ako1e2akf1i2aho182bkf1f2bko1m2bho202bho2m2bho' +
  '052cho0t2ckf0v2chb0w2cho2d2chf2l2chf0f2dhf0m2dkb172dko092ehf1g2eko2m2eho0o2fkf0w2fho282fhf032gho' +
  '1c2gkf202gho1g2hko222hhf2i2hhf0t2ikb182iko2m2iho0l2jhb0v2jhf0w2jho052khf0b2khf022lho0h2lhf1h2lko' +
  '1z2lho2b2lhf2m2lho0u2mhb192mko1g2mkf2l2mhf0m2nkb0o2nkf0w2nho012ogo022ohb1i2oko1y2oho262ohf2l2ohb' +
  '0s2pkb1a2pko1b2pkf2l2pho072qhf0v2qhf002rgo0e2rhf1i2rko212rhf2i2rhf022shb0w2sho1x2sho2i2shb2l2sgo' +
  '0n2tkf1b2tko002ugo0m2ukb0t2uhb2d2uhf1e2vkf1w2vho012wgb0v2whf0x2who1j2wko262whf002xgo0b2xhf0i2xhf' +
  '2i2xhb2j2xgo1d2yko1w2yhf022zhf0w2zho1k2zko2h2zhf0030ho0l30kb0o30kf0r30kb0t30ho1v30ho0y31ho1e31ko' +
  '1g31kf2331hf2h32ho0r33ho1m33ko1u33ho0034ho0z34ho2a34hf0b35hf0j35hb1g35ko2f35ho0436hf0i36hf0p36ko' +
  '1n36ko1u37ho1x37hf0138ho2d38ho0j39kb1i39ko1l39kf1o39ko1x39ho0n3akf0p3ako1u3aho283bhf2a3bho053chf' +
  '0g3chf1k3cko1p3cko1y3cho223chf043dho0o3dko283dho0j3eko063fho0a3fhf0g3fho1l3fko1o3fkf203fho083ghb' +
  '253gho083hko0n3hko1r3hko0m3ikf1m3iko223ihf0b3jho0g3jho0j3jko223jho0f3khf0n3kko0e3lho1o3lko1s3mko' +
  '0j3nko0n3nko1o3oko1s3okf0l3pkf1t3qko0j3rko0n3rkb0o3rko1q3rhb1o3sko1p3tkf1t3tgb0j3uko0p3uko1v3uko' +
  '0o3wgb1n3wko1r3wgb1u3wkf0j3xko0k3xkf0q3xgo1u3yko0k40ko0r40ho1n40hb1s40kb0o41hb1n41ho1u41ho0n42ho' +
  '1r42ho';

function buildMiku() {
  const px = [];
  let w = 0, h = 0;
  for (let i = 0; i < MIKU_POINTS.length; i += 6) {
    const x = parseInt(MIKU_POINTS.slice(i, i + 2), 36), y = parseInt(MIKU_POINTS.slice(i + 2, i + 4), 36);
    px.push({ x, y, key: MIKU_POINTS[i + 4], kind: MIKU_POINTS[i + 5] });
    w = Math.max(w, x + 1); h = Math.max(h, y + 1);
  }
  for (const p of px) {
    // (colours come from the theme: see readPalette in the heap view)
    // hair below the head sways, more towards the tips
    p.sway = p.key === 'h' ? Math.max(0, Math.min(1, (p.y / h - .2) / .8)) : 0;
    // a little jitter so the sampling grid never shows
    p.x += Math.random() * .6 - .3;
    p.y += Math.random() * .6 - .3;
  }

  // join each outline / boundary point to its two nearest same-coloured neighbours
  const links = [], seen = new Set();
  px.forEach((p, i) => {
    if (p.kind === 'f') return;
    const near = [];
    px.forEach((q, j) => {
      if (i === j || q.kind === 'f' || q.key !== p.key) return;
      const d = (p.x - q.x) ** 2 + (p.y - q.y) ** 2;
      if (d < 4.2 * 4.2) near.push([d, j]);
    });
    near.sort((a, b) => a[0] - b[0]);
    for (const [, j] of near.slice(0, 2)) {
      const k = i < j ? i + ',' + j : j + ',' + i;
      if (!seen.has(k)) { seen.add(k); links.push([i, j]); }
    }
  });
  return { w, h, px, links };
}

/* =====================================================================
   Heap view — a toy generational garbage collector.

   Objects are allocated from GC roots (the small diamonds) or from other
   objects, and hold references that expire over time; most young ones
   die young. When the heap fills up, or every few seconds, the world
   stops: marking floods out from the roots (and the pointer) along live
   references, then a sweep line frees whatever wasn't reached. Objects
   that survive enough collections are promoted to the old generation,
   which only "mixed" collections clean up.

   Every so often (or on System.gc(), or typing "39" / "miku") a full GC
   compacts the heap — into Hatsune Miku — before sweeping it clean.
   ===================================================================== */
{
  // colours come from CSS custom properties, so they follow the theme
  const COL = {}, RGB = {};
  let BG = '';
  const OLD_AGE = 3;     // collections survived before promotion
  const REST = 56;       // rest length of a reference, px
  const REACH = 130;     // radius within which the pointer acts as a root, px
  const MARK_MAX = 900;  // ms, upper bound for the mark flood
  const SWEEP = 850;     // ms, sweep line duration
  const FADE = 520;      // ms, freed-object fade out
  const PERIOD = 9000;   // ms, periodic collection if the heap never fills

  // full GC / Miku show
  const MIKU = buildMiku();

  function readPalette() {
    const css = getComputedStyle(document.documentElement);
    const triple = name => css.getPropertyValue(name).trim().split(/\s*,\s*/).map(Number);
    for (const k of ['fg', 'accent', 'old']) { COL[k] = triple('--c-' + k); RGB[k] = COL[k].join(); }
    BG = css.getPropertyValue('--bg').trim();
    const m = {};
    for (const k of 'hskgp') m[k] = triple('--m-' + k);
    for (const p of MIKU.px) p.c = m[p.key];
  }
  readPalette();
  document.addEventListener('themechange', readPalette);   // before any redraw listener
  const FIRST_SHOW = 12000;  // ms after load
  const EVERY = 39000;       // ms between shows — 3·9, mi·ku
  const FORM = 1500;         // ms for each dot's flight into place
  const HOLD = 7500;         // ms the figure stays up
  const WIPE = 1300;         // ms, sweep line across the figure
  const RETURN = 800;        // ms for real objects to fly home

  const canvas = document.getElementById('heap');
  const ctx = canvas.getContext('2d');
  const stateEl = document.getElementById('state');
  const statEl = document.getElementById('gcStat');
  const logEl = document.getElementById('gcLog');

  let W = 0, H = 0, dpr = 1, cap = 120;
  let objs = [], roots = [], frags = [];
  let phase = 'run', gc = null, gcCount = 0, lastGC = 0, allocDebt = 0, statAt = 0;
  let show = null, wantShow = false, nextShow = performance.now() + FIRST_SHOW;
  const pointer = { x: 0, y: 0, on: false, root: true };

  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const ease = p => p < .5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2;
  const mix = (a, b, k) => `${a[0] + (b[0] - a[0]) * k | 0},${a[1] + (b[1] - a[1]) * k | 0},${a[2] + (b[2] - a[2]) * k | 0}`;
  const stamp = now => `[${((now - T0) / 1000).toFixed(3)}s][gc]`;
  const pick = arr => arr[Math.random() * arr.length | 0];
  const near = (a, b, r) => { const dx = a.x - b.x, dy = a.y - b.y; return dx * dx + dy * dy < r * r; };

  function makeRoot() {
    return { x: rnd(.12, .88) * W, y: rnd(.12, .88) * H, vx: rnd(-7, 7), vy: rnd(-7, 7), refs: [], root: true };
  }

  function refLife(from) {
    if (from.root) return rnd(5000, 24000);
    if (from.age >= OLD_AGE) return rnd(9000, 30000);
    // weak generational hypothesis: most young references die young
    return Math.random() < .78 ? rnd(700, 4500) : rnd(6000, 20000);
  }

  function alloc(parent, now) {
    const a = rnd(0, Math.PI * 2), d = rnd(20, 50);
    const o = {
      x: parent.x + Math.cos(a) * d, y: parent.y + Math.sin(a) * d, vx: 0, vy: 0,
      refs: [], age: 0, born: now, depth: -1, markAt: 0, swept: false,
      dying: 0, promoted: 0, dead: false,
    };
    parent.refs.push({ to: o, ttl: now + refLife(parent) });
    objs.push(o);
    return o;
  }

  function pickParent() {
    if (!objs.length || Math.random() < .3) return pick(roots);
    for (let i = 0; i < 4; i++) {
      const o = pick(objs);
      if (!o.dying) return o;
    }
    return pick(roots);
  }

  // occasionally wire an object to its nearest neighbour (makes graphs & cycles)
  function crossLink(now) {
    const a = pick(objs);
    if (!a || a.dying) return;
    let best = null, bd = 90 * 90;
    for (const b of objs) {
      if (b === a || b.dying) continue;
      const dx = b.x - a.x, dy = b.y - a.y, d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = b; }
    }
    if (best) a.refs.push({ to: best, ttl: now + refLife(a) });
  }

  function physics(dt, speed, now) {
    const k = 1.1;
    const springs = n => {
      for (const r of n.refs) {
        const b = r.to, dx = b.x - n.x, dy = b.y - n.y, d = Math.hypot(dx, dy) || 1;
        const f = (d - REST) * k * dt / d;
        b.vx -= dx * f; b.vy -= dy * f;
        if (!n.root) { n.vx += dx * f; n.vy += dy * f; }
      }
    };
    roots.forEach(springs);
    objs.forEach(springs);

    for (let i = 0; i < objs.length; i++) {
      const a = objs[i];
      for (let j = i + 1; j < objs.length; j++) {
        const b = objs[j], dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy;
        if (d2 > 26 * 26 || d2 === 0) continue;
        const d = Math.sqrt(d2), f = (26 - d) * 5 * dt / d;
        a.vx -= dx * f; a.vy -= dy * f; b.vx += dx * f; b.vy += dy * f;
      }
    }

    const damp = Math.exp(-2.2 * dt), m = 40;
    for (const o of objs) {
      o.vx += rnd(-18, 18) * dt;
      o.vy += rnd(-18, 18) * dt;
      if (o.x < m) o.vx += (m - o.x) * 3 * dt; else if (o.x > W - m) o.vx -= (o.x - W + m) * 3 * dt;
      if (o.y < m) o.vy += (m - o.y) * 3 * dt; else if (o.y > H - m) o.vy -= (o.y - H + m) * 3 * dt;
      o.vx *= damp; o.vy *= damp;
      const v = Math.hypot(o.vx, o.vy);
      if (v > 42) { o.vx *= 42 / v; o.vy *= 42 / v; }
      o.x += o.vx * dt * speed;
      o.y += o.vy * dt * speed;
    }

    for (const r of roots) {
      r.x += r.vx * dt * speed;
      r.y += r.vy * dt * speed;
      if (r.x < W * .08 || r.x > W * .92) r.vx = -r.vx;
      if (r.y < H * .1 || r.y > H * .9) r.vy = -r.vy;
      r.x = Math.min(Math.max(r.x, W * .08), W * .92);
      r.y = Math.min(Math.max(r.y, H * .1), H * .9);
    }

    for (let i = frags.length - 1; i >= 0; i--) {
      const f = frags[i];
      if (now - f.born > 700) { frags.splice(i, 1); continue; }
      f.x += f.vx * dt; f.y += f.vy * dt;
      f.vx *= damp; f.vy *= damp;
    }
  }

  function setStopped(stw) {
    document.documentElement.dataset.gc = stw ? 'stw' : '';
    stateEl.textContent = stw ? 'Stop-the-world' : 'Running';
  }

  function startGC(now, cause) {
    gcCount++;
    const mixed = gcCount % 4 === 0;
    for (const o of objs) { o.depth = -1; o.swept = false; }

    const edges = [];
    let frontier = [];
    const visit = (from, o, depth) => {
      if (o.depth >= 0 || o.dying) return;
      o.depth = depth;
      edges.push({ from, to: o, depth, at: 0 });
      frontier.push(o);
    };
    for (const r of roots) for (const ref of r.refs) visit(r, ref.to, 0);
    if (pointer.on) for (const o of objs) if (near(o, pointer, REACH)) visit(pointer, o, 0);

    let depth = 0;
    while (frontier.length) {
      const level = frontier;
      frontier = [];
      depth++;
      for (const o of level) for (const ref of o.refs) visit(o, ref.to, depth);
    }

    const step = Math.min(110, MARK_MAX / Math.max(depth, 1));
    for (const o of objs) if (o.depth >= 0) o.markAt = now + o.depth * step;
    for (const e of edges) e.at = now + e.depth * step;

    gc = {
      id: gcCount, cause, mixed, edges, x: -20,
      before: objs.length, marked: edges.length, freed: 0, promoted: 0,
      markEnd: now + depth * step + 250,
    };
    phase = 'mark';
    setStopped(true);
  }

  function sweepOne(o, now) {
    o.swept = true;
    if (o.dying) return;
    if (o.depth >= 0) {
      if (++o.age === OLD_AGE) { o.promoted = now; gc.promoted++; }
    } else if (o.age < OLD_AGE || gc.mixed) {
      o.dying = now;
      gc.freed++;
      for (let i = 0; i < 3; i++) frags.push({ x: o.x, y: o.y, vx: rnd(-40, 40), vy: rnd(-40, 40), born: now });
    }
  }

  function finishGC(now) {
    for (const o of objs) if (!o.swept) sweepOne(o, now);
    const after = gc.before - gc.freed;
    const ms = (.6 + gc.marked * .018 + rnd(0, .7)).toFixed(3);
    log(`${stamp(now)} GC(${gc.id}) Pause Young (${gc.mixed ? 'Mixed' : 'Normal'}) (${gc.cause}) ${gc.before}->${after}(${cap}) ${ms}ms`);
    lastGC = now;
    gc = null;
    phase = 'run';
    setStopped(false);
  }

  function log(line) {
    const li = document.createElement('li');
    li.textContent = line;
    logEl.append(li);
    while (logEl.children.length > 4) logEl.firstChild.remove();
  }

  function updateStat() {
    if (show) {
      statEl.innerHTML = `heap dump &middot; <span class="o">${show.parts.length} objects</span> &middot; hatsune_miku.hprof`;
      return;
    }
    let old = 0;
    for (const o of objs) if (o.age >= OLD_AGE && !o.dying) old++;
    const live = objs.filter(o => !o.dying).length;
    statEl.innerHTML = `heap <span class="y">${live}</span>/${cap} &middot; young ${live - old} &middot; <span class="o">old ${old}</span> &middot; gc ${gcCount}`;
  }

  /* ----- full GC: compact the heap into a dot-matrix Miku ----- */

  // where the figure goes: centre stage (a little left of the GC log on wide screens).
  // s is px per grid unit; z scales dot sizes gently with it.
  function mikuLayout() {
    let s, x0, y0;
    if (W >= 900) {
      s = Math.min(5.2, H * .74 / MIKU.h, W * .42 / MIKU.w);
      x0 = W * .45 - MIKU.w * s / 2; y0 = Math.max(40, H * .44 - MIKU.h * s / 2);
    } else {
      s = Math.min((W - 24) / MIKU.w, H * .64 / MIKU.h);
      x0 = (W - MIKU.w * s) / 2; y0 = Math.max(48, H * .48 - MIKU.h * s / 2);
    }
    return { s, x0, y0, z: Math.max(.75, Math.min(1.25, s / 4.4)) };
  }

  function startShow(now) {
    const live = objs.filter(o => !o.dying);
    const order = MIKU.px.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [order[i], order[j]] = [order[j], order[i]]; }
    const owner = [];
    live.forEach((o, i) => { if (i < order.length) owner[order[i]] = o; });

    // every live object is moved into the picture; the rest of the points are
    // copies spawned from random live objects, so the figure pours out of the heap.
    // parts stay in MIKU.px order so MIKU.links can index them.
    const parts = MIKU.px.map((p, i) => {
      const o = owner[i] || null;
      const src = o || (live.length ? pick(live) : { x: rnd(0, W), y: rnd(0, H) });
      const isOld = o && o.age >= OLD_AGE;
      return {
        p, obj: o,
        sx: src.x + (o ? 0 : rnd(-6, 6)), sy: src.y + (o ? 0 : rnd(-6, 6)),
        col0: isOld ? 'old' : 'fg', r0: isOld ? 2.5 : 1.7,
        delay: p.y / MIKU.h * 450 + rnd(0, 350),
        x: src.x, y: src.y, k: 0, ox: 0, oy: 0, hit: 0, back: 0,
      };
    });

    gcCount++;
    show = {
      id: gcCount, before: live.length, parts, notes: [], noteAt: 0, x: -20,
      start: now, holdAt: now + FORM + 800, wipeAt: now + FORM + 800 + HOLD, held: false, wiped: false,
    };
    phase = 'show';
    setStopped(true);
    stateEl.textContent = 'Full GC';
    document.documentElement.dataset.show = '';
    log(`${stamp(now)} GC(${gcCount}) Pause Full (System.gc()) compacting…`);
  }

  function updateShow(now, dt) {
    const S = show, L = mikuLayout(), t = now / 1000;
    const bob = Math.sin(t * 1.6) * 3 * L.z;
    const wiping = now >= S.wipeAt;
    if (wiping) S.x = ease(clamp01((now - S.wipeAt) / WIPE)) * (W + 40) - 20;
    const relax = Math.exp(-3 * dt);

    for (const q of S.parts) {
      // twin-tails sway, stronger towards the tips
      const sway = q.p.sway ? Math.sin(t * 2.1 - q.p.sway * 3.4) * q.p.sway * 15 * L.z : 0;
      const tx = L.x0 + (q.p.x + .5) * L.s + sway + q.ox;
      const ty = L.y0 + (q.p.y + .5) * L.s + bob + q.oy;
      q.k = ease(clamp01((now - S.start - q.delay) / FORM));

      if (!q.hit) {
        q.x = q.sx + (tx - q.sx) * q.k;
        q.y = q.sy + (ty - q.sy) * q.k;
        if (pointer.on && q.k === 1) {   // the pointer nudges dots aside
          const dx = q.x - pointer.x, dy = q.y - pointer.y, d2 = dx * dx + dy * dy;
          if (d2 < 80 * 80) {
            const d = Math.sqrt(d2) || 1, f = (80 - d) * 6 * dt / d;
            q.ox += dx * f; q.oy += dy * f;
          }
        }
        if (wiping && q.x <= S.x) {
          q.hit = now; q.bx = q.x; q.by = q.y;
          if (!q.obj && Math.random() < .3) frags.push({ x: q.x, y: q.y, vx: rnd(-40, 40), vy: rnd(-40, 40), born: now });
        }
      } else if (q.obj) {   // real objects go back where they came from
        q.back = ease(clamp01((now - q.hit) / RETURN));
        q.x = q.bx + (q.obj.x - q.bx) * q.back;
        q.y = q.by + (q.obj.y - q.by) * q.back;
      }
      q.ox *= relax; q.oy *= relax;
    }

    // music notes drifting off the figure
    if (now >= S.holdAt - 500 && !wiping && now >= S.noteAt) {
      S.noteAt = now + rnd(300, 600);
      S.notes.push({
        x: L.x0 + rnd(.1, .9) * MIKU.w * L.s, y: L.y0 + rnd(.05, .45) * MIKU.h * L.s,
        born: now, ch: Math.random() < .5 ? '♪' : '♫', col: Math.random() < .5 ? RGB.accent : RGB.old,
        phase: rnd(0, 6), size: rnd(.9, 1.4),
      });
    }
    S.notes = S.notes.filter(n => now - n.born < 2600);
    for (const n of S.notes) n.y -= 26 * dt;

    if (!S.held && now >= S.holdAt) {
      S.held = true;
      stateEl.textContent = 'Heap dump ♪';
      log(`${stamp(now)} Heap dump file created [hatsune_miku.hprof, 39393 bytes in 0.039 secs]`);
    }
    if (!S.wiped && wiping) { S.wiped = true; stateEl.textContent = 'Full GC'; }
    if (now >= S.wipeAt + WIPE + RETURN) finishShow(now);
  }

  function finishShow(now) {
    log(`${stamp(now)} GC(${show.id}) Pause Full (System.gc()) ${show.parts.length}->${show.before}(${cap}) 39.390ms`);
    show = null;
    phase = 'run';
    lastGC = now;
    nextShow = now + EVERY;
    setStopped(false);
    delete document.documentElement.dataset.show;
  }

  function step(now, dt) {
    if (phase === 'show') {
      updateShow(now, dt);
      physics(dt, 0, now);   // the heap itself is frozen while it's on display
      if (now - statAt > 250) { statAt = now; updateStat(); }
      return;
    }
    if (phase === 'run' && (wantShow || now >= nextShow)) {
      wantShow = false;
      startShow(now);
      return;
    }

    if (phase === 'run') {
      allocDebt = Math.min(allocDebt + dt * cap / 7, 3);
      while (allocDebt >= 1 && objs.length < cap) { alloc(pickParent(), now); allocDebt--; }
      if (Math.random() < dt * 3) crossLink(now);

      for (const n of roots) n.refs = n.refs.filter(r => r.ttl > now);
      for (const n of objs) n.refs = n.refs.filter(r => r.ttl > now);

      if (objs.length >= cap) startGC(now, 'G1 Evacuation Pause');
      else if (now - lastGC > PERIOD) startGC(now, 'G1 Periodic Collection');
    } else {
      if (phase === 'mark' && now >= gc.markEnd) phase = 'sweep';
      if (phase === 'sweep') {
        const p = Math.min(1, (now - gc.markEnd) / SWEEP);
        const e = p < .5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
        gc.x = e * (W + 40) - 20;
        for (const o of objs) if (!o.swept && o.x <= gc.x) sweepOne(o, now);
        if (p >= 1) finishGC(now);
      }
    }

    // reclaim freed objects once they've faded
    let reclaimed = false;
    for (const o of objs) if (o.dying && now - o.dying > FADE) { o.dead = true; reclaimed = true; }
    if (reclaimed) {
      objs = objs.filter(o => !o.dead);
      for (const n of roots) n.refs = n.refs.filter(r => !r.to.dead);
      for (const n of objs) n.refs = n.refs.filter(r => !r.to.dead);
    }

    physics(dt, phase === 'run' ? 1 : .12, now);   // mutators (nearly) freeze during a pause

    if (now - statAt > 250) { statAt = now; updateStat(); }
  }

  function drawRoot(x, y, s, a = .85) {
    ctx.beginPath();
    ctx.moveTo(x, y - s); ctx.lineTo(x + s, y); ctx.lineTo(x, y + s); ctx.lineTo(x - s, y); ctx.closePath();
    ctx.fillStyle = BG; ctx.fill();
    ctx.strokeStyle = `rgba(${RGB.accent},${a})`; ctx.stroke();
  }

  function drawFrags(now) {
    for (const f of frags) {
      const k = (now - f.born) / 700;
      ctx.fillStyle = `rgba(${RGB.accent},${.8 * (1 - k)})`;
      ctx.fillRect(f.x - .75, f.y - .75, 1.5, 1.5);
    }
  }

  function drawSweep(x) {
    const g = ctx.createLinearGradient(x - 140, 0, x, 0);
    g.addColorStop(0, `rgba(${RGB.accent},0)`);
    g.addColorStop(1, `rgba(${RGB.accent},.07)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - 140, 0, 140, H);
    ctx.fillStyle = `rgba(${RGB.accent},.75)`;
    ctx.fillRect(x, 0, 1, H);
  }

  function drawShow(now) {
    const S = show, L = mikuLayout(), t = now / 1000;
    const R = { o: 2.2, b: 1.9, f: 1.4 }, A = { o: 1, b: .85, f: .5 };
    for (const n of roots) drawRoot(n.x, n.y, 4.5, .35);

    // outline threads between neighbouring points, faded in as the figure settles
    const paths = {};
    for (const [i, j] of MIKU.links) {
      const p = S.parts[i], q = S.parts[j];
      if (p.hit || q.hit) continue;
      const v = Math.min(p.k, q.k);
      if (v < .6) continue;
      const key = p.p.key + ((v - .6) * 5 | 0);
      (paths[key] ||= { c: p.p.c, a: .3 * ((v - .6) * 5 | 0) / 2, pts: [] }).pts.push(p, q);
    }
    for (const k in paths) {
      const { c, a, pts } = paths[k];
      ctx.strokeStyle = `rgba(${c},${a || .1})`;
      ctx.beginPath();
      for (let i = 0; i < pts.length; i += 2) { ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[i + 1].x, pts[i + 1].y); }
      ctx.stroke();
    }

    for (const q of S.parts) {
      const dotR = R[q.p.kind] * L.z;
      let r = q.r0 + (dotR - q.r0) * q.k;
      let a = .62 + (A[q.p.kind] - .62) * q.k;
      let col = q.k === 1 ? q.p.c.join() : mix(COL[q.col0], q.p.c, q.k);
      if (q.hit) {
        if (q.obj) {
          col = mix(q.p.c, COL[q.col0], q.back);
          r = dotR + (q.r0 - dotR) * q.back;
          a = A[q.p.kind] + (.62 - A[q.p.kind]) * q.back;
        } else {
          const k = (now - q.hit) / FADE;
          if (k >= 1) continue;
          a *= 1 - k; r *= 1 + k * .8;
        }
      } else if (q.k === 1) {
        a *= .86 + .14 * Math.sin(t * 3 + q.p.x * .7 + q.p.y * .45);   // twinkle
      }
      ctx.fillStyle = `rgba(${col},${a})`;
      ctx.beginPath(); ctx.arc(q.x, q.y, r, 0, Math.PI * 2); ctx.fill();
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const n of S.notes) {
      const k = (now - n.born) / 2600;
      ctx.fillStyle = `rgba(${n.col},${Math.sin(k * Math.PI) * .9})`;
      ctx.font = `${Math.round(18 * L.z * n.size)}px "Segoe UI Symbol", "Apple Symbols", sans-serif`;
      ctx.fillText(n.ch, n.x + Math.sin(t * 2 + n.phase) * 8, n.y);
    }

    if (S.held && !S.wiped) {
      const a = clamp01((now - S.holdAt) / 600);
      const cx = L.x0 + MIKU.w * L.s / 2;
      // below the figure on wide screens; above it on narrow ones, where the GC log sits underneath
      let y = W >= 900 ? L.y0 + MIKU.h * L.s + 20 : L.y0 - 52;
      if (y + 20 > H) y = L.y0 - 52;
      ctx.font = '500 12px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillStyle = `rgba(${RGB.fg},${.9 * a})`;
      ctx.fillText('♪ 初音ミク · HATSUNE MIKU', cx, y);
      ctx.font = '400 10.5px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillStyle = `rgba(${RGB.accent},${.7 * a})`;
      ctx.fillText('heap dump → hatsune_miku.hprof', cx, y + 18);
      ctx.font = '400 9.5px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillStyle = `rgba(${RGB.fg},${.35 * a})`;
      ctx.fillText('© Crypton Future Media, INC. www.piapro.net', cx, y + 34);
    }

    drawFrags(now);
    if (S.wiped) drawSweep(S.x);
  }

  function draw(now) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;
    if (show) { drawShow(now); return; }

    // references
    ctx.strokeStyle = `rgba(${RGB.fg},.075)`;
    ctx.beginPath();
    for (const n of objs) {
      if (n.dying) continue;
      for (const r of n.refs) { ctx.moveTo(n.x, n.y); ctx.lineTo(r.to.x, r.to.y); }
    }
    ctx.stroke();

    ctx.strokeStyle = `rgba(${RGB.accent},.16)`;
    ctx.beginPath();
    for (const n of roots) for (const r of n.refs) { ctx.moveTo(n.x, n.y); ctx.lineTo(r.to.x, r.to.y); }
    ctx.stroke();

    // the mark flood travelling along live references
    if (gc) {
      for (const e of gc.edges) {
        if (now < e.at) continue;
        const a = Math.max(.14, 1 - (now - e.at) / 650) * .6;
        ctx.strokeStyle = `rgba(${RGB.accent},${a})`;
        ctx.beginPath();
        ctx.moveTo(e.from.x, e.from.y);
        ctx.lineTo(e.to.x, e.to.y);
        ctx.stroke();
      }
    }

    // the pointer as a root
    if (pointer.on) {
      ctx.strokeStyle = `rgba(${RGB.accent},.22)`;
      ctx.beginPath();
      for (const o of objs) {
        if (o.dying || !near(o, pointer, REACH)) continue;
        ctx.moveTo(pointer.x, pointer.y);
        ctx.lineTo(o.x, o.y);
      }
      ctx.stroke();
      ctx.setLineDash([2, 6]);
      ctx.strokeStyle = `rgba(${RGB.accent},.18)`;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, REACH, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // objects
    const glow = gc ? 1 : Math.max(0, 1 - (now - lastGC) / 800);
    for (const o of objs) {
      const t = now - o.born;
      const isOld = o.age >= OLD_AGE;
      let a = Math.max(0, Math.min(1, t / 400)) * (isOld ? .9 : .62);
      let r = isOld ? 2.5 : 1.7;
      let col = isOld ? RGB.old : RGB.fg;
      let lit = 0;

      if (o.dying) {
        const k = Math.min(1, (now - o.dying) / FADE);
        a *= 1 - k; r *= 1 + k * 1.4; col = RGB.accent;
      } else if (o.depth >= 0 && glow > 0 && (!gc || now >= o.markAt)) {
        lit = glow;
      } else if (gc && o.depth < 0) {
        a *= .35;   // unreachable: about to go
      }

      if (lit) {
        ctx.fillStyle = `rgba(${RGB.accent},${.13 * lit})`;
        ctx.beginPath(); ctx.arc(o.x, o.y, r * 3.6, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = `rgba(${lit > .5 ? RGB.accent : col},${a})`;
      ctx.beginPath(); ctx.arc(o.x, o.y, r, 0, Math.PI * 2); ctx.fill();

      if (t >= 0 && t < 600) {   // allocation blip
        const k = t / 600;
        ctx.strokeStyle = `rgba(${RGB.fg},${.28 * (1 - k)})`;
        ctx.beginPath(); ctx.arc(o.x, o.y, r + k * 9, 0, Math.PI * 2); ctx.stroke();
      }
      if (o.promoted && now - o.promoted < 900) {   // tenured
        const k = (now - o.promoted) / 900;
        ctx.strokeStyle = `rgba(${RGB.old},${.7 * (1 - k)})`;
        ctx.beginPath(); ctx.arc(o.x, o.y, r + 2 + k * 14, 0, Math.PI * 2); ctx.stroke();
      }
    }

    for (const n of roots) drawRoot(n.x, n.y, 4.5);
    if (pointer.on) drawRoot(pointer.x, pointer.y, 5);

    drawFrags(now);
    if (phase === 'sweep') drawSweep(gc.x);
  }

  function resize() {
    W = innerWidth; H = innerHeight;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    cap = Math.max(70, Math.min(260, Math.round(W * H / 6500)));
    for (const n of [...roots, ...objs]) {
      n.x = Math.min(Math.max(n.x, 0), W);
      n.y = Math.min(Math.max(n.y, 0), H);
    }
  }

  function seed(now) {
    roots = Array.from({ length: W < 700 ? 3 : 5 }, makeRoot);
    for (let i = 0; i < cap * .55; i++) {
      const o = alloc(pickParent(), now);
      o.born = now + rnd(0, 1200);
      o.age = Math.random() < .22 ? OLD_AGE : Math.random() * OLD_AGE | 0;
    }
    for (let i = 0; i < 200; i++) physics(.03, 1, now);   // settle before first paint
    lastGC = now;
  }

  const setPointer = e => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.on = true; };
  const clearPointer = () => { pointer.on = false; };
  addEventListener('pointermove', setPointer, { passive: true });
  addEventListener('pointerdown', setPointer, { passive: true });
  addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') clearPointer(); });
  addEventListener('pointercancel', clearPointer);
  document.addEventListener('pointerleave', clearPointer);
  addEventListener('blur', clearPointer);

  resize();
  seed(performance.now());

  let requestShow = () => { if (!show) wantShow = true; };

  if (reduceMotion) {
    // one still frame: the heap, but nothing moves; System.gc() toggles a still Miku
    let mikuUp = false;
    const still = () => {
      for (const o of objs) o.born = -1e9;
      if (mikuUp) {
        const L = mikuLayout();
        show = {
          parts: MIKU.px.map(p => ({ p, k: 1, hit: 0, r0: 1.7, col0: 'fg', x: L.x0 + (p.x + .5) * L.s, y: L.y0 + (p.y + .5) * L.s })),
          notes: [], held: true, wiped: false, holdAt: -Infinity,
        };
      }
      draw(performance.now());
      show = null;
    };
    requestShow = () => { mikuUp = !mikuUp; still(); };
    document.addEventListener('themechange', still);
    still();
    addEventListener('resize', () => { resize(); still(); });
    stateEl.textContent = 'Paused';
    updateStat();
    log('[gc] animation paused (prefers-reduced-motion)');
  } else {
    addEventListener('resize', resize);
    let last = performance.now();
    const frame = now => {
      const dt = Math.min(.05, (now - last) / 1000);
      last = now;
      step(now, dt);
      draw(now);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  document.getElementById('fullGC').addEventListener('click', () => requestShow());
  let typed = '';
  addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-4);
    if (typed.endsWith('39') || typed === 'miku') { typed = ''; requestShow(); }
  });
}
