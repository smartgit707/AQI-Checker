import { CITIES_DATA } from '../data/mockData';

/**
 * AeroSense AI Environmental Intelligence Engine
 * Provides context-aware answers to user queries regarding air quality, health advice,
 * masks/purifiers, pollutants (PM2.5, PM10, Ozone, NO2), city comparisons, and outdoor safety.
 */

export const AI_SUGGESTED_QUESTIONS = [
  {
    en: "What does an AQI of 280 mean for morning jogging?",
    hi: "सुबह की दौड़ के लिए 280 AQI का क्या मतलब है?"
  },
  {
    en: "Which mask should my family wear today: N95 or surgical?",
    hi: "मेरे परिवार को आज कौन सा मास्क पहनना चाहिए: N95 या सर्जिकल?"
  },
  {
    en: "How does PM2.5 affect children and seniors?",
    hi: "PM2.5 बच्चों और बुजुर्गों को कैसे प्रभावित करता है?"
  },
  {
    en: "Which Indian cities currently have the cleanest air?",
    hi: "वर्तमान में किन भारतीय शहरों की हवा सबसे स्वच्छ है?"
  },
  {
    en: "How do I configure my home air purifier right now?",
    hi: "मुझे अभी अपने घर के एयर प्यूरीफायर को कैसे सेट करना चाहिए?"
  }
];

/**
 * Knowledge Base & Heuristic Intelligence
 */
