/**
 * NoSQL Injection Protection Middleware
 * Recursively inspects incoming request body, parameters, and query strings.
 * Removes MongoDB query operators ($gt, $ne, $where, etc.) and dot notation keys.
 */

function cleanObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanObject);
  }

  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    // Prohibit keys starting with $ (MongoDB operators) or containing dots
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }

    if (value && typeof value === 'object') {
      cleaned[key] = cleanObject(value);
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

export function sanitizeInput(req, res, next) {
  if (req.body) {
    req.body = cleanObject(req.body);
  }

  if (req.query) {
    req.query = cleanObject(req.query);
  }

  if (req.params) {
    req.params = cleanObject(req.params);
  }

  next();
}
