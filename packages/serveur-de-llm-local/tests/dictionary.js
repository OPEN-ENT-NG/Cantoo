const fetch = require('node-fetch');

const PORT = (process.env.PORT && parseInt(process.env.PORT)) || 3001
const SERVER_URL = `http://localhost:${PORT}`;

async function testDictionary() {
  const testCases = [
    {
      word: 'serendipity',
      lang: 'english',
      phrase: 'Finding this book was pure serendipity.',
      answerLang: 'french'
    },
    {
      word: 'époustouflant',
      lang: 'french',
      answerLang: 'english'
    },
    {
      word: 'magnifique',
      lang: 'french',
      phrase: "C'est un magnifique tableau.",
      answerLang: 'french'
    }
  ];

  console.log('Starting dictionary tests...\n');

  for (const test of testCases) {
    console.log('Test case:', JSON.stringify(test, null, 2));
    try {
      const response = await fetch(`${SERVER_URL}/dictionary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test)
      });

      const result = await response.json();
      console.log('Response:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error:', error.message);
      console.log('Are you sure you have started the server? Run `npm start` to start the server.')
    }
    console.log('\n' + '-'.repeat(80) + '\n');
  }
}

testDictionary().catch(console.error);
