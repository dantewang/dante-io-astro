/**
 * Site settings that live in astro.config.mjs.
 *
 * Astro's own config has no place for site content, so this tiny integration
 * takes the options, checks them, and exposes them to pages as
 * `import site from 'virtual:site-config'`. Editing them in astro.config.mjs
 * restarts the dev server and rebuilds as usual.
 *
 * Text fields accept a little inline markup:
 *   **text**     highlighted (full-strength foreground)
 *   ==text==     accent colour (Miku teal)
 *   [text](url)  link
 *
 * @typedef {{ label: string, url: string, note?: string, newTab?: boolean }} SiteLink
 * @typedef {{ intro: string, pageSize: number, timezone: string }} BlogConfig
 * @typedef {{ links: SiteLink[], tagline: string, blog: BlogConfig }} SiteConfig
 */

const VIRTUAL_ID = 'virtual:site-config';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

/** @param {SiteConfig} options @returns {import('astro').AstroIntegration} */
export default function siteConfig(options) {
  const config = validate(options);
  return {
    name: 'dante-site-config',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [{
              name: 'dante-site-config',
              resolveId: id => (id === VIRTUAL_ID ? RESOLVED_ID : undefined),
              load: id => (id === RESOLVED_ID ? `export default ${JSON.stringify(config)};` : undefined),
            }],
          },
        });
      },
    },
  };
}

/** @param {any} o @returns {SiteConfig} */
function validate(o) {
  const fail = msg => { throw new Error(`[site-config] ${msg} (see astro.config.mjs)`); };

  if (!Array.isArray(o?.links)) fail('`links` must be an array');
  o.links.forEach((l, i) => {
    if (typeof l?.label !== 'string' || !l.label) fail(`links[${i}].label must be a non-empty string`);
    if (typeof l.url !== 'string' || !/^(https?:\/\/|\/|mailto:)/i.test(l.url)) fail(`links[${i}].url must start with http(s)://, / or mailto:`);
  });
  if (typeof o.tagline !== 'string') fail('`tagline` must be a string');

  const blog = o.blog ?? {};
  if (typeof blog.intro !== 'string') fail('`blog.intro` must be a string');
  const pageSize = blog.pageSize ?? 10;
  if (!Number.isInteger(pageSize) || pageSize < 1) fail('`blog.pageSize` must be a positive integer');
  const timezone = blog.timezone ?? 'Asia/Shanghai';
  try { new Intl.DateTimeFormat('en', { timeZone: timezone }); } catch { fail(`\`blog.timezone\` "${timezone}" is not a valid IANA time zone`); }

  return { links: o.links, tagline: o.tagline, blog: { intro: blog.intro, pageSize, timezone } };
}
