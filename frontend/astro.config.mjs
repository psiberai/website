// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://psiberai.com',
  // All marketing/blog pages prerender to static HTML. Only Keystatic's own
  // /keystatic + /api/keystatic routes are server-rendered (Cloudflare Pages
  // Functions via the adapter) so a non-technical editor can edit in-browser.
  integrations: [sitemap(), react(), keystatic()],
  adapter: cloudflare(),
  build: {
    inlineStylesheets: 'auto',
  },
});
