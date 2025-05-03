const { Builder, By, until, Key } = require('selenium-webdriver');
const { faker } = require('@faker-js/faker');

jest.setTimeout(30000); // Збільшення тайм-ауту для повільних дій

let driver;
let testName;
let testEmail;
const testPassword = 'Test@1234';

async function registerUser() {
    await driver.get('https://automationexercise.com');
    await driver.findElement(By.linkText('Signup / Login')).click();
  
    await driver.wait(until.elementLocated(By.css('input[data-qa="signup-name"]')), 10000);
  
    testName = faker.person.firstName();
    testEmail = faker.internet.email();
  
    await driver.findElement(By.css('input[data-qa="signup-name"]')).sendKeys(testName);
    await driver.findElement(By.css('input[data-qa="signup-email"]')).sendKeys(testEmail);
    await driver.findElement(By.css('button[data-qa="signup-button"]')).click();
  
    await driver.wait(until.elementLocated(By.id('id_gender1')), 10000);
    await driver.findElement(By.id('id_gender1')).click();
    await driver.findElement(By.id('password')).sendKeys(testPassword);
    await driver.findElement(By.id('days')).sendKeys('10');
    await driver.findElement(By.id('months')).sendKeys('May');
    await driver.findElement(By.id('years')).sendKeys('1990');
  
    await driver.findElement(By.id('newsletter')).click();
    await driver.findElement(By.id('optin')).click();
  
    await driver.findElement(By.id('first_name')).sendKeys(faker.person.firstName());
    await driver.findElement(By.id('last_name')).sendKeys(faker.person.lastName());
    await driver.findElement(By.id('company')).sendKeys(faker.company.name());
    await driver.findElement(By.id('address1')).sendKeys(faker.location.streetAddress());
    await driver.findElement(By.id('address2')).sendKeys(faker.location.secondaryAddress());
    await driver.findElement(By.id('country')).sendKeys('Canada');
    await driver.findElement(By.id('state')).sendKeys(faker.location.state());
    await driver.findElement(By.id('city')).sendKeys(faker.location.city());
    await driver.findElement(By.id('zipcode')).sendKeys(faker.location.zipCode());
    await driver.findElement(By.id('mobile_number')).sendKeys(faker.phone.number());
  
    await driver.findElement(By.css('button[data-qa="create-account"]')).click();
  
    await driver.wait(until.elementLocated(By.xpath("//b[text()='Account Created!']")), 10000);
    await driver.findElement(By.css('a[data-qa="continue-button"]')).click();
  
    // Переконатись, що вхід відбувся
    await driver.wait(until.elementLocated(By.xpath(`//*[contains(text(),'Logged in as')]`)), 10000);
}

async function logoutIfLoggedIn() {
    await driver.get('https://automationexercise.com');

    const bodyText = await driver.findElement(By.tagName('body')).getText();

    if (bodyText.includes('Logged in as')) {
    try {
        const logoutBtn = await driver.findElement(By.partialLinkText('Logout'));
        await logoutBtn.click();
        await driver.wait(until.elementLocated(By.xpath("//h2[text()='Login to your account']")), 10000);
        console.log('✅ User was logged in — logged out successfully');
    } catch (err) {
        console.warn('⚠️ Could not click Logout, maybe already logged out');
    }
    } else {
    console.log('ℹ️ User already logged out');
    }
}

async function clickSignupLogin() {
    await driver.wait(until.elementLocated(By.partialLinkText('Signup')), 10000);
    const loginLink = await driver.findElement(By.partialLinkText('Signup'));
    await loginLink.click();
}

async function clearCart() {
    await driver.get('https://automationexercise.com/view_cart');
    const deleteButtons = await driver.findElements(By.css('.cart_quantity_delete'));
    for (const btn of deleteButtons) {
        await driver.executeScript("arguments[0].click();", btn);
    }
}  

beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await registerUser(); // Створюємо користувача один раз
});

afterAll(async () => {
    try {
        await driver.get('https://automationexercise.com');
        const bodyText = await driver.findElement(By.tagName('body')).getText();
        if (bodyText.includes('Logged in as')) {
            await driver.findElement(By.linkText('Delete Account')).click();
            await driver.wait(until.elementLocated(By.xpath("//b[text()='Account Deleted!']")), 10000);
            await driver.findElement(By.css('a[data-qa="continue-button"]')).click();
        }
    } catch (e) {
        console.warn('Account deletion skipped or failed:', e.message);
    } finally {
        await driver.quit();
    }
});

