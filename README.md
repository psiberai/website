# psiberai/website

The public site for **psiberAI** — post-quantum & compliance readiness for regulated enterprises.

Built with [Astro](https://astro.build) (static output). Source of truth is this repo; the site deploys via GitHub Actions to the origin VPS and is served behind Cloudflare.

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output → dist/
npm run preview    # serve the built dist/ locally
```

## Structure

- `src/layouts/Base.astro` — shared head (meta, JSON-LD, fonts), Nav + Footer
- `src/components/` — Nav, Footer, ServiceCard, Cta
- `src/pages/` — the site pages (see the sitemap below)
- `src/styles/global.css` — the design system (IBM Plex + cool-slate/teal, light + dark)
- `public/` — static assets, `robots.txt`, `llms.txt`, favicon

## Sitemap

```
/                       Home
/services               Services overview
/services/pqc-migration PQC Migration (featured — the wedge)
/services/iso-27001     ISO 27001
/services/iso-42001     ISO 42001
/insights               Insights (blog index — Ghost plugs in here later)
/about                  About
/contact                Contact & book an assessment
/privacy                Privacy policy
```

## Conventions

- **One primary CTA everywhere**: *Book a PQC Assessment* → `/contact`.
- Content is static/Markdown for now (edited in git). Non-technical editing + newsletter arrive later via Ghost, mounted at the Insights seam.

## Deploy

`git push` to `main` → GitHub Actions builds and rsyncs `dist/` to the origin VPS. See `.github/workflows/deploy.yml`.
