const puppeteer = require('puppeteer');
const state = require('./state.js');


async function download() {
    console.log('> Logging in your account...')
    const userinfo = state.load()

    (async () => {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        await page.goto(`https://instagram.com`)
    });
  
  
    
}

module.exports = download;