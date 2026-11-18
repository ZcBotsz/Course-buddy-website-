import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const bad = ['Courses_Buddy', 't.me/Courses_Buddy', 'telegram.me/Courses_Buddy', 'Course Buddy 2'];
const include = ['app', 'lib', 'data', 'public', 'styles'];
const files = [];
function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.(tsx?|jsx?|css|json|webmanifest|html|txt)$/.test(e.name)) files.push(p); } }
for (const d of include) if (fs.existsSync(path.join(root, d))) walk(path.join(root, d));
let failures = [];
for (const f of files) { const s = fs.readFileSync(f, 'utf8'); for (const b of bad) if (s.includes(b)) failures.push(`${f}: contains ${b}`); }
const courses = JSON.parse(fs.readFileSync('data/courses.json', 'utf8'));
const updates = JSON.parse(fs.readFileSync('data/updates.json', 'utf8'));
const categories = JSON.parse(fs.readFileSync('data/categories.json', 'utf8'));
const config = fs.readFileSync('lib/config.ts', 'utf8');
if (!config.includes("SITE_NAME = 'Course Buddy'")) failures.push('config site name mismatch');
const manifestRoute = fs.readFileSync('app/manifest.ts', 'utf8');
if (!manifestRoute.includes('name: SITE_NAME') || !manifestRoute.includes('short_name: SITE_NAME')) failures.push('manifest route not using SITE_NAME');
if (fs.existsSync('public/manifest.webmanifest')) failures.push('duplicate static manifest shadows app/manifest.ts');
if (!config.includes("TELEGRAM_USERNAME = 'CourseBuddy_Admin'")) failures.push('config username mismatch');
if (!config.includes('https://t.me/${TELEGRAM_USERNAME}')) failures.push('config base mismatch');
for (const c of courses) { if (c.thumbnail_url && !fs.existsSync(path.join('public', c.thumbnail_url))) failures.push(`missing thumbnail ${c.id} ${c.thumbnail_url}`); }
for (const c of categories) { if (c.thumbnail_url && !fs.existsSync(path.join('public', c.thumbnail_url))) failures.push(`missing category thumbnail ${c.slug}`); }
console.log(JSON.stringify({ courses: courses.length, categories: categories.length, updates: updates.length, filesScanned: files.length, failures }, null, 2));
if (failures.length) process.exit(1);
