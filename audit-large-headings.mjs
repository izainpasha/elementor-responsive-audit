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
  await page.setViewport({ width: 1339, height: 800, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });

  const result = await page.evaluate(() => {
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
    const seen = new Set();
    return headings.map((h) => {
      const s = getComputedStyle(h);
      const fontSize = parseFloat(s.fontSize);
      if (fontSize < 60) return null;
      const dataId = h.closest('[data-id]')?.getAttribute('data-id') || '';
      const key = dataId + '|' + h.textContent.trim().slice(0, 30);
      if (seen.has(key)) return null; // dedupe (swiper clones etc.)
      seen.add(key);
      return {
        dataId,
        tag: h.tagName.toLowerCase(),
        fontSize: s.fontSize,
        cls: [...h.classList].filter(c => c.startsWith('elementor-size')).join(' '),
        text: h.textContent.trim().slice(0, 40),
      };
    }).filter(Boolean);
  });
  console.log(url.replace('https://paradisejets.com/', '').replace(/\/$/, ''), JSON.stringify(result));
  await page.close();
}

await browser.close();
