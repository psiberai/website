/* ---------------------------------------------------------------------------
 * Shared contact-form validation.
 * Pure, DOM-free functions so the SAME rules run in the browser now and in the
 * future backend (`/api/contact`) — no duplicated logic, no drift.
 * ------------------------------------------------------------------------- */

export interface ContactInput {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// A short block-list keeps the "work email" ask honest without being obnoxious.
const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com',
]);

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isFreeEmail(value: string): boolean {
  const domain = value.trim().toLowerCase().split('@')[1] ?? '';
  return FREE_EMAIL_DOMAINS.has(domain);
}

/**
 * Validate a contact submission. Returns a map of field → human-readable message.
 * An empty object means the input is valid.
 */
export function validateContact(input: Partial<ContactInput>): ContactErrors {
  const errors: ContactErrors = {};
  const name = (input.name ?? '').trim();
  const email = (input.email ?? '').trim();
  const message = (input.message ?? '').trim();

  if (!name) {
    errors.name = 'Please enter your name.';
  } else if (name.length < 2) {
    errors.name = 'That name looks too short.';
  }

  if (!email) {
    errors.email = 'Please enter your email.';
  } else if (!isEmail(email)) {
    errors.email = 'Enter a valid email address, e.g. name@company.com.';
  } else if (isFreeEmail(email)) {
    errors.email = 'Please use your work email so we can reach the right team.';
  }

  if (!message) {
    errors.message = 'Tell us a little about what you need.';
  } else if (message.length < 10) {
    errors.message = 'A little more detail helps — at least a sentence.';
  }

  // `company` is optional; no rule.
  return errors;
}
