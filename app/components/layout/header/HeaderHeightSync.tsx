"use client";

import { useEffect } from "react";

// Keeps --header-height equal to the real rendered height of the sticky <header>,
// which varies with the LocaleBanner (present/absent, and wrapping to two lines
// on mobile). The header itself takes real layout space, so main flows below it
// with no help needed; this exists purely so consumers that offset off the
// pinned header (FilterSidebar's sticky `top`) stay correct when the banner
// shows. The static --header-height in spacing.css is the pre-JS fallback.
export function HeaderHeightSync() {
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) {
      return;
    }

    const sync = () => {
      document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return null;
}
