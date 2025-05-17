import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import arTranslation from './locales/ar';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        translation: arTranslation
      }
    },
    lng: 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
