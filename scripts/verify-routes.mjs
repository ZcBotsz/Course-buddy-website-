import fs from 'node:fs';
fs.mkdirSync('screenshots', { recursive: true });
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const courses = JSON.parse(fs.readFileSync('data/courses.json', 'utf8'));
const categories = JSON.parse(fs.readFileSync('data/categories.json', 'utf8'));
const routes = ['/', '/search?q=ai', '/watchlist', '/updates', ...categories.map(c => `/category/${c.slug}`), ...courses.map(c => `/course/${c.id}`)];
let failed = []; let done = 0; const concurrency = 12;
async function worker(queue) { while (queue.length) { const r = queue.shift(); try { const res = await fetch(BASE + r); const text = await res.text(); if (res.status !== 200) failed.push({ route: r, status: res.status }); else if (r.startsWith('/course/') && !text.includes('Course Buddy')) failed.push({ route: r, status: 'missing brand' }); } catch (e) { failed.push({ route: r, status: String(e) }); } done++; if (done % 250 === 0) console.log(done + '/' + routes.length); } }
const queue = [...routes]; await Promise.all(Array.from({ length: concurrency }, () => worker(queue)));
console.log(JSON.stringify({ checked: routes.length, failed: failed.length, failures: failed.slice(0, 20) }, null, 2));
fs.writeFileSync('screenshots/route-results.json', JSON.stringify({ checked: routes.length, failed: failed.length, failures: failed }, null, 2));
process.exit(failed.length ? 1 : 0);
