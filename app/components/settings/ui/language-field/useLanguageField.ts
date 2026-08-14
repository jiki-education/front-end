import { useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { getApiErrorType } from "@/lib/api/client";
import { useApiErrorMessage } from "@/lib/api/apiErrors";
import { getGroupedLanguages, type Language } from "@/lib/i18n/languages";
import { normalizeLocale } from "@/lib/i18n/config";
import { matchesQuery } from "./filterLanguages";

interface UseLanguageFieldOptions {
  /** The account's current locale (settings.locale). */
  value: string;
  onSave: (locale: string) => Promise<void>;
}

interface UseLanguageFieldResult {
  active: string;
  current: Language;
  englishNames: Intl.DisplayNames;
  live: Language[];
  comingSoon: Language[];
  hasMatches: boolean;
  isEditing: boolean;
  query: string;
  saving: string | null;
  error: string | null;
  panelId: string;
  toggleRef: React.RefObject<HTMLButtonElement | null>;
  setQuery: (query: string) => void;
  toggle: () => void;
  close: () => void;
  closeAndRefocus: () => void;
  select: (code: string) => void;
}

export function useLanguageField({ value, onSave }: UseLanguageFieldOptions): UseLanguageFieldResult {
  const t = useTranslations("settings.language");
  const apiErrorMessage = useApiErrorMessage();

  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const active = normalizeLocale(value);
  const { live, comingSoon } = getGroupedLanguages(active);
  const englishNames = new Intl.DisplayNames(["en"], { type: "language" });
  const current = live.find((language) => language.code === active) ?? live[0];

  const matchingLive = live.filter((language) => matchesQuery(language, query, englishNames));
  const matchingComingSoon = comingSoon.filter((language) => matchesQuery(language, query, englishNames));

  const close = () => {
    setIsEditing(false);
    setQuery("");
    setError(null);
  };

  const closeAndRefocus = () => {
    close();
    toggleRef.current?.focus();
  };

  const select = (code: string) => {
    if (code === active) {
      close();
      return;
    }

    setSaving(code);
    setError(null);

    void onSave(code)
      .then(() => {
        // A full reload rather than letting ClientLocaleProvider swap in place.
        // The provider re-renders the client tree, but everything the server
        // already rendered for this request keeps the old locale: the sidebar,
        // the page shell, and any server-fetched copy. Reloading re-resolves the
        // whole page against the NEXT_LOCALE cookie the save just wrote, so the
        // language changes everywhere at once instead of in patches.
        window.location.reload();
      })
      .catch((err: unknown) => {
        setError(getApiErrorType(err) ? apiErrorMessage(err) : t("saveFailed"));
        setSaving(null);
      });
  };

  return {
    active,
    current,
    englishNames,
    live: matchingLive,
    comingSoon: matchingComingSoon,
    hasMatches: matchingLive.length > 0 || matchingComingSoon.length > 0,
    isEditing,
    query,
    saving,
    error,
    panelId,
    toggleRef,
    setQuery,
    toggle: () => (isEditing ? close() : setIsEditing(true)),
    close,
    closeAndRefocus,
    select
  };
}
