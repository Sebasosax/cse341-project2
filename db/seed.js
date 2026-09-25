require('dotenv').config();
const { MongoClient } = require('mongodb');

const players = [
  {
    firstName: 'Emiliano',
    lastName: 'Martínez',
    position: 'Goalkeeper',
    jerseyNumber: 23,
    birthDate: '1992-09-02',
    birthPlace: 'Mar del Plata, Buenos Aires',
    currentClub: 'Aston Villa',
    internationalCaps: 55,
    internationalGoals: 0,
    worldCupWinner: true
  },
  {
    firstName: 'Nahuel',
    lastName: 'Molina',
    position: 'Defender',
    jerseyNumber: 26,
    birthDate: '1998-04-06',
    birthPlace: 'Embalse, Córdoba',
    currentClub: 'Atlético Madrid',
    internationalCaps: 45,
    internationalGoals: 1,
    worldCupWinner: true
  },
  {
    firstName: 'Cristian',
    lastName: 'Romero',
    position: 'Defender',
    jerseyNumber: 13,
    birthDate: '1998-04-27',
    birthPlace: 'Córdoba, Córdoba',
    currentClub: 'Tottenham Hotspur',
    internationalCaps: 45,
    internationalGoals: 3,
    worldCupWinner: true
  },
  {
    firstName: 'Nicolás',
    lastName: 'Otamendi',
    position: 'Defender',
    jerseyNumber: 19,
    birthDate: '1988-02-12',
    birthPlace: 'El Talar, Buenos Aires',
    currentClub: 'Benfica',
    internationalCaps: 125,
    internationalGoals: 7,
    worldCupWinner: true
  },
  {
    firstName: 'Nicolás',
    lastName: 'Tagliafico',
    position: 'Defender',
    jerseyNumber: 8,
    birthDate: '1992-08-31',
    birthPlace: 'Rafael Calzada, Buenos Aires',
    currentClub: 'Olympique Lyonnais',
    internationalCaps: 65,
    internationalGoals: 1,
    worldCupWinner: true
  },
  {
    firstName: 'Rodrigo',
    lastName: 'De Paul',
    position: 'Midfielder',
    jerseyNumber: 7,
    birthDate: '1994-05-24',
    birthPlace: 'Sarandí, Buenos Aires',
    currentClub: 'Inter Miami CF',
    internationalCaps: 80,
    internationalGoals: 2,
    worldCupWinner: true
  },
  {
    firstName: 'Enzo',
    lastName: 'Fernández',
    position: 'Midfielder',
    jerseyNumber: 24,
    birthDate: '2001-01-17',
    birthPlace: 'San Martín, Buenos Aires',
    currentClub: 'Chelsea',
    internationalCaps: 40,
    internationalGoals: 5,
    worldCupWinner: true
  },
  {
    firstName: 'Alexis',
    lastName: 'Mac Allister',
    position: 'Midfielder',
    jerseyNumber: 20,
    birthDate: '1998-12-24',
    birthPlace: 'Santa Rosa, La Pampa',
    currentClub: 'Liverpool',
    internationalCaps: 40,
    internationalGoals: 4,
    worldCupWinner: true
  },
  {
    firstName: 'Ángel',
    lastName: 'Di María',
    position: 'Forward',
    jerseyNumber: 11,
    birthDate: '1988-02-14',
    birthPlace: 'Rosario, Santa Fe',
    currentClub: 'Rosario Central',
    internationalCaps: 145,
    internationalGoals: 31,
    worldCupWinner: true
  },
  {
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
  },
  {
    firstName: 'Julián',
    lastName: 'Álvarez',
    position: 'Forward',
    jerseyNumber: 9,
    birthDate: '2000-01-31',
    birthPlace: 'Calchín, Córdoba',
    currentClub: 'Atlético Madrid',
    internationalCaps: 45,
    internationalGoals: 15,
    worldCupWinner: true
  }
];

const seed = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const collection = client.db(process.env.DB_NAME).collection('players');

    const deleted = await collection.deleteMany({});
    console.log(`Removed ${deleted.deletedCount} existing players`);

    const result = await collection.insertMany(players);
    console.log(`Inserted ${result.insertedCount} players`);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
};

seed();