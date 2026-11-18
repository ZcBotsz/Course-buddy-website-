# Course Buddy — Full Build & Deployment Guide

This project recreates the public course-library website and applies only the requested rebrand and Telegram routing changes.

---

## 1. Final result

| Item | Original | Clone |
|---|---|---|
| Site name | Courses Buddy | **Course Buddy** |
| Main welcome heading | Welcome to Courses Buddy | **Welcome to Course Buddy** |
| Telegram access/chat target | previous Telegram account | **@CourseBuddy_Admin** |
| Telegram base URL | previous `t.me` account | **https://t.me/CourseBuddy_Admin** |
| Catalogue | public pages | **1,472 courses, 17 categories, 59 homepage updates** |
| Assets | remote/proxied | **local thumbnails, fonts, icons, OG image** |

The clone preserves the public experience: home/update feed, categories, category pages, course detail pages, bundle pages, search, watchlist, mobile bottom navigation, install-app prompt, and Telegram chat/access buttons.

---

## 2. What was reverse-engineered

The original site is a Next.js App Router application. Public inspection showed:

1. **Home page**
   - Welcome heading
   - “Latest courses added” status badge
   - Global search bar
   - Category navigation
   - Monthly updates feed

2. **Categories**
   - 17 categories
   - Category counts include nested/bundle courses
   - Category pages show top-level courses/bundles

3. **Courses**
   - Normal course detail page with thumbnail, title, description, Get Access, and Watchlist
   - Bundle/folder pages list child courses
   - Some courses have price and sales-page metadata

4. **Search**
   - Search bar routes to `/search?q=...`
   - Results include matching categories and courses

5. **Watchlist**
   - Client-side saved courses
   - Persisted in browser localStorage

6. **Telegram routing**
   - Original access buttons used a Telegram deep link with a pre-filled course request
   - Chat buttons used a general interest message

7. **Private/admin area**
   - The original has admin/login routes, but the private backend requires credentials/source access.
   - This clone does **not** include private admin functionality.

More detail: `docs/REVERSE-ENGINEERING.md`.

---

## 3. Exact changes made

### Brand replacement
The brand is centralized in:

```ts
// lib/config.ts
export const SITE_NAME = 'Course Buddy';
```

It is used in:
- Header logo
- Welcome heading
- Page titles/metadata
- PWA manifest
- Install-app modal
- OpenGraph/Twitter metadata

### Telegram replacement
All access/chat links are generated from one place:

```ts
// lib/config.ts
export const TELEGRAM_USERNAME = 'CourseBuddy_Admin';
export const TELEGRAM_BASE = `https://t.me/${TELEGRAM_USERNAME}`;
```

Access button message:

```text
Hi Buddy 😄

I want access to "COURSE TITLE"
```

Chat button message:

```text
Hi Buddy, I'm interested in courses
```

> Telegram deep links open the chat and pre-fill the message. The visitor still presses Send. A website cannot force Telegram to auto-send a message.

---

## 4. Project structure

```text
course-buddy-2/
├─ app/
│  ├─ layout.tsx                 # global layout, metadata, header/footer/modal
│  ├─ manifest.ts                # PWA manifest route (single source)
│  ├─ page.tsx                   # home page
│  ├─ category/[slug]/page.tsx   # category pages
│  ├─ course/[id]/page.tsx       # course + bundle pages
│  ├─ search/                    # search results
│  ├─ watchlist/page.tsx         # saved courses
│  ├─ updates/page.tsx           # latest updates
│  └─ components/                # UI components
├─ lib/
│  ├─ config.ts                  # brand, Telegram target, canonical site URL
│  ├─ data.ts                    # catalogue helpers/search
│  ├─ format.ts                  # date grouping
│  └─ types.ts
├─ data/
│  ├─ categories.json            # 17 categories
│  ├─ courses.json               # 1,472 courses
│  └─ updates.json               # 59 homepage updates
├─ public/
│  ├─ sb-storage/thumbnails/     # local course/category thumbnails
│  ├─ fonts/                     # local Inter fonts
│  ├─ og.png                     # updated Course Buddy social image
│  ├─ favicon.ico                # browser favicon
│  └─ icon.png / apple-icon.png / pwa-192.png / pwa-512.png
├─ styles/
│  ├─ original.css               # original compiled visual stylesheet
│  └─ globals.css                # small clone-specific fixes
├─ scripts/                      # verification and asset helpers
├─ tests/verify.mjs              # Playwright browser checks
├─ GUIDE.md
└─ docs/
```

---

## 5. Run locally

### Requirements
- Node.js **20+** (Node 22 or 24 LTS recommended)
- npm

### Production-style local run
```bash
cd course-buddy-2
npm ci
npm run typecheck
npm run build
npm run start
```

Open:

```text
http://localhost:3000
```

### Development run
```bash
npm run dev
```

### After an environment reset
If `node_modules` or `.next` disappeared, run:

```bash
npm run resume
```

This installs/builds only what is missing, then serves on `0.0.0.0:3000`.

---

## 6. Deploy to Vercel

The app is ready for Vercel's **Next.js** preset. It does **not** need a database, Supabase keys, or a Telegram bot token: the catalogue, thumbnails, fonts, and icons are all included locally.

### Recommended project settings

| Setting | Value |
|---|---|
| Framework preset | **Next.js** |
| Root directory | `course-buddy-2` if the repo contains this folder; otherwise leave blank |
| Build command | `npm run build` |
| Install command | `npm ci` (or leave Vercel's default npm install) |
| Output directory | Leave default / empty |
| Node.js version | **22.x or 24.x** recommended; `package.json` requires `>=20` |

### Environment variables

| Variable | Required? | Purpose |
|---|---:|---|
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical origin for metadata/social previews, e.g. `https://your-domain.com` |

