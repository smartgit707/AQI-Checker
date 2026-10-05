/**
 * Centralized API Response Standards
 */

export function successResponse(res, data, statusCode = 200, meta = null) {
  const payload = {
    success: true,
    data
  };

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
}

export function errorResponse(res, message, statusCode = 500, errorDetails = null) {
  const payload = {
    success: false,
    message
  };

  if (process.env.NODE_ENV === 'development' && errorDetails) {
    payload.error = errorDetails;
  }

  return res.status(statusCode).json(payload);
}
