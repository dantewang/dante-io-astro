// Theme switch, shared by every page. The initial theme is set before first
// paint by the inline script in <head> (see ThemeInit.astro); this wires up
// the buttons and tells canvases to re-read their palette via `themechange`.

const root = document.documentElement;
const buttons = document.querySelectorAll('.theme button');
const meta = document.querySelector('meta[name="theme-color"]');

const apply = t => {
  root.dataset.theme = t;
  buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.set === t)));
  if (meta) meta.content = getComputedStyle(root).getPropertyValue('--bg').trim();
  document.dispatchEvent(new Event('themechange'));
};

buttons.forEach(b => b.addEventListener('click', () => {
  if (b.dataset.set === root.dataset.theme) return;
  try { localStorage.setItem('theme', b.dataset.set); } catch {}
  apply(b.dataset.set);
}));

// follow the system until the visitor picks one
matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch {}
  if (!saved) apply(e.matches ? 'light' : 'dark');
});

apply(root.dataset.theme);
