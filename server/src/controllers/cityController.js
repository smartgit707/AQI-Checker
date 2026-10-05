import * as cityService from '../services/cityService.js';
import * as airQualityService from '../services/airQualityService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export async function getCities(req, res, next) {
  try {
    const { search, state, limit = 20, page = 1 } = req.query;
    const result = await cityService.getAllCities({ search, state, limit, page });
    return successResponse(res, result.cities, 200, result.pagination);
  } catch (error) {
    next(error);
  }
}

export async function getCityBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const city = await cityService.getCityBySlug(slug);

    if (!city) {
      return errorResponse(res, `City with slug '${slug}' not found`, 404);
    }

    return successResponse(res, city, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * Aggregated City Environmental Intelligence Endpoint: GET /api/v1/cities/:slug/dashboard
 */
export async function getCityDashboard(req, res, next) {
  try {
    const { slug } = req.params;
    const dashboard = await airQualityService.getCityDashboard(slug);

    if (!dashboard) {
      return errorResponse(res, `City with slug '${slug}' not found in active registry`, 404);
    }

    return successResponse(res, dashboard, 200);
  } catch (error) {
    next(error);
  }
}

export async function createCity(req, res, next) {
  try {
    const { name, state, coordinates } = req.body;

    if (!name || !state) {
      return errorResponse(res, 'City name and state are required fields', 400);
    }

    if (coordinates) {
      if (coordinates.latitude < -90 || coordinates.latitude > 90) {
        return errorResponse(res, 'Latitude must be between -90 and 90 degrees', 400);
      }
      if (coordinates.longitude < -180 || coordinates.longitude > 180) {
        return errorResponse(res, 'Longitude must be between -180 and 180 degrees', 400);
      }
    }

    const newCity = await cityService.createCity(req.body);
    return successResponse(res, newCity, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateCity(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await cityService.updateCity(id, req.body);

    if (!updated) {
      return errorResponse(res, `City with id '${id}' not found`, 404);
    }

    return successResponse(res, updated, 200);
  } catch (error) {
    next(error);
  }
}

export async function deleteCity(req, res, next) {
  try {
    const { id } = req.params;
    const success = await cityService.deleteCity(id);

    if (!success) {
      return errorResponse(res, `City with id '${id}' not found`, 404);
    }

    return successResponse(res, { deleted: true, id }, 200);
  } catch (error) {
    next(error);
  }
}