For a normal `*.vercel.app` deployment, leave `NEXT_PUBLIC_SITE_URL` unset. The app automatically uses Vercel's system environment variables:

1. `NEXT_PUBLIC_SITE_URL` if you set it
2. `VERCEL_PROJECT_PRODUCTION_URL`
3. `VERCEL_URL`
4. `http://localhost:3000` for local development

Keep Vercel's **System Environment Variables** enabled. If you attach a custom domain, set `NEXT_PUBLIC_SITE_URL` to that domain and redeploy.

### Option A: Vercel Drop — easiest, no Git, no CLI

Vercel Drop accepts the **ZIP file directly** and builds Next.js for you. You do not
unzip it, and you never upload the folders one by one.

1. Go to **https://vercel.com/drop**.
2. Sign in (required for framework projects like Next.js).
3. Drag **`course-buddy.zip`** onto the page — the ZIP itself, still zipped.
4. Choose your team, enter a project name, select **Deploy**.
5. Vercel uploads, detects Next.js, builds, and gives you a live production URL.

No environment variables are needed. See `START-HERE.txt` for the short version.

> Each drop on `vercel.com/drop` creates a **new** project. To update the same site
> later, drop the folder onto the existing project in the Vercel dashboard, or
> connect a Git repository for automatic deployments.

### Option B: GitHub import

1. Extract `course-buddy.zip`.
2. Push the project to a GitHub repository.
   - If the repository root contains `package.json`, leave Vercel's Root Directory blank.
   - If the repository root contains a `course-buddy-2/` folder, set Root Directory to `course-buddy-2`.
3. In Vercel, choose **Add New → Project** and import the repository.
4. Confirm the settings above.
5. Deploy.

### Option C: Vercel CLI

```bash
cd course-buddy-2
npx vercel@latest
npx vercel@latest --prod
```

The first command creates/links the Vercel project. The second promotes a production deployment.

### Custom domain

1. Add the domain in Vercel → Project → Settings → Domains.
2. Optionally set `NEXT_PUBLIC_SITE_URL=https://your-domain.com`.
3. Redeploy so metadata/social previews use the custom domain.

### Deployment notes

- `app/manifest.ts` is the **only** PWA manifest source. Do not add `public/manifest.webmanifest`; a duplicate static file would shadow the generated route.
- `public/robots.txt` intentionally disallows crawling, matching the original site. Edit it only if you want search engines to index the clone.
- Telegram buttons are client-side deep links. They do not require server-side Telegram credentials.

---

## 7. Recheck after deployment

Open these pages:

```text
/
/category/ai
/course/9a8ec5f3-194c-4414-85e6-cb8daa8673e6
/course/5fffbc55-a8b2-4002-95fa-cee726172ca2
/search?q=ai
/watchlist
```

Check:
- Heading says **Welcome to Course Buddy**
- Header says **Course Buddy**
- Get Access opens `https://t.me/CourseBuddy_Admin?...`
- Chat opens `https://t.me/CourseBuddy_Admin?...`
- No button points to the previous Telegram account
- Categories and search work
- Watchlist saves on the same browser/device

Automated checks:
```bash
npm run typecheck
npm run verify:links
npm test
node scripts/verify-routes.mjs
```

---

## 8. Change the Telegram username later

Edit only:

```ts
// lib/config.ts
export const TELEGRAM_USERNAME = 'NewUsername';
```

Then rebuild/redeploy:

```bash
npm run build
```

All Get Access and Chat links update automatically.

---

## 9. Change the site name later

Edit:

```ts
// lib/config.ts
export const SITE_NAME = 'Course Buddy'; // change this value only if rebranding again
```

> Note: the folder/ZIP slug (`course-buddy-2`) and the browser watchlist storage key (`course-buddy-2-watchlist`) are internal identifiers, not visible branding. They were left unchanged so existing saved watchlists keep working.

Also update if desired:
- `app/manifest.ts` already uses `SITE_NAME`; it is the single manifest source
- `public/og.png` via `node scripts/generate-og.mjs` while a local server is running

---

## 10. Add or edit courses manually

The catalogue is static JSON in `data/courses.json`.

A course object looks like:

