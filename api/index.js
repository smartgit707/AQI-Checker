import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

// Initialize DB connection in background without blocking serverless handler
connectDB().catch(() => {});

export default app;
