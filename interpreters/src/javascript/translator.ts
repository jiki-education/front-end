import { createInstance } from "i18next";

const DEFAULT_LANGUAGE = "en";
const DEBUG = false;

import enLangPack from "./locales/en/translation.json";
import systemLangPack from "./locales/system/translation.json";

const javascriptI18n = createInstance();

void javascriptI18n.init({
  debug: DEBUG,
  lng: DEFAULT_LANGUAGE,
  initImmediate: false,
});

javascriptI18n.addResourceBundle("system", "translation", systemLangPack);
javascriptI18n.addResourceBundle("en", "translation", enLangPack);

export function getLanguage(): string {
  return javascriptI18n.language;
}

export async function changeLanguage(language: string): Promise<void> {
  if (javascriptI18n.language === language) {
    return;
  }

  await javascriptI18n.changeLanguage(language);
}

export function translate(key: string, options = {}): string {
  return javascriptI18n.t(key, { ...options, interpolation: { escapeValue: false } }).toString();
}
