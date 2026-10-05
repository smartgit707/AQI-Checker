import * as dataSourceService from '../services/dataSourceService.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Data Source Controller
 */

export async function getDataSources(req, res, next) {
  try {
    const sources = await dataSourceService.getAllDataSources();
    return successResponse(res, sources);
  } catch (error) {
    next(error);
  }
}

export async function getDataSourceById(req, res, next) {
  try {
    const { id } = req.params;
    const source = await dataSourceService.getDataSourceById(id);

    if (!source) {
      return errorResponse(res, `Data source with id '${id}' not found`, 404);
    }

    return successResponse(res, source);
  } catch (error) {
    next(error);
  }
}
