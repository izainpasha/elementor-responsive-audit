import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

const slugs = [
  '', 'aviation-consulting-new', 'inside-paradise-new', 'contact-new',
  'block-charter-new', 'co-ownership-new', 'aircraft-investment-new', 'aircraft-buy-sell-services-new'
];

for (const slug of slugs) {
  const url = `https://paradisejets.com/${slug}${slug ? '/' : ''}`;
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  const templateId = await page.evaluate(() => {
    const headerEl = document.querySelector('[data-elementor-type="header"]');
    return headerEl ? headerEl.getAttribute('data-elementor-id') : null;
  });
  console.log((slug || 'home-page-v1'), '->', templateId);
}

await browser.close();
