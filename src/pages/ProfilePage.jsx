import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  User,
  Mail,
  Calendar,
  Clock,
  Shield,
  Heart,
  Settings,
  CheckCircle2,
  AlertCircle,
  Save,
  Sparkles
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Name cannot be empty.');
      return;
    }

    setIsSaving(true);
    const res = await updateProfile({ name: name.trim() });
    setIsSaving(false);

    if (res.success) {
      setSuccessMessage('Profile name updated successfully.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      setErrorMessage(res.error || 'Failed to update profile.');
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Recent Member';

  const lastLogin = user?.lastLoginAt
    ? new Date(user.lastLoginAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : 'Active Session';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-3xl font-extrabold shadow-md shadow-emerald-600/20 shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Verified Environmental Citizen
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {user?.name || 'User Profile'}
            </h1>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>

          <Link
            to="/settings"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Account Settings</span>
          </Link>
        </div>

        {/* Status Messages */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Profile Card & Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Edit Column */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Profile Details
            </h2>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address (Primary Identity)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-2xs text-slate-400 mt-1">
                  Email address is linked to your authentication credential and cannot be changed.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-xs disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Account Meta Column */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Account Metadata
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-slate-500">Member Since</div>
                  <div className="text-sm font-bold text-slate-800">{memberSince}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-slate-500">Last Activity</div>
                  <div className="text-sm font-bold text-slate-800">{lastLogin}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Heart className="w-4 h-4 text-rose-500 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-slate-500">Saved Favorites</div>
                  <div className="text-sm font-bold text-slate-800">
                    {user?.favoriteCities?.length || 0} cities
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-emerald-600 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-slate-500">Account Status</div>
                  <div className="text-sm font-bold text-emerald-700">Active & Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
