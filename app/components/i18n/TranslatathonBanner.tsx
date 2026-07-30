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
 * It targets the first non-catalog language in the viewer's own language list
 * (`navigator.languages`, i.e. their browser's ordered preference list), shown to
 * signed-in users only:
 * - a language we run in the Translatathon program (COPY below) gets the whole
 *   banner IN that language;
 * - any other non-English language gets the English banner with its name filled in.
 *
 * Rendering client-side is intentional: navigator.languages IS the "language
 * list", and it keeps this out of the edge-cached SSR HTML.
 *
 * The whole banner is temporary and self-removes after the event (see END).
 *
 * NOTE: the translated strings below were drafted for the event and should be
 * sanity-checked by native speakers / the Translatathon translators.
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
 * Fully-translated copy for each language in the Translatathon program, keyed by
 * the program's own locale ids (matching ../../translator/languages/names.json,
 * minus `hu` which we already ship). Multi-variant languages have one entry per
 * variant (es-419/es-ES, pt-BR/pt-pt, zh-CN/zh-TW); resolveTarget maps a browser
 * tag to the right one. Each string is written in that language, with the
 * language's own name for itself; "Jiki" and "Translatathon" stay as proper nouns.
 */
const COPY: Record<string, TranslatathonCopy> = {
  ar: {
    pre: "هل تريد مساعدتنا في ترجمة Jiki إلى العربية؟ ",
    link: "انضمّ إلى Translatathon",
    post: "",
    close: "إغلاق"
  },
  bn: {
    pre: "Jiki-কে বাংলায় অনুবাদ করতে আমাদের সাহায্য করতে চান? ",
    link: "Translatathon-এ যোগ দিন",
    post: "",
    close: "বন্ধ করুন"
  },
  ca: {
    pre: "Vols ajudar-nos a traduir Jiki al català? ",
    link: "Uneix-te al Translatathon",
    post: "",
    close: "Tanca"
  },
  de: {
    pre: "Möchtest du uns helfen, Jiki ins Deutsche zu übersetzen? ",
    link: "Mach beim Translatathon mit",
    post: "",
    close: "Schließen"
  },
  el: {
    pre: "Θέλεις να μας βοηθήσεις να μεταφράσουμε το Jiki στα Ελληνικά; ",
    link: "Λάβε μέρος στο Translatathon",
    post: "",
    close: "Κλείσιμο"
  },
  "es-419": {
    pre: "¿Quieres ayudarnos a traducir Jiki al español? ",
    link: "Únete al Translatathon",
    post: "",
    close: "Cerrar"
  },
  "es-ES": {
    pre: "¿Quieres ayudarnos a traducir Jiki al español? ",
    link: "Únete al Translatathon",
    post: "",
    close: "Cerrar"
  },
  fa: {
    pre: "می‌خواهید در ترجمهٔ Jiki به فارسی به ما کمک کنید؟ ",
    link: "به Translatathon بپیوندید",
    post: "",
    close: "بستن"
  },
  fr: {
    pre: "Vous voulez nous aider à traduire Jiki en français ? ",
    link: "Rejoignez le Translatathon",
    post: "",
    close: "Fermer"
  },
  hi: {
    pre: "क्या आप Jiki का हिन्दी में अनुवाद करने में हमारी मदद करना चाहते हैं? ",
    link: "Translatathon में शामिल हों",
    post: "",
    close: "बंद करें"
  },
  id: {
    pre: "Ingin membantu kami menerjemahkan Jiki ke Bahasa Indonesia? ",
    link: "Ikuti Translatathon",
    post: "",
    close: "Tutup"
  },
  it: {
    pre: "Vuoi aiutarci a tradurre Jiki in italiano? ",
    link: "Partecipa al Translatathon",
    post: "",
    close: "Chiudi"
  },
  ja: {
    pre: "Jiki を日本語に翻訳するのを手伝いませんか？",
    link: "Translatathon に参加する",
    post: "",
    close: "閉じる"
  },
  ko: {
    pre: "Jiki를 한국어로 번역하는 데 도움을 주시겠어요? ",
    link: "Translatathon에 참여하세요",
    post: "",
    close: "닫기"
  },
  nl: {
    pre: "Wil je ons helpen Jiki naar het Nederlands te vertalen? ",
    link: "Doe mee aan de Translatathon",
    post: "",
    close: "Sluiten"
  },
  pl: {
    pre: "Chcesz pomóc nam przetłumaczyć Jiki na polski? ",
    link: "Dołącz do Translatathonu",
    post: "",
    close: "Zamknij"
  },
  "pt-BR": {
    pre: "Quer nos ajudar a traduzir o Jiki para o português? ",
    link: "Participe do Translatathon",
    post: "",
    close: "Fechar"
  },
  "pt-pt": {
    pre: "Quer ajudar-nos a traduzir o Jiki para português? ",
    link: "Junte-se ao Translatathon",
    post: "",
    close: "Fechar"
  },
  ru: {
    pre: "Хотите помочь нам перевести Jiki на русский? ",
    link: "Присоединяйтесь к Translatathon",
    post: "",
    close: "Закрыть"
  },
  sr: {
    pre: "Желите да нам помогнете да преведемо Jiki на српски? ",
    link: "Придружите се Translatathon-у",
    post: "",
    close: "Затвори"
  },
  sw: {
    pre: "Ungependa kutusaidia kutafsiri Jiki kwa Kiswahili? ",
    link: "Jiunge na Translatathon",
    post: "",
    close: "Funga"
  },
  tr: {
    pre: "Jiki'yi Türkçeye çevirmemize yardım etmek ister misin? ",
    link: "Translatathon'a katıl",
    post: "",
    close: "Kapat"
  },
  uk: {
    pre: "Хочете допомогти нам перекласти Jiki українською? ",
    link: "Долучайтеся до Translatathon",
    post: "",
    close: "Закрити"
  },
  ur: {
    pre: "کیا آپ Jiki کا اردو میں ترجمہ کرنے میں ہماری مدد کرنا چاہتے ہیں؟ ",
    link: "Translatathon میں شامل ہوں",
    post: "",
    close: "بند کریں"
  },
  vi: {
    pre: "Bạn muốn giúp chúng tôi dịch Jiki sang Tiếng Việt? ",
    link: "Tham gia Translatathon",
    post: "",
    close: "Đóng"
  },
  "zh-CN": {
    pre: "想帮我们把 Jiki 翻译成中文吗？",
    link: "加入 Translatathon",
    post: "",
    close: "关闭"
  },
  "zh-TW": {
    pre: "想幫我們把 Jiki 翻譯成中文嗎？",
    link: "加入 Translatathon",
    post: "",
    close: "關閉"
  }
};

