import { config, collection, fields } from '@keystatic/core';

/**
 * Keystatic — the in-browser editor for the Insights blog.
 *
 * Storage = GitHub: edits are committed straight to this repo as Markdown, and
 * Cloudflare Pages rebuilds. No server, no database.
 *
 * `pathPrefix: 'frontend'` because the Astro app lives in the repo's frontend/
 * subdirectory — so a post at `src/content/insights/<slug>.md` below is written
 * to `frontend/src/content/insights/<slug>.md` in the repo, exactly where the
 * Astro content collection (src/content.config.ts) reads it.
 *
 * The schema MUST stay in sync with the zod schema in src/content.config.ts.
 */
export default config({
  storage: {
    kind: 'github',
    repo: 'psiberai/website',
    pathPrefix: 'frontend',
  },
  ui: {
    brand: { name: 'psiberAI Insights' },
  },
  collections: {
    insights: collection({
      label: 'Insights',
      slugField: 'title',
      path: 'src/content/insights/*',
      format: { contentField: 'content' },
      columns: ['title', 'pubDate'],
      schema: {
        title: fields.slug({
          name: { label: 'Title' },
          slug: {
            label: 'URL slug',
            description: 'The /insights/<slug> part of the address.',
          },
        }),
        description: fields.text({
          label: 'Summary',
          description: 'One or two lines shown in listings and search/meta.',
          multiline: true,
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Quantum Security & PQC', value: 'pqc' },
            { label: 'Compliance', value: 'compliance' },
            { label: 'Research & Policy', value: 'research' },
          ],
          defaultValue: 'pqc',
        }),
        pubDate: fields.date({ label: 'Publish date' }),
        author: fields.text({ label: 'Author', defaultValue: 'psiberAI' }),
        linkedin: fields.url({
          label: 'Original LinkedIn URL',
          description: 'Optional — adds a "first published on LinkedIn" link on the post.',
        }),
        readMinutes: fields.integer({
          label: 'Read time (minutes)',
          description: 'Optional.',
        }),
        draft: fields.checkbox({
          label: 'Draft',
          description: 'Keep this out of the published list and off the site.',
          defaultValue: false,
        }),
        content: fields.markdoc({
          label: 'Body',
          // Plain Markdown (.md) so Astro's built-in Markdown rendering reads it.
          extension: 'md',
          options: {
            image: {
              directory: 'public/insights-images',
              publicPath: '/insights-images/',
            },
          },
        }),
      },
    }),
  },
});
