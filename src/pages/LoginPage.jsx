import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wind, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, Home, Activity } from 'lucide-react';

export default function LoginPage() {
  const { login, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customRedirect = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearAuthError();

    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      const defaultDest = result.user?.role === 'citizen' ? '/citizen-dashboard' : '/dashboard';
      const dest = customRedirect || defaultDest;
      navigate(dest, { replace: true });
    }
  };

  const fillCitizenDemo = () => {
    setEmail('citizen@aerosense.air');
    setPassword('password123');
    setLocalError('');
    clearAuthError();
  };

  const fillScientistDemo = () => {
    setEmail('demo@aerosense.air');
    setPassword('password123');
    setLocalError('');
    clearAuthError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Wind className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-display">
            Aero<span className="text-emerald-600">Sense</span>
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
          Access your personal air quality telemetry, saved cities, and environmental analytics.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          {(localError || authError) && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-sm text-rose-700 leading-snug font-medium">
                {localError || authError}
              </div>
            </div>
          )}

          {/* Quick Demo Login Preset Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Instant Academic Demo Presets
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-normal">
              Click any persona to fill verified demo credentials and explore its tailored dashboard:
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={fillCitizenDemo}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-emerald-100/70 border border-emerald-300 text-emerald-900 shadow-2xs transition-all flex items-center justify-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5 text-emerald-600" />
                <span>Citizen (Family)</span>
              </button>

              <button
                type="button"
                onClick={fillScientistDemo}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-teal-100/70 border border-teal-300 text-teal-900 shadow-2xs transition-all flex items-center justify-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5 text-teal-600" />
                <span>Environmentalist</span>
              </button>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-md shadow-emerald-600/20 disabled:opacity-60 transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Don't have an AeroSense account?{' '}
              <Link
                to={`/register${customRedirect && customRedirect !== '/dashboard' ? `?redirect=${encodeURIComponent(customRedirect)}` : ''}`}
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
