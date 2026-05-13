"use client";

import { Compartment } from "@codemirror/state";
import type { Extension } from "@codemirror/state";
import { createAdaptiveTheme } from "./theme-adapter";

// Create a compartment for theme switching
export const themeCompartment = new Compartment();

// Create theme-aware extension
export function createThemeExtension(isDark: boolean = false): Extension {
  const theme = createAdaptiveTheme(isDark ? "dark" : "light");
  return themeCompartment.of(theme);
}