test('Test Case 1: Register User — перевірка, що користувач увійшов', async () => {
    await driver.get('https://automationexercise.com');

    await driver.wait(until.elementLocated(By.xpath(`//*[contains(text(),'Logged in as')]`)), 10000);
    const loggedIn = await driver.findElement(By.xpath(`//*[contains(text(),'Logged in as')]`));
    const loggedText = await loggedIn.getText();

    console.log('Logged in text:', loggedText);
    expect(loggedText).toContain(testName);
});

test('Test Case 2: Login User with correct email and password', async () => {
    // 1. Вийти зі свого акаунту
    await driver.get('https://automationexercise.com');
    const logoutLink = await driver.findElement(By.linkText('Logout'));
    await logoutLink.click();

    // 2. Перейти до логіну
    await driver.wait(until.elementLocated(By.partialLinkText('Signup')), 10000);
    const loginLink = await driver.findElement(By.partialLinkText('Signup'));
    await loginLink.click();

    // 3. Ввести правильні email та пароль
    await driver.wait(until.elementLocated(By.name('email')), 10000);
    await driver.findElement(By.name('email')).sendKeys(testEmail);
    await driver.findElement(By.name('password')).sendKeys(testPassword);
    await driver.findElement(By.css('button[data-qa="login-button"]')).click();

    // 4. Перевірка входу
    await driver.wait(until.elementLocated(By.xpath(`//*[contains(text(),'Logged in as')]`)), 10000);
    const loggedIn = await driver.findElement(By.xpath(`//*[contains(text(),'Logged in as')]`));
    const loggedText = await loggedIn.getText();

    expect(loggedText).toContain(testName);
});

test('Test Case 3: Login User with incorrect email and password', async () => {
    await driver.get('https://automationexercise.com');
    await logoutIfLoggedIn(); // ← гарантуємо правильний стан
    await clickSignupLogin();

    // Перехід до логіну
    await driver.wait(until.elementLocated(By.partialLinkText('Signup')), 10000);
    const loginLink = await driver.findElement(By.partialLinkText('Signup'));
    await loginLink.click();

    // Перевірка, що відображається блок "Login to your account"
    await driver.wait(until.elementLocated(By.xpath("//h2[text()='Login to your account']")), 10000);

    // Введення некоректних даних
    await driver.findElement(By.name('email')).sendKeys('wrongemail@example.com');
    await driver.findElement(By.name('password')).sendKeys('WrongPassword123');
    await driver.findElement(By.css('button[data-qa="login-button"]')).click();

    // Перевірка повідомлення про помилку
    const errorMsg = await driver.wait(
    until.elementLocated(By.xpath("//*[contains(text(),'Your email or password is incorrect!')]")),
    10000
    );
    expect(await errorMsg.isDisplayed()).toBe(true);
});

test('Test Case 4: Logout User', async () => {
    await driver.get('https://automationexercise.com');
    await logoutIfLoggedIn(); // ← гарантуємо правильний стан
    await clickSignupLogin();

    // Перехід до логіну
    await driver.wait(until.elementLocated(By.partialLinkText('Signup')), 10000);
    const loginLink = await driver.findElement(By.partialLinkText('Signup'));
    await loginLink.click();

    // Вхід з коректними даними
    await driver.wait(until.elementLocated(By.name('email')), 10000);
    await driver.findElement(By.name('email')).sendKeys(testEmail);
    await driver.findElement(By.name('password')).sendKeys(testPassword);
    await driver.findElement(By.css('button[data-qa="login-button"]')).click();

    // Перевірка входу
    await driver.wait(until.elementLocated(By.xpath(`//*[contains(text(),'Logged in as')]`)), 10000);
    const loggedIn = await driver.findElement(By.xpath(`//*[contains(text(),'Logged in as')]`));
    expect(await loggedIn.isDisplayed()).toBe(true);

    // Клік на Logout
    const logoutBtn = await driver.findElement(By.linkText('Logout'));
    await logoutBtn.click();

    // Перевірка, що користувача повернуло на сторінку входу
    const loginHeader = await driver.wait(
    until.elementLocated(By.xpath("//h2[text()='Login to your account']")),
    10000
    );
    expect(await loginHeader.isDisplayed()).toBe(true);
});

test('Test Case 5: Register User with existing email', async () => {
    await logoutIfLoggedIn();
    await clickSignupLogin();

    // Перевірка заголовка
    const newUserSignup = await driver.findElement(By.xpath("//h2[text()='New User Signup!']"));
    expect(await newUserSignup.isDisplayed()).toBe(true);

    // Використовуємо testEmail, зареєстрований у beforeAll
    await driver.findElement(By.css('input[data-qa="signup-name"]')).sendKeys('TestName');
    await driver.findElement(By.css('input[data-qa="signup-email"]')).sendKeys(testEmail);

    await driver.findElement(By.css('button[data-qa="signup-button"]')).click();

    // Очікуємо повідомлення про помилку
    const errorMsg = await driver.wait(
    until.elementLocated(By.xpath("//*[contains(text(),'Email Address already exist!')]")),
    10000
    );
    expect(await errorMsg.isDisplayed()).toBe(true);
});

