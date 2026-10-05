import * as comparisonService from '../services/comparisonService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export async function compareCities(req, res, next) {
  try {
    const { cities, period = '7d' } = req.query;

    if (!cities) {
      return errorResponse(res, 'Query parameter "cities" is required (e.g. ?cities=delhi,mumbai,chennai)', 400);
    }

    const slugs = cities.split(',').map(s => s.trim()).filter(Boolean);
    if (slugs.length < 2) {
      return errorResponse(res, 'Please provide at least 2 cities to compare (e.g. ?cities=delhi,mumbai)', 400);
    }

    if (slugs.length > 4) {
      return errorResponse(res, 'Comparison supports up to 4 cities maximum.', 400);
    }

    const data = await comparisonService.compareCities(slugs, period);
    return successResponse(res, data, 200);
  } catch (error) {
    next(error);
  }
}
