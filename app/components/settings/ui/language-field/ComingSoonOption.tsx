import { useTranslations } from "next-intl";
import type { Language } from "@/lib/i18n/languages";
import LanguageLabel from "./LanguageLabel";
import styles from "./LanguageField.module.css";

interface ComingSoonOptionProps {
  language: Language;
  englishNames: Intl.DisplayNames;
}

/**
 * A language Jiki is being translated into but does not serve yet.
 *
 * Not a disabled button: there is nowhere to go yet, and a control that never
 * becomes enabled is just noise in the tab order.
 */
export default function ComingSoonOption({ language, englishNames }: ComingSoonOptionProps) {
  const t = useTranslations("settings.language");

  return (
    <span className={`${styles.item} ${styles.itemDisabled}`}>
      <LanguageLabel language={language} englishNames={englishNames} />
      <span className={`${styles.trailing} ${styles.badge}`}>{t("comingSoonBadge")}</span>
    </span>
  );
}
