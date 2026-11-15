import { chromium } from 'playwright';
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await page.setContent(`<!doctype html><html><head><style>
@font-face{font-family:Inter;src:url('http://localhost:3000/fonts/83afe278b6a6bb3c-s.p.2bn3s6zvc0dyp.woff2') format('woff2');font-weight:400}
@font-face{font-family:Inter;src:url('http://localhost:3000/fonts/83afe278b6a6bb3c-s.p.2bn3s6zvc0dyp.woff2') format('woff2');font-weight:600}
*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#f6f2fc,#e9e2f6);font-family:Inter,sans-serif}
.icon{width:170px;height:170px;border-radius:42px;background:linear-gradient(135deg,#8b6cd0,#6a4bb0);display:flex;align-items:center;justify-content:center;color:#fff;font-size:64px;font-weight:500;box-shadow:0 18px 40px rgba(106,75,176,.25)}
h1{margin:48px 0 0;font-size:76px;font-weight:500;color:#261d3a;letter-spacing:-2px}h1 span{color:#6a4bb0}p{margin:18px 0 0;font-size:34px;color:#6f6488}
</style></head><body><div class="icon">CB</div><h1>Course <span>Buddy</span></h1><p>Premium Courses Library</p></body></html>`);
await page.waitForTimeout(500);
await page.screenshot({ path: 'public/og.png' });
await browser.close();
console.log('og.png generated');
