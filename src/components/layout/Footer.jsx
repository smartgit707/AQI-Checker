import React from 'react';
import { Wind, Heart, Shield, Globe, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white">
                <Wind className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight font-display">
                AeroSense
              </span>
            </div>
            
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-4">
              "Understand the air you breathe." High-precision environmental intelligence, live atmospheric indices, and localized air health guidance for India.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All telemetry streams operating normally</span>
            </div>
          </div>

          {/* Quick Nav Col 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-display">
              Air Intelligence
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#overview" className="hover:text-emerald-400 transition-colors">Overview</a></li>
              <li><a href="#live-map" className="hover:text-emerald-400 transition-colors">Live India Map</a></li>
              <li><a href="#city-explorer" className="hover:text-emerald-400 transition-colors">City Explorer</a></li>
              <li><a href="#pollutants" className="hover:text-emerald-400 transition-colors">Pollutant Matrix</a></li>
              <li><a href="#meteorology" className="hover:text-emerald-400 transition-colors">Meteorological Layer</a></li>
            </ul>
          </div>

          {/* Quick Nav Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-display">
              Health & Standards
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#health-advisory" className="hover:text-emerald-400 transition-colors">Health Protocols</a></li>
              <li><a href="#science-insights" className="hover:text-emerald-400 transition-colors">PM2.5 Science</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">CPCB NAQI Standards</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">WHO Comparison Scale</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Sensitive Group FAQ</a></li>
            </ul>
          </div>

          {/* Quick Nav Col 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-display">
              Platform & Data
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Telemetry API Docs</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Sensor Calibration</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Data Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact Research Lab</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>
            © {new Date().getFullYear()} AeroSense Environmental Technologies. Built with precision for clean air transparency.
          </div>
          <div className="flex items-center gap-6">
            <span>India NAQI Compliant</span>
            <span>Continuous CAAQMS Telemetry</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
