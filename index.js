// const express = require('express');
// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const { promisify } = require('util');

// const PORT = process.env.PORT || 443

// // Format the date/time in a human-readable format
// const options = { 
//     year: 'numeric', 
//     month: 'short', 
//     day: 'numeric', 
//     hour: '2-digit', 
//     minute: '2-digit', 
//     second: '2-digit', 
//     timeZoneName: 'short' 
//   };

// const app = express();
// app.use(express.text())
// app.post('*', async (req, res) => {
//     res.send('Hello post')
//     console.debug('req', req)
//     //console.debug('host', req.get('host'))
//     const webhookURL = req.headers['referer'] || req.headers['origin'] || 'Unknown';
//     console.debug('webhookURL', webhookURL)
//     // console.debug('origin', req.get('origin'))
//     // console.debug('req', req.body)
// });

// app.get('*', async (req, res) => {
//     res.send('Hello get')
// });

// app.listen(PORT, function(err) {
//     if(err) console.error(err);
//     console.debug('Server listening on PORT: ', PORT)
// });

// //`https://api.telegram.org/bot${TOKEN}/${method}`

const customCSS = `
    #overlap-manager-root,
    [data-role="toast-container"] {
        display: none !important;
    }
`;

const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const { promisify } = require('util');

const PORT = process.env.PORT || 443;

const app = express();
app.use(express.text());

app.post('*', async (req, res) => {
    const url = req.body; // Assuming the URL is provided in the request body

    try {
        const screenshotPath = await takeScreenshot(url);
        console.debug('Screenshot saved:', screenshotPath);
        res.send('Screenshot saved');
    } catch (error) {
        console.error('Error taking screenshot:', error);
        res.status(500).send('Error taking screenshot');
    }
});

app.get('*', async (req, res) => {
    res.send('Hello get');
});

app.listen(PORT, function (err) {
    if (err) console.error(err);
    console.debug('Server listening on PORT:', PORT);
});

async function takeScreenshot(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    });
    await page.goto(url);
    await page.addStyleTag({ content: customCSS });
 
    await page.waitForSelector('.i-no-scroll', { timeout: 5000 });

    // Get the bounding box of the element
    const elementBoundingBox = await page.$eval('.chart-widget', el => {
        const { x, y, width, height } = el.getBoundingClientRect();
        return { left: x, top: y, width, height, id: el.id };
    });

    const screenshotPath = `screenshot_${Date.now()}.png`;
    await page.screenshot({
        path: screenshotPath,
        clip: {
            x: elementBoundingBox.left,
            y: elementBoundingBox.top,
            width: elementBoundingBox.width,
            height: elementBoundingBox.height
        }
    });
    await browser.close();
    return screenshotPath;
}