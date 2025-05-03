const { Builder, By, until, Key } = require('selenium-webdriver');
const { faker } = require('@faker-js/faker');

jest.setTimeout(60000);

let driver;

beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
});

afterAll(async () => {
    await driver.quit();
});  

test('Test Case 14: Place Order: Register while Checkout', async () => {
    // Очищення кошика
    await driver.get('https://automationexercise.com/view_cart');
    const deleteButtons = await driver.findElements(By.css('.cart_quantity_delete'));
    for (const btn of deleteButtons) {
        await driver.executeScript("arguments[0].click();", btn);
    }

    // Перехід на головну сторінку
    await driver.get('https://automationexercise.com');

    // Перевірка логотипу
    const logo = await driver.findElement(By.css('img[src="/static/images/home/logo.png"]'));
    expect(await logo.isDisplayed()).toBe(true);

    // Додавання товару до кошика
    const addToCartBtn = await driver.findElement(By.css('a[data-product-id="1"]'));
    await driver.executeScript("arguments[0].click();", addToCartBtn);

    // Очікування модального вікна і клік "Continue Shopping"
    await driver.wait(until.elementLocated(By.css('.modal-footer .btn-success')), 10000);
    const continueShoppingBtn = await driver.findElement(By.css('.modal-footer .btn-success'));
    await driver.wait(until.elementIsVisible(continueShoppingBtn), 10000);
    await driver.executeScript("arguments[0].click();", continueShoppingBtn);

    // Перехід до кошика
    const cartBtn = await driver.findElement(By.xpath("//a[contains(text(),'Cart')]"));
    await cartBtn.click();
    await driver.wait(until.urlContains('/view_cart'), 10000);
    const cartPage = await driver.findElement(By.xpath("//section[@id='cart_items']"));
    expect(await cartPage.isDisplayed()).toBe(true);

    // Перехід до оформлення
    const proceedToCheckoutBtn = await driver.findElement(By.xpath("//a[contains(text(),'Proceed To Checkout')]"));
    await proceedToCheckoutBtn.click();

    // Перехід на реєстрацію
    const registerLoginBtn = await driver.findElement(By.xpath("//u[contains(text(),'Register / Login')]"));
    await registerLoginBtn.click();

    // Реєстрація нового користувача
    const nameInput = await driver.findElement(By.css('input[data-qa="signup-name"]'));
    const emailInput = await driver.findElement(By.css('input[data-qa="signup-email"]'));
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    await nameInput.sendKeys('TestUser');
    await emailInput.sendKeys(uniqueEmail);
    const signupBtn = await driver.findElement(By.css('button[data-qa="signup-button"]'));
    await signupBtn.click();

    // Заповнення профілю
    await driver.wait(until.elementLocated(By.id('id_gender1')), 10000);
    await driver.findElement(By.id('id_gender1')).click();
    await driver.findElement(By.id('password')).sendKeys('Password123');
    await driver.findElement(By.id('days')).sendKeys('1');
    await driver.findElement(By.id('months')).sendKeys('January');
    await driver.findElement(By.id('years')).sendKeys('2000');
    await driver.findElement(By.id('first_name')).sendKeys('Test');
    await driver.findElement(By.id('last_name')).sendKeys('User');
    await driver.findElement(By.id('address1')).sendKeys('123 Test Street');
    await driver.findElement(By.id('state')).sendKeys('Test State');
    await driver.findElement(By.id('city')).sendKeys('Test City');
    await driver.findElement(By.id('zipcode')).sendKeys('12345');
    await driver.findElement(By.id('mobile_number')).sendKeys('1234567890');
    await driver.findElement(By.css('button[data-qa="create-account"]')).click();

    // Підтвердження акаунта
    const accountCreatedMsg = await driver.wait(until.elementLocated(By.css('[data-qa="account-created"]')), 10000);
    expect(await accountCreatedMsg.isDisplayed()).toBe(true);
    await driver.findElement(By.css('a[data-qa="continue-button"]')).click();

    // Перевірка логіну
    const loggedInAs = await driver.findElement(By.xpath("//a[contains(text(),'Logged in as')]"));
    expect(await loggedInAs.isDisplayed()).toBe(true);

    // Повторне відкриття кошика
    const cartBtn2 = await driver.findElement(By.xpath("//a[contains(text(),'Cart')]"));
    await cartBtn2.click();

    // Повторний перехід до оформлення
    const proceedToCheckoutBtn2 = await driver.findElement(By.xpath("//a[contains(text(),'Proceed To Checkout')]"));
    await proceedToCheckoutBtn2.click();

    // Перевірка адреси
    const addressDetails = await driver.findElement(By.xpath("//ul[@id='address_delivery']"));
    expect(await addressDetails.isDisplayed()).toBe(true);

    // Коментар до замовлення
    await driver.findElement(By.name('message')).sendKeys('Please deliver between 9 AM to 5 PM.');
    await driver.findElement(By.xpath("//a[contains(text(),'Place Order')]")).click();

    // Платіжні дані
    await driver.findElement(By.name('name_on_card')).sendKeys('Test User');
    await driver.findElement(By.name('card_number')).sendKeys('4111111111111111');
    await driver.findElement(By.name('cvc')).sendKeys('123');
    await driver.findElement(By.name('expiry_month')).sendKeys('12');
    await driver.findElement(By.name('expiry_year')).sendKeys('2025');
    await driver.findElement(By.id('submit')).click();

    // Перевірка повідомлення про успішне замовлення
    const successMsg = await driver.wait(
        until.elementLocated(By.xpath("//p[contains(text(),'Congratulations! Your order has been confirmed!')]")), 5000);
    expect(await successMsg.isDisplayed()).toBe(true);

    // Видалення акаунта
    const deleteAccountBtn = await driver.findElement(By.xpath("//a[contains(text(),'Delete Account')]"));
    await deleteAccountBtn.click();
    const accountDeletedMsg = await driver.wait(
        until.elementLocated(By.xpath("//b[contains(text(),'Account Deleted!')]")), 10000);
    expect(await accountDeletedMsg.isDisplayed()).toBe(true);
    await driver.findElement(By.css('a[data-qa="continue-button"]')).click();
}, 60000);

