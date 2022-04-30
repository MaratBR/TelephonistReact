import i18n from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

const ruI18N = () => import('@locales/ru/translation.json');
const enI18N = () => import('@locales/en/translation.json');

interface TranslationObject extends Record<string, string | TranslationObject> {}

const languages = {
  'en-US': enI18N,
  'ru-RU': ruI18N,
  ru: ruI18N,
  en: enI18N,
};

export const languageNames = {
  'en-US': 'English',
  'ru-RU': 'Русский',
};

function loadTranslations(language: string, namespace: string) {
  if (namespace !== 'translation')
    throw new Error('Only the default namespace is supported at the moment');

  let promise: () => Promise<TranslationObject>;
  let actualLang: string = language;

  if (typeof languages[actualLang] === 'undefined') {
    promise = languages[actualLang];
  } else {
    if (/^\w+-\w+$/.test(language)) actualLang = language.split('-')[0].toLowerCase();
    else actualLang = language.toLowerCase();
    promise = languages[actualLang];
  }

  if (promise) {
    return promise();
  }
  throw new Error(`language ${actualLang} is not supported`);
}

export function initI18N() {
  i18n
    .use(initReactI18next)
    .use(
      resourcesToBackend((language, namespace, callback) => {
        loadTranslations(language, namespace)
          .then((response) => callback(null, response))
          .catch((error) => callback(error, null));
      })
    )
    .use(I18nextBrowserLanguageDetector)
    .init({
      debug: process.env.NODE_ENV === 'development',
      fallbackLng: 'en',
      pluralSeparator: '+',
      interpolation: {
        escapeValue: false,
      },
    });
}
