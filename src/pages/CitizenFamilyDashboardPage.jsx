import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CITIES_DATA } from '../data/mockData';
import { getAQILevel } from '../design-system/aqiTokens';
import AudioBriefingPlayer from '../components/common/AudioBriefingPlayer';
import AiAssistantWidget from '../components/common/AiAssistantWidget';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  Heart,
  Activity,
  Wind,
  TrendingUp,
  ArrowRight,
  Plus,
  Sparkles,
  ShieldCheck,
  Thermometer,
  CloudSun,
  AlertTriangle,
  Compass,
  Bell,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Sliders,
  User,
  Users,
  Home,
  Bike,
  Car,
  Footprints,
  Baby,
  Smile,
  Shield,
  HelpCircle,
  Printer,
  ChevronRight,
  Flame,
  Droplets,
  Eye,
  Check,
  X,
  Navigation
} from 'lucide-react';

const DEFAULT_FAMILY_MEMBERS = [
  {
    id: 'fam_1',
    name: 'Aarav',
    relation: 'Toddler (2 yrs)',
    riskLevel: 'High',
    avatar: '👶',
    condition: 'Sensitive developing respiratory system',
    guideline: 'Keep indoors during early morning and late evening. Run HEPA air purifier in bedroom.'
  },
  {
    id: 'fam_2',
    name: 'Diya',
    relation: 'School Child (9 yrs)',
    riskLevel: 'Moderate',
    avatar: '🧒',
    condition: 'Active student, school transit',
    guideline: 'Wear an N95 mask during school bus commute. Request indoor sports if AQI exceeds 200.'
  },
  {
    id: 'fam_3',
    name: 'Dadaji',
    relation: 'Grandparent (72 yrs)',
    riskLevel: 'Very High',
    avatar: '👴',
    condition: 'Hypertension & mild bronchitis',
    guideline: 'Strictly avoid morning fog/smog walks. Schedule light indoor stretching between 1 PM and 3 PM.'
  },
  {
    id: 'fam_4',
    name: 'Me (Parent)',
    relation: 'Adult Jogger (36 yrs)',
    riskLevel: 'Standard',
    avatar: '🏃',
    condition: 'Regular morning cardio & running',
    guideline: 'Check the Golden Outdoor Window before running. Postpone outdoor cardio when AQI > 150.'
  }
];

