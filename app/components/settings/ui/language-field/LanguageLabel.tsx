import { getLanguageNames, type Language } from "@/lib/i18n/languages";
import Flag from "./Flag";
import styles from "./LanguageField.module.css";

interface LanguageLabelProps {
  language: Language;
  englishNames: Intl.DisplayNames;
}

/** The flag-and-two-names block every row shares, selectable or not. */
export default function LanguageLabel({ language, englishNames }: LanguageLabelProps) {
  const { native, english } = getLanguageNames(language, englishNames);

  return (
    <>
      <Flag language={language} />
      <span className={styles.names}>
        {/* The endonym leads, so a speaker finds their own language without
            reading English first, matching the header switcher's ordering. */}
        <span className={styles.primary} lang={language.code}>
          {native}
        </span>
        <span className={styles.secondary}>{english}</span>
      </span>
    </>
  );
}
