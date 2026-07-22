"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import CrossIcon from "@/icons/cross.svg";
import HamburgerIcon from "@/icons/hamburger.svg";
import styles from "./external.module.css";

export default function ExternalButtons() {
  const t = useTranslations("layout.externalHeader");
  const routes = useLocaleRoutes();

  return (
    <>
      <div className={styles.navLinks}>
        <Link href="https://jiki.io/blog/the-backstory-of-jiki" className={styles.navLink}>
          {t("aboutJiki")}
        </Link>
        <Link href={routes.premium()} className={styles.navLink}>
          {t("premium")}
        </Link>
        <Link href={routes.testimonials()} className={styles.navLink}>
          {t("testimonials")}
        </Link>
      </div>

      <div className={styles.authButtons}>
        <Link href={routes.authLogin()} className="ui-btn ui-btn-small ui-btn-secondary">
          {t("login")}
        </Link>
        <Link href={routes.authSignup()} className="ui-btn ui-btn-small ui-btn-primary">
          {t("signUp")}
        </Link>
      </div>

      <MobileMenu />
    </>
  );
}

// Progressive collapse (see external.module.css for the breakpoints):
//   >= 1024px         nav links + auth buttons on the bar, no hamburger
//   720px - 1023px    hamburger (nav links only) + auth buttons still on the bar
//   < 720px           hamburger holds everything; auth buttons leave the bar
// The auth buttons live in both the bar and the dropdown; CSS shows exactly one
// set at each width, so there's no JS width tracking.
function MobileMenu() {
  const t = useTranslations("layout.externalHeader");
  const routes = useLocaleRoutes();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const close = () => setIsOpen(false);

  return (
    <div className={styles.mobileMenu} ref={ref}>
      <button
        type="button"
        className={styles.menuToggle}
        aria-label={isOpen ? t("closeMenuAriaLabel") : t("menuAriaLabel")}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <CrossIcon width={16} height={16} /> : <HamburgerIcon width={20} height={20} />}
      </button>

      {isOpen && (
        <div className={styles.menuDropdown} role="menu">
          <Link href="https://jiki.io/blog/the-backstory-of-jiki" className={styles.menuLink} onClick={close}>
            {t("aboutJiki")}
          </Link>
          <Link href={routes.premium()} className={styles.menuLink} onClick={close}>
            {t("premium")}
          </Link>
          <Link href={routes.testimonials()} className={styles.menuLink} onClick={close}>
            {t("testimonials")}
          </Link>

          <div className={styles.menuAuthButtons}>
            <Link href={routes.authLogin()} className="ui-btn ui-btn-small ui-btn-secondary" onClick={close}>
              {t("login")}
            </Link>
            <Link href={routes.authSignup()} className="ui-btn ui-btn-small ui-btn-primary" onClick={close}>
              {t("signUp")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
