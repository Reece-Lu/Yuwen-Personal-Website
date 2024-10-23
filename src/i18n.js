import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../src/config/locales/en.json';
import zh from '../src/config/locales/zh.json';

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        zh: { translation: zh },
    },
    lng: 'en', // default language
    fallbackLng: 'en', // if translation not available, fallback to this
    interpolation: { escapeValue: false }, // react already safes from xss
});

export default i18n;
