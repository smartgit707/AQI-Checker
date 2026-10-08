/**
 * AeroSense Multilingual Internationalization (i18n) Engine
 * Designed for full 23-language support (English + 22 Scheduled Indian Languages)
 * Includes exhaustive, production-grade translations for English and Hindi (हिन्दी).
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

export const TRANSLATIONS = {
  en: {
    // Navigation
    'nav.overview': 'Overview',
    'nav.analytics': 'Analytics',
    'nav.compare': 'Compare',
    'nav.rankings': 'Rankings',
    'nav.cleanCommute': 'Clean Route',
    'nav.stubbleTracker': 'Stubble Fires',
    'nav.methodology': 'Methodology',
    'nav.dashboards': 'Dashboards',
    'nav.workspaces': 'Workspaces',
    'nav.scientificDashboard': 'Scientific Dashboard',
    'nav.scientificSubtitle': 'Telemetry & station sensors',
    'nav.citizenDashboard': 'Citizen & Family',
    'nav.citizenSubtitle': '24h Golden Window & advisory',
    'nav.adminConsole': 'Admin Console',
    'nav.adminSubtitle': 'System operations & controls',
    'nav.favorites': 'Favorites',
    'nav.alerts': 'Threshold Alert Rules',
    'nav.notifications': 'Notifications Inbox',
    'nav.profile': 'Profile Overview',
    'nav.settings': 'Settings & Security',
    'nav.signIn': 'Sign In',
    'nav.getStarted': 'Get Started',
    'nav.signOut': 'Sign Out',
    'nav.signedInAs': 'Signed in as',

    // Hero Section
    'hero.badgeNetwork': 'CPCB & Sensor Network',
    'hero.badgeLive': 'Real-time Pan-India Ambient Air Monitoring',
    'hero.headlinePrefix': 'Understand the',
    'hero.headlineHighlight': 'air you breathe',
    'hero.headlineSuffix': 'with precision.',
    'hero.subtitle': 'Real-time air quality metrics, pollutant breakdown, atmospheric trends, and actionable health guidance for cities across India.',
    'hero.searchPlaceholder': 'Search city, district, or monitoring station (e.g. Delhi, Chennai, Bengaluru)...',
    'hero.myLocation': 'My Location',
    'hero.featureStandards': 'Calibrated NAQI Standards',
    'hero.featureTelemetry': 'Sub-Hour Telemetry Refresh',
    'hero.featureBreakdown': 'Multi-Pollutant Particulate Breakdown',
    'hero.liveAqi': 'Live Air Quality Index',
    'hero.naqiScore': 'NAQI Value',
    'hero.dominant': 'Dominant',
    'hero.trend24h': '24h Trend',
    'hero.healthAdvisory': 'Health Advisory Note',
    'hero.fullProfile': 'Full City Profile',
    'hero.sensorTelemetry': 'Sensor Telemetry',
    'hero.temperature': 'Temperature',
    'hero.humidity': 'Humidity',
    'hero.windSpeed': 'Wind Speed',

    // Section Headers
    'section.liveStationBadge': 'Ambient Monitoring Station Telemetry',
    'section.liveStationTitle': 'Real-Time Station Conditions',
    'section.cpcbStandard': 'India NAQI (CPCB 2026)',
    'section.standardLabel': 'Standard:',
    'section.updated': 'Updated',
    'section.realtimeScore': 'Real-time Air Score',
    'section.continuousFeed': 'Continuous Feed',
    'section.dominantPollutant': 'Dominant Pollutant',
    'section.variation24h': '24h Variation',
    'section.hourlyProgression': 'Hourly AQI Progression',
    'section.diurnalModel': '(diurnal model)',
    'section.todayTrajectory': "Today's Trajectory",
    'section.localAtmosphere': 'Local Atmospheric Conditions',
    'section.sensibleAmbient': 'Sensible ambient',
    'section.relativeMoisture': 'Relative moisture',
    'section.surfaceWind': 'Surface Wind',
    'section.dispersionVector': 'Dispersion vector',
    'section.visibility': 'Visibility',
    'section.opticalHorizon': 'Optical horizon',

    // Pollutant Breakdown
    'pollutants.badge': 'Chemical & Particulate Analysis',
    'pollutants.title': 'Critical Pollutant Matrix',
    'pollutants.subtitle': 'Real-time multi-pollutant concentrations measured against 24-hour CPCB National Ambient Air Quality Standards.',
    'pollutants.cpcbLimit': '24h National Safety Standard',
    'pollutants.nationalStandard': 'National Standard Limit',

    // Interactive Map
    'map.badge': 'Geospatial Sensor Mesh',
    'map.title': 'Pan-India Real-Time Air Quality Map',
    'map.subtitle': 'Live spatial interpolation of continuous ambient air quality monitoring stations across all Indian states and union territories.',
    'map.filterStations': 'Filter Stations:',
    'map.allMonitored': 'All Monitored',
    'map.critical': 'Critical (>150)',
    'map.cleanAir': 'Clean Air (≤50)',
    'map.liveModel': 'Live CAMS Model Interpolation',
    'map.demoTelemetry': 'Demonstration Telemetry',
    'map.scaleBar': 'CPCB National AQI Index Scale',

    // Visual City Explorer
    'explorer.badge': 'Urban Landscape Telemetry',
    'explorer.title': 'Explore India’s Cities',
    'explorer.subtitle': 'Real-time air indices contextualized with iconic architectural landscapes and regional microclimates.',
    'explorer.viewDetails': 'View Live Details',

    // Atmospheric Science & Environmental Story
    'story.badge': 'Atmospheric Science',
    'story.title': 'Why Air Quality Matters',
    'story.subtitle': 'Understanding the physical dynamics of the air column and how invisible aerosols alter physiological and planetary wellbeing.',

    // Health & Advisory Protocols
    'health.badge': 'Evidence-Based Protocols',
    'health.title': 'Personalized Health Actions',
    'health.subtitle': 'Medical and physiological precautions tailored to real-time ambient particulate concentrations.',
    'health.outdoorProtocol': 'Outdoor Exercise & Sports Protocol',
    'health.childrenProtocol': 'Children & Sensitive Groups Protection Protocol',
    'health.indoorProtocol': 'Indoor Air Quality & Filtration Engineering Protocol',

    // Weather Dispersion
    'weather.badge': 'Synoptic Climatology',
    'weather.title': 'Weather & Atmospheric Dispersion',
    'weather.subtitle': 'How thermal turbulence, planetary boundary layer dynamics, and relative humidity drive local pollution accumulation.',

    // Data Sources
    'sources.badge': 'Open Telemetry Pipeline',
    'sources.title': 'Data Sources & Measurement Architecture',
    'sources.subtitle': 'Calibrated ingestion streams integrating regulatory reference monitors, satellite radiometry, and continuous optical mesh sensors.',

    // NAQI Categories
    'aqi.good': 'Good',
    'aqi.satisfactory': 'Satisfactory',
    'aqi.moderate': 'Moderate',
    'aqi.poor': 'Poor',
    'aqi.verypoor': 'Very Poor',
    'aqi.unhealthy': 'Unhealthy',
    'aqi.severe': 'Severe',
    'aqi.hazardous': 'Hazardous',

    // Citizen & Family Advisory
    'citizen.title': 'Daily Protection Guide for Your Household',
    'citizen.subtitle': 'Practical, science-backed guidance translating complex atmospheric data into everyday decisions: school commutes, morning jogging windows, and home air purifier settings.',
    'citizen.goldenWindow': 'Golden Window Today',
    'citizen.outdoorWindows': 'Outdoor Activity & Exercise Windows',
    'citizen.commuteTitle': 'Daily Commute & School Exposure Calculator',
    'citizen.commuteSubtitle': 'Estimate how much particulate pollution you and your children inhale based on travel duration and transit mode.',
    'citizen.transitMode': '1. Select Transit Mode',
    'citizen.transitDuration': '2. One-Way Travel Duration',
    'citizen.routeEnv': '3. Route Environment',
    'citizen.inhalationScore': 'Calculated Inhalation Score',
    'citizen.inhaledPm25': 'Inhaled PM2.5 Micrograms',
    'citizen.cigEquivalent': 'Cigarette Equivalent',
    'citizen.familyProfiles': 'Household Member Vulnerability Profiles',
    'citizen.addMember': 'Add Family Member',
    'citizen.purifierSetting': 'Air Purifier Setting',
    'citizen.maskGuide': 'Outdoor Mask Guide',
    'citizen.windowVent': 'Window Ventilation',

    // Common Actions
    'common.search': 'Search',
    'common.clear': 'Clear',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.back': 'Back',
    'common.viewAll': 'View All',
    'common.printPlan': 'Print Family Safety Plan',
    'common.listenBulletin': 'Listen to Briefing',

    // Footer
    'footer.tagline': '"Understand the air you breathe." High-precision environmental intelligence, live atmospheric indices, and localized air health guidance for India.',
    'footer.status': 'All telemetry streams operating normally',
    'footer.airIntel': 'Air Intelligence',
    'footer.scientificStandards': 'Scientific Standards',
    'footer.userServices': 'User Services',
    'footer.compliance': 'Regulatory Compliance'
  },

  hi: {
    // Navigation
    'nav.overview': 'अवलोकन',
    'nav.analytics': 'विश्लेषिकी',
    'nav.compare': 'तुलना',
    'nav.rankings': 'रैंकिंग',
    'nav.cleanCommute': 'स्वच्छ मार्ग',
    'nav.stubbleTracker': 'पराली आग ट्रैकर',
    'nav.methodology': 'पद्धति',
    'nav.dashboards': 'डैशबोर्ड',
    'nav.workspaces': 'कार्यक्षेत्र',
    'nav.scientificDashboard': 'वैज्ञानिक डैशबोर्ड',
    'nav.scientificSubtitle': 'सेंसर व प्रदूषक टेलीमेट्री डेटा',
    'nav.citizenDashboard': 'नागरिक एवं परिवार',
    'nav.citizenSubtitle': '24-घंटे गोल्डन विंडो व स्वास्थ्य सुरक्षा',
    'nav.adminConsole': 'प्रशासनिक कंसोल',
    'nav.adminSubtitle': 'सिस्टम संचालन व नियंत्रण',
    'nav.favorites': 'पसंदीदा शहर',
    'nav.alerts': 'चेतावनी सीमा नियम',
    'nav.notifications': 'सूचनाएं',
    'nav.profile': 'प्रोफ़ाइल विवरण',
    'nav.settings': 'सेटिंग्स एवं सुरक्षा',
    'nav.signIn': 'साइन इन',
    'nav.getStarted': 'शुरू करें',
    'nav.signOut': 'साइन आउट',
    'nav.signedInAs': 'लॉग इन उपयोगकर्ता',

    // Hero Section
    'hero.badgeNetwork': 'सीपीसीबी एवं सेंसर नेटवर्क',
    'hero.badgeLive': 'अखिल भारतीय वास्तविक समय वायु गुणवत्ता निगरानी',
    'hero.headlinePrefix': 'अपनी सांस की',
    'hero.headlineHighlight': 'हवा को गहराई से',
    'hero.headlineSuffix': 'सटीकता के साथ समझें।',
    'hero.subtitle': 'पूरे भारत के शहरों के लिए वास्तविक समय वायु गुणवत्ता सूचकांक, सूक्ष्म प्रदूषक विवरण, मौसमी रुझान और व्यावहारिक स्वास्थ्य दिशा-निर्देश।',
    'hero.searchPlaceholder': 'शहर, जिला या निगरानी केंद्र खोजें (उदा. दिल्ली, चेन्नई, बेंगलुरु)...',
    'hero.myLocation': 'मेरा स्थान',
    'hero.featureStandards': 'कैलिब्रेटेड NAQI मानक',
    'hero.featureTelemetry': 'प्रति घंटे ताज़ा टेलीमेट्री',
    'hero.featureBreakdown': 'बहु-प्रदूषक सूक्ष्म कण विश्लेषण',
    'hero.liveAqi': 'लाइव वायु गुणवत्ता सूचकांक',
    'hero.naqiScore': 'NAQI स्कोर',
    'hero.dominant': 'मुख्य प्रदूषक',
    'hero.trend24h': '24 घंटे का बदलाव',
    'hero.healthAdvisory': 'स्वास्थ्य सुरक्षा सुझाव',
    'hero.fullProfile': 'शहर की पूरी रिपोर्ट',
    'hero.sensorTelemetry': 'सेंसर टेलीमेट्री',
    'hero.temperature': 'तापमान',
    'hero.humidity': 'आर्द्रता',
    'hero.windSpeed': 'हवा की गति',

    // Section Headers
    'section.liveStationBadge': 'वायु निगरानी स्टेशन टेलीमेट्री',
    'section.liveStationTitle': 'वास्तविक समय स्टेशन स्थितियां',
    'section.cpcbStandard': 'भारत NAQI (CPCB 2026 मानक)',
    'section.standardLabel': 'मानक:',
    'section.updated': 'अद्यतन',
    'section.realtimeScore': 'वास्तविक समय वायु गुणवत्ता स्कोर',
    'section.continuousFeed': 'निरंतर लाइव फीड',
    'section.dominantPollutant': 'प्रमुख प्रदूषक',
    'section.variation24h': '24 घंटे का परिवर्तन',
    'section.hourlyProgression': 'घंटे-दर-घंटे AQI पूर्वानुमान',
    'section.diurnalModel': '(दैनिक मौसमी मॉडल)',
    'section.todayTrajectory': 'आज का अनुमानित रुझान',
    'section.localAtmosphere': 'स्थानीय मौसम व वायुमंडलीय स्थितियां',
    'section.sensibleAmbient': 'परिवेश का तापमान',
    'section.relativeMoisture': 'सापेक्षिक नमी',
    'section.surfaceWind': 'सतही हवा',
    'section.dispersionVector': 'प्रदूषण फैलाव गति',
    'section.visibility': 'दृश्यता',
    'section.opticalHorizon': 'ऑप्टिकल क्षितिज',

    // Pollutant Breakdown
    'pollutants.badge': 'रासायनिक एवं सूक्ष्म कण विश्लेषण',
    'pollutants.title': 'प्रमुख वायु प्रदूषक मैट्रिक्स',
    'pollutants.subtitle': '24 घंटे के CPCB राष्ट्रीय परिवेशी वायु गुणवत्ता मानकों के विरुद्ध मापी गई वास्तविक समय सांद्रता।',
    'pollutants.cpcbLimit': '24 घंटे का राष्ट्रीय सुरक्षा मानक',
    'pollutants.nationalStandard': 'राष्ट्रीय मानक सीमा',

    // Interactive Map
    'map.badge': 'भू-स्थानिक सेंसर जाल',
    'map.title': 'अखिल भारतीय लाइव वायु गुणवत्ता मानचित्र',
    'map.subtitle': 'सभी भारतीय राज्यों एवं केंद्र शासित प्रदेशों में निरंतर परिवेशी वायु निगरानी स्टेशनों का वास्तविक समय स्थानिक नक्शा।',
    'map.filterStations': 'स्टेशन फ़िल्टर करें:',
    'map.allMonitored': 'सभी मॉनिटर किए गए',
    'map.critical': 'गंभीर स्थिति (>150)',
    'map.cleanAir': 'स्वच्छ हवा (≤50)',
    'map.liveModel': 'लाइव CAMS मॉडल विश्लेषण',
    'map.demoTelemetry': 'प्रदर्शन टेलीमेट्री डेटा',
    'map.scaleBar': 'CPCB राष्ट्रीय AQI पैमाना',

    // Visual City Explorer
    'explorer.badge': 'शहरी परिवेश टेलीमेट्री',
    'explorer.title': 'भारत के प्रमुख शहरों की स्थिति देखें',
    'explorer.subtitle': 'प्रसिद्ध स्थापत्य और क्षेत्रीय सूक्ष्म जलवायु के संदर्भ में प्रस्तुत वास्तविक समय वायु सूचकांक।',
    'explorer.viewDetails': 'लाइव विवरण देखें',

    // Atmospheric Science & Environmental Story
    'story.badge': 'वायुमंडलीय विज्ञान',
    'story.title': 'हवा की गुणवत्ता क्यों महत्वपूर्ण है',
    'story.subtitle': 'वायु स्तंभ की भौतिक गतिशीलता को समझें और जानें कि कैसे अदृश्य एरोसोल हमारे फेफड़ों और पर्यावरण को प्रभावित करते हैं।',

    // Health & Advisory Protocols
    'health.badge': 'वैज्ञानिक स्वास्थ्य प्रोटोकॉल',
    'health.title': 'व्यक्तिगत स्वास्थ्य सुरक्षा दिशानिर्देश',
    'health.subtitle': 'वास्तविक समय के सूक्ष्म कणों के स्तर के अनुसार तैयार की गई चिकित्सकीय एवं शारीरिक सावधानियां।',
    'health.outdoorProtocol': 'आउटडोर व्यायाम एवं खेलकूद प्रोटोकॉल',
    'health.childrenProtocol': 'बच्चों और संवेदनशील समूहों के लिए सुरक्षा नियम',
    'health.indoorProtocol': 'घर के अंदर की वायु गुणवत्ता व प्यूरीफायर प्रोटोकॉल',

    // Weather Dispersion
    'weather.badge': 'मौसम एवं जलवायु विज्ञान',
    'weather.title': 'मौसम एवं वायुमंडलीय प्रदूषण फैलाव',
    'weather.subtitle': 'जानिए कैसे तापमान का उतार-चढ़ाव, हवा की गति और आर्द्रता प्रदूषण के जमाव या फैलाव को नियंत्रित करते हैं।',

    // Data Sources
    'sources.badge': 'ओपन टेलीमेट्री पाइपलाइन',
    'sources.title': 'डेटा स्रोत एवं मापन प्रणाली संरचना',
    'sources.subtitle': 'नियामक संदर्भ मॉनिटरों, उपग्रह रेडियोमेट्री और निरंतर ऑप्टिकल सेंसरों को एकीकृत करने वाले प्रमाणित डेटा स्रोत।',

    // NAQI Categories
    'aqi.good': 'अच्छा',
    'aqi.satisfactory': 'संतोषजनक',
    'aqi.moderate': 'मध्यम',
    'aqi.poor': 'खराब',
    'aqi.verypoor': 'बहुत खराब',
    'aqi.unhealthy': 'अस्वास्थ्यकर',
    'aqi.severe': 'गंभीर',
    'aqi.hazardous': 'खतरनाक',

    // Citizen & Family Advisory
    'citizen.title': 'आपके परिवार के लिए दैनिक सुरक्षा निर्देशिका',
    'citizen.subtitle': 'जटिल वायुमंडलीय डेटा को व्यावहारिक निर्णयों में बदलने वाले विज्ञान-आधारित सुझाव: स्कूल आवागमन, सुबह की सैर का समय और प्यूरीफायर सेटिंग्स।',
    'citizen.goldenWindow': 'आज की गोल्डन विंडो (सुरक्षित समय)',
    'citizen.outdoorWindows': 'आउटडोर गतिविधि एवं व्यायाम समय',
    'citizen.commuteTitle': 'दैनिक स्कूल एवं ऑफिस यात्रा प्रदूषण कैलकुलेटर',
    'citizen.commuteSubtitle': 'यात्रा के समय और वाहन के प्रकार के आधार पर सांस द्वारा अंदर जाने वाले प्रदूषण कणों का सटीक अनुमान लगाएं।',
    'citizen.transitMode': '1. यात्रा साधन चुनें',
    'citizen.transitDuration': '2. एकतरफा यात्रा समय',
    'citizen.routeEnv': '3. मार्ग वातावरण',
    'citizen.inhalationScore': 'अनुमानित प्रदूषण अवशोषण स्कोर',
    'citizen.inhaledPm25': 'सांस द्वारा ग्रहण PM2.5 (माइक्रोग्राम)',
    'citizen.cigEquivalent': 'सिगरेट के बराबर प्रभाव',
    'citizen.familyProfiles': 'परिवार के सदस्यों की संवेदनशीलता प्रोफाइल',
    'citizen.addMember': 'सदस्य जोड़ें',
    'citizen.purifierSetting': 'एयर प्यूरीफायर सेटिंग',
    'citizen.maskGuide': 'आउटडोर मास्क निर्देश',
    'citizen.windowVent': 'खिड़की खोलने का सुरक्षित समय',

    // Common Actions
    'common.search': 'खोजें',
    'common.clear': 'हटाएं',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.close': 'बंद करें',
    'common.loading': 'लोड हो रहा है...',
    'common.back': 'वापस जाएं',
    'common.viewAll': 'सभी देखें',
    'common.printPlan': 'पारिवारिक सुरक्षा योजना प्रिंट करें',
    'common.listenBulletin': 'दैनिक बुलेटिन सुनें',

    // Footer
    'footer.tagline': '"अपनी सांस की हवा को गहराई से समझें।" भारत के शहरों के लिए उच्च-सटीक पर्यावरणीय बुद्धिमत्ता, लाइव वायु सूचकांक और स्थानीय स्वास्थ्य सुरक्षा मार्गदर्शन।',
    'footer.status': 'सभी टेलीमेट्री डेटा स्ट्रीम सामान्य रूप से सक्रिय हैं',
    'footer.airIntel': 'वायु गुणवत्ता सेवाएं',
    'footer.scientificStandards': 'वैज्ञानिक मानक',
    'footer.userServices': 'उपयोगकर्ता सेवाएं',
    'footer.compliance': 'नियामक अनुपालन'
  }
};
