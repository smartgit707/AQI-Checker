import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

let dbInitialized = false;

export default async function handler(req, res) {
  if (!dbInitialized) {
    try {
      await connectDB();
    } catch (err) {
      // ConnectDB gracefully falls back to in-memory store
    }
    dbInitialized = true;
  }

  return app(req, res);
}
