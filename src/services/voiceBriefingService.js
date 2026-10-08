/**
 * AeroSense AI Voice Air Quality Briefing Engine
 * Generates natural atmospheric scripts in English and Hindi,
 * and manages browser speech synthesis (Web Speech API) with zero dependencies.
 */

/**
 * Generate a spoken bulletin script for a given city and language.
 * @param {Object} city - City data object (name, state, aqi, dominantPollutant, temperature, humidity, etc.)
 * @param {string} lang - 'en' or 'hi'
 * @returns {string} Natural spoken audio script
 */
export function generateVoiceBriefingScript(city, lang = 'en') {
  if (!city) return '';

  const cityName = city.name || 'Your City';
  const aqi = city.aqi ?? 50;
  const dominant = city.dominantPollutant || 'PM 2.5';
  const temp = city.temperature || '26°C';
  const humidity = city.humidity || '55%';

  // Determine category and advisory
  let categoryEn = 'Good';
  let categoryHi = 'अच्छा';
  let adviceEn = 'Air quality is satisfactory and poses little or no health risk. Enjoy outdoor activities.';
  let adviceHi = 'हवा की गुणवत्ता संतोषजनक है और कोई स्वास्थ्य जोखिम नहीं है। बाहरी गतिविधियों का आनंद लें।';

  if (aqi > 400) {
    categoryEn = 'Severe';
    categoryHi = 'गंभीर';
    adviceEn = 'Air pollution is critical. Avoid outdoor exertion, keep windows tightly closed, and operate indoor HEPA purifiers.';
    adviceHi = 'वायु प्रदूषण अत्यंत गंभीर है। बाहर निकलने से बचें, खिड़कियां बंद रखें और घर के अंदर एयर प्यूरीफायर चलाएं।';
  } else if (aqi > 300) {
    categoryEn = 'Very Poor';
    categoryHi = 'बहुत खराब';
    adviceEn = 'Respiratory illness risk is elevated. Wear an N95 respirator if stepping outside and avoid intense physical exercise.';
    adviceHi = 'सांस संबंधी परेशानी का खतरा अधिक है। बाहर निकलते समय N95 मास्क पहनें और भारी व्यायाम से बचें।';
  } else if (aqi > 200) {
    categoryEn = 'Poor';
    categoryHi = 'खराब';
    adviceEn = 'Breathing discomfort is possible for children, seniors, and asthmatics. Limit prolonged outdoor exposure.';
    adviceHi = 'बच्चों, बुजुर्गों और अस्थमा रोगियों को सांस लेने में कठिनाई हो सकती है। ज्यादा देर बाहर रहने से बचें।';
  } else if (aqi > 100) {
    categoryEn = 'Moderate';
    categoryHi = 'मध्यम';
    adviceEn = 'Air quality is acceptable. Sensitive individuals should consider reducing intense outdoor exertion.';
    adviceHi = 'हवा मध्यम स्तर पर है। संवेदनशील लोगों को बाहर ज्यादा मेहनत वाले काम सीमित करने चाहिए।';
  } else if (aqi > 50) {
    categoryEn = 'Satisfactory';
    categoryHi = 'संतोषजनक';
    adviceEn = 'Air quality is acceptable. Enjoy the fresh conditions with mild caution for sensitive groups.';
    adviceHi = 'हवा की स्थिति सामान्य और संतोषजनक है।';
  }

  if (lang === 'hi') {
    return `नमस्ते! यह है एरोसेंस दैनिक वायु गुणवत्ता बुलेटिन। ${cityName} में वर्तमान एयर क्वालिटी इंडेक्स ${aqi} दर्ज किया गया है, जो कि ${categoryHi} श्रेणी में आता है। मुख्य प्रदूषक ${dominant} है। वर्तमान तापमान ${temp} और आर्द्रता ${humidity} है। स्वास्थ्य सलाह: ${adviceHi} सुरक्षित रहें और स्वच्छ हवा में सांस लें।`;
  }

  return `Hello, here is your AeroSense daily atmospheric briefing for ${cityName}. The current Air Quality Index is ${aqi}, rated as ${categoryEn}. The dominant pollutant in the atmosphere is ${dominant}. Current temperature stands at ${temp} with ${humidity} humidity. Health recommendation: ${adviceEn} Stay safe and breathe well.`;
}

/**
 * Get the best browser SpeechSynthesisVoice for a target language.
 * @param {string} lang - 'en' or 'hi'
 * @returns {SpeechSynthesisVoice|null}
 */
export function getPreferredVoice(lang = 'en') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  if (lang === 'hi') {
    // Prefer native Hindi voices (e.g. Google हिन्दी, Lekha, hi-IN)
    const hiVoice = voices.find(v => v.lang && (v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('hi-in')));
    if (hiVoice) return hiVoice;
  }

  // English preference: Indian English or natural English (Google, Samantha, Daniel)
  const enInVoice = voices.find(v => v.lang && (v.lang.toLowerCase() === 'en-in' || v.name.toLowerCase().includes('india')));
  if (enInVoice) return enInVoice;

  const enNaturalVoice = voices.find(v => 
    v.lang && v.lang.toLowerCase().startsWith('en') && 
    (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
  );
  if (enNaturalVoice) return enNaturalVoice;

  const anyEnVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en'));
  if (anyEnVoice) return anyEnVoice;

  return voices[0] || null;
}

/**
 * Synthesizes and plays the briefing audio.
 * @param {string} text - The script to read aloud
 * @param {string} lang - 'en' or 'hi'
 * @param {Object} handlers - { onStart, onEnd, onError, onBoundary, onPause, onResume }
 * @returns {SpeechSynthesisUtterance|null}
 */
export function playSpeechBulletin(text, lang = 'en', handlers = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (handlers.onError) handlers.onError(new Error('Speech Synthesis not supported by this browser.'));
    return null;
  }

  // Cancel any running speech before starting
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate = lang === 'hi' ? 0.95 : 1.0; // Slightly slower for clear Hindi pronunciation
  utterance.pitch = 1.0;

  const voice = getPreferredVoice(lang);
  if (voice) {
    utterance.voice = voice;
  }

  utterance.onstart = () => {
    if (handlers.onStart) handlers.onStart();
  };

  utterance.onend = () => {
    if (handlers.onEnd) handlers.onEnd();
  };

  utterance.onerror = (e) => {
    if (handlers.onError) handlers.onError(e);
  };

  utterance.onpause = () => {
    if (handlers.onPause) handlers.onPause();
  };

  utterance.onresume = () => {
    if (handlers.onResume) handlers.onResume();
  };

  if (handlers.onBoundary) {
    utterance.onboundary = (e) => handlers.onBoundary(e);
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

/**
 * Pause speech
 */
export function pauseSpeechBulletin() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.pause();
  }
}

/**
 * Resume speech
 */
export function resumeSpeechBulletin() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.resume();
  }
}

/**
 * Stop / Cancel speech
 */
export function stopSpeechBulletin() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
