"use client";

import { useEffect } from "react";
import { ErrorPageContent } from "../components/error-page/ErrorPage";
// global-error.tsx replaces the entire HTML tree including root layout,
// so it must import globals.css directly to have any styles
import "./globals.css";
import styles from "../components/error-page/ErrorPage.module.css";
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, isSupportedLocale, type Locale } from "@/lib/i18n/config";

// This page replaces the entire HTML tree when the app crashes hard, so it must
// render with ZERO loadable dependencies: no NextIntlClientProvider, no message
// catalog, no fetch. Its strings are therefore DELIBERATELY kept out of
// messages/*.json and live in the inline COPY dictionary below.
//
// IMPORTANT: because this bypasses the catalog, every new locale must be added
// here BY HAND. The translation repo knows about this deliberate exception.
//
// These three strings are the one place Jiki's copy is not translated by the
// normal pass, so they do not reach a reviewer the way catalog copy does. Each
// entry follows its own language's guide on formality, and where that language's
// reviewed catalog already has copy for these same three strings
// (misc.errorPage.*) it reuses that wording verbatim, so the crash page and the
// normal error page match. Two locales sharing a string is the catalogs' own
// call, not a shortcut taken here. They are worth a native speaker's eye on the
// next review pass.
interface GlobalErrorCopy {
  title: string;
  message: string;
  actionLabel: string;
}

const COPY: Record<Locale, GlobalErrorCopy> = {
  en: {
    title: "Something went wrong",
    message: "We encountered an unexpected error. Sorry about that!",
    actionLabel: "Try again"
  },
  hu: {
    title: "Valami hiba történt",
    message: "Váratlan hiba lépett fel. Elnézést kérünk emiatt!",
    actionLabel: "Próbáld újra"
  },
  el: {
    title: "Κάτι πήγε στραβά",
    message: "Παρουσιάστηκε ένα απροσδόκητο σφάλμα. Λυπόμαστε!",
    actionLabel: "Δοκίμασε ξανά"
  },
  "es-419": {
    title: "Algo salió mal",
    message: "Encontramos un error inesperado. ¡Lo sentimos!",
    actionLabel: "Inténtalo de nuevo"
  },
  "es-ES": {
    title: "Algo salió mal",
    message: "Encontramos un error inesperado. ¡Lo sentimos!",
    actionLabel: "Inténtalo de nuevo"
  },
  fr: {
    title: "Une erreur s'est produite",
    message: "Nous avons rencontré une erreur inattendue. Désolé !",
    actionLabel: "Réessaie"
  },
  it: {
    title: "Qualcosa è andato storto",
    message: "Si è verificato un errore imprevisto. Ci dispiace!",
    actionLabel: "Riprova"
  },
  "pt-PT": {
    title: "Algo correu mal",
    message: "Encontrámos um erro inesperado. Lamentamos!",
    actionLabel: "Tenta novamente"
  },
  uk: {
    title: "Щось пішло не так",
    message: "Сталася неочікувана помилка. Перепрошуємо!",
    actionLabel: "Спробуйте ще раз"
  }
};

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      import("@sentry/nextjs")
        .then((Sentry) => {
          Sentry.captureException(error);
        })
        .catch(() => {
          // Sentry failed to load - nothing we can do
        });
    }
  }, [error]);

  const locale = resolveGlobalErrorLocale();
  const copy = getGlobalErrorCopy(locale);

  return (
    <html lang={locale}>
      <body className={styles.wrapper}>
        <div className={styles.container}>
          <ErrorPageContent
            variant="serverError"
            title={copy.title}
            message={copy.message}
            actionLabel={copy.actionLabel}
            onAction={reset}
          />
        </div>
      </body>
    </html>
  );
}

// Dependency-free locale resolution for the crash page. Mirrors the precedence of
// lib/i18n/resolveLocale.ts (URL locale segment, then NEXT_LOCALE cookie, else
// default) but without next/headers, since it must run purely client-side after a
// hard crash. SSR-safe: returns the default locale if evaluated without a DOM
// (global-error only renders client-side in practice, but this must never throw).
export function resolveGlobalErrorLocale(): Locale {
  if (typeof document === "undefined" || typeof location === "undefined") {
    return DEFAULT_LOCALE;
  }

  const urlSegment = location.pathname.split("/")[1];
  if (isSupportedLocale(urlSegment)) {
    return urlSegment;
  }

  const cookieLocale = readCookie(LOCALE_COOKIE_NAME);
  if (isSupportedLocale(cookieLocale)) {
    return cookieLocale;
  }

  return DEFAULT_LOCALE;
}

// Selects the inline copy for a locale, falling back to English for any locale
// not present in the dictionary.
export function getGlobalErrorCopy(locale: string): GlobalErrorCopy {
  const dictionary: Record<string, GlobalErrorCopy | undefined> = COPY;
  return dictionary[locale] ?? COPY[DEFAULT_LOCALE];
}

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}
