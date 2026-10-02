// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkCjkFriendly from 'remark-cjk-friendly';
import remarkCjk from './src/lib/remark-cjk.mjs';
import siteConfig from './src/integrations/site-config.mjs';

export default defineConfig({
  site: 'https://dante.io',

  integrations: [
    siteConfig({
      // The list on the cover page (labels are shown in capitals) and the
      // blog's top navigation. External links open in a new tab unless
      // `newTab: false`; site paths like /blog/ open in place.
      links: [
        { label: 'Blog', url: '/blog/', note: 'long-form notes, mostly the JVM' },
        { label: 'Memos', url: 'https://memos.dante.io', note: 'notes, thoughts & fragments' },
        { label: 'GitHub', url: 'https://github.com/dantewang', note: 'code & experiments' },
      ],

      // The paragraph under HELLO I'M DANTE.
      // **text** = highlighted, ==text== = accent (Miku teal), [text](url) = link.
      //   is a non-breaking space, keeping "Hatsune Miku" on one line.
      tagline:
        'Fifteen years on the JVM. I **tune collectors**, **chase latency**, ' +
        'and build the **infrastructure** other Java code quietly stands on. ' +
        'Off the heap, a devoted Hatsune ==Miku== fan.',

      blog: {
        // The paragraph under BLOG on the blog's front page (same markup).
        intro:
          '不定时的碎碎念',
        // Posts per list page (the blog index and each tag).
        pageSize: 5,
        // Dates are shown in this time zone; build machines run in UTC.
        timezone: 'Asia/Shanghai',
      },
    }),
    sitemap(),
  ],

  markdown: {
    // remark/rehype pipeline, for the CJK fixes (Astro 7's default processor has no remark plugins)
    processor: unified({
      remarkPlugins: [remarkCjkFriendly, remarkCjk],
      remarkRehype: { footnoteLabel: '脚注', footnoteBackLabel: '返回正文' },
    }),
    shikiConfig: {
      // both palettes are emitted as CSS variables; blog.css picks one per theme
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
      defaultColor: false,
    },
  },
});
