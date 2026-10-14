import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SmartHomeSimulator3D from '../components/home3d/SmartHomeSimulator3D';
import { useLanguage } from '../context/LanguageContext';
import { 
  Wind, 
  Sparkles, 
  ShieldCheck, 
  Home, 
  Sliders, 
  ArrowRight,
  Info,
  CheckCircle2,
  Leaf
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PurifierSimulatorPage() {
  const { currentLang, t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      
      {/* 1. Global Navigation */}
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Page Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-300 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>{currentLang === 'hi' ? '3D कक्षीय वायु गतिशीलता' : '3D Fluid Dynamics Chamber'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-display">
              {currentLang === 'hi' ? 'स्मार्ट होम वायु शोधक 3D सिम्युलेटर' : '3D Smart Home & Purifier Simulator'}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {currentLang === 'hi'
                ? 'कमरे का आकार, खिड़की की स्थिति और वायु शोधक (HEPA Purifier) की गति को 3D कमरे में बदलकर देखें कि आपके घर के अंदर की हवा कितनी तेजी से शुद्ध होती है।'
                : 'Interact with an isometric 3D apartment to simulate real-time HEPA filtration, window infiltration, and particulate clearance times under varying outdoor pollution levels.'}
            </p>
          </div>

          {/* Core Interactive 3D Simulator Engine */}
          <SmartHomeSimulator3D />

          {/* Educational Purifier Buying & Sizing Guide */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-card border border-slate-200/90 mt-12">
            <h3 className="text-xl font-extrabold text-slate-900 font-display mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>{currentLang === 'hi' ? 'वायु शोधक चयन एवं उपयोग वैज्ञानिक मार्गदर्शिका' : 'Science-Backed Air Purifier Sizing & Usage Guide'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {currentLang === 'hi' ? 'CADR का 2/3 नियम' : 'The CADR 2/3 Sizing Rule'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentLang === 'hi'
                    ? 'कमरे के क्षेत्रफल (वर्ग फुट) का कम से कम 2/3 CADR (Smoke Clean Air Delivery Rate) होना चाहिए। उदाहरण: 300 वर्ग फुट के कमरे के लिए न्यूनतम 200 m³/h CADR वाला प्यूरीफायर चुनें।'
                    : 'Your purifier’s CADR (Clean Air Delivery Rate) should be at least two-thirds of your room’s square footage. For a 300 sq ft living room, look for at least 200 m³/h CADR.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {currentLang === 'hi' ? 'ट्रू HEPA (H13) बनाम आयनाइज़र' : 'True HEPA H13 vs. Ionizers'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentLang === 'hi'
                    ? 'हमेशा मैकेनिकल ट्रू HEPA फ़िल्टर चुनें जो 0.3 माइक्रोन के 99.97% कणों को रोकता है। ओज़ोन उत्सर्जित करने वाले आयनाइज़र से बचें क्योंकि वे फेफड़ों में जलन पैदा कर सकते हैं।'
                    : 'Always choose medical-grade True HEPA H13 mechanical filters. Avoid ionizers and UV plasma generators that generate secondary ozone, a pulmonary irritant.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {currentLang === 'hi' ? 'हवा के बदलाव (ACH) का महत्व' : 'Target 4 to 5 Air Changes (ACH)'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentLang === 'hi'
                    ? 'धुंध और प्रदूषण के दिनों में प्यूरीफायर को कमरे की कुल हवा को प्रति घंटे 4-5 बार पूरी तरह बदलना चाहिए। खिड़कियां बंद रखने से इनडोर AQI 30 मिनट में 250 से 25 तक गिर सकता है।'
                    : 'Aim for 4 to 5 Air Changes per Hour (ACH). Keeping windows sealed allows the purifier to drop indoor PM2.5 from hazardous levels down to clean air within 30 minutes.'}
                </p>
              </div>

            </div>

            {/* Quick Link Footer */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                {currentLang === 'hi'
                  ? 'बाहर निकलते समय सुरक्षित यात्रा के लिए स्वच्छ मार्ग नेविगेटर का उपयोग करें।'
                  : 'Stepping outside? Plan your daily commute along lower-pollution corridors.'}
              </div>
              <Link
                to="/clean-commute"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shrink-0"
              >
                <span>{currentLang === 'hi' ? 'स्वच्छ मार्ग योजनाकार' : 'Open Clean Route Planner'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* 3. Global Footer */}
      <Footer />

    </div>
  );
}
