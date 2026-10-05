import mongoose from 'mongoose';
import dotenv from 'dotenv';
import City from '../models/City.js';
import AirQuality from '../models/AirQuality.js';
import DataSource from '../models/DataSource.js';
import { INITIAL_CITIES, INITIAL_AIR_QUALITY, INITIAL_DATA_SOURCES } from '../utils/seedData.js';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aerosense';

async function seedDatabase() {
  console.log('[Seed] Connecting to MongoDB...');
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] Connected successfully.');

    // Clear existing collections
    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      City.deleteMany({}),
      AirQuality.deleteMany({}),
      DataSource.deleteMany({})
    ]);

    // Insert Cities
    console.log('[Seed] Seeding Cities...');
    const cityDocs = INITIAL_CITIES.map(({ _id, ...rest }) => rest);
    const createdCities = await City.insertMany(cityDocs);
    console.log(`[Seed] Seeded ${createdCities.length} Indian cities.`);

    // Map city slug to ObjectId for Air Quality foreign key reference
    const cityMap = {};
    createdCities.forEach(c => {
      cityMap[c.slug] = c._id;
    });

    // Insert Air Quality records
    console.log('[Seed] Seeding Air Quality Telemetry...');
    const aqiDocs = INITIAL_AIR_QUALITY.map(item => ({
      ...item,
      cityId: cityMap[item.citySlug] || createdCities[0]._id
    }));
    const createdAQI = await AirQuality.insertMany(aqiDocs);
    console.log(`[Seed] Seeded ${createdAQI.length} initial air quality telemetry records.`);

    // Insert Data Sources
    console.log('[Seed] Seeding Data Sources...');
    const dsDocs = INITIAL_DATA_SOURCES.map(({ _id, ...rest }) => rest);
    const createdSources = await DataSource.insertMany(dsDocs);
    console.log(`[Seed] Seeded ${createdSources.length} environmental monitoring sources.`);

    console.log('[Seed] Seed script finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
