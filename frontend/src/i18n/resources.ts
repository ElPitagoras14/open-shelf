import en from "./locales/en.json";
import es from "./locales/es.json";

export const resources = { en: { translation: en }, es: { translation: es } } as const;
export const SUPPORTED_LANGUAGES = ["en", "es"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = "en";
