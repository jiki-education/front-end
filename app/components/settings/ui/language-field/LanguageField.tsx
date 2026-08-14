"use client";

import { useTranslations } from "next-intl";
import { getLanguageNames } from "@/lib/i18n/languages";
import Flag from "./Flag";
import LanguagePicker from "./LanguagePicker";
import { useLanguageField } from "./useLanguageField";
import fieldStyles from "../EditableField.module.css";
import styles from "./LanguageField.module.css";

interface LanguageFieldProps {
  /** The account's current locale (settings.locale). */
  value: string;
  onSave: (locale: string) => Promise<void>;
}

/**
 * The account's display language, in the shape of the other settings fields:
 * a labelled row whose button discloses the picker in place.
 *
 * A deliberate sibling of the header's LanguageSwitcher rather than a reuse of
 * it, because the two do different things with a click. The header switcher
 * *navigates* — an anonymous visitor's language is a property of the URL, so it
 * links to the same page under another prefix and reloads. Here the language is
 * a property of the account: picking one PATCHes the setting and reloads, with
 * no URL change. Sharing one component would mean a prop that switches its
 * central behaviour, and the two would drift into each other's edge cases.
 */
export default function LanguageField({ value, onSave }: LanguageFieldProps) {
  const t = useTranslations("settings.language");
  const tField = useTranslations("settings.editableField");
  const field = useLanguageField({ value, onSave });

  return (
    <div className={styles.field}>
      <div className={fieldStyles.header}>
        <div className={fieldStyles.labelGroup}>
          <span className={fieldStyles.label}>{t("label")}</span>
          {/* The collapsed row keeps showing the current language while the
              picker is open, so the value never disappears mid-decision. */}
          <div className={`${fieldStyles.value} ${styles.currentValue}`}>
            <Flag language={field.current} />
            <span lang={field.current.code}>{getLanguageNames(field.current, field.englishNames).native}</span>
          </div>
        </div>
        {/* The same control opens and closes the picker. An expanded disclosure
            has nothing pending to discard, so a paired Cancel would name a
            rollback that does not exist — this field commits on click. */}
        <button
          ref={field.toggleRef}
          type="button"
          onClick={field.toggle}
          disabled={field.saving != null}
          aria-expanded={field.isEditing}
          aria-controls={field.panelId}
          className="ui-btn ui-btn-tertiary ui-btn-small"
        >
          {field.isEditing ? t("done") : tField("edit")}
        </button>
      </div>

      {field.isEditing && (
        <LanguagePicker
          id={field.panelId}
          live={field.live}
          comingSoon={field.comingSoon}
          hasMatches={field.hasMatches}
          active={field.active}
          englishNames={field.englishNames}
          query={field.query}
          saving={field.saving}
          onQueryChange={field.setQuery}
          onSelect={field.select}
          onDismiss={field.closeAndRefocus}
        />
      )}

      {field.error && <div className={fieldStyles.errorMessage}>{field.error}</div>}
    </div>
  );
}
