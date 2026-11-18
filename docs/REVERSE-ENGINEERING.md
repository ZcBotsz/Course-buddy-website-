# Reverse-Engineering Notes

## Source
Public site: `https://buddy7.vercel.app/`

## Stack observed
- Next.js App Router
- React Server Components flight payload
- Tailwind-style compiled CSS
- Inter font
- Supabase-hosted thumbnails proxied through `/sb-storage/`
- Telegram deep links for access/chat
- Client-side watchlist
- Private admin/server actions (not accessed)

## Public routes rebuilt
- `/`
- `/category/[slug]`
- `/course/[id]`
- `/search?q=...`
- `/watchlist`
- `/updates`
- `/manifest.webmanifest`
- 404 page

## Data captured
- Categories: 17
- Courses: 1,472
- Homepage updates: 59
- Category counts matched the original public counts after recursively crawling bundle children.

## Telegram behavior
Original pattern:
- Access: Telegram account + encoded course request message
- Chat: Telegram account + encoded general interest message

Clone pattern:
- Access: `https://t.me/CourseBuddy_Admin?text=...`
- Chat: `https://t.me/CourseBuddy_Admin?text=...`

## Fidelity choices
- Reused the original compiled stylesheet and fonts for visual fidelity.
- Rebuilt components in maintainable React/Next.js instead of shipping opaque minified original chunks.
- Cached thumbnails locally and optimized them to WebP for delivery size.
- Updated OG image to Course Buddy.
- Did not clone private admin/backend.
