import { errorResponse } from '../utils/response.js';

/**
 * 404 Route Not Found Middleware
 */
export function notFoundHandler(req, res, next) {
  return errorResponse(res, `Resource not found: ${req.method} ${req.originalUrl}`, 404);
}

/**
 * Global Error Handler Middleware
 */
export function errorHandler(err, req, res, next) {
  console.error('[Unhandled Error]', err);

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    return errorResponse(res, `Invalid resource identifier: ${err.value}`, 400);
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return errorResponse(res, `Validation error: ${messages.join(', ')}`, 400, err.errors);
  }

  // Duplicate Key error (MongoDB error 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, `Duplicate field value entered: ${field}`, 409);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error occurred';

  return errorResponse(res, message, statusCode, err.stack);
}
