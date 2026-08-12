"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { getApiErrorType } from "@/lib/api/client";
import { useApiErrorMessage } from "@/lib/api/apiErrors";
import { getGroupedLanguages, getLanguageNames, type Language } from "@/lib/i18n/languages";
import { normalizeLocale } from "@/lib/i18n/config";
import { staticAsset } from "@/lib/static-asset";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import fieldStyles from "./EditableField.module.css";
import styles from "./LanguageField.module.css";

interface LanguageFieldProps {
  /** The account's current locale (settings.locale). */
  value: string;
  onSave: (locale: string) => Promise<void>;
}

/**
 * The account's display language, in the shape of the other settings fields:
 * a labelled row with an Edit button that opens the picker in place.
 *
 * A deliberate sibling of the header's LanguageSwitcher rather than a reuse of
 * it, because the two do different things with a click. The header switcher
 * *navigates* — an anonymous visitor's language is a property of the URL, so it
 * links to the same page under another prefix and reloads. Here the language is
 * a property of the account: picking one PATCHes the setting and lets
 * ClientLocaleProvider swap the catalog in place, with no navigation and no URL
 * change. Sharing one component would mean a prop that switches its central
 * behaviour, and the two would drift into each other's edge cases.
 */
export default function LanguageField({ value, onSave }: LanguageFieldProps) {
  const t = useTranslations("settings.language");
  const tField = useTranslations("settings.editableField");
  const tCommon = useTranslations("common");
  const apiErrorMessage = useApiErrorMessage();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const active = normalizeLocale(value);
  const { live, comingSoon } = getGroupedLanguages(active);
  const englishNames = new Intl.DisplayNames(["en"], { type: "language" });
  const current = live.find((language) => language.code === active) ?? live[0];

  const select = async (code: string) => {
    if (code === active) {
      setIsEditing(false);
      return;
    }

    setSaving(code);
    setError(null);

    try {
      await onSave(code);
      // A full reload rather than letting ClientLocaleProvider swap in place.
      // The provider re-renders the client tree, but everything the server
      // already rendered for this request keeps the old locale: the sidebar,
      // the page shell, and any server-fetched copy. Reloading re-resolves the
      // whole page against the NEXT_LOCALE cookie the save just wrote, so the
      // language changes everywhere at once instead of in patches.
      window.location.reload();
    } catch (err) {
      setError(getApiErrorType(err) ? apiErrorMessage(err) : t("saveFailed"));
      setSaving(null);
    }
  };

  if (!isEditing) {
    return (
      <div className={fieldStyles.header}>
        <div className={fieldStyles.labelGroup}>
          <span className={fieldStyles.label}>{t("label")}</span>
          <div className={`${fieldStyles.value} ${styles.currentValue}`}>
            <Flag language={current} />
            <span>{getLanguageNames(current, englishNames).native}</span>
          </div>
        </div>
        <button onClick={() => setIsEditing(true)} className="ui-btn ui-btn-tertiary ui-btn-small">
          {tField("edit")}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.editing}>
      <span className={fieldStyles.label}>{t("label")}</span>

      {/* Inline rather than the header's floating dropdown: settings is a column
          of stacked fields with room to expand, so a popover would only add a
          layer to dismiss. */}
      <div className={styles.picker}>
        <ul className={styles.group}>
          {live.map((language) => (
            <li key={language.code}>
              <button
                type="button"
                className={styles.item}
                lang={language.code}
                aria-current={language.code === active ? "true" : undefined}
                disabled={saving != null}
                onClick={() => void select(language.code)}
              >
                <LanguageLabel language={language} englishNames={englishNames} />
                {saving === language.code && <LoadingSpinner size="sm" />}
              </button>
            </li>
          ))}
        </ul>

        <p className={styles.groupHeading}>{t("comingSoon")}</p>
        <ul className={styles.group}>
          {comingSoon.map((language) => (
            <li key={language.code}>
              {/* Not a disabled button: there is nowhere to go yet, and a control
                  that never becomes enabled is just noise in the tab order. */}
              <span className={`${styles.item} ${styles.itemDisabled}`}>
                <LanguageLabel language={language} englishNames={englishNames} />
                <span className={styles.badge}>{t("comingSoonBadge")}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {error && <div className={fieldStyles.errorMessage}>{error}</div>}

      <div className={fieldStyles.buttonRow}>
        <button
          onClick={() => {
            setIsEditing(false);
            setError(null);
          }}
          disabled={saving != null}
          className="ui-btn ui-btn-secondary ui-btn-small"
        >
          {tCommon("cancel")}
        </button>
      </div>
    </div>
  );
}

function LanguageLabel({ language, englishNames }: { language: Language; englishNames: Intl.DisplayNames }) {
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

function Flag({ language }: { language: Language }) {
  // Plain <img> rather than next/image: tiny static SVGs from the hashed asset
  // tree, so there is nothing for the optimizer to do.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={staticAsset(`images/flags/${language.flag}.svg`)} alt="" aria-hidden="true" className={styles.flag} />
  );
}
