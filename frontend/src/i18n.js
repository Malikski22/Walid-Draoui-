import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import arTranslation from './locales/ar';
import frTranslation from './locales/fr';
import enTranslation from './locales/en';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        translation: arTranslation
      },
      fr: {
        translation: frTranslation
      },
      en: {
        translation: enTranslation
      }
    },
    lng: localStorage.getItem('language') || 'ar', // Get language from localStorage or default to Arabic
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

// Function to change language
export const changeLanguage = (lng) => {
  localStorage.setItem('language', lng);
  i18n.changeLanguage(lng);
  // Update document direction for RTL/LTR
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  
  // Update some style adjustments for RTL/LTR
  if (lng === 'ar') {
    document.body.classList.add('rtl');
    document.body.classList.remove('ltr');
  } else {
    document.body.classList.add('ltr');
    document.body.classList.remove('rtl');
  }
};

// Initialize document direction based on current language
document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
if (i18n.language === 'ar') {
  document.body.classList.add('rtl');
  document.body.classList.remove('ltr');
} else {
  document.body.classList.add('ltr');
  document.body.classList.remove('rtl');
}

export default i18n;
