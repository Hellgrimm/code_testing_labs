const { spec } = require('pactum');

describe('Cat Fact API', () => {
    test('Перевірка структури об\'єкта /fact', async () => {
      const res = await spec()
        .get('https://catfact.ninja/fact')
        .expectStatus(200);
      expect(typeof res.body.fact).toBe('string');
      expect(typeof res.body.length).toBe('number');
    });

  test('Перевірка /facts?limit=3&max_length=50', async () => {
    const res = await spec()
      .get('https://catfact.ninja/facts?limit=3&max_length=50')
      .expectStatus(200);
    expect(res.body.data.length).toBe(3);
    res.body.data.forEach(f => {
      expect(typeof f.fact).toBe('string');
      expect(f.fact.length).toBeLessThanOrEqual(50);
    });
  });

  test('Заголовки відповіді', async () => {
    const res = await spec().get('https://catfact.ninja/fact');
    expect(res.headers).toHaveProperty('server');
    expect(res.headers).toHaveProperty('cache-control');
    expect(res.headers).toHaveProperty('date');
  });

  test('Типи даних у відповіді', async () => {
    const res = await spec().get('https://catfact.ninja/fact');
    expect(typeof res.body.fact).toBe('string');
    expect(typeof res.body.length).toBe('number');
  });
});
