const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({reducedMotion:"reduce"});
const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
const csv=(await readFile('data/scenarios.csv','utf8')).trim().split(/\r?\n/).map(l=>l.split(','));
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(n));
for(const width of [390,1440]){
 await page.setViewportSize({width,height:900});
 await page.goto('http://localhost:4173/',{waitUntil:'networkidle'});
 assert.equal(await page.locator('main>section').count(),9);
 const hero=await page.locator(width===390?'#hero-mobile-value':'#hero-value').boundingBox();
 assert.ok(hero.y+hero.height<=900,'key number is in first viewport');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`overflow at ${width}`);
 for(const name of ['base','bull','bear','token_trading_fades','imd_price_falls_70pct']){
  await page.locator(`button[data-scenario="${name}"]`).click();
  const final=csv.find(row=>row[0]===name&&row[1]==='12');
  assert.equal(await page.locator('#nav-value').textContent(),money(final[3]));
  assert.equal(await page.locator('#income-value').textContent(),money(final[4]));
  assert.equal(await page.locator('#imd-value').textContent(),money(final[10]));
  assert.equal(await page.locator('#monthly-rows tr').count(),12);
  const expectedRows=csv.filter(row=>row[0]===name);
  for(let i=0;i<12;i++){const values=await page.locator('#monthly-rows tr').nth(i).locator('td').allTextContents();assert.deepEqual(values,[3,4,9,2,11].map(index=>money(expectedRows[i][index])));}
  assert.equal(await page.locator('#volume-chart polyline').count(),2);
  assert.equal(await page.locator(`button[data-scenario="${name}"]`).getAttribute('aria-pressed'),'true');
  assert.ok(page.url().includes(`scenario=${name}`));
 }
 await page.reload();assert.equal(await page.locator('#scenario-title').textContent(),'IMD price falls 70%');
 await page.locator('button[data-scenario="token_trading_fades"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#scenario-title').textContent(),'Token trading fades');
 assert.match(await page.locator('#breakpoint-note').textContent(),/below/);
 await page.locator('.model-data summary').click();assert.equal(await page.locator('.model-data').getAttribute('open'),'');
 for(const href of ['report.md','model.py','scenarios.csv','sources.md']){const r=await page.request.get(`http://localhost:4173/assets/${href}`);assert.equal(r.status(),200);}
 await page.locator('.header a[href="#model"]').click();assert.equal(new URL(page.url()).hash,'#model');
 await page.locator('button[data-scenario="base"]').click();
 await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(300);
 await page.screenshot({path:`test/scratch/${width}.png`,fullPage:true});
 await page.screenshot({path:`test/scratch/${width}-viewport.png`});
 console.log(`PASS ${width}px: sections, overflow, five scenarios, CSV values, charts, state, keyboard, disclosures, links.`);
}
assert.deepEqual(errors,[]);console.log('PASS: no browser console, JavaScript or resource errors.');
await browser.close();
