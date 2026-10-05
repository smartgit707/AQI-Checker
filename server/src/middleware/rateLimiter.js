/**
 * Lightweight In-Memory Sliding-Window Rate Limiter Middleware
 * Provides anti-abuse protection for authentication, alert creation, and forecast APIs
 * without external Redis dependencies.
 */

class MemoryRateLimiter {
  constructor(windowMs = 15 * 60 * 1000, maxRequests = 100, message = 'Too many requests, please try again later.') {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.message = message;
    this.hits = new Map();

    // Periodic sweep every 5 minutes to reclaim memory
    setInterval(() => this.cleanup(), 5 * 60 * 1000).unref();
  }

  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.hits.entries()) {
      if (now - record.resetTime > this.windowMs) {
        this.hits.delete(key);
      }
    }
  }

  middleware() {
    return (req, res, next) => {
      // Exclude automated health checks or local testing
      if (req.path === '/api/health' || req.path === '/' || process.env.NODE_ENV === 'test') {
        return next();
      }

      // Extract client identifier (handling proxies / Vercel X-Forwarded-For)
      const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1')
        .split(',')[0]
        .trim();
      const key = `${ip}:${req.baseUrl || req.path}`;
      const now = Date.now();

      let record = this.hits.get(key);

      if (!record || now > record.resetTime) {
        record = {
          count: 1,
          resetTime: now + this.windowMs
        };
        this.hits.set(key, record);
      } else {
        record.count++;
      }

      const remaining = Math.max(0, this.maxRequests - record.count);
      const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', resetSeconds);

      if (record.count > this.maxRequests) {
        return res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: this.message,
            retryAfterSeconds: resetSeconds
          }
        });
      }

      next();
    };
  }
}

// 1. Auth endpoints limiter: 25 requests per 15 minutes (protects against brute-force)
export const authRateLimiter = new MemoryRateLimiter(
  15 * 60 * 1000,
  25,
  'Too many authentication attempts. Please wait 15 minutes before trying again.'
).middleware();

// 2. Alert creation & evaluation limiter: 60 requests per 15 minutes
export const alertRateLimiter = new MemoryRateLimiter(
  15 * 60 * 1000,
  60,
  'Alert rule configuration rate limit reached. Please try again shortly.'
).middleware();

// 3. General public API limiter: 300 requests per 15 minutes
export const apiRateLimiter = new MemoryRateLimiter(
  15 * 60 * 1000,
  300,
  'Too many API requests from this client. Please slow down.'
).middleware();
