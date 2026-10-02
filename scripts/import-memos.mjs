#!/usr/bin/env node
// Import public memos as blog posts (Markdown in src/content/blog).
//
//   node scripts/import-memos.mjs [--base https://memos.dante.io] [--tz Asia/Shanghai] [--force]
//
// - Only PUBLIC, non-archived memos are read; no token is needed.
// - The first "# heading" becomes the title (else the first sentence).
// - The trailing line of #tags is removed; tags go to frontmatter, minus
//   the management-only #blog tag.
// - Dates are the memo's createTime, written in the given time zone, which
//   is what the Memos web UI shows.
// - Files are named <date>-<memo id>.md. Rename them freely: a memo is
//   recognised by the `memo:` field, so it's never imported twice. Existing
//   posts are left alone unless --force is given.

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : fallback; };
const BASE = opt('--base', 'https://memos.dante.io').replace(/\/$/, '');
const TZ = opt('--tz', 'Asia/Shanghai');
const FORCE = args.includes('--force');
const OUT = join(import.meta.dirname, '..', 'src', 'content', 'blog');
const IGNORED_TAGS = new Set(['blog']);

async function fetchMemos() {
  const memos = [];
  let token = '';
  do {
    const url = `${BASE}/api/v1/memos?pageSize=100${token ? `&pageToken=${encodeURIComponent(token)}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    const body = await res.json();
    memos.push(...(body.memos ?? []));
    token = body.nextPageToken ?? '';
  } while (token);
  return memos.filter(m => m.visibility === 'PUBLIC' && m.state === 'NORMAL');
}

/** ISO timestamp with the zone's offset, e.g. 2025-12-16T00:19:03+08:00 */
function zoned(iso) {
  const d = new Date(iso);
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'longOffset',
  }).formatToParts(d).map(p => [p.type, p.value]));
  const offset = parts.timeZoneName.replace('GMT', '') || '+00:00';
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}${offset}`;
}

function convert(memo) {
  let lines = memo.content.replace(/\r\n/g, '\n').split('\n');

  // trailing tag line(s), e.g. "#java #osgi"
  const isTagLine = l => /^\s*(#[^\s#]+\s*)+$/.test(l);
  while (lines.length && (lines.at(-1).trim() === '' || isTagLine(lines.at(-1)))) lines.pop();

  // title: a leading "# heading", else the first sentence
  let title;
  const first = lines.findIndex(l => l.trim() !== '');
  if (first >= 0 && /^#\s+/.test(lines[first])) {
    title = lines[first].replace(/^#\s+/, '').trim();
    lines.splice(0, first + 1);
  } else {
    const text = lines.join(' ').replace(/`/g, '').replace(/\s+/g, ' ').trim();
    title = text.split(/[。！？.!?，,：:]/)[0].trim().slice(0, 60);
  }
  while (lines.length && lines[0].trim() === '') lines.shift();

  const body = lines.join('\n').trimEnd() + '\n';
  const tags = (memo.tags ?? []).filter(t => !IGNORED_TAGS.has(t.toLowerCase()));
  const han = (body.match(/\p{Script=Han}/gu) ?? []).length;
  const lang = han / Math.max(1, body.replace(/\s/g, '').length) < .05 ? 'en' : 'zh-CN';
  const date = zoned(memo.createTime);
  const updated = memo.updateTime && new Date(memo.updateTime) - new Date(memo.createTime) > 60_000 ? zoned(memo.updateTime) : null;

  const fm = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `date: ${date}`,
    updated && `updated: ${updated}`,
    `tags: [${tags.map(t => JSON.stringify(t)).join(', ')}]`,
    lang !== 'zh-CN' && `lang: ${lang}`,
    `memo: ${memo.name}`,
    '---',
  ].filter(Boolean).join('\n') + '\n';
  return { id: memo.name.split('/').pop(), date, text: fm + body };
}

async function existingByMemo() {
  const map = new Map();
  let files = [];
  try { files = (await readdir(OUT)).filter(f => f.endsWith('.md')); } catch {}
  for (const f of files) {
    const m = (await readFile(join(OUT, f), 'utf8')).match(/^memo:\s*(\S+)\s*$/m);
    if (m) map.set(m[1], f);
  }
  return map;
}

const memos = await fetchMemos();
const existing = await existingByMemo();
await mkdir(OUT, { recursive: true });
let written = 0;
for (const memo of memos) {
  const { id, date, text } = convert(memo);
  const file = existing.get(memo.name) ?? `${date.slice(0, 10)}-${id}.md`;
  if (existing.has(memo.name) && !FORCE) { console.log(`skip   ${file} (exists)`); continue; }
  await writeFile(join(OUT, file), text);
  written++;
  console.log(`write  ${file}`);
}
console.log(`${memos.length} public memos, ${written} written`);
