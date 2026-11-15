export const SITE_NAME = 'Course Buddy';
export const SITE_DESCRIPTION = 'Premium Courses Library';

// Canonical origin for metadata/social previews.
// Works locally, on Vercel preview deployments, and on production without manual setup.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  'http://localhost:3000';
export const TELEGRAM_USERNAME = 'CourseBuddy_Admin';
export const TELEGRAM_BASE = `https://t.me/${TELEGRAM_USERNAME}`;
export const CHAT_URL = `${TELEGRAM_BASE}?text=${encodeURIComponent("Hi Buddy, I'm interested in courses")}`;
export function getAccessUrl(title: string) {
  const message = `Hi Buddy 😄\n\nI want access to "${title}"`;
  return `${TELEGRAM_BASE}?text=${encodeURIComponent(message)}`;
}
