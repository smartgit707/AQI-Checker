import React from 'react';
import { Microscope, CloudDrizzle, Factory, Wind, Sparkles, CheckCircle2 } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import OptimizedImage from '../common/OptimizedImage';
import { IMAGES } from '../../data/images';
import { useLanguage } from '../../context/LanguageContext';

export default function EnvironmentalStory() {
  const { t, currentLang } = useLanguage();
  const pollutantProfiles = [
    {
      code: 'PM2.5',
      fullName: currentLang === 'hi' ? 'सूक्ष्म दहन कण (≤ 2.5 µm)' : 'Fine Combustion Particles (≤ 2.5 µm)',
      impact: currentLang === 'hi' ? 'मानव बाल के व्यास का लगभग 3%। सीधे फेफड़ों की गहराई और रक्तप्रवाह में प्रवेश करता है।' : 'Roughly 3% the diameter of a human hair. Enters alveolar sacs directly and enters the bloodstream.',
      icon: Microscope,
      badge: currentLang === 'hi' ? 'उच्च जोखिम' : 'High Systemic Risk'
    },
    {
      code: 'PM10',
      fullName: currentLang === 'hi' ? 'मोटे धूल कण (≤ 10 µm)' : 'Coarse Dust & Particulates (≤ 10 µm)',
      impact: currentLang === 'hi' ? 'सड़क की धूल और निर्माण कार्य से उत्पन्न। ऊपरी श्वसन मार्ग में जलन पैदा करता है।' : 'Derived from road dust, mechanical grinding, and construction. Aggravates upper respiratory passageways.',
      icon: Wind,
      badge: currentLang === 'hi' ? 'श्वसन जलन' : 'Irritant'
    },
    {
      code: 'NO₂',
      fullName: currentLang === 'hi' ? 'नाइट्रोजन डाइऑक्साइड (वाहन धुआं)' : 'Nitrogen Dioxide (Traffic Exhaust)',
      impact: currentLang === 'hi' ? 'इंजनों से उत्सर्जित अत्यधिक प्रतिक्रियाशील गैस जो जमीनी स्तर पर स्मॉग बनाती है।' : 'Emitted from internal combustion engines. Highly reactive gas contributing to ground ozone and smog.',
      icon: Factory,
      badge: currentLang === 'hi' ? 'दहन गैस' : 'Combustion Gas'
    },
    {
      code: 'O₃',
      fullName: currentLang === 'hi' ? 'ट्रोपोस्फेरिक ओजोन' : 'Tropospheric Ground-Level Ozone',
      impact: currentLang === 'hi' ? 'धूप और रासायनिक गैसों के बीच फोटोकैमिकल प्रतिक्रिया द्वारा निर्मित।' : 'Created by sunlight triggering photochemical reactions between NOx and volatile organic compounds.',
      icon: Sparkles,
      badge: currentLang === 'hi' ? 'फोटोकैमिकल' : 'Photochemical'
    }
  ];

  return (
    <section id="science-insights" className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          badge={t('story.badge', 'Atmospheric Science')}
          title={t('story.title', 'Why Air Quality Matters')}
          subtitle={t('story.subtitle', 'Understanding the physical dynamics of the air column and how invisible aerosols alter physiological and planetary wellbeing.')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Editorial Visual Photographic Side (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80">
              <OptimizedImage
                src={IMAGES.editorial.atmosphericLayers}
                alt={IMAGES.editorial.atmosphericLayersAlt}
                aspectRatio="aspect-[4/5]"
                overlay={
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/10" />
                }
              />

              {/* Float quote card */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-400 block mb-1">
                  Atmospheric Boundary Layer
                </span>
                <p className="text-sm font-medium text-slate-100 italic leading-relaxed">
                  "Clean air is not an absence of particles; it is an equilibrium between planetary natural cycles and responsible human stewardship."
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-6 h-0.5 bg-emerald-500"></div>
                  <span>AeroSense Research Group</span>
                </div>
              </div>
            </div>

            {/* Decorative backing geometry */}
            <div className="absolute -bottom-4 -right-4 w-3/4 h-3/4 bg-emerald-100/60 rounded-3xl -z-10 blur-xl"></div>
          </div>

          {/* Scientific Pollutant Breakdown Side (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="mb-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                The Anatomy of Ambient Aerosols
              </h3>
              <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
                Air quality isn't represented by a single monolithic gas. It is a shifting mixture of solid particulates, liquid droplets, and reactive gases suspended in tropospheric currents.
              </p>
            </div>

            <div className="space-y-4">
              {pollutantProfiles.map((p) => {
                const IconComponent = p.icon;
                return (
                  <div 
                    key={p.code}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-card transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 flex-shrink-0">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                            <span>{p.code}</span>
                            <span className="text-slate-400 font-normal text-xs">•</span>
                            <span className="text-xs font-semibold text-slate-600">{p.fullName}</span>
                          </span>
                          <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {p.badge}
                          </span>
                        </div>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {p.impact}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Calibrated against World Health Organization (WHO 2021) and CPCB National Ambient Standards.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
