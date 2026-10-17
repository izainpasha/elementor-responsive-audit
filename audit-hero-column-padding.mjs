import puppeteer from 'puppeteer';

const pages = [
  'https://paradisejets.com/home-page-v1/',
  'https://paradisejets.com/aviation-consulting-new/',
  'https://paradisejets.com/inside-paradise-new/',
  'https://paradisejets.com/contact-new/',
  'https://paradisejets.com/block-charter-new/',
  'https://paradisejets.com/co-ownership-new/',
  'https://paradisejets.com/aircraft-investment-new/',
  'https://paradisejets.com/aircraft-buy-sell-services-new/',
];

const browser = await puppeteer.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox'],
});

for (const url of pages) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1198, height: 800, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });

  const result = await page.evaluate(() => {
    // find hero: first .e-con.e-parent within first 700px with height > 300
    const hero = [...document.querySelectorAll('.e-con.e-parent')].find(el => {
      const r = el.getBoundingClientRect();
      return r.top < 700 && r.height > 300;
    });
    if (!hero) return 'no hero';
    // find 2-column grid rows within hero with mismatched padding
    const rows = hero.querySelectorAll('.e-grid.e-con.e-child, [style*="grid-template-columns"]');
    const mismatches = [];
    for (const row of rows) {
      const kids = [...row.children].filter(c => c.getBoundingClientRect().width > 50);
      if (kids.length !== 2) continue;
      const [a, b] = kids;
      const pa = getComputedStyle(a).paddingLeft;
      const pb = getComputedStyle(b).paddingLeft;
      if (pa !== pb) {
        mismatches.push({
          rowDataId: row.getAttribute('data-id'),
          colA: { dataId: a.getAttribute('data-id'), paddingLeft: pa, paddingRight: getComputedStyle(a).paddingRight },
          colB: { dataId: b.getAttribute('data-id'), paddingLeft: pb, paddingRight: getComputedStyle(b).paddingRight },
        });
      }
    }
    return mismatches;
  });
  console.log(url.replace('https://paradisejets.com/', '').replace(/\/$/, ''), JSON.stringify(result));
  await page.close();
}

await browser.close();
