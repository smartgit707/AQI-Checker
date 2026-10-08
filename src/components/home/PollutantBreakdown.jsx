import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import { useLanguage } from '../../context/LanguageContext';

export default function PollutantBreakdown({ pollutants, cityName }) {
  const { t, currentLang } = useLanguage();

  const getPollutantStatusBadge = (status) => {
    switch (status) {
      case 'Good':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Moderate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Poor':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Unhealthy':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Good': return '#10b981';
      case 'Moderate': return '#f59e0b';
      case 'Poor': return '#f97316';
      case 'Unhealthy': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <section id="pollutants" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          badge={t('pollutants.badge', 'Chemical & Particulate Analysis')}
          title={`${t('pollutants.title', 'Critical Pollutant Matrix')} — ${cityName}`}
          subtitle={t('pollutants.subtitle', 'Real-time multi-pollutant concentrations measured against 24-hour CPCB National Ambient Air Quality Standards.')}
        />

        {/* 6 Grid Pollutant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pollutants?.map((item) => {
            const percentageOfLimit = Math.min(Math.round((item.value / item.limit) * 100), 100);
            const statusColor = getStatusColor(item.status);

            return (
              <div 
                key={item.code}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-slate-300 hover:shadow-card transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-slate-900 font-display">
                          {item.code}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getPollutantStatusBadge(item.status)}`}>
                          {t(`aqi.${(item.status || '').toLowerCase()}`, item.status)}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-500 mt-1">
                        {item.name}
                      </h4>
                    </div>

                    {/* Trend Icon */}
                    <div className="p-2 rounded-xl bg-slate-50 text-slate-400">
                      {item.trend === 'up' && <TrendingUp className="w-4 h-4 text-rose-500" />}
                      {item.trend === 'down' && <TrendingDown className="w-4 h-4 text-emerald-500" />}
                      {item.trend === 'stable' && <Minus className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {/* Value & Unit */}
                  <div className="my-5 flex items-baseline gap-2">
                    <span 
                      className="text-4xl font-extrabold tracking-tight font-display"
                      style={{ color: statusColor }}
                    >
                      {item.value}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {item.unit}
                    </span>
                  </div>

                  {/* Standard Limit Comparison Bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                      <span>{currentLang === 'hi' ? 'मानक सीमा' : 'Threshold'}: {item.limit} {item.unit}</span>
                      <span className="font-semibold text-slate-700">
                        {percentageOfLimit}% {currentLang === 'hi' ? 'सुरक्षित सीमा का' : 'of safe limit'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{ 
                          width: `${percentageOfLimit}%`, 
                          backgroundColor: statusColor 
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Pollutant Explanation */}
                <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 leading-relaxed flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>{item.desc}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informative standard banner */}
        <div className="mt-8 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>
              {currentLang === 'hi'
                ? 'सभी मापे गए पैरामीटर केंद्रीय प्रदूषण नियंत्रण बोर्ड (CPCB) के निरंतर परिवेशी निगरानी मानदंडों का पालन करते हैं।'
                : 'All monitored parameters adhere to the revised Central Pollution Control Board (CPCB) continuous ambient monitoring criteria.'}
            </span>
          </div>
          <span className="font-semibold text-emerald-700 whitespace-nowrap">
            {currentLang === 'hi' ? '24 घंटे का निरंतर भारित औसत' : 'Updated continuous 24h weighted average'}
          </span>
        </div>

      </div>
    </section>
  );
}
