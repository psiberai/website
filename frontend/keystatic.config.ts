import { config, collection, singleton, fields } from '@keystatic/core';

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
    pages: collection({
      label: 'Pages (About, etc.)',
      slugField: 'title',
      path: 'src/content/pages/*',
      format: { contentField: 'body' },
      columns: ['title'],
      schema: {
        title: fields.slug({
          name: {
            label: 'Internal name',
            description:
              'Identifies the page in code — DO NOT rename (e.g. "About" stays "About"), or the page will stop building.',
          },
        }),
        eyebrow: fields.text({ label: 'Eyebrow', description: 'Small label above the heading.' }),
        heading: fields.text({ label: 'Page heading' }),
        lead: fields.text({ label: 'Lead paragraph', multiline: true }),
        body: fields.markdoc({
          label: 'Body',
          extension: 'md',
          options: {
            image: { directory: 'public/page-images', publicPath: '/page-images/' },
          },
        }),
        ctaHeading: fields.text({ label: 'Call-to-action heading', description: 'Bottom band. Leave blank for the site default.' }),
        ctaBody: fields.text({ label: 'Call-to-action text', multiline: true, description: 'Leave blank for the site default.' }),
        ctaButton: fields.text({ label: 'Call-to-action button label', description: 'Leave blank for the site default.' }),
      },
    }),
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
  singletons: {
    site: singleton({
      label: 'Site settings (global: nav, footer, SEO)',
      path: 'src/content/site',
      format: { data: 'json' },
      schema: {
        contactEmail: fields.text({
          label: 'Contact / booking email',
          description:
            'Used by the "Book a call" and "Email us" buttons, the contact form, and the footer. Just the address, e.g. hello@psiberai.com.',
        }),

        seoTitle: fields.text({
          label: 'Default page title (SEO)',
          description: 'The browser-tab title / search-result headline for pages that don\'t set their own.',
        }),
        seoDescription: fields.text({
          label: 'Default search description (SEO)',
          multiline: true,
        }),

        navLinks: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'Link (e.g. /services)' }),
          }),
          { label: 'Navigation menu links', itemLabel: (p) => p.fields.label.value }
        ),
        navCtaLabel: fields.text({
          label: 'Header & footer button label',
          description: 'The "Book a PQC Assessment" button in the top nav and footer.',
        }),

        ctaHeading: fields.text({
          label: 'Call-to-action band — heading',
          description: 'The highlighted band near the bottom of most pages. Individual pages can override this.',
        }),
        ctaBody: fields.text({ label: 'Call-to-action band — text', multiline: true }),
        ctaButton: fields.text({ label: 'Call-to-action band — button label' }),

        brandTagline: fields.text({ label: 'Footer — tagline', multiline: true }),
        linkedinUrl: fields.url({ label: 'LinkedIn URL' }),
        xUrl: fields.url({ label: 'X (Twitter) URL' }),
        copyrightName: fields.text({ label: 'Footer — copyright name', description: 'Shown as "© <year> <name>. All rights reserved."' }),
      },
    }),
    insightsIndex: singleton({
      label: 'Insights listing page',
      path: 'src/content/insights-index',
      format: { data: 'json' },
      schema: {
        eyebrow: fields.text({ label: 'Eyebrow' }),
        title: fields.text({ label: 'Title', multiline: true }),
        lead: fields.text({ label: 'Lead paragraph', multiline: true }),
      },
    }),
    home: singleton({
      label: 'Home page',
      path: 'src/content/home',
      format: { data: 'json' },
      schema: {
        heroEyebrow: fields.text({ label: 'Hero — eyebrow' }),
        heroTitle: fields.text({ label: 'Hero — headline', multiline: true }),
        heroLead: fields.text({ label: 'Hero — lead paragraph', multiline: true }),
        heroCtaPrimary: fields.text({ label: 'Hero — primary button label' }),
        heroCtaSecondary: fields.text({ label: 'Hero — secondary button label' }),

        trustLead: fields.text({ label: 'Trust strip — text', multiline: true }),
        trustBadges: fields.array(fields.text({ label: 'Badge' }), {
          label: 'Trust strip — standard badges',
          itemLabel: (p) => p.value,
        }),
        trustAccentBadge: fields.text({ label: 'Trust strip — highlighted badge' }),

        servicesEyebrow: fields.text({ label: 'Services — eyebrow' }),
        servicesHeading: fields.text({ label: 'Services — heading', multiline: true }),
        cards: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            tag: fields.text({ label: 'Tag' }),
            blurb: fields.text({ label: 'Blurb', multiline: true }),
            href: fields.text({ label: 'Link' }),
            featured: fields.checkbox({ label: 'Featured (highlighted)' }),
          }),
          { label: 'Services — cards', itemLabel: (p) => p.fields.name.value }
        ),

        whyNowEyebrow: fields.text({ label: 'Why now — eyebrow' }),
        whyNowHeading: fields.text({ label: 'Why now — heading', multiline: true }),
        whyNowBody: fields.text({
          label: 'Why now — body',
          description: 'Leave a blank line between paragraphs.',
          multiline: true,
        }),

        offerBadge: fields.text({ label: 'Offer — badge' }),
        offerTitle: fields.text({ label: 'Offer — title', multiline: true }),
        offerBody: fields.text({ label: 'Offer — body', multiline: true }),
        offerPoints: fields.array(
          fields.object({
            num: fields.text({ label: 'Number' }),
            head: fields.text({ label: 'Heading' }),
            desc: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Offer — points', itemLabel: (p) => p.fields.head.value }
        ),
        offerCta: fields.text({ label: 'Offer — button label' }),
        offerHref: fields.text({ label: 'Offer — button link' }),

        aboutEyebrow: fields.text({ label: 'About snippet — eyebrow' }),
        aboutLead: fields.text({ label: 'About snippet — text', multiline: true }),
        aboutButton: fields.text({ label: 'About snippet — button label' }),
      },
    }),
    servicesIndex: singleton({
      label: 'Services page',
      path: 'src/content/services-index',
      format: { data: 'json' },
      schema: {
        eyebrow: fields.text({ label: 'Eyebrow' }),
        heading: fields.text({ label: 'Heading', multiline: true }),
        lead: fields.text({ label: 'Lead paragraph', multiline: true }),
        cards: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            tag: fields.text({ label: 'Tag' }),
            blurb: fields.text({ label: 'Blurb', multiline: true }),
            href: fields.text({ label: 'Link' }),
            featured: fields.checkbox({ label: 'Featured (highlighted)' }),
          }),
          { label: 'Service cards', itemLabel: (p) => p.fields.name.value }
        ),
        note: fields.text({ label: 'Where-to-start note', multiline: true }),
      },
    }),
    contact: singleton({
      label: 'Home — contact form',
      path: 'src/content/contact',
      format: { data: 'json' },
      schema: {
        eyebrow: fields.text({ label: 'Eyebrow' }),
        heading: fields.text({ label: 'Heading' }),
        lead: fields.text({ label: 'Lead paragraph', multiline: true }),
        expectItems: fields.array(fields.text({ label: 'Step' }), {
          label: 'What to expect (numbered steps)',
          itemLabel: (p) => p.value,
        }),
      },
    }),
    contactPage: singleton({
      label: 'Contact page (/contact)',
      path: 'src/content/contact-page',
      format: { data: 'json' },
      schema: {
        eyebrow: fields.text({ label: 'Header — eyebrow' }),
        title: fields.text({ label: 'Header — title', multiline: true }),
        lead: fields.text({ label: 'Header — lead paragraph', multiline: true }),
        mainHeading: fields.text({ label: 'Main card — heading' }),
        mainBody: fields.text({ label: 'Main card — text', multiline: true }),
        bookLabel: fields.text({ label: 'Primary button label (Book a call)' }),
        emailLabel: fields.text({ label: 'Secondary button label (Email us)' }),
        expectHeading: fields.text({ label: 'What-to-expect — heading' }),
        expectItems: fields.array(fields.text({ label: 'Step', multiline: true }), {
          label: 'What to expect (numbered steps)',
          itemLabel: (p) => p.value,
        }),
      },
    }),
    pqcMigration: singleton({
      label: 'PQC Migration page',
      path: 'src/content/pqc-migration',
      format: { data: 'json' },
      schema: {
        eyebrow: fields.text({ label: 'Header — eyebrow' }),
        title: fields.text({ label: 'Header — title', multiline: true }),
        lead: fields.text({ label: 'Header — lead paragraph', multiline: true }),

        problemEyebrow: fields.text({ label: 'Problem — eyebrow' }),
        problemHeading: fields.text({ label: 'Problem — heading', multiline: true }),
        problemBody: fields.text({
          label: 'Problem — body',
          description: 'Leave a blank line between paragraphs.',
          multiline: true,
        }),

        methodEyebrow: fields.text({ label: 'Method — eyebrow' }),
        methodHeading: fields.text({ label: 'Method — heading', multiline: true }),
        method: fields.array(
          fields.object({
            verb: fields.text({ label: 'Verb' }),
            name: fields.text({ label: 'Name' }),
            body: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Method — steps', itemLabel: (p) => `${p.fields.verb.value} — ${p.fields.name.value}` }
        ),

        deliverablesEyebrow: fields.text({ label: 'Deliverables — eyebrow' }),
        deliverablesHeading: fields.text({ label: 'Deliverables — heading', multiline: true }),
        deliverables: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            body: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Deliverables', itemLabel: (p) => p.fields.title.value }
        ),

        tiersEyebrow: fields.text({ label: 'Engagements — eyebrow' }),
        tiersHeading: fields.text({ label: 'Engagements — heading', multiline: true }),
        tiers: fields.array(
          fields.object({
            key: fields.text({ label: 'Kicker (e.g. Snapshot)' }),
            name: fields.text({ label: 'Name' }),
            meta: fields.text({ label: 'Meta line (duration · scope)' }),
            body: fields.text({ label: 'Description', multiline: true }),
            flag: fields.text({ label: 'Flag ribbon', description: 'e.g. "Most chosen". Leave blank for none.' }),
            featured: fields.checkbox({ label: 'Featured (highlighted)' }),
          }),
          { label: 'Engagement tiers', itemLabel: (p) => p.fields.name.value }
        ),
        tiersNote: fields.text({ label: 'Engagements — footnote', multiline: true }),

        ctaHeading: fields.text({ label: 'Call-to-action — heading' }),
        ctaBody: fields.text({ label: 'Call-to-action — text', multiline: true }),
      },
    }),
  },
});
