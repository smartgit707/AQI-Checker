import { verifyToken } from '../services/authService.js';
import { findUserById } from '../services/userService.js';

/**
 * Extract token from Authorization header or cookies
 */
function extractToken(req) {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  if (req.cookies && (req.cookies.token || req.cookies.aerosense_token)) {
    return req.cookies.token || req.cookies.aerosense_token;
  }
  return null;
}

/**
 * Strict authentication middleware. Rejects unauthenticated requests with 401.
 */
export async function authenticateUser(req, res, next) {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.'
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please log in again.'
      });
    }

    // Verify user account exists and has not been deleted
    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists.'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
}

/**
 * Optional authentication middleware.
 * Attaches req.user if a valid token is present and user exists, but proceeds anyway if not.
 */
export async function optionalAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await findUserById(decoded.id);
        if (user) {
          req.user = decoded;
        }
      }
    }
  } catch (err) {
    // Optional auth, ignore error
  }
  next();
}
