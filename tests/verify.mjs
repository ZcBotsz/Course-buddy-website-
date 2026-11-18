import { chromium } from 'playwright';
import fs from 'node:fs';
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const OUT = 'screenshots'; fs.mkdirSync(OUT, { recursive: true });
const results = []; let failed = 0;
function check(name, ok, extra='') { results.push({ name, ok, extra }); if (!ok) failed++; console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' — ' + extra : ''}`); }
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = []; page.on('pageerror', e => errors.push(String(e)));
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
check('home loads', await page.title() === 'Course Buddy', await page.title());
check('welcome text', (await page.locator('h1').first().innerText()).includes('Welcome to Course Buddy'));
const access = page.locator('[data-testid="get-access"]').first();
const href = await access.getAttribute('href');
check('get access username', href.startsWith('https://t.me/CourseBuddy_Admin?text='), href.slice(0, 80));
check('get access message', decodeURIComponent(href).includes('I want access to'));
const chatHrefs = await page.locator('[data-testid="chat-link"]').evaluateAll(els => els.map(e => e.href));
check('chat links username', chatHrefs.length >= 2 && chatHrefs.every(h => h.startsWith('https://t.me/CourseBuddy_Admin')), String(chatHrefs.length));
check('no old username in DOM', !(await page.content()).includes('Courses_Buddy'));
await page.screenshot({ path: OUT + '/home-desktop.png', fullPage: false });
// category
await page.goto(BASE + '/category/ai', { waitUntil: 'networkidle' });
check('category AI', (await page.locator('h1').innerText()) === 'AI');
check('category cards', await page.locator('[data-testid="course-card"]').count() === 21, String(await page.locator('[data-testid="course-card"]').count()));
await page.screenshot({ path: OUT + '/category-ai.png', fullPage: false });
// course detail
await page.goto(BASE + '/course/9a8ec5f3-194c-4414-85e6-cb8daa8673e6', { waitUntil: 'networkidle' });
check('course detail h1', (await page.locator('h1').innerText()).includes('THE FIRST STEP'));
check('course detail access', (await page.locator('[data-testid="get-access"]').getAttribute('href')).includes('CourseBuddy_Admin'));
await page.screenshot({ path: OUT + '/course-detail.png', fullPage: false });
// bundle
await page.goto(BASE + '/course/5fffbc55-a8b2-4002-95fa-cee726172ca2', { waitUntil: 'networkidle' });
check('bundle children', await page.locator('[data-testid="course-card"]').count() === 8, String(await page.locator('[data-testid="course-card"]').count()));
// search
await page.goto(BASE + '/search?q=ai', { waitUntil: 'networkidle' });
check('search heading', (await page.locator('h1').innerText()).includes('Search results for'));
check('search has cards', await page.locator('[data-testid="course-card"]').count() > 0);
// watchlist save
await page.goto(BASE + '/course/9a8ec5f3-194c-4414-85e6-cb8daa8673e6', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Save to Watchlist' }).click();
check('watchlist saved button', await page.getByRole('button', { name: 'Saved' }).count() === 1);
await page.goto(BASE + '/watchlist', { waitUntil: 'networkidle' });
check('watchlist page has saved', await page.locator('[data-testid="course-card"]').count() === 1);
// mobile
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await mobile.goto(BASE + '/', { waitUntil: 'networkidle' });
await mobile.screenshot({ path: OUT + '/home-mobile.png', fullPage: false });
await mobile.getByRole('button', { name: 'Categories', exact: true }).click();
check('mobile categories modal', await mobile.getByRole('dialog', { name: 'Browse categories' }).count() === 1);
await mobile.screenshot({ path: OUT + '/mobile-categories.png', fullPage: false });
await mobile.waitForTimeout(350);
await mobile.locator('div[role="dialog"] a[href="/category/ai"]').click();
await mobile.waitForURL('**/category/ai', { timeout: 10000 });
check('mobile category nav', mobile.url().includes('/category/ai'));
// --- regression checks for fixed bugs ---
await page.goto(BASE + '/category/ai', { waitUntil: 'networkidle' });
await page.getByLabel('Search everything').fill('german');
await page.waitForURL('**/search?**', { timeout: 10000 });
await page.getByLabel('Search everything').fill('');
await page.waitForURL(u => !u.pathname.startsWith('/search'), { timeout: 10000 });
check('clearing search returns to origin page', new URL(page.url()).pathname === '/category/ai', new URL(page.url()).pathname);

await page.goto(BASE + '/', { waitUntil: 'networkidle' });
const nested = await page.evaluate(() => document.querySelectorAll('a button, a a').length);
check('no interactive elements nested inside anchors', nested === 0, String(nested));

const nf = await page.goto(BASE + '/definitely-not-a-page', { waitUntil: 'networkidle' });
check('unknown route returns 404', nf.status() === 404, String(nf.status()));
const mains = await page.evaluate(() => document.querySelectorAll('main').length);
check('single main landmark on 404', mains === 1, String(mains));

const fav = await fetch(BASE + '/favicon.ico');
check('favicon served', fav.status === 200, String(fav.status));
const man = await (await fetch(BASE + '/manifest.webmanifest')).json();
check('manifest served from app route', man.name === 'Course Buddy', man.name);

await mobile.goto(BASE + '/', { waitUntil: 'networkidle' });
await mobile.getByRole('button', { name: 'Categories', exact: true }).click();
await mobile.waitForTimeout(300);
await mobile.keyboard.press('Escape');
await mobile.waitForTimeout(300);
check('Escape closes categories modal', await mobile.getByRole('dialog').count() === 0);

check('no page errors', errors.length === 0, errors.join('; '));
await browser.close();
fs.writeFileSync(OUT + '/results.json', JSON.stringify({ base: BASE, failed, results }, null, 2));
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
