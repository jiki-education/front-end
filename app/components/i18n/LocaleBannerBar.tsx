"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./LocalBanner.module.css";

interface LocaleBannerBarProps {
  href: string;
  prefix: string;
  cta: string;
  or: string;
  close: string;
}

// Presentational, dismissible bar. The offer is computed server-side (see
// LocaleBanner); this only owns the dismissed state and the close button. All
// strings arrive already translated into the offered language.
export function LocaleBannerBar({ href, prefix, cta, or, close }: LocaleBannerBarProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div className={styles.banner}>
      <span>{prefix} </span>
      <Link href={href}>{cta}</Link> {or}{" "}
      <button type="button" onClick={() => setDismissed(true)} aria-label={close} className={styles.close}>
        {close}
      </button>
      .
    </div>
  );
}
