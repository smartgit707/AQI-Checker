import React from 'react';
import { HeartPulse, Activity, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import OptimizedImage from '../common/OptimizedImage';
import { IMAGES } from '../../data/images';

export default function HealthSection() {
  return (
    <section id="health-advisory" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          badge="Protective Guidance"
          title="How Does Air Quality Affect You?"
          subtitle="Actionable, scientifically grounded guidelines for physical exercise, indoor living, and protecting sensitive family members."
        />

        {/* 4 Cards Grid with Images & Contextual Health Guidance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {IMAGES.healthActivities.map((item) => (
            <div 
              key={item.id}
              className="group rounded-3xl overflow-hidden bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-card transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Header */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <OptimizedImage
                  src={item.imageUrl}
                  alt={item.alt}
                  className="group-hover:scale-105 transition-transform duration-500"
                  overlay={
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/10" />
                  }
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="text-base font-bold text-slate-900 font-display group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.advice}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Advisory Protocol</span>
                  <span className="text-emerald-600 group-hover:translate-x-1 transition-transform">Read Protocol →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer note */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start sm:items-center gap-3 text-xs text-slate-500">
          <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>Disclaimer:</strong> Environmental health guidelines are synthesized from public epidemiology publications (ICMR, WHO). Always consult certified pulmonary medical professionals for chronic respiratory therapies or specialized treatment plans.
          </span>
        </div>

      </div>
    </section>
  );
}
