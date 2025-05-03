const { Builder, By, until } = require('selenium-webdriver');

let driver;

beforeAll(async () => {
  driver = await new Builder().forBrowser('chrome').build();
});

afterAll(async () => {
  await driver.quit();
});

test('Перевірка елементів на головній сторінці', async () => {
  await driver.get('https://automationexercise.com');

  // Верхнє меню
  const navBar = await driver.findElement(By.css('ul.nav.navbar-nav'));
  expect(await navBar.isDisplayed()).toBe(true);

  // Логотип
  const logo = await driver.findElement(By.css('div.logo.pull-left img'));
  expect(await logo.isDisplayed()).toBe(true);
  expect(await logo.getAttribute('alt')).toMatch(/Website for automation practice/);

  // Кнопка "Signup / Login"
  const signupLoginBtn = await driver.findElement(By.xpath("//a[contains(text(),'Signup / Login')]"));
  expect(await signupLoginBtn.isDisplayed()).toBe(true);
});
