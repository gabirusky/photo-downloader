const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const archiver = require('archiver');
const state = require('./state.js');

async function download() {
  console.log('> Starting download...')
  const userinfo = state.load()

  // Promise-based download
  const download = (url, destination) => new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);

    https.get(url, response => {
      response.pipe(file);

      file.on('finish', () => {
        file.close(resolve(true));
      });
    }).on('error', error => {
      fs.unlink(destination);

      reject(error.message);
    });
  });

  // puppeteer launch
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://instagram.com/${userinfo.username}`);

    // infinite scroll
    await autoScroll(page);

    /*   const imgList = await page.evaluate(() => {
      // toda essa função será executada no browser
      // vamos pegar todas as imagens que estao na parte de posts
      const nodeList = document.querySelectorAll('article img')
      // transformar o NodeList em array
      const imgArray = [...nodeList]
      // transformar os nodes (elementos html) em objetos JS
      const imgList = imgArray.map( ({src}) => ({
        src
      }))
      // colocar para fora da função 
      return imgList
      });
    
      // escrever os dados em um arquivo local (json)
      fs.writeFile('instagram.json', JSON.stringify(imgList, null, 2), err => {
          if(err) throw new Error('something went wrong')
    
          console.log('well done!')
      }) */

    // create array with imgs src urls
    const imgList = await page.evaluate(() => Array.from(document.querySelectorAll('article img'), e => e.src));

    // create directory $username
    const directory = fs.mkdir(`./imgs/${userinfo.username}`, { recursive: true }, (err) => {
      if (err) throw err;
      return directory
    });

    // for loop downloading all imgs from [imgList]
    for (let i = 0; i < imgList.length; i++) {
      const result = await download(imgList[i], `./imgs/${userinfo.username}/${userinfo.username}[${i}].png`);

      if (result === true) {
        console.log(`Sucess: ${userinfo.username}[${[i]}].png has been downloaded!`);
      } else {
        console.log(`Error: ${userinfo.username}[${[i]}].png has not been downloaded.`);
        console.error(result);
      }
    }

    // infinite scroll script
    async function autoScroll(page) {
      await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
    }

    // create zip file 
    const usersource = `./imgs/${userinfo.username}/`
    const userout = `./imgs/${userinfo.username}/${userinfo.username}.zip`

    function zipDirectory(source, out) {
      const archive = archiver('zip', { zlib: { level: 9 } });
      const output = fs.createWriteStream(out);

      return new Promise((resolve, reject) => {
        archive
          .directory(source, false)
          .on('error', err => reject(err))
          .pipe(output);

        output.on('close', () => resolve());
        archive.finalize();
        console.log(`Sucess: ${userinfo.username}.zip has been created.`);
      });
    }

    zipDirectory(usersource, userout);

    await browser.close();

  })();

  // delete JSON containing userinfo
  state.deleteJson();

}
