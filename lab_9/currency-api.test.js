const { spec } = require('pactum');

describe('Open Exchange API Tests (https://open.er-api.com)', () => {
  const baseUrl = 'https://open.er-api.com/v6';

  test('Список доступних валют (ключі у rates)', async () => {
    const res = await spec().get(`${baseUrl}/latest`).expectStatus(200);
    expect(res.body.result).toBe('success');
    expect(typeof res.body.rates.USD).toBe('number');
    expect(typeof res.body.rates.EUR).toBe('number');
  });

  test('Курс євро до інших валют', async () => {
    const res = await spec().get(`${baseUrl}/latest/EUR`).expectStatus(200);
    expect(res.body.base_code).toBe('EUR');
    expect(typeof res.body.rates.USD).toBe('number');
  });

  test('Курс євро до долара', async () => {
    const res = await spec().get(`${baseUrl}/latest/EUR`).expectStatus(200);
    expect(typeof res.body.rates.USD).toBe('number');
  });

  test('Невалідна валюта — очікуємо повідомлення про помилку', async () => {
    const res = await spec().get(`${baseUrl}/latest/ZZZ`).expectStatus(200);
    expect(res.body.result).toBe('error');
  });
});
