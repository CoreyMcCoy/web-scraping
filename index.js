const PORT = process.env.PORT || 3000;
const express = require('express');
const cheerio = require('cheerio'); // for parsing html
const puppeteer = require('puppeteer'); // for scraping
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const page_url = 'https://www.missionimprintables.com/en/products/brand/30/Next-Level-Apparel';
const arr = [];

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/results', async (req, res) => {
    try {
        (async () => {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto(page_url);
            await page.screenshot({ path: 'screenshot2.png' });

            const pageData = await page.evaluate(() => {
                return {
                    html: document.querySelector('html').innerHTML,
                };
            });

            const $ = cheerio.load(pageData.html);

            $('#ulProds > li').each(function () {
                const img = $(this).find('img').attr('src');
                const title = $(this).find('div > span.title').text();
                const url = $(this).find('li > a.vt').attr('href');
                arr.push({
                    img,
                    title,
                    url: `https://www.missionimprintables.com${url}`,
                });
                return arr;
            });

            res.json(arr);
            await browser.close();
        })();
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
