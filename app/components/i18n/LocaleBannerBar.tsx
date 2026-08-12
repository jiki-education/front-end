"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { setLocalePrefCookie } from "@/lib/i18n/localeCookie";
import styles from "./LocalBanner.module.css";

interface LocaleBannerBarProps {
  /**
   * The whole banner sentence, already translated into the offered language and
   * rendered as rich text by the server (see LocaleBanner). It embeds the link
   * and the <LocaleBannerDismiss> button, so no copy or punctuation is glued
   * together in JSX.
   */
  children: ReactNode;
  /** The offered locale; dismissal is remembered per offered language. */
  offered: string;
}

// useLayoutEffect on the client (hide before paint, no flash) but useEffect on
// the server (it can't run layout effects, and would warn). Same pattern as
// ThemeProvider.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const DismissContext = createContext<(() => void) | null>(null);

// Presentational, dismissible bar. The offer is computed server-side (see
// LocaleBanner); this owns the dismissed state and persists it.
export function LocaleBannerBar({ children, offered }: LocaleBannerBarProps) {
  const [dismissed, setDismissed] = useState(false);
  const storageKey = `${DISMISS_KEY_PREFIX}${offered}`;

  // The server can't read localStorage, so it always renders the bar and the
  // first client render must match (dismissed=false) to avoid a hydration
  // mismatch. This then hides it before paint if it was dismissed previously.
  useIsomorphicLayoutEffect(() => {
    if (readDismissed(storageKey)) {
      setDismissed(true);
    }
  }, [storageKey]);

  if (dismissed) {
    return null;
  }

  const dismiss = () => {
    setDismissed(true);
    writeDismissed(storageKey);
  };

  return (
    <div className={styles.banner}>
      <DismissContext value={dismiss}>{children}</DismissContext>
    </div>
  );
}

/**
 * The `<link>` chunk of the banner message: the actual "switch to my language"
 * action, and so an explicit choice.
 *
 * A plain anchor rather than <Link>, matching LanguageSwitcher: a client-side
 * navigation would keep the mounted tree and its old-locale links, and — more to
 * the point here — the edge decides the locale before its cache, so the cookie
 * must ride on the document request this click makes. Setting it in the handler
 * gets it there, because document.cookie is synchronous.
 */
export function LocaleBannerLink({ href, offered, children }: { href: string; offered: string; children: ReactNode }) {
  return (
    <a href={href} hrefLang={offered} onClick={() => setLocalePrefCookie(offered)}>
      {children}
    </a>
  );
}

/**
 * The `<dismiss>` chunk of the banner message. Its label comes from the
 * translated string, so the button's accessible name is the translated copy.
 */
export function LocaleBannerDismiss({ children }: { children: ReactNode }) {
  const dismiss = useContext(DismissContext);

  return (
    <button type="button" onClick={() => dismiss?.()} className={styles.close}>
      {children}
    </button>
  );
}

const DISMISS_KEY_PREFIX = "locale-banner-dismissed:";

function readDismissed(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    // Storage disabled (private mode etc.) — just show the banner.
    return false;
  }
}

function writeDismissed(key: string): void {
  try {
    window.localStorage.setItem(key, "1");
  } catch {
    // Ignore storage failures; the banner still closes for this view.
  }
}
