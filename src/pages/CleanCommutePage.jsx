import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CleanRoutePlanner from '../components/commute/CleanRoutePlanner';
import { useLanguage } from '../context/LanguageContext';
import { 
  Navigation, 
  ShieldCheck, 
  Wind, 
  Heart, 
  Car, 
  HelpCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CleanCommutePage() {
  const { t, currentLang } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      
      {/* 1. Global Navigation */}
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Page Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-300 shadow-2xs">
              <Navigation className="w-3.5 h-3.5 text-emerald-700" />
              <span>{currentLang === 'hi' ? 'स्मार्ट कम्यूट टेलीमेट्री' : 'Urban Eco-Routing Telemetry'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-display">
              {currentLang === 'hi' ? 'स्वच्छ आवागमन एवं मार्ग योजनाकार' : 'Clean Route & Commute Planner'}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {currentLang === 'hi'
                ? 'सिर्फ सबसे तेज नहीं, बल्कि सबसे स्वच्छ मार्ग चुनें। शहर के ग्रीनवे, पार्कवे और झील के किनारों से गुजरने वाले मार्गों से अपने फेफड़ों में जाने वाले विषैले कणों को 40-50% तक कम करें।'
                : 'Navigate through urban green belts, parkways, and ventilated corridors instead of high-emission highway canyons. Protect your respiratory system during daily travel.'}
            </p>
          </div>

          {/* Core Interactive Clean Route Planner Engine */}
          <CleanRoutePlanner />

          {/* Commuter Health Guidance & Actionable Recommendations */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-card border border-slate-200/90 mt-12">
            <h3 className="text-xl font-extrabold text-slate-900 font-display mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>{currentLang === 'hi' ? 'दैनिक यात्रियों के लिए स्वास्थ्य सावधानियाँ' : 'Commuter Health & Defense Protocol'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {currentLang === 'hi' ? 'कार का AC आंतरिक पुनर्चक्रण पर रखें' : 'Keep Car AC on Recirculation'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentLang === 'hi'
                    ? 'वाहनों के धुएं वाले राजमार्गों पर कभी बाहरी हवा (Fresh Air) मोड न चलाएं। आंतरिक रीसर्क्युलेशन केबिन फ़िल्टर को 75-80% पीएम2.5 रोकने में सक्षम बनाता है।'
                    : 'Never draw fresh outside air when in stop-and-go traffic. Internal recirculation mode allows the cabin filter to block up to 80% of road particulates.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {currentLang === 'hi' ? 'दुपहिया और पैदल यात्रियों के लिए N95 मास्क' : 'N95 Respirators for Open Transit'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentLang === 'hi'
                    ? 'साइकिल, बाइक या ऑटो में यात्रा करते समय कपड़े का मास्क नहीं, बल्कि NIOSH-प्रमाणित N95/FFP2 मास्क ही डीजल कालिख और ब्रेक डस्ट से सुरक्षा देता है।'
                    : 'Cloth and surgical masks do not seal against toxic diesel ultrafines. Wear a certified N95 respirator if riding a motorcycle, cycling, or walking roadside.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {currentLang === 'hi' ? 'दोपहर के समय प्रस्थान चुनें' : 'Time Departures for Peak Dispersion'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentLang === 'hi'
                    ? 'सुबह 7 से 9 बजे के बीच ज़मीनी धुंध घनी होती है। यदि संभव हो, तो 11:30 AM से 3:30 PM के बीच यात्रा करें जब वायुमंडलीय मिश्रण परत सबसे ऊँची होती है।'
                    : 'Morning temperature inversions trap smog near street level. When scheduling allows, travel between 11:30 AM and 3:30 PM for peak atmospheric dispersion.'}
                </p>
              </div>

            </div>

            {/* Link to Citizen Dashboard */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                {currentLang === 'hi' 
                  ? 'अपने परिवार के सदस्यों और दैनिक स्कूल/ऑफिस आवागमन को ट्रैक करने के लिए नागरिक डैशबोर्ड पर जाएँ।'
                  : 'Manage household vulnerability profiles and save frequent routes in the Citizen & Family Dashboard.'}
              </div>
              <Link
                to="/citizen-dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shrink-0"
              >
                <span>{currentLang === 'hi' ? 'नागरिक डैशबोर्ड खोलें' : 'Open Citizen Dashboard'}</span>
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
