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
  vite: {
    // @keystatic/astro imports the `astro:env/server` virtual module; keep Vite
    // from trying to esbuild-prebundle it (which can't resolve that import) so
    // Astro's own plugin resolves it at request/build time.
    optimizeDeps: { exclude: ['@keystatic/astro'] },
  },
});
