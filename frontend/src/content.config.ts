import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Insights — real, published articles (canonical on psiberai.com).
 * Drop one Markdown file per article in src/content/insights/. The filename
 * (minus .md) is the URL slug: src/content/insights/<slug>.md → /insights/<slug>.
 * `linkedin` is the "first published on LinkedIn →" backlink; `draft: true`
 * keeps a piece out of the published list + off the build until it's ready.
 */
const insights = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['pqc', 'compliance', 'research']),
    pubDate: z.coerce.date(),
    author: z.string().default('psiberAI'),
    linkedin: z.string().url().nullish(),
    readMinutes: z.number().nullish(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { insights };
