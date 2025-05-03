const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('@jest/globals');

let driver;

beforeAll(async () => {
  driver = await new Builder().forBrowser('chrome').build();
});

afterAll(async () => {
  await driver.quit();
});

test('Пошук товару через пошук Rozetka з перевіркою рендерингу товарів', async () => {
    await driver.get('https://rozetka.com.ua/');
  
    // Чекаємо поле пошуку
    const searchInput = await driver.wait(
        until.elementLocated(By.name('search')),
        15000
    );
    await searchInput.sendKeys('Ноутбук', Key.ENTER);
  
    // Чекаємо на Angular-компонент із товарами
    const goodsContainer = await driver.wait(
        until.elementLocated(By.css('[data-testid="category_goods"]')),
        20000
    );
  
    // Чекаємо появу першого тайтла
    const firstTitle = await driver.wait(
        until.elementLocated(By.css('span[rztiletitle]')),
        15000
    );
  
    const titleText = await firstTitle.getText();
    expect(titleText.toLowerCase()).toContain('ноутбук');
  }, 60000);

test('Навігація меню або важливого елемента через Tab', async () => {
    await driver.get('https://rozetka.com.ua/');
    await driver.wait(until.elementLocated(By.tagName('body')), 10000);

    const body = await driver.findElement(By.tagName('body'));
        for (let i = 0; i < 10; i++) {
        await body.sendKeys(Key.TAB);
    }

    const activeElement = await driver.switchTo().activeElement();
    const tagName = await activeElement.getTagName();
    const ariaLabel = await activeElement.getAttribute('aria-label');
    const title = await activeElement.getAttribute('title');

    expect(['button', 'a', 'input'].includes(tagName)).toBe(true);
    expect(ariaLabel !== null || title !== null).toBe(true);
}, 60000);
