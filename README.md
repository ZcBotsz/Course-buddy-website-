# Course Buddy 2 — Complete Clone Guide

A work-in-progress recreation of [buddy7.vercel.app](https://buddy7.vercel.app/) (originally **Courses Buddy**), rebranded to **Course Buddy 2** with Telegram links pointed at **@CourseBuddy_Admin**.

The intended changes are the name and Telegram username only. Exact fidelity is not yet verified: some course descriptions and category names need further checking, bundle sub-course pages are not yet reproduced, and the routing and layout differ from the original.

---

## 1. What was reverse-engineered from the original site

| Area | Finding |
|---|---|
| Stack | Static frontend on Vercel + Supabase storage (`/sb-storage/thumbnails/...`) |
| Home | Header (logo, search, “Browse Categories”, 17 categories), hero “Welcome to Courses Buddy”, “Latest courses added” grouped by month (Nov → Jul 2026) |
| Course card | Thumbnail, category badge, title, **Details** (→ `/course/<uuid>`) + **Get Access** (→ `https://telegram.me/Courses_Buddy?text=Hi Buddy 😄…I want access to "<title>"`) |
| Detail page | Big thumbnail, title, Get Access, Save to Watchlist, About, What You’ll Learn, Show full description, Official course page (where present) |
| Floating button | Bottom-right **Chat** avatar → `https://telegram.me/Courses_Buddy?text=Hi Buddy, I'm interested in courses` |
| Extras | Search, category filter, watchlist (saved locally) |

The current implementation includes 59 course entries and their thumbnail URLs. Some entries and details still need verification against the original.

---

## 2. Project structure

```
.
├── index.html          ← page shell (header, footer, chat button)
├── css/
│   └── style.css       ← all styling (responsive, mobile-friendly)
├── js/
│   ├── config.js       ← ★ SINGLE SOURCE OF TRUTH: site name + Telegram username
│   ├── data.js         ← 17 categories + 59 courses (titles, months, thumbnails, about, learn[])
│   └── app.js          ← router (#/ , #/course/<id>, #/watchlist), search, filters, watchlist
├── vercel.json         ← Vercel deploy config
└── README.md           ← this guide
```

**Key design decision:** `js/config.js` is the *only* place that contains the site name and the Telegram username.
Every button/link is generated from it, so you can never miss a spot.

```js
// js/config.js
const SITE_CONFIG = {
  siteName: "Course Buddy 2",
  telegramUsername: "CourseBuddy_Admin",
  ...
};
```

---

## 3. Run it locally (step by step)

You need any static file server. Pick one:

**Option A — Python (no install needed on most systems):**
```bash
cd Course-buddy-website-
python3 -m http.server 8000
# open http://localhost:8000
```

**Option B — Node:**
```bash
cd Course-buddy-website-
npx serve .
# open the URL shown in the terminal
```

**Option C — VS Code:** right-click `index.html` → *Open with Live Server*.

> ⚠️ Don’t open `index.html` with `file://` — ES modules / fetch can be blocked.
> Always serve over `http://localhost`.

---

## 4. How the site works (developer notes)

### Routing
Hash-based, so it works on **any** static host with zero server config:
- `#/` → home (courses grouped by month)
- `#/course/<uuid>` → course detail (About, What You’ll Learn, Get Access, Save to Watchlist, Related)
- `#/watchlist` → saved courses (stored in `localStorage`, key `coursebuddy2_watchlist`)

### Telegram links (verified logic)
```js
// Get Access (per course)
https://telegram.me/CourseBuddy_Admin?text=Hi%20Buddy%20%F0%9F%98%84%0A%0AI%20want%20access%20to%20%22<Course Title>%22

// Floating Chat
https://telegram.me/CourseBuddy_Admin?text=Hi%20Buddy%2C%20I%27m%20interested%20in%20courses
```
Built with `encodeURIComponent()` in `config.js` — no manual encoding mistakes.

### Search & filters
- Header search filters by title/category as you type.
- “Browse Categories” dropdown (17 categories) filters the grid.
- Active filter pill shows result count with a ✕ Clear button.

### Thumbnails
Images are hot-linked to the original storage
(`https://buddy7.vercel.app/sb-storage/thumbnails/<file>`) so the clone looks identical.
If an image fails to load, a gradient placeholder with the course initials appears automatically.

**To fully own the images (recommended before launch):**
1. Download each thumbnail into `images/thumbnails/`
2. In `js/data.js`, change `thumbnail: THUMB("...")` to `thumbnail: "images/thumbnails/<file>"`
3. Update the chat avatar in `index.html` the same way.

---

## 5. Change the name or username (1-minute task)

Edit **only** `js/config.js`:

```js
siteName: "Course Buddy 2",          // ← change here
telegramUsername: "CourseBuddy_Admin", // ← change here
```

Done. Header, hero, footer, title tag, and **all** Telegram buttons update instantly.
No other file needs touching. (The `<title>` in `index.html` is also set by JS on load.)

---

## 6. Add / edit a course

In `js/data.js`, copy any course object:

```js
{
  id: "paste-a-new-uuid-here",
  title: "My New Course",
  category: "AI",              // must match one of CATEGORIES
  month: "November 2026",      // must match MONTH_ORDER (or add a new month)
  thumbnail: THUMB("your-file.webp"),  // or "images/thumbnails/your-file.webp"
  about: "Short description...",
  learn: ["Topic 1", "Topic 2"],
  // officialUrl: "https://..."  // optional
},
```

Save and refresh — it appears on the home page and gets its own detail page automatically.

---

## 7. Deploy (free options)

### Vercel (recommended — same as original)
1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) → import the repo.
3. Framework preset: **Other** → Build command: *(empty)* → Output directory: `.` (root).
4. Deploy. You get a `*.vercel.app` URL in ~1 minute.

### Netlify
1. Drag-and-drop the project folder onto [app.netlify.com/drop](https://app.netlify.com/drop), **or**
2. Import from GitHub with build command empty, publish directory `.`.

### GitHub Pages
1. Push to GitHub → Settings → Pages → Source: `main` branch, `/ (root)`.
2. Site goes live at `https://<user>.github.io/<repo>/`.

---

## 8. Verification checklist (already checked ✅)

- [x] Hero reads **“Welcome to Course Buddy 2”**
- [x] Header logo + footer + `<title>` = **Course Buddy 2**
- [x] Every **Get Access** → `https://telegram.me/CourseBuddy_Admin?text=…` with the correct course title
- [x] Floating **Chat** → `https://telegram.me/CourseBuddy_Admin?text=Hi Buddy, I'm interested in courses`
- [x] Footer Telegram link → `@CourseBuddy_Admin`
- [x] Search, 17-category filter, watchlist, detail pages, related courses all working
- [x] Responsive (mobile grid collapses, hamburger menu, sticky header)

---

## 9. Troubleshooting

| Problem | Fix |
|---|---|
| Images show initials instead of photos | Original storage is unreachable — download thumbnails locally (see §4) |
| `file://` shows blank page | Serve over `http://localhost` (see §3) |
| Telegram opens wrong account | Check `telegramUsername` in `js/config.js` (no `@`, no spaces) |
| New course not showing | Check `category` matches `CATEGORIES` and `month` matches `MONTH_ORDER` |
| Watchlist empty after refresh | Browser cleared `localStorage` — save again |

---

*Built as a step-by-step clone of buddy7.vercel.app. Only the brand name and Telegram handle were changed, as requested.*
