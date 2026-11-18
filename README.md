# Course Buddy 2

A rebranded, self-contained clone of the public `buddy7.vercel.app` course library.

## What changed
- Brand: **Courses Buddy → Course Buddy 2**
- Welcome heading: **Welcome to Course Buddy 2**
- Every access/chat Telegram link: **@CourseBuddy_Admin** (`https://t.me/CourseBuddy_Admin`)
- Catalogue, thumbnails, fonts, icons, favicon, and OG image are served locally.

## Requirements
- Node.js **20+** (Node 22 or 24 LTS recommended)
- npm

## Quick start
```bash
npm ci
npm run dev
# open http://localhost:3000
```

## Production
```bash
npm ci
npm run typecheck
npm run build
npm run start
```

## Deploy this branch to Vercel

Import the GitHub repository and select `arena/eb0db19d-course-buddy-website`. Use the Next.js preset and leave the output directory at its default. The public catalog uses the JSON files in `data/`; the optional admin panel requires the Supabase environment variables in `.env.example`.

## Other deployment options

### Easiest: Vercel Drop (no Git, no CLI, no unzipping)
1. Go to **https://vercel.com/drop** and sign in.
2. Drag **`course-buddy.zip`** onto the page — the ZIP itself.
3. Name the project and click **Deploy**.

Vercel detects Next.js and builds it automatically. No environment variables needed.
See `START-HERE.txt` for the plain-English walkthrough.

### Alternative: GitHub or CLI
1. Push this project to GitHub, or use the Vercel CLI from the project folder.
2. Import it into Vercel with the **Next.js** framework preset.
3. Use build command `npm run build`; leave the output directory default.
4. No database or Telegram bot token is required.
5. `NEXT_PUBLIC_SITE_URL` is optional. On Vercel the app auto-detects the deployment/production URL; set it only when you want a specific custom domain for metadata/social previews.

CLI:
```bash
npx vercel@latest
npx vercel@latest --prod
```

Full deployment details: `GUIDE.md`.

## Resume after an environment reset

Sandbox/hosted environments often drop `node_modules` and `.next` between sessions.
One command installs only what's missing, builds if needed, and serves on port 3000:

```bash
npm run resume
```

## Verify
```bash
npm run typecheck        # TypeScript, no emit
npm test                 # browser checks (requires: npx playwright install chromium)
npm run verify:links     # static username/asset/manifest checks
node scripts/verify-routes.mjs   # checks all public routes against a running server
```

Latest final audit: **25/25 browser checks**, **1,493/1,493 routes**, **0 link/asset failures**, clean install + production build passed.

## Docs
- `GUIDE.md` — full step-by-step guide, Vercel deployment, and maintenance
- `docs/REVERSE-ENGINEERING.md` — how the original site works and what was rebuilt
- `docs/TEST-REPORT.md` — verification results and bug-fix summary

## Admin Panel (add / manage courses)

A password-protected admin panel at **`/admin`** lets you add, edit, and delete
courses with photo uploads. It is **not public** — protected by Supabase Auth +
Next.js middleware.

### One-time setup

1. Create a free Supabase project: https://supabase.com → New Project.
2. Copy keys from Settings → API into `.env.local`:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
3. Run `supabase/migrations/001_courses_and_categories.sql` in Supabase SQL Editor.
4. Create an admin user: Supabase → Authentication → Users → Add user.
5. Create a public storage bucket named `course-thumbnails` (Supabase → Storage).

### Deploy

Add the four Supabase env vars to your Vercel project, redeploy, and run the SQL
migration against your production Supabase project. Full details: `GUIDE.md` §14.

## Important scope note

This is a complete **public-facing** clone. The original private admin/login/backend
was not accessible without credentials, so a new admin panel was added at
`/admin` (Supabase-backed, not the original). Telegram buttons open a chat with a
pre-filled message; Telegram does not allow websites to auto-send messages or
collect payments by themselves.
