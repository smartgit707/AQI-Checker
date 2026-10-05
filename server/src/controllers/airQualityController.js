import * as airQualityService from '../services/airQualityService.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Air Quality Controller
 */

export async function getAirQualityList(req, res, next) {
  try {
    const list = await airQualityService.getAllAirQuality();
    return successResponse(res, list);
  } catch (error) {
    next(error);
  }
}

export async function getMapAirQuality(req, res, next) {
  try {
    const mapData = await airQualityService.getMapTelemetry();
    return successResponse(res, mapData, 200, {
      count: mapData.length,
      retrievedAt: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export async function getLatestAirQuality(req, res, next) {
  try {
    const { cityId } = req.params;
    if (!cityId) {
      return errorResponse(res, 'City identifier parameter is required', 400);
    }

    const data = await airQualityService.getLatestAirQualityForCity(cityId);

    if (!data) {
      return errorResponse(res, `No air quality telemetry found for '${cityId}'`, 404);
    }

    return successResponse(res, data);
  } catch (error) {
    next(error);
  }
}

export async function getAirQualityHistory(req, res, next) {
  try {
    const { cityId } = req.params;
    const { period = '7d' } = req.query;

    if (!['24h', '7d', '30d', '90d'].includes(period)) {
      return errorResponse(res, "Query parameter 'period' must be one of: 24h, 7d, 30d, 90d", 400);
    }

    const history = await airQualityService.getAirQualityHistoryForCity(cityId, period);
    return successResponse(res, history, 200, { period, count: history.length });
  } catch (error) {
    next(error);
  }
}

export async function recordTelemetry(req, res, next) {
  try {
    const { aqi, dominantPollutant } = req.body;

    if (aqi === undefined || aqi < 0 || aqi > 500) {
      return errorResponse(res, 'Valid AQI between 0 and 500 is required', 400);
    }

    if (!dominantPollutant) {
      return errorResponse(res, 'Dominant pollutant is required', 400);
    }

    const record = await airQualityService.recordAirQualityTelemetry(req.body);
    return successResponse(res, record, 201);
  } catch (error) {
    next(error);
  }
}
