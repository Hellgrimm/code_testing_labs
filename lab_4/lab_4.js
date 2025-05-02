// Task 1
class UserService {
    constructor(getFullName) {
        this.getFullName = getFullName;
    }

    greet() {
        const fullName = this.getFullName("John", "Doe");
        return `HELLO, ${fullName.toUpperCase()}!`;
    }
}

// Task 2
function asyncHello() {
    return Promise.resolve("hello world");
}

// Task 3
function computeValue() {
    return 94;
}

// Task 4
function asyncError() {
    return Promise.reject(new Error("Something went wrong"));
}

// Task 5
class ApiClient {
    async fetchData() {
        const response = await fetch("https://example.com/data");
        const data = await response.json();
        return { ...data, fetchedAt: Date.now() };
    }
}

// Task 6
class ApiHelper {
    async fetchViaHelper(apiCallFunction) {
        return await apiCallFunction();
    }
}

// Task 7
function calculateFinalPrice(order) {
    if (!order?.items?.length || order.items.some(i => i.price < 0)) {
        throw new Error("Invalid order data");
    }

    let total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = Math.min(order.discount || 0, 0.5);
    total *= 1 - discount;
    total *= 1 + (order.taxRate || 0);
    return Math.round(total * 100) / 100;
}

// Task 8
class OrderProcessor {
    constructor(currencyConverter) {
        this.currencyConverter = currencyConverter;
    }

    async processOrder(order, currency) {
        const price = calculateFinalPrice(order);
        try {
            return await this.currencyConverter(price, currency);
        } catch {
            return price;
        }
    }
}

module.exports = {
    UserService,
    asyncHello,
    computeValue,
    asyncError,
    ApiClient,
    ApiHelper,
    calculateFinalPrice,
    OrderProcessor
};
