"use client";

import { useStickyNav } from "./hooks/useStickyNav";

// Runs the sticky-nav scroll effect. Isolated as a client component so LandingPage
// can be a server component.
export function StickyNav() {
  useStickyNav();
  return null;
}
