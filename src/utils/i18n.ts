import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
// import { DateTime } from 'luxon';

import ar from "../assets/locals/ar/translation.json";
import en from "../assets/locals/en/translation.json";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
  }
}
const lang = localStorage.getItem("i18nextLng") || "en";
const fallbackLng = "en";

const resources = {
  en: {
    translations: en,
  },
  ar: {
    translations: ar,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    debug: false, // show localization data in console
    lng: lang,
    fallbackLng, // use en if detected lng is not available
    nsSeparator: ":",
    keySeparator: ".", // we do not use keys in form messages.welcome
    saveMissing: true,
    supportedLngs: ["ar", "en"],
    ns: ["translations"],
    defaultNS: "translations",
    interpolation: {
      escapeValue: false, // react already safes from xss
      // format: (value, format, lng) => {
      //   if (value instanceof Date) {
      //     return DateTime.fromJSDate(value).setLocale(lng).toLocaleString(DateTime[format]);
      //   }
      //   return value;
      // },
    },
    resources,
    react: {
      useSuspense: false,
    },
    returnNull: false,
  });

i18n.on("languageChanged", (lng) => {
  document.documentElement.setAttribute("lang", lng);
  document.documentElement.setAttribute("dir", i18n.dir());
});

document.documentElement.lang = i18n.language;
document.documentElement.dir = i18n.dir();

export default i18n;
