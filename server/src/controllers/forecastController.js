import { getCityForecast } from '../services/forecasting/forecastService.js';

export async function getForecast(req, res, next) {
  try {
    const { citySlug } = req.params;
    const { hours } = req.query;

    if (!citySlug) {
      return res.status(400).json({ success: false, message: 'City slug is required' });
    }

    const forecast = await getCityForecast(citySlug, { hours });
    return res.status(200).json({
      success: true,
      data: forecast
    });
  } catch (error) {
    next(error);
  }
}