const path = require('path');

test('Test Case 6: Contact Us Form', async () => {
    await driver.get('https://automationexercise.com');

    // 4. Клік на 'Contact Us'
    const contactLink = await driver.findElement(By.partialLinkText('Contact'));
    await contactLink.click();

    // 5. Перевірка 'GET IN TOUCH'
    const getInTouch = await driver.wait(
        until.elementLocated(By.xpath("//h2[text()='Get In Touch']")),
        10000
    );
    expect(await getInTouch.isDisplayed()).toBe(true);

    // 6. Введення даних
    await driver.findElement(By.name('name')).sendKeys('Test User');
    await driver.findElement(By.name('email')).sendKeys('contact@test.com');
    await driver.findElement(By.name('subject')).sendKeys('Automation Test');
    await driver.findElement(By.id('message')).sendKeys('This is a test message.');

    // 7. Завантаження файлу
    const fileInput = await driver.findElement(By.name('upload_file'));
    const filePath = path.resolve(__dirname, 'testfile.txt'); // шлях до файлу
    await fileInput.sendKeys(filePath);

    // 8. Submit
    await driver.findElement(By.name('submit')).click();

    // 9. Alert (OK)
    try {
        await driver.switchTo().alert().accept();
    } catch (e) {
        console.warn('No alert appeared after submit');
    }

    // 10. Перевірка повідомлення про успіх
    const successMsg = await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'Success! Your details have been submitted successfully.')]")),
        10000
    );
    expect(await successMsg.isDisplayed()).toBe(true);

    // 11. Клік на 'Home' і перевірка логотипу
    const homeBtn = await driver.findElement(By.xpath("//a[contains(text(),'Home')]"));
    await homeBtn.click();

    const logo = await driver.wait(
        until.elementLocated(By.css('img[src="/static/images/home/logo.png"]')),
        10000
    );
    expect(await logo.isDisplayed()).toBe(true);
});

test('Test Case 7: Verify Test Cases Page', async () => {
    await driver.get('https://automationexercise.com');
  
    // 3. Перевірка, що головна сторінка відображається
    const logo = await driver.findElement(By.css('img[src="/static/images/home/logo.png"]'));
    expect(await logo.isDisplayed()).toBe(true);
  
    // 4. Клік на "Test Cases"
    const testCasesBtn = await driver.findElement(By.xpath("//a[contains(text(),'Test Cases')]"));
    await testCasesBtn.click();
  
    // 5. Перевірка, що відкрилася сторінка Test Cases
    await driver.wait(until.urlContains('/test_cases'), 10000);
    await driver.wait(until.elementLocated(By.css('.panel-title')), 10000);
    const testCasesTitle = await driver.findElement(By.css('.panel-title'));
    expect(await testCasesTitle.getText()).toMatch(/test case/i);
    expect(await testCasesTitle.isDisplayed()).toBe(true);
});

test('Test Case 8: Verify All Products and product detail page', async () => {
    try {
    await driver.get('https://automationexercise.com');

    const logo = await driver.findElement(By.css('img[src="/static/images/home/logo.png"]'));
    expect(await logo.isDisplayed()).toBe(true);

    const productsBtn = await driver.findElement(By.xpath("//a[contains(text(),'Products')]"));
    await productsBtn.click();

    await driver.wait(until.urlContains('/products'), 10000);

    const productList = await driver.findElement(By.css('.features_items'));
    expect(await productList.isDisplayed()).toBe(true);

    const firstViewBtn = await driver.findElement(By.xpath("//a[contains(@href, '/product_details/1')]"));
    await firstViewBtn.click();

    await driver.wait(until.urlContains('/product_details/1'), 10000);

    const name = await driver.findElement(By.css('.product-information > h2'));
    const category = await driver.findElement(By.xpath("//p[contains(text(),'Category')]"));
    const price = await driver.findElement(By.css('.product-information span span'));
    const availability = await driver.findElement(By.xpath("//b[contains(text(),'Availability')]"));
    const condition = await driver.findElement(By.xpath("//b[contains(text(),'Condition')]"));
    const brand = await driver.findElement(By.xpath("//b[contains(text(),'Brand')]"));

    expect(await name.isDisplayed()).toBe(true);
    expect(await category.isDisplayed()).toBe(true);
    expect(await price.isDisplayed()).toBe(true);
    expect(await availability.isDisplayed()).toBe(true);
    expect(await condition.isDisplayed()).toBe(true);
    expect(await brand.isDisplayed()).toBe(true);

    // ✅ Успішне завершення
    expect(true).toBe(true);
    } catch (err) {
        console.error('❌ Test Case 8 failed:', err);
        throw err; // не забувай пробросити помилку далі
    }
}, 60000);