export function queryAiAssistant(question, context = {}) {
  const q = (question || '').toLowerCase().trim();
  const lang = context.lang || 'en';
  const currentCity = context.city || CITIES_DATA.find(c => c.id === 'delhi') || CITIES_DATA[0];
  const aqi = currentCity?.aqi ?? 150;
  const cityName = currentCity?.name || 'your city';

  // 1. Current City specific queries
  if (q.includes('current city') || q.includes('this city') || q.includes('how is air') || q.includes('aqi today') || q.includes('हावा कैसी है') || q.includes('आज का aqi')) {
    if (lang === 'hi') {
      return {
        text: `वर्तमान में **${cityName}** का AQI **${aqi}** है। प्रमुख प्रदूषक **${currentCity.dominantPollutant || 'PM2.5'}** है। वर्तमान तापमान **${currentCity.temperature || '26°C'}** है। ${aqi > 200 ? 'हवा अस्वास्थ्यकर है, बाहर निकलते समय N95 मास्क अवश्य पहनें।' : 'हवा संतोषजनक से मध्यम स्तर पर है।'}`
      };
    }
    return {
      text: `In **${cityName}**, the live Air Quality Index (NAQI) is currently **${aqi}** (${currentCity.status || 'Moderate'}). The primary pollutant driving this reading is **${currentCity.dominantPollutant || 'PM2.5'}** at ${currentCity.pollutants?.[0]?.value || 35} µg/m³. Ambient temperature is **${currentCity.temperature || '26°C'}** with **${currentCity.humidity || '60%'}** humidity.`
    };
  }

  // 2. Jogging / Running / Exercise
  if (q.includes('jog') || q.includes('run') || q.includes('walk') || q.includes('exercise') || q.includes('outdoor') || q.includes('दौड़') || q.includes('व्यायाम') || q.includes('टहलना')) {
    if (aqi > 250) {
      if (lang === 'hi') {
        return {
          text: `⚠️ **आउटडोर वर्कआउट की सलाह नहीं दी जाती है।**\n\nवर्तमान AQI ${aqi} पर फेफड़ों में सूक्ष्म कणों (PM2.5) का भारी इनहेलेशन होता है। कृपया सुबह की दौड़ या साइकलिंग को घर के अंदर ट्रेडमिल या योग तक सीमित रखें, और खिड़कियां बंद रखें।`
        };
      }
      return {
        text: `⚠️ **Outdoor running is NOT recommended today.**\n\nAt an AQI of **${aqi}**, hyperventilating outdoors causes severe deep-lung deposition of PM2.5 particulates. \n\n• **Recommendation:** Switch to indoor cardio, stretching, or gym workouts.\n• **Golden Window:** Wait until afternoon (1:00 PM – 4:00 PM) when thermal convection temporarily disperses ground-level smog.`
      };
    } else if (aqi > 100) {
      if (lang === 'hi') {
        return {
          text: `ℹ️ **हल्की सावधानी के साथ व्यायाम करें।**\n\nAQI ${aqi} मध्यम स्तर पर है। संवेदनशील व्यक्तियों, बच्चों या सांस के रोगियों को भारी कार्डियो कम करना चाहिए। दोपहर 12 बजे से शाम 4 बजे के बीच हवा सबसे साफ रहती है।`
        };
      }
      return {
        text: `ℹ️ **Moderate outdoor activity is acceptable with precautions.**\n\nAt an AQI of **${aqi}**, healthy adults can exercise outdoors with moderate intensity. Children, elderly individuals, and those with mild asthma should avoid heavy prolonged exertion during early morning hours.`
      };
    } else {
      if (lang === 'hi') {
        return {
          text: `✅ **बाहरी गतिविधियों के लिए शानदार समय!**\n\nAQI ${aqi} संतोषजनक श्रेणी में है। आप बिना किसी चिंता के पार्क में दौड़ सकते हैं या टहल सकते हैं।`
        };
      }
      return {
        text: `✅ **Great conditions for outdoor exercise!**\n\nWith an AQI of **${aqi}**, ambient air quality is satisfactory. Outdoor running, sports, and cycling are fully encouraged.`
      };
    }
  }

  // 3. Mask Guidance (N95 vs Surgical)
  if (q.includes('mask') || q.includes('n95') || q.includes('surgical') || q.includes('मास्क')) {
    if (lang === 'hi') {
      return {
        text: `😷 **मास्क चयन गाइड:**\n\n• **कपड़े या सर्जिकल मास्क:** धूल रोकते हैं लेकिन सूक्ष्म PM2.5 कणों (0.3 माइक्रोन) से सुरक्षा **नहीं** देते।\n• **N95 या N99 रेस्पिरेटर:** 95% से अधिक जहरीले सूक्ष्म कणों को फिल्टर करते हैं। AQI 150 से अधिक होने पर N95 का उपयोग अनिवार्य रूप से करें, विशेषकर दोपहिया वाहनों और पैदल आवागमन के दौरान।`
      };
    }
    return {
      text: `😷 **Respirator Mask Recommendation:**\n\n• **Surgical / Cloth Masks:** Ineffective against micro-aerosols. They only block coarse dust (>10µm) and do NOT filter dangerous PM2.5 combustion soot.\n• **Certified N95 / FFP2 / N99 Masks:** Highly recommended whenever AQI exceeds **150**. Ensure a snug nose-bridge seal without facial hair gaps to guarantee 95%+ particulate filtration efficiency.`
    };
  }

  // 4. Air Purifier Setup
  if (q.includes('purifier') || q.includes('filter') || q.includes('hepa') || q.includes('प्यूरीफायर')) {
    if (lang === 'hi') {
      return {
        text: `🌀 **एयर प्यूरीफायर संचालन सुझाव:**\n\n1. **मोड:** कमरे में प्रवेश करते समय पहले 30 मिनट तक **Turbo/High** पर चलाएं, फिर **Auto/Quiet** पर सेट करें।\n2. **स्थान:** प्यूरीफायर को दीवार से कम से कम 1-2 फीट दूर और फर्श से थोड़ा ऊपर रखें।\n3. **खिड़कियां:** चलाते समय कमरे के दरवाजे और खिड़कियां पूरी तरह बंद रखें ताकि बाहर की जहरीली हवा अंदर न आए।`
      };
    }
    return {
      text: `🌀 **Optimal Air Purifier Strategy:**\n\n1. **Sealing:** Keep all doors and windows sealed in the target room. A typical True HEPA unit achieves 80% PM2.5 reduction within 30 minutes in a sealed space.\n2. **Fan Speed:** Run at **Turbo/High mode** for the first 30–45 minutes, then transition to **Auto mode** or **Silent mode** for sleeping.\n3. **Placement:** Place the unit at least 1–2 feet away from walls and curtains to optimize intake airflow circulation.`
    };
  }

  // 5. PM2.5 vs PM10 explanation
  if (q.includes('pm2.5') || q.includes('pm10') || q.includes('particulate') || q.includes('प्रदूषक')) {
    if (lang === 'hi') {
      return {
        text: `🔬 **PM2.5 और PM10 में अंतर:**\n\n• **PM10 (मोटा धूल कण):** बाल की चौड़ाई का 1/5 भाग (10 माइक्रोन)। यह मुख्य रूप से नाक और गले में रुक जाता है।\n• **PM2.5 (सूक्ष्म कण):** बाल की चौड़ाई का 1/30 भाग (2.5 माइक्रोन)। यह सीधे फेफड़ों के सबसे गहरे हिस्से (एल्वियोली) और रक्तप्रवाह में प्रवेश कर दिल और मस्तिष्क को नुकसान पहुंचाता है।`
      };
    }
    return {
      text: `🔬 **Atmospheric Particulate Breakdown:**\n\n• **PM10 (Coarse Particulates ≤ 10µm):** Generated from road dust, construction, and mechanical friction. Typically filtered by the upper respiratory tract (nasal passage and throat).\n• **PM2.5 (Fine Particulates ≤ 2.5µm):** Generated by vehicular combustion, industrial smoke, and agricultural burning. Because of their microscopic diameter, PM2.5 penetrates deep into lung alveoli and crosses the bloodstream barrier, elevating cardiovascular risks.`
    };
  }

  // 6. Cleanest / Best Cities
  if (q.includes('clean') || q.includes('best') || q.includes('lowest') || q.includes('स्वच्छ') || q.includes('सबसे अच्छा')) {
    const sorted = [...CITIES_DATA].sort((a, b) => a.aqi - b.aqi);
    const cleanest = sorted.slice(0, 3);
    if (lang === 'hi') {
      return {
        text: `🌿 **वर्तमान में सबसे स्वच्छ हवा वाले शीर्ष शहर:**\n\n${cleanest.map((c, i) => `${i + 1}. **${c.name}** (${c.state}): AQI **${c.aqi}** (${c.status})`).join('\n')}\n\nतटीय और प्रायद्वीपीय हवाएं इन क्षेत्रों में प्राकृतिक फैलाव प्रदान करती हैं।`
      };
    }
    return {
      text: `🌿 **Cleanest Indian Cities Right Now:**\n\n${cleanest.map((c, i) => `${i + 1}. **${c.name}** (${c.state}) — AQI **${c.aqi}** (${c.status})`).join('\n')}\n\nCoastal maritime breezes and higher atmospheric boundary layers facilitate continuous particulate dispersion in these zones.`
    };
  }

  // 7. Most Polluted / Worst Cities
  if (q.includes('worst') || q.includes('polluted') || q.includes('highest') || q.includes('खराब')) {
    const sorted = [...CITIES_DATA].sort((a, b) => b.aqi - a.aqi);
    const worst = sorted.slice(0, 3);
    if (lang === 'hi') {
      return {
        text: `⚠️ **वर्तमान में सबसे अधिक प्रदूषित शहर:**\n\n${worst.map((c, i) => `${i + 1}. **${c.name}** (${c.state}): AQI **${c.aqi}** (${c.status})`).join('\n')}\n\nइन क्षेत्रों में थर्मल इनवर्जन और कम हवा की गति के कारण प्रदूषण जमीन के पास जमा हो रहा है।`
      };
    }
    return {
      text: `⚠️ **Most Elevated Pollution Hotspots Right Now:**\n\n${worst.map((c, i) => `${i + 1}. **${c.name}** (${c.state}) — AQI **${c.aqi}** (${c.status})`).join('\n')}\n\nThermal inversion layers and weak wind speeds are preventing vertical dispersion across these landlocked river basin zones.`
    };
  }

  // 8. General Health & Children / Vulnerable Groups
  if (q.includes('child') || q.includes('senior') || q.includes('asthma') || q.includes('बच्चे') || q.includes('बुजुर्ग')) {
    if (lang === 'hi') {
      return {
        text: `👶 **बच्चों और वरिष्ठ नागरिकों के लिए सुरक्षा निर्देश:**\n\n• बच्चे प्रति मिनट वयस्कों की तुलना में अधिक हवा सांस में लेते हैं, जिससे वे PM2.5 के प्रति अधिक संवेदनशील होते हैं।\n• जब AQI 150 से ऊपर हो, तो आउटडोर खेल का समय सीमित करें और स्कूल बस में मास्क पहनाएं।\n• अस्थमा रोगियों को हमेशा अपना इनहेलर पास रखना चाहिए और सुबह की ठंडी धुंध में टहलने से बचना चाहिए।`
      };
    }
    return {
      text: `👶 **High-Risk Protocol (Children, Asthmatics & Seniors):**\n\n• **Children:** Because children have developing respiratory tracts and breathe faster per kilogram of body weight, PM2.5 exposure is 30–50% more damaging. Limit playground activities when AQI > 150.\n• **Seniors & Asthmatics:** Strictly avoid morning fog/smog strolls. Cold temperatures compress the planetary boundary layer, trapping toxic combustion particles right at breathing level.`
    };
  }

  // Fallback intelligent response tailored to context
  if (lang === 'hi') {
    return {
      text: `नमस्ते! मैं आपका **AeroSense AI पर्यावरण सहायक** हूँ। वर्तमान में **${cityName}** में AQI **${aqi}** है। \n\nआप मुझसे निम्न विषयों पर पूछ सकते हैं:\n• क्या आज सुबह की दौड़ सुरक्षित है?\n• N95 और सर्जिकल मास्क में क्या अंतर है?\n• घर के एयर प्यूरीफायर को कैसे सेट करें?\n• PM2.5 और ओजोन स्वास्थ्य को कैसे प्रभावित करते हैं?`
    };
  }

  return {
    text: `Hello! I am your **AeroSense Environmental AI Assistant**. Right now in **${cityName}**, the AQI is **${aqi}** (${currentCity.status || 'Moderate'}).\n\nYou can ask me about:\n• **Exercise Safety:** Is it safe to jog or run outdoors today?\n• **Respirator Masks:** When should I wear an N95 vs a surgical mask?\n• **Home Filtration:** Best settings and placement for HEPA purifiers.\n• **Pollutant Science:** How PM2.5, NO₂, and Ozone impact your health.\n• **City Comparisons:** Which cities have the lowest or highest pollution levels?`
  };
}
