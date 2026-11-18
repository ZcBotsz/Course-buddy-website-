import { chromium } from 'playwright';
const B = 'http://127.0.0.1:3000';
const b = await chromium.launch({ args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const out = {};

// 1. Search "return to" behaviour: category -> search -> clear should go back to category
await p.goto(B + '/category/ai', { waitUntil: 'networkidle' });
await p.getByLabel('Search everything').fill('german');
await p.waitForURL('**/search?**', { timeout: 10000 });
await p.getByLabel('Search everything').fill('');
await p.waitForTimeout(1200);
out.searchReturnTo = { expected: '/category/ai', actual: new URL(p.url()).pathname };

// 2. Load-more limit should reset when the query changes
await p.goto(B + '/search?q=a', { waitUntil: 'networkidle' });
const more = p.getByRole('button', { name: 'Load more' });
if (await more.count()) { await more.click(); await p.waitForTimeout(300); }
const before = await p.locator('[data-testid="course-card"]').count();
await p.getByLabel('Search everything').fill('handwriting');
await p.waitForTimeout(1200);
out.loadMoreReset = { cardsAfterLongQuery: before, cardsAfterNewQuery: await p.locator('[data-testid="course-card"]').count() };

// 3. Escape should close the mobile categories modal
const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await m.goto(B + '/', { waitUntil: 'networkidle' });
await m.getByRole('button', { name: 'Categories', exact: true }).click();
await m.waitForTimeout(400);
const openBefore = await m.getByRole('dialog').count();
await m.keyboard.press('Escape');
await m.waitForTimeout(400);
out.escapeClosesModal = { openBefore, openAfterEscape: await m.getByRole('dialog').count() };

// 4. Invalid HTML nesting: interactive button inside anchor
await p.goto(B + '/', { waitUntil: 'networkidle' });
out.nestedInteractive = await p.evaluate(() => document.querySelectorAll('a button, a a').length);

// 5. Nested <main> landmarks on 404
const r404 = await p.goto(B + '/definitely-not-a-page', { waitUntil: 'networkidle' });
out.notFound = { status: r404.status(), mainElements: await p.evaluate(() => document.querySelectorAll('main').length) };

// 6. favicon
const fav = await fetch(B + '/favicon.ico');
out.faviconStatus = fav.status;

console.log(JSON.stringify(out, null, 2));
await b.close();
