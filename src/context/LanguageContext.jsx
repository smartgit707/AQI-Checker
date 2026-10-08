import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      const saved = localStorage.getItem('aerosense_language');
      if (saved && TRANSLATIONS[saved]) return saved;
      // Check browser preferences
      const browserLang = navigator.language?.slice(0, 2);
      if (browserLang === 'hi') return 'hi';
      return 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aerosense_language', currentLang);
      document.documentElement.lang = currentLang;
    } catch {}
  }, [currentLang]);

  const setLanguage = useCallback((langCode) => {
    if (TRANSLATIONS[langCode]) {
      setCurrentLang(langCode);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setCurrentLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  }, []);

  /**
   * Translate key with optional fallback
   */
  const t = useCallback((key, fallback = '') => {
    if (!key) return fallback || '';
    try {
      const langDict = (TRANSLATIONS && TRANSLATIONS[currentLang]) || (TRANSLATIONS && TRANSLATIONS.en);
      if (langDict && langDict[key] !== undefined) {
        return langDict[key];
      }
      // Fallback to English
      if (TRANSLATIONS && TRANSLATIONS.en && TRANSLATIONS.en[key] !== undefined) {
        return TRANSLATIONS.en[key];
      }
    } catch {}
    return fallback !== '' ? fallback : String(key);
  }, [currentLang]);

  const value = {
    currentLang,
    isHindi: currentLang === 'hi',
    setLanguage,
    toggleLanguage,
    t,
    languages: SUPPORTED_LANGUAGES
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
