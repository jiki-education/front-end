"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import styles from "./LocalBanner.module.css";

interface LocaleBannerBarProps {
  href: string;
  prefix: string;
  cta: string;
  or: string;
  close: string;
  /** The offered locale; dismissal is remembered per offered language. */
  offered: string;
}

// useLayoutEffect on the client (hide before paint, no flash) but useEffect on
// the server (it can't run layout effects, and would warn). Same pattern as
// ThemeProvider.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Presentational, dismissible bar. The offer is computed server-side (see
// LocaleBanner); this owns the dismissed state and persists it. All strings
// arrive already translated into the offered language.
export function LocaleBannerBar({ href, prefix, cta, or, close, offered }: LocaleBannerBarProps) {
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

  return (
    <div className={styles.banner}>
      <span>{prefix} </span>
      <Link href={href}>{cta}</Link> {or}{" "}
      <button
        type="button"
        onClick={() => {
          setDismissed(true);
          writeDismissed(storageKey);
        }}
        aria-label={close}
        className={styles.close}
      >
        {close}
      </button>
      .
    </div>
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
