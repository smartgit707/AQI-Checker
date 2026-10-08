import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import StubbleTrackerView from '../components/stubble/StubbleTrackerView';
import { useLanguage } from '../context/LanguageContext';
import { 
  Flame, 
  Satellite, 
  ShieldCheck, 
  Wind, 
  Sparkles, 
  ArrowRight,
  Leaf
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StubbleTrackerPage() {
  const { t, currentLang } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      
      {/* 1. Global Navigation */}
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Page Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span>{currentLang === 'hi' ? 'उत्तर भारत उपग्रह निगरानी' : 'North India Satellite Thermal Surveillance'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-display">
              {currentLang === 'hi' ? 'पराली दहन एवं उपग्रह थर्मल ट्रैकर' : 'Stubble Burning & Farm Fire Satellite Tracker'}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {currentLang === 'hi'
                ? 'नासा VIIRS और इसरो उपग्रहों द्वारा ट्रैक किए गए सक्रिय कृषि अग्नि हॉटस्पॉट, उत्तर-पश्चिमी वायु प्रवाह और दिल्ली-एनसीआर में मौसमी वायु गुणवत्ता पर पड़ने वाले प्रभाव का वैज्ञानिक विश्लेषण।'
                : 'High-resolution thermal anomaly data from NASA VIIRS and ISRO satellites monitoring crop residue fires across Punjab, Haryana, and Western UP alongside atmospheric plume dispersion into the Indo-Gangetic basin.'}
            </p>
          </div>

          {/* Core Interactive Stubble Tracker View Component */}
          <StubbleTrackerView />

          {/* Sustainable Agronomic Solutions & Policy Alternatives */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-card border border-slate-200/90 mt-12">
            <h3 className="text-xl font-extrabold text-slate-900 font-display mb-6 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              <span>{currentLang === 'hi' ? 'पराली के स्थायी समाधान व विकल्प' : 'Sustainable Crop Residue Management Alternatives'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {currentLang === 'hi' ? 'हैप्पी सीडर व सुपर एसएमएस (इन-सीटू)' : 'Happy Seeder & In-Situ Sowing'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentLang === 'hi'
                    ? 'बिना पराली जलाए सीधे गेहूं की बुवाई करने वाली मशीनें। यह मिट्टी में नमी बनाए रखती हैं और खाद का काम करती हैं।'
                    : 'Tractor-mounted machinery that sows wheat directly through standing paddy stubble without burning, enriching soil organic carbon.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-teal-200 text-teal-800 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {currentLang === 'hi' ? 'पूसा बायो-डिकम्पोज़र स्प्रे' : 'Pusa Bio-Decomposer Microbial Spray'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentLang === 'hi'
                    ? 'आईसीएआर द्वारा विकसित कवक कैप्सूल जो 20-25 दिनों में खेत में ही पराली को गलाकर प्राकृतिक जैविक खाद में बदल देते हैं।'
                    : 'A microbial consortium developed by ICAR that decomposes paddy straw directly on the field into rich humus in 20-25 days.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {currentLang === 'hi' ? 'बायोमास पेलेट व बिजली उत्पादन' : 'Biomass Pelleting & Thermal Power Co-Firing'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentLang === 'hi'
                    ? 'पराली को कम्प्रेस करके पेलेट्स बनाना, जिसे कोयले के साथ थर्मल पावर प्लांटों और बॉयलरों में ईंधन के रूप में इस्तेमाल किया जाता है।'
                    : 'Baling and compressing crop residue into biomass briquettes co-fired in coal thermal plants and 2G bio-ethanol refineries.'}
                </p>
              </div>

            </div>

            {/* Link back to Clean Commute / Home */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                {currentLang === 'hi'
                  ? 'दिल्ली-एनसीआर में स्मॉग के दिनों में सुरक्षित यात्रा के लिए स्वच्छ मार्ग योजनाकार का उपयोग करें।'
                  : 'Traveling in North India during high-smog episodes? Plan your commute along lower-exposure corridors.'}
              </div>
              <Link
                to="/clean-commute"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shrink-0"
              >
                <span>{currentLang === 'hi' ? 'स्वच्छ मार्ग नेविगेटर खोलें' : 'Open Clean Route Planner'}</span>
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