// Program languages that read right-to-left; the banner element gets dir="rtl".
const RTL_TARGETS = new Set(["ar", "fa", "ur"]);

// The event weekend is 31 Jul – 2 Aug 2026; keep the banner up through 3 Aug.
// After this instant the banner never renders. Remove the component entirely
// once the event is well past.
const END = new Date("2026-08-04T00:00:00Z");

const DISMISS_KEY_PREFIX = "translatathon-banner-dismissed:";

interface Target {
  copy: TranslatathonCopy;
  dir: "ltr" | "rtl";
  /** Identity the dismissal is remembered under (program locale id, or base language). */
  dismissId: string;
}

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
  // Both the server render and the first client render produce null (target === null),
  // so there is no hydration mismatch; the effect then reveals the banner if it applies.
  const [target, setTarget] = useState<Target | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (new Date() >= END) {
      return;
    }
    const languages = typeof navigator !== "undefined" ? navigator.languages : [];
    const resolved = resolveTarget(languages);
    if (resolved && !isDismissed(resolved.dismissId)) {
      setTarget(resolved);
    }
  }, []);

  if (!isAuthenticated || !target) {
    return null;
  }

  const { copy, dir } = target;

  return (
    <div className={styles.banner} dir={dir}>
      <span>{copy.pre}</span>
      <Link href={routes.blogPost("translatathon")} target="_blank" rel="noopener noreferrer">
        {copy.link}
      </Link>
      <span>{copy.post}</span>
      <button
        type="button"
        onClick={() => {
          dismiss(target.dismissId);
          setTarget(null);
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
 * Resolve the viewer's language list to the banner we should show. Walks the list
 * in order, takes the first language we don't already ship, and returns either its
 * in-program translated banner or the English fallback with its name filled in.
 */
function resolveTarget(languages: readonly string[]): Target | null {
  for (const tag of languages) {
    const base = tag.split("-")[0]?.toLowerCase();
    if (!base || CATALOG_LANGUAGES.has(base)) {
      continue;
    }
    const key = programLocale(tag, base);
    if (key) {
      return { copy: COPY[key], dir: RTL_TARGETS.has(base) ? "rtl" : "ltr", dismissId: key };
    }
    const english = englishCopy(base);
    return english ? { copy: english, dir: "ltr", dismissId: base } : null;
  }
  return null;
}

/**
 * Map a browser language tag to the program locale id whose copy we show, or
 * undefined if the language isn't in the program. Multi-variant languages collapse
 * by region/script (mirrors the API's variant handling); every other program
 * language is keyed by its bare base code.
 */
function programLocale(tag: string, base: string): string | undefined {
  if (base === "es") {
    return region(tag) === "ES" ? "es-ES" : "es-419";
  }
  if (base === "pt") {
    return region(tag) === "PT" ? "pt-pt" : "pt-BR";
  }
  if (base === "zh") {
    const r = region(tag);
    return /hant/i.test(tag) || r === "TW" || r === "HK" || r === "MO" ? "zh-TW" : "zh-CN";
  }
  return base in COPY ? base : undefined;
}

/** The region subtag (first 2-alpha or 3-digit subtag), uppercased, or undefined. */
function region(tag: string): string | undefined {
  return tag
    .split("-")
    .slice(1)
    .find((part) => /^([A-Za-z]{2}|\d{3})$/.test(part))
    ?.toUpperCase();
}

/**
 * The English fallback banner for a non-program language, with the language's
 * English name filled in. Returns null when the code resolves to no real language
 * name (so we never render "translate Jiki to xyz").
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

function isDismissed(id: string): boolean {
  try {
    return window.localStorage.getItem(`${DISMISS_KEY_PREFIX}${id}`) === "1";
  } catch {
    // Storage disabled (private mode etc.) — just show the banner.
    return false;
  }
}

function dismiss(id: string): void {
  try {
    window.localStorage.setItem(`${DISMISS_KEY_PREFIX}${id}`, "1");
  } catch {
    // Ignore storage failures; the banner still closes for this view.
  }
}