test('Test Case 15: Place Order: Register before Checkout', async () => {
    // Вихід з акаунта, якщо залогінений
    try {
        const logoutBtn = await driver.findElement(By.linkText('Logout'));
        await logoutBtn.click();
    } catch (e) {
        // Якщо не залогінений — нічого не робимо
    }

    // Очищення кошика
    await driver.get('https://automationexercise.com/view_cart');
    const deleteButtons = await driver.findElements(By.css('.cart_quantity_delete'));
    for (const btn of deleteButtons) {
        await driver.executeScript("arguments[0].click();", btn);
    }

    // Відкриття головної сторінки
    await driver.get('https://automationexercise.com');

    // Перевірка логотипу
    const logo = await driver.findElement(By.css('img[src="/static/images/home/logo.png"]'));
    expect(await logo.isDisplayed()).toBe(true);

    // Перехід до реєстрації
    const signupLoginBtn = await driver.findElement(By.xpath("//a[contains(text(),'Signup / Login')]"));
    await signupLoginBtn.click();

    // Заповнення форми реєстрації
    await driver.wait(until.elementLocated(By.css('input[data-qa="signup-name"]')), 10000);
    const nameInput = await driver.findElement(By.css('input[data-qa="signup-name"]'));
    const emailInput = await driver.findElement(By.css('input[data-qa="signup-email"]'));
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    await nameInput.sendKeys('TestUser');
    await emailInput.sendKeys(uniqueEmail);
    const signupBtn = await driver.findElement(By.css('button[data-qa="signup-button"]'));
    await signupBtn.click();

    // Заповнення профілю
    await driver.wait(until.elementLocated(By.id('id_gender1')), 10000);
    await driver.findElement(By.id('id_gender1')).click();
    await driver.findElement(By.id('password')).sendKeys('Password123');
    await driver.findElement(By.id('days')).sendKeys('1');
    await driver.findElement(By.id('months')).sendKeys('January');
    await driver.findElement(By.id('years')).sendKeys('2000');
    await driver.findElement(By.id('first_name')).sendKeys('Test');
    await driver.findElement(By.id('last_name')).sendKeys('User');
    await driver.findElement(By.id('address1')).sendKeys('123 Test Street');
    await driver.findElement(By.id('state')).sendKeys('Test State');
    await driver.findElement(By.id('city')).sendKeys('Test City');
    await driver.findElement(By.id('zipcode')).sendKeys('12345');
    await driver.findElement(By.id('mobile_number')).sendKeys('1234567890');
    await driver.findElement(By.css('button[data-qa="create-account"]')).click();

    // Підтвердження акаунта
    const accountCreatedMsg = await driver.wait(until.elementLocated(By.css('[data-qa="account-created"]')), 10000);
    expect(await accountCreatedMsg.isDisplayed()).toBe(true);
    await driver.findElement(By.css('a[data-qa="continue-button"]')).click();

    // Перевірка логіну
    const loggedInAs = await driver.findElement(By.xpath("//a[contains(text(),'Logged in as')]"));
    expect(await loggedInAs.isDisplayed()).toBe(true);

    // Додавання товару до кошика
    const addToCartBtn = await driver.findElement(By.css('a[data-product-id="1"]'));
    await driver.executeScript("arguments[0].click();", addToCartBtn);

    // Очікування і клік на "Continue Shopping"
    const continueShoppingBtn = await driver.wait(until.elementLocated(By.css('.modal-footer .btn-success')), 10000);
    await driver.wait(until.elementIsVisible(continueShoppingBtn), 10000);
    await driver.executeScript("arguments[0].click();", continueShoppingBtn);

    // Перехід до кошика
    const cartBtn = await driver.findElement(By.xpath("//a[contains(text(),'Cart')]"));
    await cartBtn.click();

    // Очікування відображення сторінки кошика
    await driver.wait(until.urlContains('/view_cart'), 10000);
    const cartPage = await driver.findElement(By.xpath("//section[@id='cart_items']"));
    expect(await cartPage.isDisplayed()).toBe(true);

    // Перехід до оформлення
    const proceedToCheckoutBtn = await driver.findElement(By.xpath("//a[contains(text(),'Proceed To Checkout')]"));
    await proceedToCheckoutBtn.click();

    // Перевірка адреси
    const addressDetails = await driver.findElement(By.xpath("//ul[@id='address_delivery']"));
    expect(await addressDetails.isDisplayed()).toBe(true);

    // Коментар до замовлення
    await driver.findElement(By.name('message')).sendKeys('Please leave it at the door.');
    await driver.findElement(By.xpath("//a[contains(text(),'Place Order')]")).click();

    // Платіжні дані
    await driver.findElement(By.name('name_on_card')).sendKeys('Test User');
    await driver.findElement(By.name('card_number')).sendKeys('4111111111111111');
    await driver.findElement(By.name('cvc')).sendKeys('123');
    await driver.findElement(By.name('expiry_month')).sendKeys('12');
    await driver.findElement(By.name('expiry_year')).sendKeys('2025');
    await driver.findElement(By.id('submit')).click();

    // Підтвердження замовлення
    const orderPlacedTitle = await driver.wait(
        until.elementLocated(By.css('[data-qa="order-placed"]')), 10000
    );
    expect(await orderPlacedTitle.isDisplayed()).toBe(true);

    const confirmationMsg = await driver.findElement(
        By.xpath("//p[contains(text(),'Congratulations! Your order has been confirmed!')]")
    );
    expect(await confirmationMsg.isDisplayed()).toBe(true);

    // Видалення акаунта
    const deleteAccountBtn = await driver.findElement(By.xpath("//a[contains(text(),'Delete Account')]"));
    await deleteAccountBtn.click();

    const accountDeletedMsg = await driver.wait(
        until.elementLocated(By.xpath("//b[contains(text(),'Account Deleted!')]")),
        10000
    );
    expect(await accountDeletedMsg.isDisplayed()).toBe(true);
    await driver.findElement(By.css('a[data-qa="continue-button"]')).click();
}, 60000);
