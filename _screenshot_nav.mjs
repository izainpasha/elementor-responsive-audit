import puppeteer from 'puppeteer';

const browser = await puppeteer.launch();
const page = await browser.newPage();

// Desktop
await page.setViewport({ width: 1440, height: 900 });
await page.goto('https://paradisejets.com/', { waitUntil: 'networkidle2' });
await page.screenshot({ path: 'screenshots/nav-desktop.png' });

// Mobile
await page.setViewport({ width: 390, height: 844 });
await page.goto('https://paradisejets.com/', { waitUntil: 'networkidle2' });
await page.screenshot({ path: 'screenshots/nav-mobile.png' });

await browser.close();
console.log('done');
