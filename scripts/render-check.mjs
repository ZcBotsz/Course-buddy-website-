import { chromium } from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('screenshots', { recursive: true });
const b = await chromium.launch({ args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [], failed = [];
p.on('pageerror', e => errors.push(String(e)));
p.on('requestfailed', r => failed.push(r.url() + ' :: ' + (r.failure()?.errorText || '')));
const res = await p.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(1200);
const info = await p.evaluate(() => ({
  title: document.title,
  h1: document.querySelector('h1')?.innerText,
  cards: document.querySelectorAll('[data-testid="course-card"]').length,
  imgsLoaded: [...document.images].filter(i => i.complete && i.naturalWidth > 0).length,
  imgsTotal: document.images.length,
  bodyBg: getComputedStyle(document.body).backgroundColor,
  textLen: document.body.innerText.length
}));
console.log('HTTP', res.status());
console.log(JSON.stringify(info, null, 2));
console.log('pageErrors:', errors.length, errors.slice(0,3));
console.log('failedRequests:', failed.length, failed.slice(0,3));
await p.screenshot({ path: 'screenshots/preview-check.png' });
await b.close();
