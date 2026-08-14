import { useTranslations } from "next-intl";
import type { Language } from "@/lib/i18n/languages";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CheckmarkIcon from "@/icons/checkmark.svg";
import LanguageLabel from "./LanguageLabel";
import styles from "./LanguageField.module.css";

interface LanguageOptionProps {
  language: Language;
  englishNames: Intl.DisplayNames;
  isActive: boolean;
  isSaving: boolean;
  disabled: boolean;
  onSelect: () => void;
}

/** A language the account can switch to. Commits on click. */
export default function LanguageOption({
  language,
  englishNames,
  isActive,
  isSaving,
  disabled,
  onSelect
}: LanguageOptionProps) {
  const t = useTranslations("settings.language");

  return (
    <button
      type="button"
      className={styles.item}
      aria-current={isActive ? "true" : undefined}
      disabled={disabled}
      onClick={onSelect}
    >
      <LanguageLabel language={language} englishNames={englishNames} />
      {/* The spinner is the only sign the click landed, and every row disables
          while it spins, so it has to announce itself rather than just spin. */}
      {isSaving && (
        <span className={styles.trailing} role="status" aria-label={t("saving")}>
          <LoadingSpinner size="sm" />
        </span>
      )}
      {/* The selected row is marked, not only tinted: the tint alone is what
          hover looks like elsewhere. */}
      {!isSaving && isActive && (
        <CheckmarkIcon
          className={`${styles.trailing} ${styles.check}`}
          width={18}
          height={18}
          aria-label={t("selected")}
        />
      )}
    </button>
  );
}
