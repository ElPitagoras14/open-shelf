import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LANGUAGE, resources, SUPPORTED_LANGUAGES } from "./resources";

void i18n.use(initReactI18next).init({
  resources,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
  defaultNS: "translation",
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
