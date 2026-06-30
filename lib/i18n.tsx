'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Lang = 'en' | 'hi';

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'drishti_lang';

// ============================================================================
// DICTIONARY — English + Hindi (Devanagari)
// ============================================================================

const DICT: Record<string, { en: string; hi: string }> = {
  // Nav / chrome
  'nav.home': { en: 'Home', hi: 'होम' },
  'nav.services': { en: 'Services', hi: 'सेवाएँ' },
  'nav.match': { en: 'Match', hi: 'गुण मिलान' },
  'nav.whyDrishti': { en: 'Why DRISHTI', hi: 'क्यों दृष्टि' },
  'nav.login': { en: 'Login', hi: 'लॉगिन' },
  'nav.logout': { en: 'Logout', hi: 'लॉगआउट' },

  // Common
  'common.fullName': { en: 'Full Name', hi: 'पूरा नाम' },
  'common.birthDate': { en: 'Date of Birth', hi: 'जन्म तिथि' },
  'common.birthTime': { en: 'Time of Birth', hi: 'जन्म समय' },
  'common.birthPlace': { en: 'Place of Birth', hi: 'जन्म स्थान' },
  'common.gender': { en: 'Gender', hi: 'लिंग' },
  'common.male': { en: 'Male', hi: 'पुरुष' },
  'common.female': { en: 'Female', hi: 'महिला' },
  'common.sampleData': { en: 'Use sample data', hi: 'नमूना डेटा उपयोग करें' },
  'common.generate': { en: 'Generate', hi: 'बनाएँ' },
  'common.calculate': { en: 'Calculate', hi: 'गणना करें' },
  'common.loading': { en: 'Loading…', hi: 'लोड हो रहा है…' },
  'common.download': { en: 'Download / Print Report', hi: 'रिपोर्ट डाउनलोड / प्रिंट करें' },
  'common.shareWA': { en: 'Share on WhatsApp', hi: 'व्हाट्सएप पर साझा करें' },
  'common.changeDetails': { en: 'Change details', hi: 'विवरण बदलें' },
  'common.usingProfile': { en: 'Using profile', hi: 'प्रोफ़ाइल उपयोग में' },
  'common.saveContinue': { en: 'Save & Continue', hi: 'सहेजें और आगे बढ़ें' },

  // Home
  'home.tagline': { en: 'Astrology meets Numerology', hi: 'ज्योतिष और अंक विज्ञान का संगम' },
  'home.heroA': { en: 'Two ancient sciences.', hi: 'दो प्राचीन विज्ञान।' },
  'home.heroB': { en: 'One unified vision.', hi: 'एक एकीकृत दृष्टि।' },
  'home.sub': {
    en: 'Get your complete Vedic reading — birth chart, Mulank, Bhagyank, Lo Shu Grid, Kua direction, and personal year cycle — in 30 seconds.',
    hi: 'अपना संपूर्ण वैदिक विश्लेषण पाएँ — जन्म कुंडली, मूलांक, भाग्यांक, लो शू ग्रिड, कुआ दिशा, और व्यक्तिगत वर्ष चक्र — 30 सेकंड में।',
  },
  'home.allServices': { en: 'All Services (14+)', hi: 'सभी सेवाएँ (14+)' },
  'home.birthDetails': { en: 'Birth Details', hi: 'जन्म विवरण' },

  // Tabs
  'tab.astrology': { en: 'Astrology', hi: 'ज्योतिष' },
  'tab.numerology': { en: 'Numerology', hi: 'अंक विज्ञान' },
  'tab.loshu': { en: 'Lo Shu Grid', hi: 'लो शू ग्रिड' },
  'tab.reading': { en: 'DRISHTI Reading', hi: 'दृष्टि विश्लेषण' },

  // Login
  'login.title': { en: 'Client Login', hi: 'क्लाइंट लॉगिन' },
  'login.sub': { en: 'Enter your registered email to receive a secure login link', hi: 'सुरक्षित लॉगिन लिंक पाने के लिए अपना पंजीकृत ईमेल दर्ज करें' },
  'login.email': { en: 'Registered Email', hi: 'पंजीकृत ईमेल' },
  'login.sendLink': { en: 'Send Login Link', hi: 'लॉगिन लिंक भेजें' },
  'login.checkEmail': { en: 'Check your email for the login link!', hi: 'लॉगिन लिंक के लिए अपना ईमेल देखें!' },
  'login.welcome': { en: 'Welcome back', hi: 'पुनः स्वागत है' },

  // OM
  'om.label': { en: 'OM Dhwani', hi: 'ॐ ध्वनि' },
  'om.on': { en: 'OM sound on', hi: 'ॐ ध्वनि चालू' },
  'om.off': { en: 'OM sound off', hi: 'ॐ ध्वनि बंद' },
};

function translate(key: string, lang: Lang): string {
  const entry = DICT[key];
  if (!entry) return key;
  return entry[lang] || entry.en;
}

// ============================================================================
// PROVIDER
// ============================================================================

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === 'en' || stored === 'hi') setLangState(stored);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  };

  const toggle = () => setLang(lang === 'en' ? 'hi' : 'en');

  const t = (key: string) => translate(key, lang);

  return (
    <I18nContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLang(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Safe fallback if used outside provider
    return {
      lang: 'en',
      setLang: () => {},
      toggle: () => {},
      t: (key: string) => translate(key, 'en'),
    };
  }
  return ctx;
}

// Helper for bilingual inline display: returns "English · हिन्दी" or single based on lang
export function bilingual(en: string, hi: string, lang: Lang): string {
  if (lang === 'hi') return hi;
  return en;
}