test('Test Case 9: Search Product', async () => {
    await driver.get('https://automationexercise.com');
  
    // 1. Перевірка логотипу
    const logo = await driver.findElement(By.css('img[src="/static/images/home/logo.png"]'));
    expect(await logo.isDisplayed()).toBe(true);
  
    // 2. Клік на "Products"
    const productsBtn = await driver.findElement(By.xpath("//a[contains(text(),'Products')]"));
    await productsBtn.click();
  
    // 3. Очікування переходу на /products
    await driver.wait(until.urlContains('/products'), 10000);
  
    // 4. Введення пошукового запиту
    const searchInput = await driver.findElement(By.id('search_product'));
    const searchBtn = await driver.findElement(By.id('submit_search'));
    await searchInput.sendKeys('Top');
    await searchBtn.click();
  
    // 5. Очікуємо "Searched Products"
    const searchedTitle = await driver.wait(
        until.elementLocated(By.xpath("//h2[contains(text(),'Searched Products')]")),
        10000
    );
    expect(await searchedTitle.isDisplayed()).toBe(true);
  
    // 6. Знаходимо знайдені товари (назви в .productinfo p)
    const searchedProducts = await driver.findElements(By.css('.productinfo p'));
    expect(searchedProducts.length).toBeGreaterThan(0);
  
    // 7. Перевірка: принаймні один з товарів містить "top"
    const matched = [];
  
    for (const product of searchedProducts) {
        const text = await product.getText();
        // console.log('🔍 Назва товару:', text);
        if (text.toLowerCase().includes('top')) {
            matched.push(text);
        }
    }
  
    expect(matched.length).toBeGreaterThan(0);
});

test('Test Case 10: Verify Subscription in home page', async () => {
    await driver.get('https://automationexercise.com');
  
    // Перевірка головної сторінки
    const logo = await driver.findElement(By.css('img[src="/static/images/home/logo.png"]'));
    expect(await logo.isDisplayed()).toBe(true);
  
    // Прокрутка до футера
    await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
  
    // Перевірка "SUBSCRIPTION"
    const subscriptionTitle = await driver.wait(
        until.elementLocated(By.xpath("//h2[contains(text(),'Subscription')]")),
        10000
    );
    expect(await subscriptionTitle.isDisplayed()).toBe(true);
  
    // Введення email і клік по кнопці
    const emailInput = await driver.findElement(By.id('susbscribe_email'));
    const subscribeBtn = await driver.findElement(By.id('subscribe'));
    await emailInput.sendKeys('test_' + Date.now() + '@example.com');
    await subscribeBtn.click();
  
    // Перевірка повідомлення про успіх
    const successMsg = await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'You have been successfully subscribed!')]")),
        10000
    );
    expect(await successMsg.isDisplayed()).toBe(true);
});

test('Test Case 11: Verify Subscription in Cart page', async () => {
    await driver.get('https://automationexercise.com');
  
    // 3. Перевірка логотипу
    const logo = await driver.findElement(By.css('img[src="/static/images/home/logo.png"]'));
    expect(await logo.isDisplayed()).toBe(true);
  
    // 4. Перехід на Cart
    const cartBtn = await driver.findElement(By.xpath("//a[contains(text(),'Cart')]"));
    await cartBtn.click();
  
    // 5. Прокрутка до футера
    await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
  
    // 6. Перевірка наявності 'SUBSCRIPTION'
    const subscriptionTitle = await driver.wait(
       until.elementLocated(By.xpath("//h2[contains(text(),'Subscription')]")),
       10000
    );
    expect(await subscriptionTitle.isDisplayed()).toBe(true);
  
    // 7. Введення email і клік
    const emailInput = await driver.findElement(By.id('susbscribe_email'));
    const subscribeBtn = await driver.findElement(By.id('subscribe'));
    await emailInput.sendKeys('test_' + Date.now() + '@example.com');
    await subscribeBtn.click();
  
    // 8. Перевірка повідомлення про успішну підписку
    const successMsg = await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'You have been successfully subscribed!')]")),
        10000
    );
    expect(await successMsg.isDisplayed()).toBe(true);
});

