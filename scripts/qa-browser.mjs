import {chromium,firefox,webkit,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync,writeFileSync} from 'node:fs';
const base='http://127.0.0.1:8123';
const credentials=JSON.parse(readFileSync('/private/tmp/dr-rich-qa-admin.json','utf8'));
const report={browsers:[],accessibility:[],performance:[]};
async function login(page){await page.goto(base+'/admin/login');await page.getByLabel('Email address').fill(credentials.email);await page.getByLabel('Password',{exact:true}).fill(credentials.password);await page.getByRole('button',{name:'Sign in',exact:true}).click();await page.waitForURL('**/admin/dashboard');}
async function audit(page,name){const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();report.accessibility.push({page:name,violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});}
for(const [name,engine] of Object.entries({chromium,firefox,webkit})){
 const browser=await engine.launch({headless:true});const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/googletagmanager.com/**',r=>r.fulfill({contentType:'application/javascript',body:''}));
 await page.route('https://example.test/**',r=>r.fulfill({contentType:'text/html',body:'QA external destination'}));
 try{
  await page.goto(base);await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await page.getByRole('button',{name:'Essential only',exact:true}).click();
  if(name==='chromium'){await audit(page,'Home desktop');report.performance.push(await page.evaluate(()=>{const n=performance.getEntriesByType('navigation')[0];return {viewport:'desktop',domContentLoadedMs:Math.round(n.domContentLoadedEventEnd),loadMs:Math.round(n.loadEventEnd),transferredBytes:performance.getEntriesByType('resource').reduce((sum,r)=>sum+r.transferSize,0)}}));}
  for(const width of [768,390]){await page.setViewportSize({width,height:900});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Home overflow at '+width);if(await page.locator('.hero h1').evaluate(e=>e.scrollWidth>e.clientWidth))throw Error('Clipped heading');}
  await page.getByRole('button',{name:'Toggle navigation'}).click();await page.getByRole('link',{name:'Our story',exact:true}).click();await expect(page.getByRole('heading',{name:'About Dr. Rich',exact:true})).toBeVisible();
  await page.goto(base+'/books');await expect(page.getByText('Forthcoming',{exact:true})).toBeVisible();
  await page.goto(base+'/events');await expect(page.getByRole('heading',{name:'QA Event',exact:true})).toBeVisible();await page.locator('select[name="view"]').selectOption('past');await page.getByRole('button',{name:'Apply filters'}).click();await expect(page.getByRole('heading',{name:'QA Past Event',exact:true})).toBeVisible();
  await page.goto(base+'/articles?tag=qa-leadership');await expect(page.getByRole('heading',{name:'QA Article',exact:true})).toBeVisible();
  await page.goto(base+'/articles/qa-article');await expect(page.getByText('By QA Author')).toBeVisible();await expect(page.getByRole('heading',{name:'Continue exploring'})).toBeVisible();
  await page.goto(base+'/contact');if(name==='chromium')await audit(page,'Contact mobile');
  await page.getByLabel('Full name',{exact:true}).fill('QA '+name);await page.getByLabel('Email address',{exact:true}).fill(name+'@example.test');await page.getByLabel('Enquiry category').selectOption('Media');await page.getByLabel('Subject',{exact:true}).fill('QA media request');await page.getByLabel('Your message',{exact:true}).fill('Please review this isolated QA enquiry.');await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Send request',exact:true}).click();await expect(page.getByRole('status')).toContainText('received');
  await page.goto(base+'/speaking');await expect(page.getByLabel('Proposed topic')).toBeVisible();await page.getByLabel('Engagement format').selectOption('In person');
  await page.goto(base+'/consultations');await page.getByLabel('Requesting as').selectOption('Organisation');await expect(page.getByLabel('Area of interest').getByRole('option',{name:'QA Consultation Area'})).toHaveCount(1);
  await login(page);if(name==='chromium')await audit(page,'Dashboard mobile');
  await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/admin/settings');await expect(page.getByRole('heading',{name:'Homepage sections & order'})).toBeVisible();if(name==='chromium')await audit(page,'Settings desktop');
  await page.goto(base+'/admin/books');await page.getByRole('row').filter({hasText:'QA Book'}).getByRole('button',{name:'Edit'}).click();await expect(page.getByLabel('Major lessons')).toHaveValue('A useful lesson.');await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
  if(name==='chromium'){
   await page.goto(base+'/admin/media');await page.getByRole('button',{name:'Create resource'}).click();await page.getByLabel('Title',{exact:true}).fill('QA uploaded resource');await page.getByLabel('Image description',{exact:true}).fill('QA logo upload');await page.locator('input[type=file]').setInputFiles('drlogo.png');await expect(page.getByLabel('Image / cover URL')).toHaveValue(/\.webp$/);await page.getByRole('button',{name:'Save content',exact:true}).click();await expect(page.getByRole('dialog')).toHaveCount(0);
   await page.goto(base);await page.getByRole('button',{name:'Privacy choices',exact:true}).click();await page.getByRole('button',{name:'Allow analytics',exact:true}).click();await page.goto(base+'/books/qa-book');await page.getByRole('link',{name:'Pre-order / learn more'}).click();const tracked=await page.evaluate(()=>window.dataLayer?.some(x=>Array.from(x)[0]==='event'&&Array.from(x)[1]==='book_purchase_click'));if(!tracked)throw Error('Purchase conversion not recorded');
   await page.screenshot({path:'/private/tmp/dr-rich-qa-book.png',fullPage:true});
  }
  if(errors.length)throw Error(errors.join('\n'));report.browsers.push({name,result:'passed'});console.log(name+': browser workflows passed');
 }catch(error){await page.screenshot({path:'/private/tmp/dr-rich-qa-'+name+'-failure.png',fullPage:true});report.browsers.push({name,result:'failed',error:String(error)});console.error(name+': '+String(error));}finally{await browser.close();}
}
writeFileSync('/private/tmp/dr-rich-qa-report.json',JSON.stringify(report,null,2));
console.log('Accessibility:',JSON.stringify(report.accessibility.map(x=>({page:x.page,violations:x.violations.map(v=>({id:v.id,nodes:v.nodes.length}))}))));
console.log('Performance (local lab only):',JSON.stringify(report.performance));
if(report.browsers.some(x=>x.result==='failed')||report.accessibility.some(x=>x.violations.length))process.exitCode=1;
