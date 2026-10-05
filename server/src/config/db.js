import mongoose from 'mongoose';

/**
 * MongoDB Connection Handler with Mongoose
 * Gracefully manages connection states, reconnects, and lifecycle events.
 */
let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aerosense';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Fail fast (5s) if MongoDB daemon is unreachable
    });

    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.error(`[Database Error] Connection failed: ${error.message}`);
    console.warn(`[Database Warning] Operating in disconnected fallback mode. In-memory data will serve requests.`);
    return null;
  }
}

export function getDBStatus() {
  const state = mongoose.connection.readyState;
  switch (state) {
    case 0: return 'disconnected';
    case 1: return 'connected';
    case 2: return 'connecting';
    case 3: return 'disconnecting';
    default: return 'unknown';
  }
}

export function isDBConnected() {
  return mongoose.connection.readyState === 1;
}
