"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { localePath } from "@/lib/i18n/routes";
import { getGroupedLanguages, getLanguageNames, type Language } from "@/lib/i18n/languages";
import { staticAsset } from "@/lib/static-asset";
import ChevronIcon from "@/icons/chevron-down.svg";
import styles from "./LanguageSwitcher.module.css";

/**
 * Language picker for the external (marketing) header.
 *
 * The languages this environment serves link to the current page under their own
 * prefix; the rest are listed disabled with a "coming soon" badge, so the breadth
 * of the translation effort is visible before any of it ships.
 *
 * Targets come from `localePath`, the inverse of the middleware's routing, so a
 * switch preserves the page, query and hash and lands on the URL the router will
 * actually serve (/blog/foo -> /pt-PT/blog/foo).
 */
export function LanguageSwitcher() {
  const t = useTranslations("layout.externalHeader");
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { live, comingSoon } = getGroupedLanguages(locale);
  const englishNames = new Intl.DisplayNames(["en"], { type: "language" });
  const current = live.find((language) => language.code === locale) ?? live[0];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={styles.switcher} ref={ref}>
      <button
        type="button"
        className={`ui-btn ui-btn-small ui-btn-tertiary ${styles.toggle}`}
        aria-label={t("languageAriaLabel")}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <Flag language={current} />
        <ChevronIcon className={styles.chevron} width={12} height={12} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <ul className={styles.group}>
            {live.map((language) => (
              <li key={language.code}>
                <Link
                  href={localePath(pathname, language.code)}
                  className={styles.item}
                  hrefLang={language.code}
                  aria-current={language.code === locale ? "true" : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  <LanguageLabel language={language} englishNames={englishNames} />
                </Link>
              </li>
            ))}
          </ul>

          <p className={styles.groupHeading}>{t("languageComingSoon")}</p>
          <ul className={styles.group}>
            {comingSoon.map((language) => (
              <li key={language.code}>
                {/* Not a button: there is nowhere to go yet, and a disabled control
                    that never becomes enabled is just noise in the tab order. */}
                <span className={`${styles.item} ${styles.itemDisabled}`}>
                  <LanguageLabel language={language} englishNames={englishNames} />
                  <span className={styles.badge}>{t("languageComingSoonBadge")}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function LanguageLabel({ language, englishNames }: { language: Language; englishNames: Intl.DisplayNames }) {
  const { native, english } = getLanguageNames(language, englishNames);

  return (
    <>
      <Flag language={language} />
      <span className={styles.names}>
        {/* The endonym leads, so a speaker finds their own language without reading
            English first, and the list is sorted on it to match (see
            compareForDisplay). Every row renders both lines, English included —
            no row is a special case, so the column never goes ragged. */}
        <span className={styles.primary} lang={language.code}>
          {native}
        </span>
        <span className={styles.secondary}>{english}</span>
      </span>
    </>
  );
}

function Flag({ language }: { language: Language }) {
  // Plain <img> rather than next/image: these are tiny static SVGs served from the
  // hashed asset tree, so there is nothing for the optimizer to do.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={staticAsset(`images/flags/${language.flag}.svg`)} alt="" aria-hidden="true" className={styles.flag} />
  );
}
