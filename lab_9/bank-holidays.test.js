const { spec } = require('pactum');

describe('UK Bank Holidays API', () => {
  test('Кількість святкових днів в Англії та Уельсі', async () => {
    const res = await spec().get('https://www.gov.uk/bank-holidays.json');
    const holidays = res.body['england-and-wales'].events;
    expect(holidays.length).toBeGreaterThan(0);
  });

  test('Перевірка дати Великодня', async () => {
    const res = await spec().get('https://www.gov.uk/bank-holidays.json');
    const easter = res.body['england-and-wales'].events.find(e => e.title.includes('Easter'));
    expect(easter).toBeDefined();
  });
});
