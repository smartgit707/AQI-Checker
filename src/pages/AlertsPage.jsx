import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Sliders, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  Play, 
  ArrowLeft, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { 
  getAlertsApi, 
  updateAlertApi, 
  deleteAlertApi, 
  evaluateAlertsApi 
} from '../services/api';
import { getAQILevel } from '../design-system/aqiTokens';
import AlertModal from '../components/city/AlertModal';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCityForModal, setSelectedCityForModal] = useState({ slug: 'delhi', name: 'Delhi', aqi: 150 });

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setIsLoading(true);
      const res = await getAlertsApi();
      if (res.success) {
        setAlerts(res.alerts || []);
      }
    } catch (err) {
      console.error('[AlertsPage] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (alert) => {
    try {
      const res = await updateAlertApi(alert._id, { enabled: !alert.enabled });
      if (res.success) {
        setAlerts(prev => prev.map(a => a._id === alert._id ? res.alert : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteAlertApi(id);
      if (res.success) {
        setAlerts(prev => prev.filter(a => a._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunEvaluation = async () => {
    try {
      setEvaluating(true);
      setFeedback(null);
      const res = await evaluateAlertsApi();
      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Evaluation completed: ${res.triggeredCount} threshold breaches triggered into notifications (${res.evaluatedCount} alerts evaluated).`
        });
        loadAlerts();
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Evaluation run failed.'
      });
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </Link>
          <Link
            to="/notifications"
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            View Event Notifications →
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <Bell className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real-Time Environmental Sentinel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Air Quality Alert Rules
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Configure personal AQI thresholds to automatically receive in-app notifications whenever atmospheric telemetry crosses critical levels.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRunEvaluation}
              disabled={evaluating || alerts.length === 0}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              title="Trigger real-time evaluation against current telemetry"
            >
              {evaluating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 text-slate-600" />
              )}
              <span>Run Telemetry Evaluation</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`p-4 rounded-2xl mb-6 flex items-center gap-3 text-xs font-semibold ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' 
              : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}>
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Alerts List */}
        {isLoading ? (
          <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Loading your alert rules...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No alert rules configured</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
              You haven't configured any environmental alerts yet. Visit any city page or your favorites list to set custom AQI thresholds.
            </p>
            <Link
              to="/favorites"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              <span>Explore Monitored Cities</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => {
              const level = getAQILevel(alert.threshold);
              return (
                <div
                  key={alert._id}
                  className={`bg-white rounded-2xl p-5 border transition-all ${
                    alert.enabled ? 'border-slate-200 shadow-xs' : 'border-slate-200/60 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-white shrink-0 font-bold"
                        style={{ backgroundColor: level.color }}
                      >
                        <span className="text-xs leading-none">AQI</span>
                        <span className="text-sm font-black">{alert.threshold}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900 font-display">
                            {alert.cityName}
                          </h4>
                          <span className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                            alert.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {alert.enabled ? 'Active' : 'Paused'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                          <span className="font-medium text-slate-700">
                            Trigger when AQI {alert.operator === 'below' ? 'drops below' : 'rises above or equals'} <strong>{alert.threshold}</strong>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3" />
                            {alert.cooldownHours}h cooldown
                          </span>
                          {alert.lastTriggeredAt && (
                            <>
                              <span>•</span>
                              <span className="text-slate-400">
                                Last triggered: {new Date(alert.lastTriggeredAt).toLocaleString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleToggle(alert)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          alert.enabled
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {alert.enabled ? 'Pause' : 'Enable'}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCityForModal({
                            slug: alert.citySlug,
                            name: alert.cityName,
                            aqi: alert.threshold
                          });
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(alert._id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Edit Alert Modal */}
      <AlertModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          loadAlerts();
        }}
        citySlug={selectedCityForModal.slug}
        cityName={selectedCityForModal.name}
        currentAqi={selectedCityForModal.aqi}
      />

      <Footer />
    </div>
  );
}
