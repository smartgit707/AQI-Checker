/**
 * Input Sanitization Middleware
 * Recursively inspects incoming request body, parameters, and query strings.
 * Safely mutates objects in-place to avoid Express 5 / Node getter-only property errors.
 */

function cleanObjectInPlace(obj) {
  if (!obj || typeof obj !== 'object') {
    return;
  }

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (obj[i] && typeof obj[i] === 'object') {
        cleanObjectInPlace(obj[i]);
      }
    }
    return;
  }

  for (const key of Object.keys(obj)) {
    // Prohibit keys starting with $ (injection operators) or containing dots
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
      continue;
    }

    if (obj[key] && typeof obj[key] === 'object') {
      cleanObjectInPlace(obj[key]);
    }
  }
}

export function sanitizeInput(req, res, next) {
  try {
    if (req.body && typeof req.body === 'object') {
      cleanObjectInPlace(req.body);
    }

    if (req.query && typeof req.query === 'object') {
      cleanObjectInPlace(req.query);
    }

    if (req.params && typeof req.params === 'object') {
      cleanObjectInPlace(req.params);
    }
  } catch (err) {
    // Non-blocking fail-safe
    console.warn('[SanitizeInput Warning]', err.message);
  }

  next();
}
