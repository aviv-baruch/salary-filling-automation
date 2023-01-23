import puppeteer from 'puppeteer';
import token from './token.json' assert {type: 'json'};
import configuration from './configuration.json' assert {type: 'json'};


(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const homepage = "https://my360265.sapbydesign.com/sap/public/ap/ui/repository/SAP_UI/HTMLOBERON5/client.html"
    //user data

    const username = configuration.users.username
    const password = configuration.users.password
    console.log(username, password)
    //data to be filled
    const task = configuration.data.task
    const taskDescription = configuration.data.taskDescription
    const hours = {
        total: configuration.data.hours.total,
        startTime: configuration.data.hours.startTime,
        endTime: configuration.data.hours.endTime
    }
    const dayDescription = configuration.data.dayDescription
    let text = `${task} ${taskDescription}`


    await page.goto(homepage);
    await login(username, password, page);
    await goToHoursFillingPage(page);
    await choose_today(page);
    await select_today(page, text)
    await fill_today(page, hours, dayDescription)

    console.log("sucess!")
    await browser.close();
})();


async function login(username, password, page) {
    const logOnButton = '#__control0-logonBtn-inner';

    await page.type('#__control0-user-inner', username);
    await page.type('#__control0-pass-inner', password);
    await page.click(logOnButton);
    await page.waitForNetworkIdle({ idleTime: 500 });

    if (is_already_connected(page)) //activated if more than one account is already connected
    {
        const continueButton = '#__control1-continueBtn-inner';
        const deleteSessions = "#__box0-CbBg"
        await page.click(deleteSessions);
        await page.waitForNetworkIdle({ idleTime: 500 });
        await page.click(continueButton);
    }
}

async function goToHoursFillingPage(page) {
    const homeButton = '.sapBUiShMnuItemIcon';
    const selfServicesDashboard = '#__item39';
    const editTimeShit = '#__link26';
    try
    {
        await page.waitForSelector(homeButton);
        await page.click(homeButton);

        await page.waitForSelector(selfServicesDashboard);
        await page.click(selfServicesDashboard);

        await page.waitForSelector(editTimeShit);
        await page.waitForNetworkIdle({ idleTime: 500 });
        await page.click(editTimeShit)
    } catch {
        console.log("error")

    }
}

async function is_already_connected(page) {
    await page.evaluate(() => {
        const button = document.querySelector(".__control1-continueBtn-inner")
        return button ? true : false
    })
}

async function choose_today(page) {
    const day = `[data-day="${(new Date).getDate()}"]`
    const month = `[data-month="${(new Date).getMonth() + 1}"]`
    const year = `[data-year="${(new Date).getFullYear()}"]`
    await page.waitForSelector(day);
    await page.click(day + month + year);

}

async function select_today(page, workDetails) {
    const catagoryOptionsSelector = '#__box42-arrow'
    const openTaskCatagory = "#__input13-vhi"
    const search = "#__pane8-searchField-I"
    const desiredChoice = "#__table3_r0"
    const dayToFill = await getDayOfWeekSelector();

    await page.waitForSelector(catagoryOptionsSelector);
    await page.click(catagoryOptionsSelector);

    await page.waitForSelector(openTaskCatagory);
    await page.click(openTaskCatagory);

    await page.waitForSelector(search);
    await page.waitForNetworkIdle({ idleTime: 500 });
    await page.focus(search)
    await page.keyboard.type(workDetails)
    await page.keyboard.press('Enter');

    await page.waitForNetworkIdle({ idleTime: 500 });
    await page.click(desiredChoice);

    await page.waitForNetworkIdle({ idleTime: 500 });
    await page.click(dayToFill);
}


async function fill_today(page, hours, description) {
    const billableHours = '#__field113'
    const workDescription = "#__area8-inner"
    const startTime = "#__field117"
    const endTime = "#__field119"
    const release = "#__button33"
    const all = "#__item191" //missing
    await page.waitForNetworkIdle({ idleTime: 500 });
    await page.waitForSelector(billableHours || "#__field99");

    await page.click(billableHours || "#__field99");
    await page.keyboard.type((hours.total).toString(), { delay: 20 })

    await page.click(startTime);
    await page.keyboard.type(hours.startTime.toString(), { delay: 20 })
    await page.click(endTime);
    await page.keyboard.type(hours.endTime.toString(), { delay: 20 })

    await page.click(workDescription);
    await page.type(workDescription, description, { delay: 20 })

    await page.waitForNetworkIdle({ idleTime: 500 });
    await page.click(release);
    await page.waitForSelector(all);
    await page.click(all);
    await page.waitForNetworkIdle({ idleTime: 500 });
}

async function getDayOfWeekSelector() {
    const dayOfWeek = (new Date().getDay() + 1);
    switch (dayOfWeek)
    {
        case 1: return "#__table2_r1_c10"
        case 2: return "#__table2_r1_c4"
        case 3: return "#__table2_r1_c5"
        case 4: return "#__table2_r0_c6"
        case 5: return "#__table2_r0_c7"
        default:
            throw Error;
    }
}