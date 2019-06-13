const puppeteer = require('puppeteer');
const fs = require('fs');

const url = 'https://www.youtube.com/feed/trending';

(async () => {
  try {
  
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('ytd-app', { headless: false });
    
    let trends = [];

    const videos = await page.$$("ytd-video-renderer");
    for(const video of videos) {
      const title = await video.$eval('a#video-title' , a => a.innerText);
      const meta = await video.$('ytd-video-meta-block');
      const user = await meta.$eval('a', a => a.innerText);
      trends.push({
        title: title.trim(),
        user: user
      });
    }

    await browser.close();
    writeTrendsToFile(trends);
  } catch (error) {
    console.log(error);
  }
})();

function writeTrendsToFile(trends) {
  const filename = new Date().toISOString().slice(0,10) + '.json';
  fs.writeFileSync(filename, JSON.stringify(trends));
}