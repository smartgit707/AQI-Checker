import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  Lock,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ShieldAlert,
  KeyRound,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

export default function SettingsPage() {
  const { user, changePassword, updateProfile, deleteAccount, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState({ text: '', type: '' });

  // Preferences state
  const [tempUnit, setTempUnit] = useState(user?.settings?.temperatureUnit || 'C');
  const [dashView, setDashView] = useState(user?.settings?.defaultDashboardView || 'detailed');
  const [prefNotice, setPrefNotice] = useState('');

  // Delete modal state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteInputText, setDeleteInputText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordNotice({ text: '', type: '' });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordNotice({ text: 'All password fields are required.', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordNotice({ text: 'New password must be at least 6 characters.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordNotice({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    setPasswordLoading(true);
    const res = await changePassword({ currentPassword, newPassword });
    setPasswordLoading(false);

    if (res.success) {
      setPasswordNotice({ text: 'Password changed successfully.', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordNotice({ text: '', type: '' }), 4000);
    } else {
      setPasswordNotice({ text: res.error || 'Failed to change password.', type: 'error' });
    }
  };

  const handlePreferencesSave = async (e) => {
    e.preventDefault();
    setPrefNotice('');

    const res = await updateProfile({
      settings: {
        temperatureUnit: tempUnit,
        defaultDashboardView: dashView
      }
    });

    if (res.success) {
      setPrefNotice('Preferences saved successfully.');
      setTimeout(() => setPrefNotice(''), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError('');
    if (deleteInputText !== 'DELETE') {
      setDeleteError('Please type DELETE in capital letters to confirm.');
      return;
    }

    setDeleteLoading(true);
    const res = await deleteAccount();
    setDeleteLoading(false);

    if (res.success) {
      navigate('/login?redirect=/', { replace: true });
    } else {
      setDeleteError(res.error || 'Failed to delete account.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Account & Security Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your credentials, environmental dashboard layout, and security controls.
          </p>
        </div>

        {/* Section 1: Security & Password */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
              <p className="text-xs text-slate-500">
                Update your account password to maintain security.
              </p>
            </div>
          </div>

          {passwordNotice.text && (
            <div
              className={`p-4 rounded-xl flex items-center gap-2.5 text-sm font-medium ${
                passwordNotice.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-700'
              }`}
            >
              {passwordNotice.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{passwordNotice.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                New Password (min 6 characters)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-xs disabled:opacity-60 flex items-center gap-2"
            >
              {passwordLoading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>Update Password</span>
            </button>
          </form>
        </div>

        {/* Section 2: Environmental Display Preferences */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Dashboard & Units</h2>
              <p className="text-xs text-slate-500">
                Configure default telemetry display and temperature metrics.
              </p>
            </div>
          </div>

          {prefNotice && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{prefNotice}</span>
            </div>
          )}

          <form onSubmit={handlePreferencesSave} className="space-y-5 max-w-lg">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Temperature Unit
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTempUnit('C')}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all ${
                    tempUnit === 'C'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Celsius (°C)
                </button>
                <button
                  type="button"
                  onClick={() => setTempUnit('F')}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all ${
                    tempUnit === 'F'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Default Dashboard View
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDashView('detailed')}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all ${
                    dashView === 'detailed'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Detailed Cards
                </button>
                <button
                  type="button"
                  onClick={() => setDashView('compact')}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all ${
                    dashView === 'compact'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Compact Table
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Interface Color Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                    theme === 'light'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-2xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Sun className={`w-4 h-4 ${theme === 'light' ? 'text-amber-500' : 'text-slate-400'}`} />
                  <span>Light Mode</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                    theme === 'dark'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-2xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Moon className={`w-4 h-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>Dark Mode</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('system')}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                    theme === 'system'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-2xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Monitor className={`w-4 h-4 ${theme === 'system' ? 'text-teal-500' : 'text-slate-400'}`} />
                  <span>System Auto</span>
                </button>
              </div>
              <p className="text-2xs text-slate-400 mt-1.5">
                Quick toggle anytime with keyboard shortcut <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-3xs">⌘ + J</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-3xs">Ctrl + J</kbd>.
              </p>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-xs"
            >
              Save Preferences
            </button>
          </form>
        </div>

        {/* Section 3: Danger Zone */}
        <div className="bg-rose-50/50 rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-rose-900">Danger Zone</h2>
              <p className="text-xs text-rose-600">
                Irreversible account deletion and profile removal.
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
            Deleting your account will permanently remove your login credentials, favorite cities,
            and personal environmental activity history. This action cannot be undone.
          </p>

          {!deleteConfirmOpen ? (
            <button
              type="button"
              onClick={() => setDeleteConfirmOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-colors shadow-xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete AeroSense Account</span>
            </button>
          ) : (
            <div className="p-5 rounded-2xl bg-white border border-rose-300 space-y-4 max-w-md">
              <div className="flex items-start gap-2.5 text-rose-800 text-sm font-semibold">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <span>Confirm Permanent Deletion</span>
              </div>
              <p className="text-xs text-slate-600">
                Please type <strong className="text-rose-700 font-mono">DELETE</strong> below to confirm permanent deletion of your account.
              </p>

              {deleteError && (
                <div className="text-xs text-rose-600 font-medium">{deleteError}</div>
              )}

              <input
                type="text"
                value={deleteInputText}
                onChange={(e) => setDeleteInputText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors disabled:opacity-60"
                >
                  {deleteLoading ? 'Deleting...' : 'Permanently Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmOpen(false);
                    setDeleteInputText('');
                    setDeleteError('');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
