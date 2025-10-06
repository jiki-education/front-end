import { createInstance } from "i18next";

const DEFAULT_LANGUAGE = "en";
const DEBUG = false;

import enLangPack from "./locales/en/translation.json";
import systemLangPack from "./locales/system/translation.json";

const pythonI18n = createInstance();

void pythonI18n.init({
  debug: DEBUG,
  lng: DEFAULT_LANGUAGE,
  initImmediate: false,
});

pythonI18n.addResourceBundle("system", "translation", systemLangPack);
pythonI18n.addResourceBundle("en", "translation", enLangPack);

export function getLanguage(): string {
  return pythonI18n.language;
}

export async function changeLanguage(language: string): Promise<void> {
  if (pythonI18n.language === language) {
    return;
  }

  await pythonI18n.changeLanguage(language);
}

export function translate(key: string, options = {}): string {
  return pythonI18n.t(key, { ...options, interpolation: { escapeValue: false } }).toString();
}
