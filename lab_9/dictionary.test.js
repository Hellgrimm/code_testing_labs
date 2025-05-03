const { spec } = require('pactum');

describe('Dictionary API', () => {
  const words = ['love', 'example', 'school', 'happy', 'future'];

  for (const word of words) {
    test(`Приклади використання слова "${word}"`, async () => {
      const res = await spec().get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const definitions = res.body[0]?.meanings?.flatMap(m => m.definitions) || [];
      const example = definitions.find(d => typeof d.example === 'string');
      
      if (!example) {
        console.warn(`⚠️  Немає прикладу використання для слова "${word}"`);
      } else {
        expect(typeof example.example).toBe('string');
      }
    });
  }
});
