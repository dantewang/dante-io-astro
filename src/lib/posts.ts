import { getCollection, type CollectionEntry } from 'astro:content';
import site from 'virtual:site-config';

export type Post = CollectionEntry<'blog'>;

/** published posts, newest first (drafts show up in `astro dev` only) */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }: Post) => import.meta.env.DEV || !data.draft);
  return posts.sort((a: Post, b: Post) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** split into pages of `blog.pageSize` (from astro.config.mjs); always at least one page */
export function paginate<T>(items: T[], size = site.blog.pageSize): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out.length ? out : [[]];
}

/** /blog/ for page 1, /blog/page/2/ after that (same scheme under each tag) */
export const pageUrl = (base: string, n: number) => (n <= 1 ? base : `${base}page/${n}/`);
export const tagUrl = (tag: string) => `/blog/tags/${encodeURIComponent(tag)}/`;
export const postUrl = (post: Post) => `/blog/${post.id}/`;

/** calendar parts in the configured time zone (build machines run in UTC) */
export function dateParts(d: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: site.blog.timezone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(d);
  const get = (t: string) => parts.find(p => p.type === t)!.value;
  return { year: get('year'), month: get('month'), day: get('day') };
}
export const isoDate = (d: Date) => { const p = dateParts(d); return `${p.year}-${p.month}-${p.day}`; };

const CJK_CHAR = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu;

/** rough reading time: ~400 汉字 or ~220 English words a minute, code skipped */
export function readingMinutes(body = '') {
  const text = body.replace(/```[\s\S]*?```/g, ' ');
  const cjk = text.match(CJK_CHAR)?.length ?? 0;
  const words = text.replace(CJK_CHAR, ' ').match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0;
  return Math.max(1, Math.round(cjk / 400 + words / 220));
}

/** frontmatter `description`, else the start of the body as plain text */
export function excerpt(post: Post, max = 110) {
  if (post.data.description) return post.data.description;
  const text = (post.body ?? '')
    .replace(/```[\s\S]*?```/g, ' ')            // code blocks
    .replace(/<[^>]+>/g, ' ')                    // html
    .replace(/^\s*\|.*$/gm, ' ')                 // tables
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '') // headings, quotes, list markers
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')        // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')     // links
    .replace(/[*_~`]+/g, '')                     // emphasis, inline code
    .replace(/\\(.)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  return [...text].length > max ? [...text].slice(0, max).join('').trimEnd() + '…' : text;
}

/** tags with counts, most used first */
export function tagCounts(posts: Post[]) {
  const counts = new Map<string, number>();
  for (const p of posts) for (const t of p.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts].map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
