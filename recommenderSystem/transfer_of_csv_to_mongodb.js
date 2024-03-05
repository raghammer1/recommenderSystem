const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = 'mongodb://localhost:27017';
const dbName = 'movieDB'; // Replace with your database name
const collectionName = 'movies'; // Replace with your collection name

// Path to your CSV file
const csvFilePath = './tmdb_5000_movies.csv'; // Replace with the path to your CSV file

async function importCsvToMongo() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const results = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        await collection.insertMany(results);
        console.log(`${results.length} records inserted.`);
        await client.close();
      });
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  }
}

importCsvToMongo();
