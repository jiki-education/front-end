import { createInstance } from "i18next";

const DEFAULT_LANGUAGE = "en";
const DEBUG = false;

import enLangPack from "./locales/en/translation.json";
import systemLangPack from "./locales/system/translation.json";

const jikiscriptI18n = createInstance();

void jikiscriptI18n.init({
  debug: DEBUG,
  lng: DEFAULT_LANGUAGE,
  initImmediate: false,
});

jikiscriptI18n.addResourceBundle("system", "translation", systemLangPack);
jikiscriptI18n.addResourceBundle("en", "translation", enLangPack);

export function getLanguage(): string {
  return jikiscriptI18n.language;
}

export async function changeLanguage(language: string): Promise<void> {
  if (jikiscriptI18n.language === language) {
    return;
  }

  await jikiscriptI18n.changeLanguage(language);
}

export function translate(key: string, options = {}): string {
  return jikiscriptI18n.t(key, { ...options, interpolation: { escapeValue: false } }).toString();
}
