// Blog behaviour. All optional sugar: pages read fine without it.
import './theme.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== index: a quiet echo of the cover's heap — drifting objects and
   references, no collector, no show. Pauses when off screen. ===== */
{
  const canvas = document.querySelector('.ambient');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = 1, dots = [], C = {}, visible = true;
    const palette = () => {
      const css = getComputedStyle(document.documentElement);
      for (const k of ['fg', 'accent', 'old']) C[k] = css.getPropertyValue('--c-' + k).trim();
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      const n = Math.round(Math.min(70, W * H / 9000));
      while (dots.length < n) {
        const roll = Math.random();
        dots.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - .5) * 10, vy: (Math.random() - .5) * 10,
          kind: roll < .06 ? 'root' : roll < .26 ? 'old' : 'young',
        });
      }
      dots.length = n;
    };
    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) for (let j = i + 1; j < dots.length; j++) {
        const a = dots[i], b = dots[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > 110) continue;
        const root = a.kind === 'root' || b.kind === 'root';
        ctx.strokeStyle = `rgba(${root ? C.accent : C.fg},${(1 - d / 110) * (root ? .3 : .12)})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      for (const d of dots) {
        if (d.kind === 'root') {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y - 4.5); ctx.lineTo(d.x + 4.5, d.y); ctx.lineTo(d.x, d.y + 4.5); ctx.lineTo(d.x - 4.5, d.y); ctx.closePath();
          ctx.strokeStyle = `rgba(${C.accent},.85)`; ctx.stroke();
        } else {
          ctx.fillStyle = d.kind === 'old' ? `rgba(${C.old},.85)` : `rgba(${C.fg},.55)`;
          ctx.beginPath(); ctx.arc(d.x, d.y, d.kind === 'old' ? 2.3 : 1.6, 0, Math.PI * 2); ctx.fill();
        }
      }
    };
    let last = performance.now();
    const frame = now => {
      const dt = Math.min(.05, (now - last) / 1000);
      last = now;
      if (visible) {
        for (const d of dots) {
          d.x += d.vx * dt; d.y += d.vy * dt;
          if (d.x < 0 || d.x > W) d.vx *= -1;
          if (d.y < 0 || d.y > H) d.vy *= -1;
        }
        draw();
      }
      requestAnimationFrame(frame);
    };
    palette();
    resize();
    draw();
    addEventListener('resize', () => { resize(); draw(); });
    document.addEventListener('themechange', () => { palette(); draw(); });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
    if (!reduceMotion) requestAnimationFrame(frame);
  }
}

/* ===== article: reading progress + table of contents ===== */
{
  const article = document.querySelector('.prose');
  if (article) {
    const root = document.documentElement;
    const onScroll = () => {
      const r = article.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
      root.style.setProperty('--p', p.toFixed(4));
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();

    const links = new Map([...document.querySelectorAll('.toc a')].map(a => [a.hash.slice(1), a]));
    if (links.size) {
      const heads = [...article.querySelectorAll('h2[id]:not(.sr-only)')];
      const mark = () => {
        let current = heads[0];
        for (const h of heads) if (h.getBoundingClientRect().top < innerHeight * .3) current = h;
        links.forEach(a => a.classList.remove('active'));
        links.get(current.id)?.classList.add('active');
      };
      addEventListener('scroll', mark, { passive: true });
      mark();
    }
  }
}