export default function CitizenFamilyDashboardPage() {
  const { user } = useAuth();
  const { t, currentLang } = useLanguage();

  // Selected City for Family Intelligence
  const initialCitySlug = (user?.favoriteCities && user.favoriteCities[0]) || 'delhi';
  const [selectedCitySlug, setSelectedCitySlug] = useState(initialCitySlug);

  // Commute Calculator State
  const [transitMode, setTransitMode] = useState('bike'); // 'walk', 'bike', 'bus', 'metro'
  const [commuteMinutes, setCommuteMinutes] = useState(30);
  const [routeType, setRouteType] = useState('arterial'); // 'arterial', 'commercial', 'green'

  // Activity Planner Filter
  const [activeActivity, setActiveActivity] = useState('jogging'); // 'jogging', 'kids', 'walking', 'cycling'

  // Family Members Management State
  const [familyMembers, setFamilyMembers] = useState(() => {
    try {
      const stored = localStorage.getItem('aerosense_family_members');
      return stored ? JSON.parse(stored) : DEFAULT_FAMILY_MEMBERS;
    } catch {
      return DEFAULT_FAMILY_MEMBERS;
    }
  });

  const [newMemberModalOpen, setNewMemberModalOpen] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    relation: 'Child',
    riskLevel: 'High',
    avatar: '🧒',
    condition: 'Mild Asthma',
    guideline: 'Carry emergency inhaler. Limit playground activities during high pollution hours.'
  });

  useEffect(() => {
    try {
      localStorage.setItem('aerosense_family_members', JSON.stringify(familyMembers));
    } catch {}
  }, [familyMembers]);

  // Resolve City Telemetry
  const currentCity = useMemo(() => {
    const match = CITIES_DATA.find(
      (c) => c.id.toLowerCase() === selectedCitySlug.toLowerCase() || c.name.toLowerCase() === selectedCitySlug.toLowerCase()
    );
    return match || CITIES_DATA[0];
  }, [selectedCitySlug]);

  const aqiInfo = getAQILevel(currentCity.aqi);

  // Generate 24-Hour Lifestyle Activity Windows based on current city AQI
  const hourlyActivityWindows = useMemo(() => {
    const hours = [
      { hour: '06:00 AM', period: 'Early Morning', offset: -15 },
      { hour: '08:00 AM', period: 'Morning Rush', offset: +35 },
      { hour: '11:00 AM', period: 'Late Morning', offset: -10 },
      { hour: '02:00 PM', period: 'Afternoon Sun', offset: -45 },
      { hour: '05:00 PM', period: 'Evening School End', offset: +15 },
      { hour: '07:30 PM', period: 'Dinner Rush Hour', offset: +60 },
      { hour: '10:00 PM', period: 'Night Bedtime', offset: +25 }
    ];

    return hours.map((item) => {
      const projectedAqi = Math.max(25, Math.min(480, currentCity.aqi + item.offset));
      const level = getAQILevel(projectedAqi);

      let activityVerdict = 'Safe for Outdoor Exercise';
      let verdictColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      let icon = 'safe';

      if (projectedAqi > 250) {
        activityVerdict = 'Hazardous: Keep All Family Indoors';
        verdictColor = 'text-rose-700 bg-rose-50 border-rose-200';
        icon = 'hazard';
      } else if (projectedAqi > 150) {
        activityVerdict = 'Caution: Sensitive Members Avoid Outdoors';
        verdictColor = 'text-amber-800 bg-amber-50 border-amber-200';
        icon = 'caution';
      } else if (projectedAqi > 90) {
        activityVerdict = 'Moderate: Suitable for Walking & Play';
        verdictColor = 'text-yellow-800 bg-yellow-50 border-yellow-200';
        icon = 'moderate';
      }

      return {
        ...item,
        aqi: projectedAqi,
        level,
        activityVerdict,
        verdictColor,
        icon
      };
    });
  }, [currentCity.aqi]);

  // Identify Golden Hour (best time to go outside)
  const goldenHour = useMemo(() => {
    return [...hourlyActivityWindows].sort((a, b) => a.aqi - b.aqi)[0];
  }, [hourlyActivityWindows]);

  // Calculate Commute Route Exposure Score
  const commuteAnalysis = useMemo(() => {
    // Breathing rate in m3/hr by transit mode
    const ventilationRates = {
      walk: 1.8,   // High respiration while brisk walking
      bike: 2.2,   // High exertion on two-wheeler/bicycle
      bus: 0.9,    // Sedentary but exposed to open windows
      metro: 0.5   // Enclosed filtered air conditioning
    };

    // Ambient microenvironment concentration factor relative to city AQI
    const exposureFactors = {
      walk: 1.2,   // Pavement level next to exhausts
      bike: 1.5,   // Directly behind bus/truck diesel exhaust pipes
      bus: 1.1,    // Non-AC bus cabin
      metro: 0.25  // Subterranean/elevated with recirculated HEPA
    };

    const routeMultipliers = {
      arterial: 1.3,
      commercial: 1.1,
      green: 0.75
    };

    const ventRate = ventilationRates[transitMode] || 1.0;
    const expFactor = exposureFactors[transitMode] || 1.0;
    const routeMult = routeMultipliers[routeType] || 1.0;

    // Approximate PM2.5 in ug/m3 based on AQI
    const ambientPm25 = Math.round(currentCity.aqi * 0.65);
    const effectiveConcentration = ambientPm25 * expFactor * routeMult;
    const hours = commuteMinutes / 60;
    const inhaledMicrograms = Math.round(effectiveConcentration * ventRate * hours);

    // Approximate equivalent in cigarettes smoked (approx 22ug PM2.5 = 1 cigarette equivalent)
    const cigaretteEquivalent = (inhaledMicrograms / 22).toFixed(1);

    let riskGrade = 'Low';
    let riskColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    let advice = 'Standard commute exposure. No special gear necessary today.';

    if (inhaledMicrograms > 120) {
      riskGrade = 'Severe Exposure';
      riskColor = 'text-rose-800 bg-rose-50 border-rose-200';
      advice = 'High particulate exposure. Strongly advise wearing an N95 respirator mask or switching to Metro/AC transport.';
    } else if (inhaledMicrograms > 60) {
      riskGrade = 'Elevated Risk';
      riskColor = 'text-amber-800 bg-amber-50 border-amber-200';
      advice = 'Moderate-high inhalation. Wear a particulate mask on two-wheelers and avoid heavy breathing.';
    } else if (inhaledMicrograms > 30) {
      riskGrade = 'Moderate';
      riskColor = 'text-yellow-800 bg-yellow-50 border-yellow-200';
      advice = 'Acceptable for healthy individuals. Children and asthmatics should prefer AC transit.';
    }

    return {
      inhaledMicrograms,
      cigaretteEquivalent,
      riskGrade,
      riskColor,
      advice,
      ambientPm25: Math.round(effectiveConcentration)
    };
  }, [transitMode, commuteMinutes, routeType, currentCity.aqi]);

  // Home Protection & Equipment Analysis
  const homeProtection = useMemo(() => {
    const aqi = currentCity.aqi;
    if (aqi > 300) {
      return {
        purifierMode: 'Turbo / Maximum Clean Air Delivery (CADR)',
        purifierColor: 'text-purple-700 bg-purple-50 border-purple-200',
        maskType: 'N95 or N99 Respirator with tight seal',
        maskColor: 'text-rose-700 bg-rose-50 border-rose-200',
        windowAdvice: 'Keep all windows and balcony doors sealed 24/7. Use wet mopping indoors to trap settling dust.',
        ventilateWindow: 'Do not open windows today'
      };
    } else if (aqi > 200) {
      return {
        purifierMode: 'High Speed Mode in living room and bedrooms',
        purifierColor: 'text-rose-700 bg-rose-50 border-rose-200',
        maskType: 'N95 Respirator mask mandatory outdoors',
        maskColor: 'text-rose-700 bg-rose-50 border-rose-200',
        windowAdvice: 'Keep windows closed during morning & evening rush hours. Ventilate only during sunny afternoon.',
        ventilateWindow: '1:30 PM – 3:00 PM (brief 15 mins only)'
      };
    } else if (aqi > 100) {
      return {
        purifierMode: 'Auto / Medium Speed Mode recommended',
        purifierColor: 'text-amber-800 bg-amber-50 border-amber-200',
        maskType: 'Surgical or 3-ply mask for sensitive members',
        maskColor: 'text-amber-800 bg-amber-50 border-amber-200',
        windowAdvice: 'Cross-ventilation is safe during midday when temperature rises and particulates disperse.',
        ventilateWindow: '12:00 PM – 4:00 PM'
      };
    } else {
      return {
        purifierMode: 'Eco Mode or Standby (Indoor air is healthy)',
        purifierColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        maskType: 'No mask required for general activities',
        maskColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        windowAdvice: 'Ideal conditions to open windows and let natural fresh air circulate through the house.',
        ventilateWindow: 'Safe all day (Morning & Afternoon)'
      };
    }
  }, [currentCity.aqi]);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberForm.name.trim()) return;
    const newEntry = {
      id: `fam_${Date.now()}`,
      ...newMemberForm
    };
    setFamilyMembers((prev) => [...prev, newEntry]);
    setNewMemberModalOpen(false);
    setNewMemberForm({
      name: '',
      relation: 'Child',
      riskLevel: 'High',
      avatar: '🧒',
      condition: 'Mild Asthma',
      guideline: 'Carry emergency inhaler. Limit playground activities during high pollution hours.'
    });
  };

  const handleRemoveMember = (id) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Persona Switcher Bar */}
          <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <Link
                to="/citizen-dashboard"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
              >
                <Home className="w-4 h-4 text-emerald-200" />
                <span>Citizen & Family Dashboard</span>
              </Link>

              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors"
              >
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Scientific Sensor Overview</span>
              </Link>

              <Link
                to="/alerts"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors"
              >
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Alert Rules</span>
              </Link>

              <Link
                to="/compare"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors"
              >
                <Sliders className="w-4 h-4 text-teal-600" />
                <span>City Comparison</span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors self-end sm:self-auto"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Family Safety Plan</span>
            </button>
          </div>

          {/* Location Hero Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {user?.role === 'citizen' ? '🏡 Verified Citizen & Household Advisory Suite' : t('citizen.title', 'Family Air Quality & Lifestyle Advisory')}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {currentLang === 'hi'
                  ? `${user?.name ? `${user.name} के ` : ''}परिवार के लिए दैनिक सुरक्षा निर्देशिका`
                  : `Daily Protection Guide for ${user?.name || 'Your Household'}`}
              </h1>
              <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
                {t('citizen.subtitle', 'Practical, science-backed guidance translating complex atmospheric data into everyday decisions: school commutes, morning jogging windows, and home air purifier settings.')}
              </p>
            </div>

            {/* City Selector Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
              <div className="space-y-1">
                <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
                  Select Monitored City
                </span>
                <select
                  value={selectedCitySlug}
                  onChange={(e) => setSelectedCitySlug(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-800 focus:outline-emerald-500 shadow-2xs"
                >
                  {CITIES_DATA.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.state})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-4 pt-3 sm:pt-0">
                <div
                  className="px-3 py-1.5 rounded-xl flex items-center gap-2 border"
                  style={{
                    backgroundColor: aqiInfo.bgColor,
                    borderColor: aqiInfo.borderColor,
                    color: aqiInfo.textColor
                  }}
                >
                  <span className="text-2xl font-black">{currentCity.aqi}</span>
                  <div className="text-left">
                    <span className="text-xs font-bold block leading-none">{aqiInfo.category}</span>
                    <span className="text-2xs opacity-80">{currentCity.dominantPollutant || 'PM2.5'}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 space-y-0.5">
                  <div className="flex items-center gap-1 font-semibold text-slate-700">
                    <Thermometer className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentCity.temperature}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentCity.humidity} Humidity</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Voice Morning Atmospheric Bulletin Player */}
          <AudioBriefingPlayer city={currentCity} />

          {/* Section 1: Golden Outdoor Window & Hour-by-Hour Activity Planner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Footprints className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {t('citizen.outdoorWindows', 'Outdoor Activity & Exercise Windows')}
                  </h2>
                </div>
                <p className="text-sm text-slate-500">
                  {currentLang === 'hi'
                    ? 'टहलने, दौड़ने और बच्चों के खेलकूद के लिए वह समय चुनें जब जमीनी स्तर पर प्रदूषण के कण न्यूनतम हों।'
                    : "Plan walks, jogging sessions, and children's outdoor playtime when ground-level particulates are lowest."}
                </p>
              </div>

              {/* Golden Hour Spotlight Badge */}
              <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  ✨
                </div>
                <div>
                  <span className="text-2xs font-extrabold text-emerald-800 uppercase tracking-wider block">
                    {t('citizen.goldenWindow', 'Golden Window Today')}
                  </span>
                  <div className="text-xs font-bold text-slate-900">
                    {goldenHour.hour} ({goldenHour.period}) • AQI ~{goldenHour.aqi}
                  </div>
                </div>
              </div>
            </div>

            {/* Hour by Hour Time Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
              {hourlyActivityWindows.map((slot) => {
                const isGolden = slot.hour === goldenHour.hour;
                return (
                  <div
                    key={slot.hour}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isGolden
                        ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-extrabold text-slate-900">{slot.hour}</span>
                        {isGolden && (
                          <span className="px-1.5 py-0.5 rounded text-3xs font-extrabold bg-emerald-600 text-white">
                            BEST
                          </span>
                        )}
                      </div>
                      <div className="text-2xs text-slate-500 mb-2 truncate">{slot.period}</div>

                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="text-lg font-black text-slate-900">{slot.aqi}</span>
                        <span
                          className="px-1.5 py-0.5 rounded text-2xs font-bold"
                          style={{ backgroundColor: slot.level.bgColor, color: slot.level.textColor }}
                        >
                          {slot.level.category}
                        </span>
                      </div>
                    </div>

                    <div className={`mt-2 p-1.5 rounded-lg text-2xs font-bold border leading-tight ${slot.verdictColor}`}>
                      {slot.activityVerdict}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: School & Office Commute Route Exposure Calculator */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Bike className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {t('citizen.commuteTitle', 'Daily Commute & School Exposure Calculator')}
                </h2>
              </div>
              <p className="text-sm text-slate-500">
                {currentLang === 'hi'
                  ? `${currentCity.name} में यात्रा के समय और वाहन के प्रकार के आधार पर सांस द्वारा अंदर जाने वाले प्रदूषण कणों का सटीक अनुमान लगाएं।`
                  : `Estimate how much particulate pollution you and your children inhale based on travel duration and transit mode in ${currentCity.name}.`}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Controls Column */}
              <div className="lg:col-span-7 space-y-5">
                {/* Mode Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    {t('citizen.transitMode', '1. Select Transit Mode')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'walk', label: 'Walking', icon: Footprints, desc: 'High breathing rate' },
                      { id: 'bike', label: 'Bike / Scooter', icon: Bike, desc: 'Direct tailpipe exhaust' },
                      { id: 'bus', label: 'Non-AC Bus / Auto', icon: Car, desc: 'Open window cabin' },
                      { id: 'metro', label: 'Metro / AC Car', icon: Shield, desc: 'Filtered recirculated air' }
                    ].map((mode) => {
                      const Icon = mode.icon;
                      const isSelected = transitMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setTransitMode(mode.id)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900 shadow-2xs'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <div className="text-xs font-bold">{mode.label}</div>
                          <div className="text-3xs text-slate-400 mt-0.5">{mode.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t('citizen.transitDuration', '2. One-Way Travel Duration')}
                    </label>
                    <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                      {commuteMinutes} {currentLang === 'hi' ? 'मिनट' : 'Minutes'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={90}
                    step={15}
                    value={commuteMinutes}
                    onChange={(e) => setCommuteMinutes(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-2xs font-semibold text-slate-400 mt-1">
                    <span>15 min</span>
                    <span>30 min</span>
                    <span>45 min</span>
                    <span>60 min</span>
                    <span>90 min</span>
                  </div>
                </div>

                {/* Route Type */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    {t('citizen.routeEnv', '3. Route Environment')}
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'arterial', label: 'Heavy Highway / Arterial', factor: '1.3x High Fumes' },
                      { id: 'commercial', label: 'Commercial City Center', factor: '1.1x Moderate Traffic' },
                      { id: 'green', label: 'Residential / Green Corridor', factor: '0.75x Lower Dust' }
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRouteType(r.id)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                          routeType === r.id
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-bold">{r.label}</div>
                        <div className="text-2xs opacity-70">{r.factor}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Output Analysis Column */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white space-y-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-extrabold text-emerald-400 uppercase tracking-wider">
                    {t('citizen.inhalationScore', 'Calculated Inhalation Score')}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-2xs font-extrabold border ${commuteAnalysis.riskColor}`}>
                    {commuteAnalysis.riskGrade}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                    <div className="text-2xs text-slate-300 font-semibold mb-1">Inhaled PM2.5 Micrograms</div>
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      {commuteAnalysis.inhaledMicrograms} <span className="text-xs font-normal text-slate-400">µg</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                    <div className="text-2xs text-slate-300 font-semibold mb-1">Cigarette Equivalent</div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-300">
                      ~{commuteAnalysis.cigaretteEquivalent} <span className="text-xs font-normal text-slate-400">cigs</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200 leading-relaxed">
                  <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Commuter Action Advisory</span>
                  </div>
                  {commuteAnalysis.advice}
                </div>

                <Link
                  to="/clean-commute"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5 text-slate-900" />
                  <span>{currentLang === 'hi' ? 'पूर्ण 2D स्वच्छ मार्ग नेविगेटर खोलें ➔' : 'Open Full 2D Clean Route Navigator ➔'}</span>
                </Link>

                <div className="text-3xs text-slate-400 flex items-center gap-1.5 pt-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Calculated using CPCB vehicular exposure coefficients and standard minute respiratory volumes.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Family Vulnerability Profiles */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {t('citizen.familyProfiles', 'Household Member Vulnerability Profiles')}
                  </h2>
                </div>
                <p className="text-sm text-slate-500">
                  {currentLang === 'hi'
                    ? 'उम्र, पूर्व स्वास्थ्य स्थितियों और संवेदनशीलता के आधार पर व्यक्तिगत स्वास्थ्य सावधानियां।'
                    : 'Customized health cautions and safety restrictions based on age, pre-existing conditions, and sensitivity.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setNewMemberModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{t('citizen.addMember', 'Add Family Member')}</span>
              </button>
            </div>

            {/* Members Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl p-1 bg-slate-50 rounded-xl border border-slate-100">{member.avatar}</span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">{member.name}</h4>
                          <span className="text-xs text-slate-500">{member.relation}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                        title="Remove member"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-semibold">Sensitivity Risk:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-2xs ${
                          member.riskLevel === 'Very High'
                            ? 'bg-rose-100 text-rose-800'
                            : member.riskLevel === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {member.riskLevel}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 text-2xs font-semibold text-slate-600 border border-slate-100">
                      Condition: {member.condition}
                    </div>

                    <div className="text-xs text-slate-700 leading-relaxed font-medium">
                      {member.guideline}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-400">
                    <span>Active in safety plan</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Home & Indoor Defense System (Purifiers & Mask Advisor) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Air Purifier Guide */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{t('citizen.purifierSetting', 'Air Purifier Setting')}</h3>
                  <span className="text-xs text-slate-500">HEPA CADR Control</span>
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border text-xs font-bold leading-normal ${homeProtection.purifierColor}`}>
                {homeProtection.purifierMode}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Ensure True-HEPA H13 filters are checked. Run purifiers at least 45 minutes prior to sleep in occupied bedrooms.
              </p>
            </div>

            {/* Mask Recommendation */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{t('citizen.maskGuide', 'Outdoor Mask Guide')}</h3>
                  <span className="text-xs text-slate-500">Particulate Filtration</span>
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border text-xs font-bold leading-normal ${homeProtection.maskColor}`}>
                {homeProtection.maskType}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Cloth handkerchiefs do not filter sub-micron PM2.5. Use certified N95 masks with nose clips to guarantee a tight seal.
              </p>
            </div>

            {/* Window Ventilation */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <CloudSun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{t('citizen.windowVent', 'Window Ventilation')}</h3>
                  <span className="text-xs text-slate-500">Safe Fresh Air Window</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 text-xs font-bold leading-normal">
                {homeProtection.ventilateWindow}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {homeProtection.windowAdvice}
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Modal: Add Family Member */}
      {newMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                <span>Add Family Profile</span>
              </h3>
              <button
                type="button"
                onClick={() => setNewMemberModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Rohan, Grandma Sunita"
                  value={newMemberForm.name}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Relation / Role</label>
                  <select
                    value={newMemberForm.relation}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, relation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-emerald-500"
                  >
                    <option value="Toddler (0-4 yrs)">Toddler (0-4 yrs)</option>
                    <option value="Child (5-17 yrs)">Child (5-17 yrs)</option>
                    <option value="Adult / Parent">Adult / Parent</option>
                    <option value="Senior Citizen (65+ yrs)">Senior Citizen (65+ yrs)</option>
                    <option value="Expectant Mother">Expectant Mother</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Sensitivity Level</label>
                  <select
                    value={newMemberForm.riskLevel}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, riskLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-emerald-500"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Very High">Very High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Health Condition / Details</label>
                <input
                  type="text"
                  placeholder="e.g., Dust allergy, Asthma, Healthy Runner"
                  value={newMemberForm.condition}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, condition: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Daily Safety Guideline</label>
                <textarea
                  rows={2}
                  placeholder="e.g., Avoid evening sports, wear mask during bus transit"
                  value={newMemberForm.guideline}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, guideline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewMemberModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  Save Member Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />

      {/* Floating AI Assistant */}
      <AiAssistantWidget currentCity={currentCity} />
    </div>
  );
}
