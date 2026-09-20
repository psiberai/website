/* ---------------------------------------------------------------------------
 * Insights feed data.
 * Placeholder editorial topics for launch — the grid + filter render from this
 * array, so when real posts arrive this becomes an Astro content collection
 * with zero markup changes. Each item's `status` shows "Upcoming" honestly
 * instead of a fabricated publish date.
 * ------------------------------------------------------------------------- */

/** @typedef {'pqc' | 'compliance' | 'research'} CategoryId */

/** @type {{ id: CategoryId, label: string }[]} */
export const CATEGORIES = [
  { id: 'pqc', label: 'Quantum Security & PQC' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'research', label: 'Research & Policy' },
];

export const INSIGHTS = [
  {
    slug: 'harvest-now-decrypt-later',
    category: 'pqc',
    title: 'What "harvest-now, decrypt-later" actually means for your data',
    excerpt:
      'Why data with a long confidentiality horizon is already exposed — and a plain way to reason about which of your secrets are at risk today.',
    readMinutes: 6,
    status: 'Upcoming',
  },
  {
    slug: 'cryptographic-inventory-where-to-look',
    category: 'pqc',
    title: 'Building a cryptographic inventory: where to look first',
    excerpt:
      'A practical starting map — TLS, PKI, code signing, HSMs, third parties — and the questions that surface the crypto hiding in plain sight.',
    readMinutes: 8,
    status: 'Upcoming',
  },
  {
    slug: 'ml-kem-ml-dsa-slh-dsa-in-plain-terms',
    category: 'pqc',
    title: 'ML-KEM, ML-DSA, SLH-DSA: the NIST algorithms in plain terms',
    excerpt:
      'What FIPS 203/204/205 standardized, what each one is for, and what a hybrid migration looks like in practice.',
    readMinutes: 7,
    status: 'Upcoming',
  },
  {
    slug: 'crypto-controls-iso-27001',
    category: 'compliance',
    title: 'Cryptography controls in ISO 27001 — and how PQC readiness feeds them',
    excerpt:
      'How a cryptographic inventory does double duty as ISMS evidence, so quantum readiness becomes part of the audit rather than a separate project.',
    readMinutes: 5,
    status: 'Upcoming',
  },
  {
    slug: 'iso-42001-ai-governance-starter',
    category: 'compliance',
    title: 'ISO 42001 for teams shipping AI: a proportionate starting point',
    excerpt:
      'Governance that is enough to be defensible without becoming a tax on every model you ship — scoped to real use cases.',
    readMinutes: 6,
    status: 'Upcoming',
  },
  {
    slug: 'reading-the-pqc-mandate-timelines',
    category: 'research',
    title: 'Reading the PQC mandate timelines without the hype',
    excerpt:
      'CNSA 2.0, sector regulators and the G7 call to action — what the procurement signals mean for a regulated enterprise planning its transition.',
    readMinutes: 7,
    status: 'Upcoming',
  },
];
