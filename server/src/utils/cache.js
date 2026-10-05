/**
 * In-Memory Fast Cache with Expiry (TTL)
 * Protects against excessive requests and provides sub-millisecond retrieval.
 */

class MemoryCache {
  constructor(defaultTtlSeconds = 900) { // 15 mins default TTL
    this.cache = new Map();
    this.defaultTtl = defaultTtlSeconds * 1000;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  set(key, value, ttlSeconds = null) {
    const ttl = (ttlSeconds ? ttlSeconds * 1000 : this.defaultTtl);
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
      storedAt: Date.now()
    });
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
  }
}

export const envCache = new MemoryCache(900); // 15 minutes TTL for atmospheric data
