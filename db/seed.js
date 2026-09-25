require('dotenv').config();
const { MongoClient } = require('mongodb');

const datasets = {
  clubs: require('./data/clubs')
};

// Usage: node db/seed.js clubs
const target = process.argv[2];

const seed = async () => {
  if (!datasets[target]) {
    console.error(`Usage: node db/seed.js <${Object.keys(datasets).join('|')}>`);
    process.exitCode = 1;
    return;
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const collection = client.db(process.env.DB_NAME).collection(target);

    const deleted = await collection.deleteMany({});
    console.log(`Removed ${deleted.deletedCount} existing ${target}`);

    const result = await collection.insertMany(datasets[target]);
    console.log(`Inserted ${result.insertedCount} ${target}`);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
};

seed();