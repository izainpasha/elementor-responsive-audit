import puppeteer from 'puppeteer';

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

const browser = await puppeteer.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox'],
});

for (const { slug, url } of pages) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1339, height: 1000, deviceScaleFactor: 1 });
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
  } catch (e) {
    console.log(slug, 'FAILED TO LOAD', e.message);
    await page.close();
    continue;
  }

  const result = await page.evaluate(() => {
    const clean = (v) => Math.round(v * 100) / 100;
    // top-level Elementor section containers directly under the page content
    const containers = [...document.querySelectorAll('.elementor-section, .e-con.e-parent')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 800; // full-width-ish sections only
      });
    return containers.slice(0, 40).map((el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        dataId: el.getAttribute('data-id') || '',
        left: clean(r.left), right: clean(window.innerWidth - r.right), width: clean(r.width),
        paddingLeft: s.paddingLeft, paddingRight: s.paddingRight,
      };
    });
  });
  console.log(`=== ${slug} ===`);
  console.log(JSON.stringify(result));
  await page.close();
}

await browser.close();
