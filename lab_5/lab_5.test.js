const { Builder, By, until } = require('selenium-webdriver');

let driver;

beforeAll(async () => {
  driver = await new Builder().forBrowser('chrome').build();
});

afterAll(async () => {
  await driver.quit();
});

test('Перевірка наявності елементів на wikipedia.org', async () => {
    await driver.get('https://www.wikipedia.org');

    // Поле пошуку
    const searchBoxById = await driver.findElement(By.id('searchInput'));
    const searchBoxByName = await driver.findElement(By.name('search'));

    // Логотип
    const logo = await driver.findElement(By.css('img.central-featured-logo'));

    // Перевірки
    expect(await searchBoxById.isDisplayed()).toBe(true);
    expect(await logo.getAttribute('src')).toMatch(/Wikipedia-logo/);
});


test('Пошук "Selenium" на Wikipedia', async () => {
    await driver.get('https://www.wikipedia.org');

    const searchBox = await driver.findElement(By.id('searchInput'));
    await searchBox.sendKeys('Selenium');

    const searchButton = await driver.findElement(By.css('button[type="submit"]'));
    await searchButton.click();

    await driver.wait(until.titleContains('Selenium'), 5000);

    const title = await driver.getTitle();
    expect(title).toMatch(/Selenium/);
});

test('Перевірка статті "Selenium" на Wikipedia', async () => {
    await driver.get('https://en.wikipedia.org/wiki/Selenium');

    const heading = await driver.findElement(By.xpath('//h1[@id="firstHeading"]'));
    const headingText = await heading.getText();
    expect(headingText).toBe('Selenium');

    const navLinks = await driver.findElements(By.css('#mw-panel a'));
    for (const link of navLinks) {
    const href = await link.getAttribute('href');
    expect(href).toMatch(/^https?:\/\//);
    }

    const searchForm = await driver.findElement(By.name('search'));
    expect(await searchForm.isDisplayed()).toBe(true);
});


test('Навігація та перевірка CSS', async () => {
    await driver.get('https://en.wikipedia.org/wiki/Selenium');

    const internalLink = await driver.findElement(By.css('#mw-content-text a'));
    const href = await internalLink.getAttribute('href');
    await internalLink.click();

    await driver.wait(until.urlContains(href), 5000);
    const newUrl = await driver.getCurrentUrl();
    expect(newUrl).toContain(href.split('/').pop());

    const heading = await driver.findElement(By.id('firstHeading'));
    const color = await heading.getCssValue('color');
    expect(color).toBeDefined(); // Додатково можна перевірити конкретний колір
});
