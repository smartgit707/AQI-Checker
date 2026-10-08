import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[AeroSense ErrorBoundary Caught]:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Track repeat crash loops
    try {
      const crashCount = Number(sessionStorage.getItem('aerosense_crash_count') || '0') + 1;
      sessionStorage.setItem('aerosense_crash_count', String(crashCount));
      if (crashCount > 2) {
        // Auto-heal by clearing corrupted cache on repeated crash
        localStorage.removeItem('aerosense_active_city');
        sessionStorage.removeItem('aerosense_crash_count');
      }
    } catch {}
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    try {
      sessionStorage.removeItem('aerosense_crash_count');
    } catch {}
    window.location.reload();
  };

  handleSafeReset = () => {
    try {
      // Clear potentially corrupted cached telemetry and reset to default
      localStorage.removeItem('aerosense_active_city');
      localStorage.removeItem('aerosense_language');
      sessionStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // If used as an inline section boundary, render a compact graceful fallback
      if (this.props.inline || this.props.sectionName) {
        return (
          <div className="p-6 rounded-3xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center my-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {this.props.sectionName ? `${this.props.sectionName} Temporarily Unavailable` : 'Telemetry Section Suspended'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-1 mb-3">
              Standard telemetry fallback active while live atmospheric sensors synchronize.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Component</span>
            </button>
          </div>
        );
      }

      // Full-page error boundary
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black font-display text-slate-900 dark:text-slate-100">
            Environmental Telemetry Display Interrupted
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mt-2 mb-6">
            An unexpected error occurred while rendering this view. Our telemetry monitoring system has logged this incident.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry and Reload</span>
            </button>

            <button
              onClick={this.handleSafeReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs"
              title="Clears corrupted state and loads baseline overview"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Clean State</span>
            </button>

            <a
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>National Overview</span>
            </a>
          </div>

          {/* Diagnostic Technical Details Accordion */}
          {this.state.error && (
            <div className="mt-8 max-w-xl w-full text-left">
              <button
                type="button"
                onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 flex items-center gap-1 mx-auto"
              >
                <span>{this.state.showDetails ? 'Hide' : 'Show'} Diagnostic Details</span>
                {this.state.showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {this.state.showDetails && (
                <div className="mt-3 p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto border border-slate-800 shadow-inner">
                  <div className="text-rose-400 font-bold mb-1">
                    {this.state.error.toString()}
                  </div>
                  {this.state.error.stack && (
                    <pre className="text-[11px] text-slate-400 whitespace-pre-wrap leading-relaxed">
                      {this.state.error.stack.split('\n').slice(0, 8).join('\n')}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
