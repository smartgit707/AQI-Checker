import React, { useState } from 'react';
import { HeartPulse, Activity, ShieldCheck, AlertCircle, ArrowRight, X, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import OptimizedImage from '../common/OptimizedImage';
import { IMAGES } from '../../data/images';

const PROTOCOL_DETAILS = {
  outdoor: {
    title: 'Outdoor Exercise & Sports Protocol',
    category: 'Physical Activity',
    overview: 'During cardiovascular and endurance exercise, pulmonary minute ventilation increases by 10 to 20 times. This dramatically elevates particulate matter inhalation and drives pollutants deeper into the alveolar tissue.',
    thresholds: [
      { aqi: '0 - 50', status: 'Good', advice: 'Ideal for all sports, marathons, cycling, and intense outdoor conditioning.' },
      { aqi: '51 - 100', status: 'Moderate', advice: 'Safe for healthy individuals. Sensitive runners should choose routes away from heavy traffic corridors.' },
      { aqi: '101 - 200', status: 'Poor', advice: 'Shift intense cardio and HIIT workouts indoors. Exercise outdoors only during midday when inversion layers disperse.' },
      { aqi: '> 200', status: 'Severe', advice: 'Strictly avoid strenuous outdoor exercise. Heavy breathing under severe PM2.5 induces systemic arterial inflammation.' }
    ],
    guidelines: [
      'Select training locations buffered by parks and trees rather than arterial motorways with high diesel exhaust.',
      'Train between 12:00 PM and 4:00 PM in winter months, when solar irradiance breaks nocturnal surface temperature inversions.',
      'Practice nasal breathing for steady-state low-intensity runs to utilize natural upper airway particulate filtering.',
      'Stay properly hydrated; airway mucosal membranes lose barrier efficiency when dehydrated in polluted ambient air.',
      'If outdoor commuting by bicycle is necessary in high AQI, use certified FFP2 or N95 masks with tight silicone seal.'
    ],
    reference: 'Synthesized from ICMR Environmental Health Research & WHO Global Guidelines on Physical Activity.'
  },
  children: {
    title: 'Children & Sensitive Groups Protection Protocol',
    category: 'Vulnerable Groups',
    overview: 'Children breathe approximately 50% more air per kilogram of body weight than adults, and their respiratory epithelial lining is still in active biological development, making them substantially more susceptible to aerosol toxicity.',
    thresholds: [
      { aqi: '0 - 50', status: 'Good', advice: 'Unrestricted outdoor playtime, park activities, and school athletics.' },
      { aqi: '51 - 100', status: 'Moderate', advice: 'Generally safe. Monitor children with documented allergic rhinitis or mild asthma.' },
      { aqi: '101 - 150', status: 'Poor', advice: 'Limit prolonged outdoor playground activities. Schedule rest breaks with indoor hydrations.' },
      { aqi: '> 150', status: 'Severe', advice: 'Schools should suspend outdoor recess and physical education. Keep classroom windows closed with filtration.' }
    ],
    guidelines: [
      'Identify early signs of respiratory distress: recurrent nocturnal coughing, unexplained wheezing, eye itching, or reduced stamina.',
      'Deploy True HEPA (H13 grade) filtration units in children’s study and sleep quarters to maintain indoor PM2.5 below 15 µg/m³.',
      'Eliminate indoor irritants: avoid incense sticks (agarbatti), chemical aerosol fresheners, and burning mosquito coils in child bedrooms.',
      'Ensure children wash their face and rinse nasal passages with saline after returning from dusty school commutes.',
      'Have an emergency pediatric asthma action plan signed by your pediatrician, with rapid-acting inhalers kept within reach.'
    ],
    reference: 'Adapted from Indian Academy of Pediatrics (IAP) & American Academy of Pediatrics Environmental Health Guidance.'
  },
  indoor: {
    title: 'Indoor Air Quality & Filtration Engineering Protocol',
    category: 'Home & Office',
    overview: 'Indoor environments can accumulate 2 to 5 times higher concentrations of fine pollutants and volatile organic compounds (VOCs) than the ambient atmosphere if air recirculation and filtration are improperly managed.',
    thresholds: [
      { aqi: '0 - 50', status: 'Good', advice: 'Open cross-ventilation windows freely to refresh indoor oxygen and disperse indoor CO2.' },
      { aqi: '51 - 100', status: 'Moderate', advice: 'Ventilate during low-traffic afternoon hours. Run purifiers on auto mode in bedrooms.' },
      { aqi: '101 - 200', status: 'Poor', advice: 'Keep windows closed. Run HEPA filtration continuously in occupied zones with doors shut.' },
      { aqi: '> 200', status: 'Severe', advice: 'Complete room seal. Run air purifiers on high/turbo speed. Seal door draft gaps with draft stoppers.' }
    ],
    guidelines: [
      'Size air purifiers properly: verify the Clean Air Delivery Rate (CADR) provides at least 4 to 5 Air Changes per Hour (ACH) for your room volume.',
      'Maintain filter hygiene: vacuum the pre-filter mesh every 2 weeks, and replace true HEPA H13 filters every 6 months in urban areas.',
      'Avoid uncertified ionizing purifiers or ozone-generating electronic air cleaners that produce secondary pulmonary irritants.',
      'Operate heavy kitchen exhaust hoods while cooking with frying oil or spices to prevent indoor PM2.5 spikes exceeding 500 µg/m³.',
      'Use wet microfiber damp mopping rather than dry sweeping to prevent resuspended coarse dust (PM10) particles.'
    ],
    reference: 'Standards aligned with ASHRAE 62.2 Ventilation Standards and CPCB Clean Indoor Air Guidelines.'
  },
  respiratory: {
    title: 'Cardiopulmonary & Chronic Respiratory Protocol',
    category: 'Preventative Wellness',
    overview: 'Fine particulates (PM2.5) and ultrafine particles (< 0.1 µm) cross the alveolar-capillary barrier directly into arterial circulation, inducing oxidative stress, vasoconstriction, platelet activation, and autonomic nervous system imbalance.',
    thresholds: [
      { aqi: '0 - 50', status: 'Good', advice: 'Standard preventative medication routine. Safe for all normal daily activities.' },
      { aqi: '51 - 100', status: 'Moderate', advice: 'Maintain baseline inhaler adherence. Carry rescue medication when traveling in transit.' },
      { aqi: '101 - 200', status: 'Poor', advice: 'Avoid non-essential outdoor transit. Monitor resting pulse oximetry (SpO2) and peak flow rates.' },
      { aqi: '> 200', status: 'Severe', advice: 'Strictly remain indoors within HEPA-filtered zones. Wear fitted N95 respirators if leaving home.' }
    ],
    guidelines: [
      'Keep rescue bronchodilators (e.g. Salbutamol) readily accessible at work, home, and during daily commutes.',
      'Never skip or alter prescribed maintenance anti-inflammatory therapies (such as inhaled corticosteroids) during high pollution spikes.',
      'Ordinary cloth and single-ply surgical masks offer under 20% filtration against fine particles; always use certified N95 or FFP2 respirators.',
      'Track sudden shifts in ambient NO2 and SO2 alongside PM2.5, as acidic gases exacerbate bronchial hypersensitivity.',
      'Seek urgent medical attention if experiencing persistent chest tightness, severe shortness of breath, dizziness, or cyanosis.'
    ],
    reference: 'Endorsed by the Global Initiative for Chronic Obstructive Lung Disease (GOLD) & Indian Chest Society.'
  }
};

export default function HealthSection() {
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  const protocolData = selectedProtocol ? PROTOCOL_DETAILS[selectedProtocol.id] || null : null;

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
              onClick={() => setSelectedProtocol(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedProtocol(item); }}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
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
                  <span className="text-emerald-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read Protocol <ArrowRight className="w-3.5 h-3.5" />
                  </span>
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

      {/* Interactive Protocol Modal */}
      {selectedProtocol && protocolData && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedProtocol(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-left overflow-hidden relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-slate-100">
              <img 
                src={selectedProtocol.imageUrl} 
                alt={selectedProtocol.alt} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent" />
              
              <button
                onClick={() => setSelectedProtocol(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors border border-white/20 focus:outline-none"
                aria-label="Close protocol"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[11px] font-bold uppercase tracking-wider">
                  {protocolData.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display mt-2 drop-shadow-sm">
                  {protocolData.title}
                </h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Overview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Scientific Basis & Impact</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {protocolData.overview}
                </p>
              </div>

              {/* Threshold Matrix */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">AQI Trigger Thresholds</h4>
                <div className="space-y-2">
                  {protocolData.thresholds.map((t, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 gap-2 text-xs">
                      <div className="flex items-center gap-2 font-mono font-bold text-slate-800">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          t.status === 'Good' ? 'bg-emerald-500' :
                          t.status === 'Moderate' ? 'bg-amber-500' :
                          t.status === 'Poor' ? 'bg-orange-500' : 'bg-rose-500'
                        }`} />
                        AQI {t.aqi} ({t.status})
                      </div>
                      <span className="text-slate-600 sm:text-right flex-1 sm:pl-4">{t.advice}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Guidelines */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Actionable Clinical Guidelines</h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  {protocolData.guidelines.map((g, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reference */}
              <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
                <span>{protocolData.reference}</span>
                <button
                  onClick={() => setSelectedProtocol(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
                >
                  Close Advisory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
