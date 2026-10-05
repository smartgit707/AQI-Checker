import * as analyticsService from '../services/analyticsService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export async function getAnalyticsDashboard(req, res, next) {
  try {
    const data = await analyticsService.getAnalyticsDashboard();
    return successResponse(res, data, 200);
  } catch (error) {
    next(error);
  }
}

export async function getRankings(req, res, next) {
  try {
    const { region, sortBy, limit } = req.query;
    const data = await analyticsService.getFilteredRankings({ region, sortBy, limit });
    return successResponse(res, data, 200);
  } catch (error) {
    next(error);
  }
}
