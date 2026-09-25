const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Argentine Football API',
    description:
      'REST API for managing Argentine football players and clubs. CSE 341 Project 2.',
    version: '1.0.0'
  },
  tags: [
    { name: 'Players', description: 'Argentine national team players' }
  ],
  definitions: {
    Player: {
      firstName: 'Lionel',
      lastName: 'Messi',
      position: 'Forward',
      jerseyNumber: 10,
      birthDate: '1987-06-24',
      birthPlace: 'Rosario, Santa Fe',
      currentClub: 'Inter Miami CF',
      internationalCaps: 190,
      internationalGoals: 112,
      worldCupWinner: true
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);