"use client";

import { settingsApi } from "@/lib/api/settings";
import { useAuthStore } from "@/lib/auth/authStore";
import { languageName } from "@/lib/i18n/languageNames";
import { SUPPORTED_LOCALES } from "@/lib/locales";
import { useState } from "react";
import styles from "./LocaleSwitcher.module.css";

/**
 * STAGING-ONLY: floating language picker, bottom-left of every app page.
 *
 * It exists so a translator can read the app-internal pages (dashboard, lesson,
 * settings) in their own language. Those pages are not locale-prefixed by
 * design: they resolve their locale from /internal/me, so without this there is
 * no way to reach them in anything but the locale the browser asks for.
 *
 * Switching writes `explicit_locale` through the API (PATCH
 * /internal/settings/locale). That is the only durable answer:
 * `resolveUserLocale()` gives `explicit_locale` precedence over both the
 * browser's `locales` and the account `locale`, so the choice survives a reload.
 * Writing the NEXT_LOCALE cookie alone would be simpler but pointless, because
 * `authStore.setUser` re-seeds that cookie from /internal/me on the next auth
 * check and the change would silently revert.
 *
 * The store write is what swaps the UI in place: ClientLocaleProvider watches
 * the auth store through `resolveUserLocale()`, loads the new catalog and flips
 * `<html lang/dir>`. We set the user rather than refetching, because the PATCH
 * returns settings rather than a User and `checkAuth()` early-returns once auth
 * has been checked.
 *
 * We go to `settingsApi` rather than `settingsStore.updateLocale` deliberately:
 * that action routes through `updateSetting`, which early-returns when
 * `settings` is null, and settings are only ever fetched on the settings page.
 * From the dashboard it would silently do nothing, and it would not touch the
 * auth store either.
 *
 * Options are `SUPPORTED_LOCALES`, the set this build actually serves, so the
 * picker can never offer a locale whose catalog cannot be loaded. On staging
 * that is all 33 languages; a production build would collapse it to English.
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
      setUser({ ...user, explicit_locale: value, locale: value });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change language");
    } finally {
      setSaving(false);
    }
  }

  // Guarded rather than trusting the type, matching resolveUserLocale: `locales`
  // is new on /internal/me and an API that hasn't shipped it must degrade.
  const autoLocale = Array.isArray(user.locales) && user.locales.length > 0 ? user.locales[0] : user.locale;

  return (
    <div className={styles.switcher} data-testid="staging-locale-switcher">
      <label className={styles.label} htmlFor="staging-locale-switcher-select">
        Language <span className={styles.badge}>staging</span>
      </label>
      <select
        id="staging-locale-switcher-select"
        className={styles.select}
        value={user.explicit_locale ?? ""}
        disabled={saving}
        onChange={(event) => void handleChange(event.target.value)}
      >
        {/* No explicit choice yet: the locale comes from the browser instead.
            Choosing a real locale is one-way here, because the API has no
            endpoint to clear the field again, so this option is disabled. */}
        <option value="" disabled>
          Auto ({autoLocale})
        </option>
        {SUPPORTED_LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {languageName(locale, locale)} ({locale})
          </option>
        ))}
      </select>
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
