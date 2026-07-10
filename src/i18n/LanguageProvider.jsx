import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import translations from './translations';

export const LanguageContext = createContext();
export const useT = () => useContext(LanguageContext).t;

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('jh_language') || 'en'; }
    catch { return 'en'; }
  });

  useEffect(() => {
    try { localStorage.setItem('jh_language', lang); } catch {}
  }, [lang]);

  const t = useCallback((key, fallback) => {
    const val = translations[lang]?.[key];
    if (val !== undefined && val !== null) return val;
    const fallbackVal = translations.en?.[key];
    if (fallbackVal !== undefined && fallbackVal !== null) return fallbackVal;
    return fallback ?? key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
