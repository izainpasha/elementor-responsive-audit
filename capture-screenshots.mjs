import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';

const pages = [
  { slug: 'home-page-v1', url: 'https://paradisejets.com/home-page-v1/' },
  { slug: 'aviation-consulting-new', url: 'https://paradisejets.com/aviation-consulting-new/' },
  { slug: 'inside-paradise-new', url: 'https://paradisejets.com/inside-paradise-new/' },
  { slug: 'contact-new', url: 'https://paradisejets.com/contact-new/' },
  { slug: 'block-charter-new', url: 'https://paradisejets.com/block-charter-new/' },
  { slug: 'co-ownership-new', url: 'https://paradisejets.com/co-ownership-new/' },
  { slug: 'aircraft-investment-new', url: 'https://paradisejets.com/aircraft-investment-new/' },
  { slug: 'aircraft-buy-sell-services-new', url: 'https://paradisejets.com/aircraft-buy-sell-services-new/' },
];

// Scope: below 1340px down to 767px (the tablet/laptop shrink range), plus
// the standard mobile checkpoints already used elsewhere in this audit.
const widths = [1339, 1200, 1024, 900, 768, 767, 425, 390];

const browser = await puppeteer.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox'],
});

for (const { slug, url } of pages) {
  const dir = `./screenshots/${slug}`;
  mkdirSync(dir, { recursive: true });

  for (const width of widths) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
      // Let entrance animations settle before capturing.
      await new Promise((r) => setTimeout(r, 600));
      await page.screenshot({ path: `${dir}/${slug}-${width}.png`, fullPage: true });
      console.log(`OK   ${slug} @ ${width}px`);
    } catch (err) {
      console.log(`FAIL ${slug} @ ${width}px: ${err.message}`);
    }
    await page.close();
  }
}

await browser.close();
