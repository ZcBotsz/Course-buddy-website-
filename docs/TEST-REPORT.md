# Test Report — Course Buddy

## Final audit result

| Check | Command | Result |
|---|---|---|
| TypeScript | `npm run typecheck` | Exit 0 |
| Clean install | `npm ci` after removing `node_modules` | Passed |
| Clean production build | `npm run build` after removing `.next` | Passed; 25 static pages generated |
| Browser regression suite | `npm test` | **25/25 passed** |
| Full public route sweep | `node scripts/verify-routes.mjs` | **1,493 checked, 0 failed** |
| Static link/asset/manifest audit | `npm run verify:links` | **0 failures** |
| Targeted bug probe | `node scripts/bug-probe.mjs` | All previously found bugs resolved |

## Browser checks

Command:
```bash
npm test
```

Result: **25/25 passed**

Covered:
- Home title and welcome heading
- Get Access Telegram username and message
- Chat Telegram username
- No previous Telegram username in rendered DOM
- Category page and card count
- Course detail page and access link
- Bundle child course count
- Search results
- Watchlist save and watchlist page
- Mobile categories modal and navigation
- Clearing search returns to the origin page
- No interactive elements nested inside anchors
- Unknown route returns HTTP 404
- Single `<main>` landmark on the 404 page
- `/favicon.ico` is served
- PWA manifest is served from the app route with name `Course Buddy`
- Escape closes the mobile categories modal
- No JavaScript page errors

## Targeted bug probe

Command:
```bash
node scripts/bug-probe.mjs
```

Result after fixes:
```json
{
  "searchReturnTo": {
    "expected": "/category/ai",
    "actual": "/category/ai"
  },
  "loadMoreReset": {
    "cardsAfterLongQuery": 120,
    "cardsAfterNewQuery": 4
  },
  "escapeClosesModal": {
    "openBefore": 1,
    "openAfterEscape": 0
  },
  "nestedInteractive": 0,
  "notFound": {
    "status": 404,
    "mainElements": 1
  },
  "faviconStatus": 200
}
```

## Bugs fixed in the final audit

1. **Search return path** — clearing the global search now returns to the page the visitor came from instead of always returning home.
2. **Search pagination** — the visible-result limit resets when the query changes, so a new short query is not hidden behind an old “Load more” state.
3. **Categories modal keyboard behavior** — Escape closes the modal and focus is restored.
4. **Invalid nested interactive elements** — watchlist buttons were moved outside course-card anchors; rendered nested interactive count is now 0.
5. **404 landmarks** — the not-found page no longer creates a second `<main>` inside the layout.
6. **Missing favicon** — added `public/favicon.ico`; `/favicon.ico` returns 200.

## Vercel-readiness fixes

- Added automatic `SITE_URL` detection for `metadataBase`:
  1. `NEXT_PUBLIC_SITE_URL`
  2. `VERCEL_PROJECT_PRODUCTION_URL`
  3. `VERCEL_URL`
  4. `http://localhost:3000`
- Removed duplicate `public/manifest.webmanifest`; `app/manifest.ts` is the single manifest source.
- Removed the broken `next lint` script and added `npm run typecheck`.
- Declared `engines.node >=20`.
- Added immutable CDN cache headers for `/sb-storage/*` and `/fonts/*`.
- Verification scripts now create their `screenshots/` output directory when it is missing.

## Route checks

Command:
```bash
node scripts/verify-routes.mjs
```

Result:
```json
{
  "checked": 1493,
  "failed": 0,
  "failures": []
}
```

Routes checked:
- Home
- Search
- Watchlist
- Updates
- 17 category pages
- 1,472 course pages

## Static link/asset checks

Command:
```bash
npm run verify:links
```

Result:
```json
{
  "courses": 1472,
  "categories": 17,
  "updates": 59,
  "filesScanned": 40,
  "failures": []
}
```

Checks:
- No previous Telegram username in served source/data/assets
- Telegram config points to `CourseBuddy_Admin`
- Site name is exactly `Course Buddy`
- PWA manifest route uses `SITE_NAME`
- No duplicate static manifest shadows `app/manifest.ts`
- Every referenced course/category thumbnail exists locally

## Brand verification

Visible brand is **Course Buddy** everywhere checked:
- `<title>Course Buddy</title>`
- `Welcome to Course Buddy`
- `og:title = Course Buddy`
- PWA manifest `name` / `short_name` = `Course Buddy`
- No visible `Course Buddy 2` branding
- `public/og.png` regenerated with the Course Buddy name

Internal identifiers intentionally unchanged:
- Folder/package slug: `course-buddy-2`
- Watchlist localStorage key: `course-buddy-2-watchlist`

These are not visible branding and were preserved so existing saved watchlists keep working.
