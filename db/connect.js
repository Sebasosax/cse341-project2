const { MongoClient } = require('mongodb');

let database;

const initDb = async () => {
  if (database) {
    console.log('Database is already initialized');
    return database;
  }
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  database = client.db(process.env.DB_NAME);
  console.log(`Connected to MongoDB database: ${process.env.DB_NAME}`);
  return database;
};

const getDb = () => {
  if (!database) {
    throw new Error('Database not initialized');
  }
  return database;
};

module.exports = { initDb, getDb };