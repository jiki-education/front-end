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
// New locales' entries start as the English copy verbatim (never machine-translated).
interface GlobalErrorCopy {
  title: string;
  message: string;
  actionLabel: string;
}

// English is required (it is the fallback for every locale without an entry);
// every other locale is optional, so adding a locale doesn't break the build —
// it just falls back to English until its copy is hand-written here.
type GlobalErrorCopyMap = Partial<Record<Locale, GlobalErrorCopy>> & { en: GlobalErrorCopy };

const COPY: GlobalErrorCopyMap = {
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
    message: "Παρουσιάστηκε ένα απρόσμενο σφάλμα. Συγγνώμη γι' αυτό!",
    actionLabel: "Δοκίμασε ξανά"
  },
  ru: {
    title: "Что-то пошло не так",
    message: "Произошла непредвиденная ошибка. Приносим извинения!",
    actionLabel: "Попробовать снова"
  },
  sr: {
    title: "Nešto je pošlo po zlu",
    message: "Došlo je do neočekivane greške. Izvini zbog toga!",
    actionLabel: "Probaj ponovo"
  },
  "pt-PT": {
    title: "Algo correu mal",
    message: "Ocorreu um erro inesperado. Pedimos desculpa!",
    actionLabel: "Tenta novamente"
  },
  uk: {
    title: "Щось пішло не так",
    message: "Сталася неочікувана помилка. Перепрошуємо!",
    actionLabel: "Спробувати ще раз"
  },
  "pt-BR": {
    title: "Algo deu errado",
    message: "Ocorreu um erro inesperado. Sentimos muito!",
    actionLabel: "Tente novamente"
  },
  fa: {
    title: "مشکلی پیش آمد",
    message: "یک خطای غیرمنتظره رخ داد. متأسفیم!",
    actionLabel: "دوباره تلاش کنید"
  },
  // Not yet translated: English copy verbatim until a website-copy pass covers
  // these languages. The crash page must render usable text, so it never carries
  // the catalog's `�` untranslated sentinel.
  fr: {
    title: "Quelque chose s'est mal passé",
    message: "Une erreur inattendue s'est produite. Désolé !",
    actionLabel: "Réessayer"
  },
  it: {
    title: "Qualcosa è andato storto",
    message: "Si è verificato un errore imprevisto. Ci dispiace!",
    actionLabel: "Riprova"
  },
  nl: {
    title: "Er is iets misgegaan",
    message: "Er is een onverwachte fout opgetreden. Sorry daarvoor!",
    actionLabel: "Probeer opnieuw"
  },
  "zh-TW": {
    title: "出了點問題",
    message: "我們遇到了非預期的錯誤，真的很抱歉！",
    actionLabel: "再試一次"
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
  return dictionary[locale] ?? COPY.en;
}

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}
