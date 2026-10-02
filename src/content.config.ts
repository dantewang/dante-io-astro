import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per post in src/content/blog; the file name is the URL slug.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    /** publish time; write it with an offset, e.g. 2025-12-16T00:19:03+08:00 */
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** shown in lists and feeds; defaults to the start of the post */
    description: z.string().optional(),
    /** language of the post body, for typography and screen readers */
    lang: z.string().default('zh-CN'),
    draft: z.boolean().default(false),
    /** the memo this post was imported from, e.g. memos/XUtabPpznNo7gCGaFVMHSU */
    memo: z.string().optional(),
  }),
});

export const collections = { blog };
