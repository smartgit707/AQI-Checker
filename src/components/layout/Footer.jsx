import React from 'react';
import { Link } from 'react-router-dom';
import { Wind, Heart, Shield, Globe, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Wind className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight font-display">
                AeroSense
              </span>
            </Link>
            
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-4">
              "Understand the air you breathe." High-precision environmental intelligence, live atmospheric indices, and localized air health guidance for India.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All telemetry streams operating normally</span>
            </div>
          </div>

          {/* Quick Nav Col 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-display">
              Air Intelligence
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">National Overview</Link></li>
              <li><Link to="/analytics" className="hover:text-emerald-400 transition-colors">Historical Analytics</Link></li>
              <li><Link to="/compare" className="hover:text-emerald-400 transition-colors">City Comparison</Link></li>
              <li><Link to="/rankings" className="hover:text-emerald-400 transition-colors">National Rankings</Link></li>
              <li><a href="/#live-map" className="hover:text-emerald-400 transition-colors">Live Pan-India Map</a></li>
            </ul>
          </div>

          {/* Quick Nav Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-display">
              Scientific Standards
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/methodology" className="hover:text-emerald-400 transition-colors">Scientific Methodology</Link></li>
              <li><Link to="/methodology" className="hover:text-emerald-400 transition-colors">CPCB NAQI Standards</Link></li>
              <li><Link to="/methodology" className="hover:text-emerald-400 transition-colors">Forecasting Specification</Link></li>
              <li><Link to="/data-sources" className="hover:text-emerald-400 transition-colors">Data Attribution</Link></li>
              <li><Link to="/methodology" className="hover:text-emerald-400 transition-colors">Model Limitations</Link></li>
            </ul>
          </div>

          {/* Quick Nav Col 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-display">
              Platform & Access
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/data-sources" className="hover:text-emerald-400 transition-colors">Telemetry Providers</Link></li>
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Personal Dashboard</Link></li>
              <li><Link to="/favorites" className="hover:text-emerald-400 transition-colors">Favorite Cities</Link></li>
              <li><Link to="/alerts" className="hover:text-emerald-400 transition-colors">Threshold Alert Rules</Link></li>
              <li><Link to="/notifications" className="hover:text-emerald-400 transition-colors">Notifications Inbox</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>
            © {new Date().getFullYear()} AeroSense Environmental Intelligence. Built with precision for clean air transparency.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/methodology" className="hover:text-slate-400 transition-colors">India NAQI Compliant</Link>
            <Link to="/data-sources" className="hover:text-slate-400 transition-colors">Copernicus CAMS & CAAQMS</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
