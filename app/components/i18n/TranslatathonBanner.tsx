"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { ALL_LOCALES } from "@/lib/locales";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import styles from "./TranslatathonBanner.module.css";

/**
 * Temporary, pre-catalog promo banner for the Big Jiki & Exercism Translatathon.
 *
 * Deliberately NOT wired into next-intl: the whole point is to reach speakers of
 * languages we do NOT yet ship in the catalog, so its copy can't come from the
 * catalog. This is different from the catalog-driven LocaleBanner (which offers to
 * switch to a language we already support) — see `components/i18n/LocaleBanner.tsx`.
 *
 * It targets the first non-English language in the viewer's own language list
 * (`navigator.languages`, i.e. their browser's ordered preference list) that we
 * don't already ship. Everyone in that bucket sees the banner:
 * - English copy by default, with their language's name filled in;
 * - or, once we have a hand-written translation for that language in COPY below,
 *   the whole banner in that language.
 *
 * Rendering client-side is intentional: navigator.languages IS the "language
 * list", and it keeps this out of the edge-cached SSR HTML (whose cache key can't
 * distinguish which off-catalog language a viewer prefers).
 *
 * The whole banner is temporary and self-removes after the event (see END).
 */

interface TranslatathonCopy {
  /** Sentence text before the linked call-to-action (may be empty). */
  pre: string;
  /** The linked call-to-action text (the "Join the Translatathon" part). */
  link: string;
  /** Sentence text after the linked call-to-action (may be empty). */
  post: string;
  /** Accessible label for the dismiss button, in this language. */
  close: string;
}

/**
 * Hand-written, fully-translated copy per base language code (lowercased, region
 * stripped: "fr", "es", "pt", ...). Optional: a language absent here falls back to
 * the English banner with its name filled in (see englishCopy). Add a language to
 * upgrade its speakers from the English fallback to a native-language banner. Each
 * string MUST be written in that language (including its own name for itself).
 */
const COPY: Partial<Record<string, TranslatathonCopy>> = {
  // e.g.
  // fr: {
  //   pre: "Vous voulez nous aider à traduire Jiki en français ? ",
  //   link: "Rejoignez le Translatathon",
  //   post: "",
  //   close: "Fermer"
  // },
};

// The event weekend is 31 Jul – 2 Aug 2026; keep the banner up through 3 Aug.
// After this instant the banner never renders. Remove the component entirely
// once the event is well past.
const END = new Date("2026-08-04T00:00:00Z");

const DISMISS_KEY_PREFIX = "translatathon-banner-dismissed:";

// useLayoutEffect on the client (decide before paint, no flash); useEffect on the
// server (it can't run layout effects and would warn). Same pattern as LocaleBannerBar.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function TranslatathonBanner() {
  const routes = useLocaleRoutes();
  // Signed-in users only. We read the current auth state and don't wait for the
  // auth check to settle: if we don't yet know they're authed, we simply show
  // nothing (and re-render once the store flips). This lets the same component
  // sit in the public/hybrid layout without ever showing to logged-out visitors.
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // Both the server render and the first client render produce null (lang === null),
  // so there is no hydration mismatch; the effect then reveals the banner if it applies.
  const [lang, setLang] = useState<string | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (new Date() >= END) {
      return;
    }
    const languages = typeof navigator !== "undefined" ? navigator.languages : [];
    const picked = pickLanguage(languages);
    if (picked && !isDismissed(picked)) {
      setLang(picked);
    }
  }, []);

  if (!isAuthenticated || !lang) {
    return null;
  }

  const copy = COPY[lang] ?? englishCopy(lang);
  if (!copy) {
    return null;
  }

  return (
    <div className={styles.banner} role="region" aria-label={copy.close}>
      <span>{copy.pre}</span>
      <Link href={routes.blogPost("translatathon")} target="_blank" rel="noopener noreferrer">
        {copy.link}
      </Link>
      <span>{copy.post}</span>
      <button
        type="button"
        onClick={() => {
          dismiss(lang);
          setLang(null);
        }}
        aria-label={copy.close}
        className={styles.close}
      >
        ×
      </button>
    </div>
  );
}

// Base languages we already ship in the catalog (e.g. "en", "hu"): their speakers
// get the real catalog LocaleBanner offering an in-app switch, so there is nothing
// to recruit and we never show them the Translatathon banner.
const CATALOG_LANGUAGES = new Set(ALL_LOCALES.map((locale) => locale.split("-")[0].toLowerCase()));

/**
 * First language in the viewer's list that we don't already ship — the one we'd
 * recruit them to help translate. Returns the base code (e.g. "fr"), or undefined
 * when their whole list is English / catalog languages.
 */
function pickLanguage(languages: readonly string[]): string | undefined {
  for (const tag of languages) {
    const base = tag.split("-")[0]?.toLowerCase();
    if (base && !CATALOG_LANGUAGES.has(base)) {
      return base;
    }
  }
  return undefined;
}

/**
 * The English fallback banner for a language we have no hand-written copy for, with
 * the language's English name filled in. Returns null when the code resolves to no
 * real language name (so we never render "translate Jiki to xyz").
 */
function englishCopy(lang: string): TranslatathonCopy | null {
  const name = languageName(lang);
  if (!name) {
    return null;
  }
  return {
    pre: `Want to help us translate Jiki to ${name}? `,
    link: "Join the Translatathon",
    post: "",
    close: "Close this notice"
  };
}

/** The English display name for a base language code, or undefined if it isn't a real language. */
function languageName(lang: string): string | undefined {
  try {
    const name = new Intl.DisplayNames(["en"], { type: "language" }).of(lang);
    // DisplayNames echoes the input back for unknown codes; treat that as "no name".
    return name && name.toLowerCase() !== lang.toLowerCase() ? name : undefined;
  } catch {
    return undefined;
  }
}

function isDismissed(lang: string): boolean {
  try {
    return window.localStorage.getItem(`${DISMISS_KEY_PREFIX}${lang}`) === "1";
  } catch {
    // Storage disabled (private mode etc.) — just show the banner.
    return false;
  }
}

function dismiss(lang: string): void {
  try {
    window.localStorage.setItem(`${DISMISS_KEY_PREFIX}${lang}`, "1");
  } catch {
    // Ignore storage failures; the banner still closes for this view.
  }
}