```json
{
  "id": "uuid-or-unique-id",
  "title": "Course title",
  "description": "Course description",
  "thumbnail_url": "/sb-storage/thumbnails/example.webp",
  "price": "999 ₹",
  "sales_page_url": null,
  "category_id": "category-uuid",
  "parent_course_id": null,
  "sort_order": 0,
  "categories": { "name": "AI", "slug": "ai" },
  "child_count": 0
}
```

Rules:
- `id` must be unique.
- `category_id` must match a category in `data/categories.json`.
- `parent_course_id: null` means top-level course/bundle.
- To put a course inside a bundle, set `parent_course_id` to the bundle course ID.
- `child_count` should equal the number of direct children.
- Put thumbnail files in `public/sb-storage/thumbnails/`.
- Category `count` in `data/categories.json` should include nested courses if you want the original counting behavior.

After editing:
```bash
npm run verify:links
npm run build
```

---

## 11. What is intentionally not included

The original private admin panel/backend was not cloned because it requires private credentials or source/database access. This deliverable includes the complete public website and a static catalogue snapshot.

Not included:
- Admin login/authentication
- Server-side course editing
- Payment processing
- Telegram bot automation
- Private user accounts

If you want those, the next phase would be adding a backend such as Supabase/Firebase plus an admin dashboard, or connecting a Telegram bot/payment provider.

---

## 12. Troubleshooting

### Images missing
Run:
```bash
npm run verify:links
```
It checks that every referenced thumbnail exists locally.

### Telegram link wrong
Check `lib/config.ts`, then rebuild.

### Search/watchlist not working in preview
Make sure JavaScript is enabled. Watchlist is browser-local and will not sync across devices.

### Playwright test fails to launch browser
Install browser dependencies:
```bash
npx playwright install chromium
npx playwright install-deps chromium
```

### Preview stopped / port 3000 empty after a session reset
Installed packages and build output are not persisted between sessions, so the server
can disappear even though the source is intact. Run:
```bash
npm run resume
```
This installs dependencies only if `node_modules` is missing, builds only if `.next/BUILD_ID`
is missing, then starts the server on `0.0.0.0:3000`.

### Old brand still appears after deploy
Clear cache/redeploy. The brand is not hardcoded in multiple places; it comes from `lib/config.ts`.


---

## 14. Admin Panel (add / manage courses)

The admin panel lives at **`/admin`** and is **not public** — it is protected by
Supabase Auth + Next.js middleware. Only signed-in admins can add, edit, or
delete courses and upload course photos.

### 14.1 What you need (one-time setup)

1. **Create a Supabase project** (free tier): https://supabase.com → New Project.
2. **Copy API keys**: Settings → API → Project URL, `anon public` key, and
   `service_role` key. Paste them into `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_URL=your-project-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Create the database**: Open Supabase → SQL Editor, paste the contents of
   `supabase/migrations/001_courses_and_categories.sql`, and click Run.

4. **Create an admin user**: Supabase → Authentication → Users → Add user.
   Enter email + password. That's your admin login.

5. **Create the storage bucket** (if not created by the migration):
   Supabase → Storage → New Bucket → `course-thumbnails` → make it **Public**.

### 14.2 Using the admin panel

- Open `http://localhost:3000/admin` (or your deployed `/admin`).
- Sign in with the admin email/password you created.
- **Dashboard**: see all courses and categories at a glance.
- **Add Course**: enter title, description, price, category, and upload a photo.
- **Edit/Delete**: click a course on the dashboard to edit it, or delete it.

### 14.3 Deployment on Vercel

Add the four `NEXT_PUBLIC_SUPABASE_*` / `SUPABASE_*` variables to your Vercel
project (Settings → Environment Variables), redeploy, and run the SQL migration
against your production Supabase project. The public site is unchanged — only
the `/admin` route is new.

### 14.4 Public site vs. admin data

The public catalogue still reads from the static `data/courses.json` (1,472
courses). Courses you add through the admin panel are stored in Supabase and
appear in the admin dashboard. To surface admin-added courses on the public
site, point the public data layer at Supabase instead of the JSON file.


## 13. Latest audit / bug-fix summary

Fixed in the final audit:

- Clearing search returns to the page the visitor came from.
- Search pagination resets when the query changes.
- Categories modal closes with Escape and restores focus.
- Watchlist buttons are no longer nested inside course-card links.
- 404 page has a single `<main>` landmark.
- Added missing `/favicon.ico`.

Vercel-readiness improvements:

- Automatic `SITE_URL` detection for metadata/social previews.
- Single PWA manifest source: `app/manifest.ts`.
- Removed broken `next lint` script; added `npm run typecheck`.
- Declared `engines.node >=20`.
- Immutable CDN cache headers for local thumbnails and fonts.

Final verification: **25/25 browser checks**, **1,493/1,493 routes**, **0 link/asset failures**, clean `npm ci` + `npm run build`, and `npm run typecheck` exit 0. Details: `docs/TEST-REPORT.md`.
