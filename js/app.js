/**
 * ============================================================
 *  COURSE BUDDY 2 — App logic (routing, search, watchlist)
 * ============================================================
 *  Routes (hash-based, works on any static host):
 *    #/                  → home (grouped by month)
 *    #/course/<id>       → course detail
 *    #/watchlist         → saved courses (localStorage)
 *
 *  All Telegram links are built from SITE_CONFIG in config.js,
 *  so changing the username there updates every button.
 * ============================================================
 */
(function () {
  "use strict";

  const app = document.getElementById("app");
  const searchInput = document.getElementById("searchInput");
  const searchInputMobile = document.getElementById("searchInputMobile");
  const categoryBtn = document.getElementById("categoryBtn");
  const categoryBtnLabel = document.getElementById("categoryBtnLabel");
  const categoryMenu = document.getElementById("categoryMenu");
  const mobileCats = document.getElementById("mobileCats");
  const watchlistCountEl = document.getElementById("watchlistCount");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  let activeCategory = "All";
  let query = "";

  // ---------- helpers ----------
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const courseById = (id) => COURSES.find((c) => c.id === id) || CATEGORY_COURSES.find((c) => c.id === id) || BUNDLE_COURSES.find((c) => c.id === id);

  const catalog = () => Array.from(new Map([...BUNDLE_COURSES, ...CATEGORY_COURSES, ...COURSES].map(c => [c.id, c])).values());

  const categoryCounts = () => {
    const map = {};
    catalog().forEach((c) => { if (c.category) map[c.category] = (map[c.category] || 0) + 1; });
    return map;
  };

  function thumbHtml(course, cls) {
    const initials = esc(course.title.split(" ").slice(0, 2).join(" ").toUpperCase());
    return `
      <div class="${cls}">
        <img src="${esc(course.thumbnail)}" alt="${esc(course.title)}" loading="lazy"
             onerror="if (!this.dataset.retried) { this.dataset.retried = '1'; const img = this; setTimeout(() => { if (img.isConnected) img.src = img.src; }, 1000); } else { this.parentElement.classList.add('has-fallback'); this.remove(); }" />
        <span class="fallback" aria-hidden="true">${initials}</span>
      </div>`;
  }

  function cardHtml(course) {
    const access = telegramAccessUrl(course.accessTitle || course.title);
    return `
      <article class="card">
        <a href="#/course/${course.id}" aria-label="${esc(course.title)}">
          ${thumbHtml(course, "card-thumb")}
          ${course.category ? `<span class="cat-badge">${esc(course.category)}</span>` : ""}
        </a>
        <div class="card-body">
          <h3 class="card-title"><a href="#/course/${course.id}">${esc(course.cardTitle || course.title)}</a></h3>
          <div class="card-actions">
            <a class="btn btn-outline" href="#/course/${course.id}">Details</a>
            <a class="btn btn-access" href="${esc(access)}" target="_blank" rel="noopener">Get Access</a>
          </div>
        </div>
      </article>`;
  }

  // ---------- watchlist (localStorage) ----------
  const WL_KEY = "coursebuddy2_watchlist";
  const getWatchlist = () => {
    try { return JSON.parse(localStorage.getItem(WL_KEY) || "[]"); } catch { return []; }
  };
  const setWatchlist = (ids) => {
    localStorage.setItem(WL_KEY, JSON.stringify(ids));
    updateWatchlistCount();
  };
  const inWatchlist = (id) => getWatchlist().includes(id);
  function toggleWatchlist(id) {
    const ids = getWatchlist();
    const i = ids.indexOf(id);
    if (i >= 0) ids.splice(i, 1); else ids.push(id);
    setWatchlist(ids);
    render(); // re-render current view to update button state
  }
  function updateWatchlistCount() {
    watchlistCountEl.textContent = String(getWatchlist().length);
  }

  // ---------- filtering ----------
  function filteredCourses() {
    const q = query.trim().toLowerCase();
    // Keep the latest-courses homepage intact; search and category views include verified bundle courses.
    const pool = activeCategory !== "All" || q ? catalog() : COURSES;
    return pool.filter((c) => {
      const okCat = activeCategory === "All" || c.category === activeCategory;
      const okQ = !q || c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
      return okCat && okQ;
    });
  }

  // ---------- views ----------
  function homeView() {
    const list = filteredCourses();
    const filterBar =
      activeCategory !== "All" || query.trim()
        ? `<div><span class="active-filter">Showing ${list.length} result${list.length === 1 ? "" : "s"}${activeCategory !== "All" ? ` in ${esc(activeCategory)}` : ""}${query.trim() ? ` for “${esc(query.trim())}”` : ""} <button id="clearFilter" aria-label="Clear filters">✕ Clear</button></span></div>`
        : "";

    if (list.length === 0) {
      return `
        <section class="hero">
          <h1>Welcome to ${esc(SITE_CONFIG.siteName)}</h1>
          <p class="subtitle">Latest courses added</p>
          ${filterBar}
        </section>
        <div class="empty"><h2>No courses found</h2><p>Try a different search or category.</p></div>`;
    }

    const byMonth = {};
    list.forEach((c) => { const group = c.month || "More courses"; (byMonth[group] = byMonth[group] || []).push(c); });
    const months = MONTH_ORDER.filter((m) => byMonth[m]).concat(Object.keys(byMonth).filter((m) => !MONTH_ORDER.includes(m)));

    const sections = months
      .map((m) => `
        <section class="month-section">
          <h2 class="month-title">${esc(m)} <span class="month-count">${byMonth[m].length} course${byMonth[m].length === 1 ? "" : "s"}</span></h2>
          <div class="grid">${byMonth[m].map(cardHtml).join("")}</div>
        </section>`)
      .join("");

    return `
      <section class="hero">
        <h1>Welcome to ${esc(SITE_CONFIG.siteName)}</h1>
        <p class="subtitle">Latest courses added</p>
        ${filterBar}
      </section>
      ${sections}`;
  }

  function detailView(course) {
    if (BUNDLES[course.id]) {
      const items = BUNDLES[course.id].map(([id, title, image, category]) => ({ id, title, thumbnail: THUMB(image), category }));
      return `<div class="grid bundle-grid">${items.map(cardHtml).join("")}</div>`;
    }
    const access = telegramAccessUrl(course.accessTitle || course.title);
    const saved = inWatchlist(course.id);
    const learnItems = course.learn || [];
    const isLong = learnItems.length > 5;
    const visibleLearn = isLong ? learnItems.slice(0, 5) : learnItems;
    const hiddenLearn = isLong ? learnItems.slice(5) : [];
    const learn = visibleLearn.map((item) => `<li><span class="tick">✓</span><span>${esc(item)}</span></li>`).join("");
    const hidden = hiddenLearn.map((item) => `<li><span class="tick">✓</span><span>${esc(item)}</span></li>`).join("");
    return `
      <a class="back-link" href="#/">← Back to all courses</a>
      <div class="detail">
        <div>
          <div class="detail-media">
            <img src="${esc(course.thumbnail)}" alt="${esc(course.title)}" onerror="this.style.display='none'" />
          </div>
        </div>
        <div class="detail-info">
          ${course.category ? `<span class="cat-badge" style="position:static;display:inline-block">${esc(course.category)}</span>` : ""}
          <h1>${esc(course.title)}</h1>
          <div class="detail-actions">
            <a class="btn btn-access" href="${esc(access)}" target="_blank" rel="noopener">Get Access</a>
            <button class="btn btn-outline" data-watch="${course.id}">${saved ? "★ Saved to Watchlist" : "☆ Save to Watchlist"}</button>
          </div>
          ${course.about || course.learn?.length ? `<h2>About this course</h2>` : ""}
          ${course.about ? `<p>${esc(course.about)}</p>` : ""}
          ${learn ? `<h2>${esc(course.learnHeading || "What You’ll Learn")}</h2><ul class="learn-list">${learn}</ul>${hidden ? `<ul class="learn-list" id="extraLearn" style="display:none">${hidden}</ul><button class="btn btn-ghost btn-sm" id="showFullBtn" style="margin-top:10px">Show full description</button>` : ""}` : ""}
          ${course.officialUrl ? `<a class="official-link" href="${esc(course.officialUrl)}" target="_blank" rel="noopener">Official course page ↗</a>` : ""}
        </div>
      </div>`;
  }

  function watchlistView() {
    const ids = getWatchlist();
    const saved = ids.map(courseById).filter(Boolean);
    if (!saved.length) {
      return `
        <section class="hero"><h1>Your Watchlist</h1><p class="subtitle">Courses you saved for later</p></section>
        <div class="empty"><h2>Nothing saved yet</h2><p>Open any course and tap “Save to Watchlist”.</p><p><a class="btn btn-primary" href="#/">Browse courses</a></p></div>`;
    }
    return `
      <section class="hero"><h1>Your Watchlist</h1><p class="subtitle">${saved.length} saved course${saved.length === 1 ? "" : "s"}</p></section>
      <div style="padding:20px 0 40px">
        ${saved.map((c) => `
          <div class="watch-item">
            <img src="${esc(c.thumbnail)}" alt="" loading="lazy" onerror="this.style.display='none'" />
            <div class="wi-info">
              <p class="wi-title"><a href="#/course/${c.id}">${esc(c.title)}</a></p>
              <span class="month-count">${esc(c.category)} · ${esc(c.month)}</span>
            </div>
            <div class="wi-actions">
              <a class="btn btn-access btn-sm" href="${esc(telegramAccessUrl(c.title))}" target="_blank" rel="noopener">Get Access</a>
              <button class="btn btn-ghost btn-sm" data-watch="${c.id}">Remove</button>
            </div>
          </div>`).join("")}
      </div>`;
  }

  function notFoundView() {
    return `<div class="empty"><h2>We couldn't find that page</h2><p>It may have been moved or removed.</p><p><a class="btn btn-primary" href="#/">Go home</a></p></div>`;
  }

  // ---------- router ----------
  function render() {
    const hash = location.hash || "#/";
    const m = hash.match(/^#\/course\/(.+)$/);
    if (m) {
      const course = courseById(decodeURIComponent(m[1]));
      app.innerHTML = course ? detailView(course) : notFoundView();
      document.title = course ? `${course.title} | ${SITE_CONFIG.siteName}` : SITE_CONFIG.siteName;
    } else if (hash === "#/watchlist") {
      app.innerHTML = watchlistView();
      document.title = `Watchlist | ${SITE_CONFIG.siteName}`;
    } else {
      app.innerHTML = homeView();
      document.title = SITE_CONFIG.siteName;
    }
    window.scrollTo({ top: 0 });
    bindDynamic();
  }

  function bindDynamic() {
    app.querySelectorAll("[data-watch]").forEach((btn) => {
      btn.addEventListener("click", () => toggleWatchlist(btn.getAttribute("data-watch")));
    });
    const clear = document.getElementById("clearFilter");
    if (clear) clear.addEventListener("click", () => {
      activeCategory = "All"; query = "";
      searchInput.value = ""; searchInputMobile.value = "";
      syncCategoryUI(); render();
    });
    const showFull = document.getElementById("showFullBtn");
    if (showFull) showFull.addEventListener("click", () => {
      const extra = document.getElementById("extraLearn");
      const open = extra.style.display === "none";
      extra.style.display = open ? "grid" : "none";
      showFull.textContent = open ? "Show less" : "Show full description";
    });
  }

  // ---------- categories UI ----------
  function buildCategoryUI() {
    const counts = categoryCounts();
    const items = ["All", ...CATEGORIES];
    categoryMenu.innerHTML = items.map((cat) => {
      const n = cat === "All" ? catalog().length : (counts[cat] || 0);
      return `<button role="menuitem" data-cat="${esc(cat)}"><span>${esc(cat === "All" ? "All Categories" : cat)}</span><span class="cat-count">${n}</span></button>`;
    }).join("");
    mobileCats.innerHTML = items.map((cat) => `<button class="btn btn-ghost btn-sm" data-cat="${esc(cat)}">${esc(cat === "All" ? "All" : cat)}</button>`).join("");
    categoryMenu.querySelectorAll("[data-cat]").forEach((b) => b.addEventListener("click", () => selectCategory(b.getAttribute("data-cat"))));
    mobileCats.querySelectorAll("[data-cat]").forEach((b) => b.addEventListener("click", () => selectCategory(b.getAttribute("data-cat"))));
  }

  function selectCategory(cat) {
    activeCategory = cat;
    syncCategoryUI();
    categoryMenu.classList.remove("open");
    categoryBtn.setAttribute("aria-expanded", "false");
    if (!location.hash || location.hash === "#/") render();
    else location.hash = "#/";
  }

  function syncCategoryUI() {
    categoryBtnLabel.textContent = activeCategory === "All" ? "Browse Categories" : activeCategory;
    categoryBtn.classList.toggle("active", activeCategory !== "All");
    mobileCats.querySelectorAll("[data-cat]").forEach((b) => b.classList.toggle("active", b.getAttribute("data-cat") === activeCategory));
  }

  // ---------- search ----------
  function onSearch(value, source) {
    query = value;
    if (source !== searchInput) searchInput.value = value;
    if (source !== searchInputMobile) searchInputMobile.value = value;
    if (!location.hash || location.hash === "#/") render();
    else location.hash = "#/";
  }
  searchInput.addEventListener("input", (e) => onSearch(e.target.value, searchInput));
  searchInputMobile.addEventListener("input", (e) => onSearch(e.target.value, searchInputMobile));

  // ---------- dropdown & mobile menu ----------
  categoryBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = categoryMenu.classList.toggle("open");
    categoryBtn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#categoryDropdown")) {
      categoryMenu.classList.remove("open");
      categoryBtn.setAttribute("aria-expanded", "false");
    }
  });
  menuToggle.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  // ---------- static links from config ----------
  document.getElementById("chatFab").href = telegramChatUrl();
  document.getElementById("footerTelegram").href = telegramChatUrl();
  document.getElementById("footerTelegram").textContent = `Telegram: @${SITE_CONFIG.telegramUsername}`;
  document.getElementById("year").textContent = String(new Date().getFullYear());

  // ---------- boot ----------
  buildCategoryUI();
  syncCategoryUI();
  updateWatchlistCount();
  window.addEventListener("hashchange", render);
  render();
})();
