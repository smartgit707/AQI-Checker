import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pool = null;
let isConnected = false;

let connectionAttempted = false;

/**
 * Resolve MySQL configuration from environment variables
 */
export function getMySQLConfig() {
  if (process.env.DATABASE_URL || process.env.MYSQL_URL) {
    const connStr = process.env.DATABASE_URL || process.env.MYSQL_URL;
    return { uri: connStr, connectTimeout: 3000 };
  }

  // If in cloud serverless environment (e.g., Vercel) and no remote host is provided,
  // do NOT attempt connecting to localhost:3306 (which doesn't exist and causes timeouts)
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);
  const host = process.env.DB_HOST;
  if (isServerless && (!host || host === 'localhost' || host === '127.0.0.1')) {
    return null;
  }

  return {
    host: host || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'aerosense',
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '5', 10),
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    connectTimeout: 1500
  };
}

/**
 * Initialize MySQL Connection Pool and verify connectivity
 */
export async function connectDB() {
  if (connectionAttempted && !isConnected) {
    return null;
  }
  connectionAttempted = true;

  const config = getMySQLConfig();

  if (!config) {
    isConnected = false;
    console.log('[Database] Cloud serverless environment without external database URL detected. Operating in resilient standalone fallback mode.');
    return null;
  }

  try {
    if (!pool) {
      if (config.uri) {
        pool = mysql.createPool(config.uri);
      } else {
        // If connecting to non-local host, attempt creation if needed
        if (config.host !== 'localhost' && config.host !== '127.0.0.1') {
          try {
            const rootConn = await mysql.createConnection({
              host: config.host,
              port: config.port,
              user: config.user,
              password: config.password,
              connectTimeout: 1500
            });
            await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
            await rootConn.end();
          } catch (dbCreateErr) {
            // May not have privileges to create DB or DB already exists; proceed to pool
          }
        }

        pool = mysql.createPool(config);
      }
    }

    // Ping the connection
    const conn = await pool.getConnection();
    isConnected = true;
    console.log(`[Database] MySQL Connected: ${config.host || 'host'}:${config.port || 3306}/${config.database || 'aerosense'}`);
    conn.release();

    // Ensure all tables exist automatically on startup
    await initSchema();

    return pool;
  } catch (error) {
    isConnected = false;
    console.error(`[Database Error] MySQL connection failed: ${error.message}`);
    console.warn(`[Database Warning] Operating in disconnected fallback mode. In-memory data will serve requests.`);
    return null;
  }
}

/**
 * Initialize schema if tables do not exist
 */
export async function initSchema() {
  if (!isConnected || !pool) return;

  try {
    const schemaPath = path.resolve(__dirname, '../db/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sqlContent = fs.readFileSync(schemaPath, 'utf-8');
      
      // Execute each statement individually (filtering comments and empty lines)
      const statements = sqlContent
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith('--') && !s.toLowerCase().startsWith('create database') && !s.toLowerCase().startsWith('use '));

      for (const statement of statements) {
        await pool.query(statement);
      }
      console.log('[Database] MySQL Relational Schema verified/synchronized successfully.');
    }
  } catch (err) {
    console.warn(`[Database Schema Warning] Could not auto-sync schema: ${err.message}`);
  }
}

/**
 * Centralized query helper with parameterized inputs
 */
export async function query(sql, params = []) {
  if (!isConnected || !pool) {
    throw new Error('Database is not connected');
  }
  const [results] = await pool.execute(sql, params);
  return results;
}

/**
 * Execute a transaction across multiple queries
 */
export async function transaction(callback) {
  if (!isConnected || !pool) {
    throw new Error('Database is not connected');
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export function getPool() {
  return pool;
}

export function isDBConnected() {
  return isConnected;
}

export function getDBStatus() {
  return isConnected ? 'connected' : 'disconnected';
}

export async function closeDB() {
  if (pool) {
    await pool.end();
    isConnected = false;
    pool = null;
  }
}