test('Test Case 12: Add Products in Cart', async () => {
    await driver.get('https://automationexercise.com');
  
    // Перевірка логотипу
    const logo = await driver.findElement(By.css('img[src="/static/images/home/logo.png"]'));
    expect(await logo.isDisplayed()).toBe(true);
  
    // Перехід до Products
    const productsBtn = await driver.findElement(By.xpath("//a[contains(text(),'Products')]"));
    await productsBtn.click();
  
    await driver.wait(until.urlContains('/products'), 10000);
  
    // 1. Додати товар з ID 1
    const firstAddBtn = await driver.findElement(By.css("a[data-product-id='1']"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", firstAddBtn);
    await driver.executeScript("arguments[0].click();", firstAddBtn);

    await driver.wait(until.elementLocated(By.css('.modal-content')), 10000);
    const continueBtn1 = await driver.findElement(By.xpath("//button[contains(text(),'Continue Shopping')]"));
    await driver.wait(until.elementIsVisible(continueBtn1), 10000);
    await driver.executeScript("arguments[0].click();", continueBtn1);

    // 2. Додати товар з ID 2
    const secondAddBtn = await driver.findElement(By.css("a[data-product-id='2']"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", secondAddBtn);
    await driver.executeScript("arguments[0].click();", secondAddBtn);

    await driver.wait(until.elementLocated(By.css('.modal-content')), 10000);
    const viewCartBtn = await driver.findElement(By.xpath("//u[contains(text(),'View Cart')]"));
    await driver.wait(until.elementIsVisible(viewCartBtn), 10000);
    await driver.executeScript("arguments[0].click();", viewCartBtn);

    // === 3. Перевірка кошика ===
    await driver.wait(until.urlContains('/view_cart'), 10000);
  
    const productsInCart = await driver.findElements(By.css('.cart_description'));
    expect(productsInCart.length).toBeGreaterThanOrEqual(2); // ключова перевірка
  
    const prices = await driver.findElements(By.css('.cart_price p'));
    const quantities = await driver.findElements(By.css('.cart_quantity button'));
    const totals = await driver.findElements(By.css('.cart_total p'));
  
    expect(prices.length).toBeGreaterThanOrEqual(2);
    expect(quantities.length).toBeGreaterThanOrEqual(2);
    expect(totals.length).toBeGreaterThanOrEqual(2);
  
    for (let i = 0; i < 2; i++) {
        const priceText = await prices[i].getText();
        const quantityText = await quantities[i].getText();
        const totalText = await totals[i].getText();
    
        console.log(`🛒 Продукт ${i + 1}: ціна: ${priceText}, кількість: ${quantityText}, сума: ${totalText}`);
    
        expect(priceText).toMatch(/Rs\.\s*\d+/);
        expect(quantityText).toMatch(/\d+/);
        expect(totalText).toMatch(/Rs\.\s*\d+/);
    }
}, 60000);

test('Test Case 13: Verify Product quantity in Cart', async () => {
    await clearCart(); // Очистити кошик перед тестом

    await driver.get('https://automationexercise.com');

    const logo = await driver.findElement(By.css('img[src="/static/images/home/logo.png"]'));
    expect(await logo.isDisplayed()).toBe(true);

    // Клік на View Product першого товару
    const viewProductBtn = await driver.findElement(By.xpath("(//a[contains(text(),'View Product')])[1]"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", viewProductBtn);
    await viewProductBtn.click();

    await driver.wait(until.urlContains('/product_details'), 10000);

    // Встановлюємо кількість = 4
    const quantityInput = await driver.findElement(By.id('quantity'));
    await quantityInput.click();
    await quantityInput.sendKeys(Key.chord(Key.CONTROL, 'a'));
    await quantityInput.sendKeys(Key.BACK_SPACE);
    await quantityInput.sendKeys('4');

    const addToCartBtn = await driver.findElement(By.css('.cart'));
    await driver.executeScript("arguments[0].click();", addToCartBtn);

    await driver.wait(until.elementLocated(By.xpath("//u[contains(text(),'View Cart')]")), 10000);
    const viewCartBtn = await driver.findElement(By.xpath("//u[contains(text(),'View Cart')]"));
    await driver.executeScript("arguments[0].click();", viewCartBtn);

    await driver.wait(until.urlContains('/view_cart'), 10000);

    const quantityBtn = await driver.findElement(By.css('.cart_quantity button'));
    const quantityValue = await quantityBtn.getText();

    console.log('🧮 Знайдена кількість у кошику:', quantityValue);
    expect(quantityValue).toBe('4');
}, 60000);
