const {
    UserService,
    asyncHello,
    computeValue,
    asyncError,
    ApiClient,
    ApiHelper,
    calculateFinalPrice,
    OrderProcessor
} = require('./lab_4');

// Task 1
test('UserService.greet calls getFullName and returns greeting', () => {
    const mockFn = jest.fn().mockReturnValue('John Doe');
    const service = new UserService(mockFn);

    const result = service.greet();

    expect(mockFn).toHaveBeenCalledWith("John", "Doe");
    expect(result).toBe("HELLO, JOHN DOE!");
});

// Task 2
test('asyncHello resolves to "hello world"', async () => {
    await expect(asyncHello()).resolves.toBe("hello world");
});

// Task 3
test('computeValue returns 94', () => {
    expect(computeValue()).toBe(94);
});

// Task 4
test('asyncError rejects with error message', async () => {
    await expect(asyncError()).rejects.toThrow("Something went wrong");
});

// Task 5
test('ApiClient.fetchData returns JSON with fetchedAt', async () => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ name: "test" })
    })
    );

    const client = new ApiClient();
    const result = await client.fetchData();

    expect(result).toHaveProperty('name', 'test');
    expect(result).toHaveProperty('fetchedAt');
    expect(typeof result.fetchedAt).toBe("number");
});

// Task 6
test('ApiHelper.fetchViaHelper returns provided JSON', async () => {
    const mockFn = jest.fn().mockResolvedValue({ success: true });
    const helper = new ApiHelper();

    const result = await helper.fetchViaHelper(mockFn);

    expect(result).toEqual({ success: true });
    expect(mockFn).toHaveBeenCalled();
});

// Task 7
describe('calculateFinalPrice', () => {
    test('correctly calculates final price', () => {
    const order = {
        items: [
        { price: 50, quantity: 1 },
        { price: 100, quantity: 2 }
        ],
        discount: 0.2,
        taxRate: 0.1
    };
    expect(calculateFinalPrice(order)).toBe(220);
    });

    test('throws error on invalid data', () => {
    expect(() => calculateFinalPrice({ items: [] })).toThrow();
    expect(() => calculateFinalPrice({ items: [{ price: -1, quantity: 1 }] })).toThrow();
    });
});

// Task 8
describe('OrderProcessor.processOrder', () => {
    const order = {
    items: [{ price: 100, quantity: 1 }],
    discount: 0.1,
    taxRate: 0.2
    };

    test('returns converted price', async () => {
    const mockConverter = jest.fn().mockResolvedValue(999);
    const processor = new OrderProcessor(mockConverter);

    const result = await processor.processOrder(order, "EUR");

    expect(result).toBe(999);
    expect(mockConverter).toHaveBeenCalled();
    });

    test('returns original price on conversion error', async () => {
    const mockConverter = jest.fn().mockRejectedValue(new Error("Conversion failed"));
    const processor = new OrderProcessor(mockConverter);

    const result = await processor.processOrder(order, "EUR");

    expect(result).toBe(calculateFinalPrice(order));
    });
});
