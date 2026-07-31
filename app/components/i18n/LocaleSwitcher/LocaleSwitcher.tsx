"use client";

import { settingsApi } from "@/lib/api/settings";
import { useAuthStore } from "@/lib/auth/authStore";
import { languageName } from "@/lib/i18n/languageNames";
import { ALL_LOCALES } from "@/lib/locales";
import { useState } from "react";
import styles from "./LocaleSwitcher.module.css";

/**
 * STAGING-ONLY: floating language picker, bottom-left of the dashboard.
 *
 * Exists so every served locale can be exercised by hand without touching the
 * database. It reads `explicit_locale` from /internal/me (the locale the user
 * deliberately chose, or null if they never have) and PATCHes
 * /internal/settings/locale to change it.
 *
 * Changing it updates the auth store, which is what actually swaps the UI:
 * ClientLocaleProvider watches the store via resolveUserLocale(), where
 * `explicit_locale` outranks the browser's `locales`. authStore.setUser mirrors
 * the same resolved value into the NEXT_LOCALE cookie, so the next SSR seed
 * agrees and there's no flash back to the old language.
 */
export function LocaleSwitcher() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  async function handleChange(value: string) {
    if (!user) {
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await settingsApi.updateLocale(value);
      // Drive the swap off the store rather than refetching /internal/me: the
      // PATCH response carries settings, not a User, and checkAuth() early-returns
      // once auth has been checked so it can't be used to refresh here.
      setUser({ ...user, explicit_locale: value, locale: value });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change language");
    } finally {
      setSaving(false);
    }
  }

  // Guarded rather than trusting the type, matching resolveUserLocale: `locales`
  // is new on /internal/me and may not be there yet.
  const autoLocale = Array.isArray(user.locales) && user.locales.length > 0 ? user.locales[0] : user.locale;

  return (
    <div className={styles.switcher}>
      <label className={styles.label} htmlFor="staging-locale-switcher">
        Language <span className={styles.badge}>staging</span>
      </label>
      <select
        id="staging-locale-switcher"
        className={styles.select}
        value={user.explicit_locale ?? ""}
        disabled={saving}
        onChange={(event) => void handleChange(event.target.value)}
      >
        {/* No explicit choice yet: the UI locale comes from the browser's
            Accept-Language instead. Selecting a real locale is one-way here —
            the API has no "clear it again" endpoint, so this option is disabled. */}
        <option value="" disabled>
          Auto ({autoLocale})
        </option>
        {ALL_LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {languageName(locale, locale)} ({locale})
          </option>
        ))}
      </select>
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
