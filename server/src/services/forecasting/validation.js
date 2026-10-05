/**
 * Time-Series Walk-Forward Backtesting & Error Evaluation
 * Evaluates model against historical observations and calculates MAE & RMSE.
 */

import { DampedHoltModel } from './forecastModels.js';

export function evaluateModelPerformance(series, diurnalAdjustments = []) {
  if (!series || series.length < 4) {
    return {
      evaluated: false,
      reason: 'Insufficient observations for train/test split (min 4 required)',
      mae: null,
      rmse: null
    };
  }

  // Split: at least 3 train, remaining test (or at least 1 test)
  const splitIdx = Math.max(3, Math.floor(series.length * 0.7));
  const trainSet = series.slice(0, splitIdx);
  const testSet = series.slice(splitIdx);

  if (testSet.length === 0) {
    // Single point test
    testSet.push(series[series.length - 1]);
  }

  const model = new DampedHoltModel();
  model.fit(trainSet, diurnalAdjustments);

  const startTime = trainSet[trainSet.length - 1].timestamp;
  const forecasts = model.predict(startTime, testSet.length, diurnalAdjustments);

  let absoluteErrorsSum = 0;
  let squaredErrorsSum = 0;
  const n = Math.min(forecasts.length, testSet.length);

  for (let i = 0; i < n; i++) {
    const actual = testSet[i].aqi;
    const predicted = forecasts[i].predictedAQI;
    const err = actual - predicted;

    absoluteErrorsSum += Math.abs(err);
    squaredErrorsSum += Math.pow(err, 2);
  }

  const mae = Math.round((absoluteErrorsSum / n) * 10) / 10;
  const rmse = Math.round(Math.sqrt(squaredErrorsSum / n) * 10) / 10;

  return {
    evaluated: true,
    testObservations: n,
    mae,
    rmse,
    evaluationWindowHours: n
  };
}
