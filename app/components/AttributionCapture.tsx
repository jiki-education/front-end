"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * Mount-only side effect: records first-touch attribution.
 * Must run before any OAuth redirect (Google clobbers document.referrer),
 * so this lives in the root layout to fire on the very first page mount.
 */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
