import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB, query, isDBConnected, closeDB } from '../config/db.js';
import { INITIAL_CITIES, INITIAL_AIR_QUALITY, INITIAL_DATA_SOURCES } from '../utils/seedData.js';
import * as cityRepository from '../db/repositories/cityRepository.js';
import * as airQualityRepository from '../db/repositories/airQualityRepository.js';
import * as dataSourceRepository from '../db/repositories/dataSourceRepository.js';
import * as userRepository from '../db/repositories/userRepository.js';

dotenv.config();

export async function seedDatabase() {
  console.log('[Seed] Connecting to MySQL Database...');
  const pool = await connectDB();

  if (!isDBConnected() || !pool) {
    console.error('[Seed Error] Could not connect to MySQL. Ensure MySQL server is running and credentials in environment variables are correct.');
    process.exit(1);
  }

  console.log('[Seed] Connected successfully.');

  try {
    // Disable foreign key checks to safely clear existing data
    await query('SET FOREIGN_KEY_CHECKS = 0');
    await query('TRUNCATE TABLE air_quality_readings');
    await query('TRUNCATE TABLE user_favorites');
    await query('TRUNCATE TABLE user_recent_cities');
    await query('TRUNCATE TABLE notifications');
    await query('TRUNCATE TABLE alerts');
    await query('TRUNCATE TABLE cities');
    await query('TRUNCATE TABLE data_sources');
    await query('TRUNCATE TABLE users');
    await query('TRUNCATE TABLE audit_logs');
    await query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('[Seed] Tables cleared successfully.');

    // 1. Seed Cities
    console.log('[Seed] Seeding Cities...');
    const cityMap = {};
    for (const cityData of INITIAL_CITIES) {
      const created = await cityRepository.insertCity(cityData);
      cityMap[created.slug] = created.id;
    }
    console.log(`[Seed] Seeded ${INITIAL_CITIES.length} Indian cities.`);

    // 2. Seed Air Quality Telemetry
    console.log('[Seed] Seeding Air Quality Telemetry...');
    for (const aqiData of INITIAL_AIR_QUALITY) {
      const cityId = cityMap[aqiData.citySlug] || null;
      await airQualityRepository.insertAirQuality({
        ...aqiData,
        cityId
      });
    }
    console.log(`[Seed] Seeded ${INITIAL_AIR_QUALITY.length} initial air quality records.`);

    // 3. Seed Data Sources
    console.log('[Seed] Seeding Data Sources...');
    for (const ds of INITIAL_DATA_SOURCES) {
      await dataSourceRepository.insertDataSource(ds);
    }
    console.log(`[Seed] Seeded ${INITIAL_DATA_SOURCES.length} environmental monitoring sources.`);

    // 4. Seed Standard Default Users (Demo & Admin)
    console.log('[Seed] Seeding Default Users (Demo & Admin)...');
    const demoPasswordHash = await bcrypt.hash('password123', 10);
    const demoUser = await userRepository.insertUser({
      name: 'Dr. Aarav Sharma',
      email: 'demo@aerosense.air',
      passwordHash: demoPasswordHash,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      settings: { temperatureUnit: 'C', defaultDashboardView: 'detailed' }
    });

    await userRepository.addUserFavorite(demoUser.id, 'delhi');
    await userRepository.addUserFavorite(demoUser.id, 'mumbai');
    await userRepository.addUserFavorite(demoUser.id, 'bengaluru');
    await userRepository.addUserRecentCity(demoUser.id, 'delhi');
    await userRepository.addUserRecentCity(demoUser.id, 'mumbai');

    const adminPasswordHash = await bcrypt.hash('AdminPass2026!', 10);
    const adminUser = await userRepository.insertUser({
      name: 'Director Environmental Operations',
      email: 'admin@aerosense.air',
      passwordHash: adminPasswordHash,
      role: 'admin',
      avatar: '',
      settings: { temperatureUnit: 'C', defaultDashboardView: 'detailed' }
    });

    await userRepository.addUserFavorite(adminUser.id, 'delhi');
    await userRepository.addUserFavorite(adminUser.id, 'mumbai');
    await userRepository.addUserFavorite(adminUser.id, 'kolkata');
    await userRepository.addUserFavorite(adminUser.id, 'chennai');
    await userRepository.addUserFavorite(adminUser.id, 'bengaluru');

    console.log('[Seed] Seeded Demo (demo@aerosense.air) and Admin (admin@aerosense.air) users.');

    console.log('[Seed] MySQL Seed script completed successfully!');
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error.message);
    process.exit(1);
  } finally {
    await closeDB();
  }
}

// Execute if run directly
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase();
}
