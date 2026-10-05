import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5050;
const HOST = '0.0.0.0';

async function startServer() {
  // Attempt Database connection
  await connectDB();

  const server = app.listen(PORT, HOST, () => {
    console.log(`=======================================================`);
    console.log(` AeroSense Environmental Intelligence Backend Server`);
    console.log(` Host: ${HOST} | Port: ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Health Check: http://localhost:${PORT}/api/health`);
    console.log(` API Endpoint: http://localhost:${PORT}/api/v1/cities`);
    console.log(`=======================================================`);
  });

  // Graceful shutdown handling
  process.on('SIGTERM', () => {
    console.log('[Server] SIGTERM received. Closing HTTP server cleanly...');
    server.close(() => {
      console.log('[Server] Process terminated.');
    });
  });

  process.on('SIGINT', () => {
    console.log('[Server] SIGINT received. Shutting down...');
    server.close(() => {
      console.log('[Server] Process ended.');
      process.exit(0);
    });
  });
}

startServer();
