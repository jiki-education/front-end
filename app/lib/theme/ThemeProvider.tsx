"use client";

import React, { createContext, useEffect, useLayoutEffect, useState } from "react";

// SSR-safe layout effect hook
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
import type { ReactNode } from "react";
import type { Theme, ResolvedTheme, ThemeContextType } from "./types";

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "jiki-theme";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = "system" }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  // Always start with "light" to prevent hydration mismatch
  // The blocking script will ensure the DOM is correct, and we'll sync in useEffect
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  // Store initial DOM state to prevent race condition between effects
  const [initialDOMState, setInitialDOMState] = useState<ResolvedTheme | null>(null);

  // Sync with blocking script immediately to prevent flash
  useIsomorphicLayoutEffect(() => {
    // Read what the blocking script set
    // Note: blocking script only sets data-theme="dark" for dark mode,
    // removes the attribute entirely for light mode (see updateDocumentTheme)
    const currentDataTheme = document.documentElement.getAttribute("data-theme");
    const blockingScriptResolvedTheme = currentDataTheme === "dark" ? "dark" : "light";

    setResolvedTheme(blockingScriptResolvedTheme);
    setInitialDOMState(blockingScriptResolvedTheme);
  }, []);

  // Initialize theme from localStorage after layout sync
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initialTheme = savedTheme || defaultTheme;

    setThemeState(initialTheme);

    // Resolve the theme and update DOM if needed
    const systemPrefersDark = window.matchMedia(MEDIA_QUERY).matches;
    const newResolvedTheme = getResolvedTheme(initialTheme, systemPrefersDark);

    // Only update DOM if the resolved theme differs from what blocking script initially set
    // Use stored initial state to prevent race condition between effects
    if (initialDOMState && newResolvedTheme !== initialDOMState) {
      setResolvedTheme(newResolvedTheme);
      updateDocumentTheme(newResolvedTheme);
    }

    setMounted(true);
  }, [defaultTheme, initialDOMState]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) {
      return;
    }

    const mediaQuery = window.matchMedia(MEDIA_QUERY);

    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        const newResolvedTheme = e.matches ? "dark" : "light";
        setResolvedTheme(newResolvedTheme);
        updateDocumentTheme(newResolvedTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    const systemPrefersDark = window.matchMedia(MEDIA_QUERY).matches;
    const newResolvedTheme = getResolvedTheme(newTheme, systemPrefersDark);

    setThemeState(newTheme);
    setResolvedTheme(newResolvedTheme);
    updateDocumentTheme(newResolvedTheme);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, newTheme);
  };

  // Prevent hydration mismatch by syncing with blocking script's theme
  // The resolvedTheme state is initialized to match the blocking script's data-theme attribute
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: defaultTheme, resolvedTheme, setTheme: () => {} }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>{children}</ThemeContext.Provider>;
}

function getResolvedTheme(theme: Theme, systemPrefersDark: boolean): ResolvedTheme {
  if (theme === "system") {
    return systemPrefersDark ? "dark" : "light";
  }
  return theme;
}

function updateDocumentTheme(resolvedTheme: ResolvedTheme) {
  const root = document.documentElement;

  if (resolvedTheme === "dark") {
    root.setAttribute("data-theme", "dark");
    root.classList.add("dark");
  } else {
    root.removeAttribute("data-theme");
    root.classList.remove("dark");
  }
}
