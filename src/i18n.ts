import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";

const ruI18N = () => import(`~locales/ru/translation.json`);
const enI18N = () => import(`~locales/en/translation.json`);

const languages = {
  en: enI18N,
  ru: ruI18N,
};

async function loadTranslations(language: string, namespace: string) {
  if (namespace !== "translation")
    throw new Error("Only the default namespace is supported at the moment");
  if (/^\w+-\w+$/.test(language))
    language = language.split("-")[0].toLowerCase();
  else language = language.toLowerCase();
  const promise = languages[language];
  if (promise) {
    return await promise();
  }
  throw new Error("language " + language + " is not supported");
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
      debug: process.env.NODE_ENV === "development",
      fallbackLng: "en",
      pluralSeparator: "+",
      interpolation: {
        escapeValue: false,
      },
    });
}
