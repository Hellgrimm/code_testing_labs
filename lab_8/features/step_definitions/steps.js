const {
  Given, When, Then, Before, After, setDefaultTimeout
} = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const assert = require('assert');

setDefaultTimeout(60 * 1000);

let browser, page;

Before(async () => {
  browser = await chromium.launch({ headless: true });
  page = await browser.newPage();
});

After(async () => {
  if (browser) await browser.close();
});

Given('I open the home page', async () => {
  await page.goto('https://automationexercise.com');
});

When('I click on {string}', async (text) => {
  await page.click(`text=${text}`);
});

When('I scroll to the bottom of the page', async () => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
});

When('I fill in {string} with {string}', async (field, value) => {
  // Проста реалізація для input по placeholder
  await page.fill(`input[placeholder="${field}"]`, value);
});

When('I enter email {string} and password {string}', async (email, password) => {
  await page.fill('input[placeholder="Email Address"]', email);
  await page.fill('input[placeholder="Password"]', password);
});

When('I click on the subscription button', async () => {
  await page.click('#subscribe');
});

Then('I should see {string} in the page title', async (expected) => {
  const title = await page.title();
  assert(
    title.includes(expected),
    `Expected page title to include "${expected}", but got "${title}"`
  );
});

Then('I should see the banner section', async () => {
  await page.waitForSelector('#slider', { state: 'visible' });
});

Then('I should see {string}', async (expectedText) => {
  try {
    const el = await page.waitForSelector(`text=${expectedText}`, { state: 'visible', timeout: 60000 });
    const actualText = await el.innerText();
    assert(
      actualText.includes(expectedText),
      `Expected to see text "${expectedText}" but got "${actualText}"`
    );
  } catch (error) {
    throw new Error(`Timeout or error finding visible text: "${expectedText}".\nDetails: ${error}`);
  }
});
