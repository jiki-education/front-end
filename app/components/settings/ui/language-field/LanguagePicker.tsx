import { useTranslations } from "next-intl";
import type { Language } from "@/lib/i18n/languages";
import LanguageSearch from "./LanguageSearch";
import LanguageOption from "./LanguageOption";
import ComingSoonOption from "./ComingSoonOption";
import TranslationFootnote from "./TranslationFootnote";
import styles from "./LanguageField.module.css";

interface LanguagePickerProps {
  id: string;
  live: Language[];
  comingSoon: Language[];
  hasMatches: boolean;
  active: string;
  englishNames: Intl.DisplayNames;
  query: string;
  saving: string | null;
  onQueryChange: (query: string) => void;
  onSelect: (code: string) => void;
  onDismiss: () => void;
}

/**
 * The disclosed panel: search, the two language groups, and the footnote.
 *
 * Inline rather than the header's floating dropdown — settings is a column of
 * stacked fields with room to expand, so a popover would only add a layer to
 * dismiss.
 */
export default function LanguagePicker({
  id,
  live,
  comingSoon,
  hasMatches,
  active,
  englishNames,
  query,
  saving,
  onQueryChange,
  onSelect,
  onDismiss
}: LanguagePickerProps) {
  const t = useTranslations("settings.language");

  return (
    <div
      id={id}
      className={styles.picker}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          onDismiss();
        }
      }}
    >
      <LanguageSearch value={query} onChange={onQueryChange} />

      <div className={styles.scroll}>
        {live.length > 0 && (
          <ul className={styles.group}>
            {live.map((language) => (
              <li key={language.code}>
                <LanguageOption
                  language={language}
                  englishNames={englishNames}
                  isActive={language.code === active}
                  isSaving={saving === language.code}
                  disabled={saving != null}
                  onSelect={() => onSelect(language.code)}
                />
              </li>
            ))}
          </ul>
        )}

        {comingSoon.length > 0 && (
          <>
            <p className={styles.groupHeading}>{t("comingSoon")}</p>
            <ul className={styles.group}>
              {comingSoon.map((language) => (
                <li key={language.code}>
                  <ComingSoonOption language={language} englishNames={englishNames} />
                </li>
              ))}
            </ul>
          </>
        )}

        {!hasMatches && (
          <p className={styles.empty}>
            {t("noMatches", { query })}
            <span className={styles.emptyHint}>{t("noMatchesHint")}</span>
          </p>
        )}
      </div>

      <TranslationFootnote />
    </div>
  );
}
