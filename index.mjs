import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const homepage = "https://my360265.sapbydesign.com/sap/public/ap/ui/repository/SAP_UI/HTMLOBERON5/client.html"

    await page.goto(homepage);

    // // Type into search box.
    login("aviv-b", "2468Aviv", page);
    goToHoursFillingPage(page);

})();


async function login(username, password, page) {
    const logOnButton = '#__control0-logonBtn-inner';

    await page.type('#__control0-user-inner', 'aviv-b');
    await page.type('#__control0-pass-inner', '2468Aviv');
    await page.click(logOnButton);
    await page.waitForNetworkIdle({ idleTime: 500 });

    if (is_already_connected(page))
    {
        console.log("wall")
        const continueButton = '#__control1-continueBtn-inner';
        await page.click(continueButton);
    }
}

async function goToHoursFillingPage(page) {
    const homeButton = '.sapBUiShMnuItemIcon';
    const selfServicesDashboard = '#__item39';
    const editTimeShit = '#__link26';
    await page.waitForSelector(homeButton);
    await page.click(homeButton);

    await page.waitForSelector(selfServicesDashboard);
    await page.click(selfServicesDashboard);

    await page.waitForSelector(editTimeShit);
    await page.click(editTimeShit);
}

async function is_already_connected(page) {
    await page.evaluate(() => {
        const button = document.querySelector(".__control1-continueBtn-inner")
        return button ? true : false
    })
}