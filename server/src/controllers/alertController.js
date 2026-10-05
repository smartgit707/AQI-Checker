import {
  getUserAlerts,
  createAlert,
  updateAlert,
  deleteAlert
} from '../services/alertService.js';
import { evaluateAllActiveAlerts } from '../services/alertEvaluationService.js';

export async function getAlerts(req, res, next) {
  try {
    const alerts = await getUserAlerts(req.user.id);
    return res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
      alerts
    });
  } catch (error) {
    next(error);
  }
}

export async function addAlert(req, res, next) {
  try {
    const alert = await createAlert(req.user.id, req.body);
    return res.status(201).json({
      success: true,
      message: 'Alert configured successfully',
      data: alert,
      alert
    });
  } catch (error) {
    next(error);
  }
}

export async function editAlert(req, res, next) {
  try {
    const { id } = req.params;
    const alert = await updateAlert(req.user.id, id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Alert updated successfully',
      data: alert,
      alert
    });
  } catch (error) {
    next(error);
  }
}

export async function removeAlert(req, res, next) {
  try {
    const { id } = req.params;
    await deleteAlert(req.user.id, id);
    return res.status(200).json({
      success: true,
      message: 'Alert deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

export async function runEvaluation(req, res, next) {
  try {
    const summary = await evaluateAllActiveAlerts();
    return res.status(200).json({
      success: true,
      data: summary,
      ...summary
    });
  } catch (error) {
    next(error);
  }
}
