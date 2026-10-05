import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  Sliders, 
  Clock, 
  Info 
} from 'lucide-react';
import { getAQILevel } from '../../design-system/aqiTokens';
import { createAlertApi, getAlertsApi, updateAlertApi, deleteAlertApi } from '../../services/api';

export default function AlertModal({ isOpen, onClose, citySlug, cityName, currentAqi = 100 }) {
  const [threshold, setThreshold] = useState(150);
  const [operator, setOperator] = useState('above');
  const [cooldownHours, setCooldownHours] = useState(6);
  const [existingAlert, setExistingAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && citySlug) {
      loadCityAlert();
    }
  }, [isOpen, citySlug]);

  const loadCityAlert = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getAlertsApi();
      if (res.success && res.alerts) {
        const found = res.alerts.find(a => a.citySlug.toLowerCase() === citySlug.toLowerCase());
        if (found) {
          setExistingAlert(found);
          setThreshold(found.threshold);
          setOperator(found.operator || 'above');
          setCooldownHours(found.cooldownHours || 6);
        } else {
          setExistingAlert(null);
          // Default threshold slightly above current AQI or 150
          setThreshold(Math.max(100, Math.ceil((currentAqi + 25) / 10) * 10));
        }
      }
    } catch (err) {
      console.error('[AlertModal] Failed to fetch alerts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setStatusMessage(null);

    try {
      const payload = {
        citySlug: citySlug.toLowerCase(),
        cityName: cityName,
        threshold: Number(threshold),
        operator,
        cooldownHours: Number(cooldownHours),
        channels: { inApp: true, email: false },
        enabled: true
      };

      let res;
      if (existingAlert) {
        res = await updateAlertApi(existingAlert._id, payload);
      } else {
        res = await createAlertApi(payload);
      }

      if (res.success) {
        setStatusMessage(existingAlert ? 'Alert threshold updated successfully.' : 'New alert created successfully.');
        setExistingAlert(res.alert);
        setTimeout(() => {
          onClose();
          setStatusMessage(null);
        }, 1200);
      } else {
        setError(res.error || 'Failed to save alert rule.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while saving the alert.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existingAlert) return;
    setIsSaving(true);
    setError(null);
    try {
      const res = await deleteAlertApi(existingAlert._id);
      if (res.success) {
        setExistingAlert(null);
        setStatusMessage('Alert rule removed.');
        setTimeout(() => {
          onClose();
          setStatusMessage(null);
        }, 1000);
      } else {
        setError(res.error || 'Failed to delete alert.');
      }
    } catch (err) {
      setError(err.message || 'Error deleting alert.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const currentLevel = getAQILevel(Number(threshold));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                AQI Threshold Alert
              </h3>
              <p className="text-xs text-slate-500">
                Configure notifications for <strong className="text-slate-700">{cityName}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Checking active alert rules...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {statusMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Threshold Slider and Display */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  <span>Threshold Value (AQI)</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black font-display text-slate-900">{threshold}</span>
                  <span 
                    className="text-2xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${currentLevel.color}20`, color: currentLevel.color }}
                  >
                    {currentLevel.category}
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="30"
                max="500"
                step="5"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-2xs text-slate-400 mt-1">
                <span>30 (Good)</span>
                <span>150 (Unhealthy)</span>
                <span>300 (Very Poor)</span>
                <span>500 (Severe)</span>
              </div>
            </div>

            {/* Operator Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Trigger Condition
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOperator('above')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                    operator === 'above'
                      ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Rises Above (≥ {threshold})
                </button>
                <button
                  type="button"
                  onClick={() => setOperator('below')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                    operator === 'below'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Drops Below (&lt; {threshold})
                </button>
              </div>
            </div>

            {/* Notification Cooldown Settings */}
            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Notification Cooldown Period</span>
                </span>
                <span className="text-2xs font-semibold text-slate-500">{cooldownHours} Hours</span>
              </label>
              <select
                value={cooldownHours}
                onChange={(e) => setCooldownHours(Number(e.target.value))}
                className="w-full text-xs font-medium rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={1}>1 Hour (Frequent updates)</option>
                <option value={3}>3 Hours</option>
                <option value={6}>6 Hours (Recommended standard)</option>
                <option value={12}>12 Hours (Twice daily)</option>
                <option value={24}>24 Hours (Daily digest)</option>
              </select>
              <p className="text-2xs text-slate-400 mt-1">
                Prevents alert spam when atmospheric conditions fluctuate near the threshold.
              </p>
            </div>

            {/* Context Note */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-2xs text-slate-600 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <span>
                Current measured AQI in <strong>{cityName}</strong> is <strong>{currentAqi}</strong>. 
                Notifications will appear in your top navigation and dashboard.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              {existingAlert ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                >
                  Delete Alert
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{existingAlert ? 'Update Alert' : 'Create Alert'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
