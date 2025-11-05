"use client";

import React, { createContext, useEffect, useState } from "react";
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
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    // Sync with blocking script's theme on initial render to prevent hydration mismatch
    if (typeof document !== "undefined") {
      const hasDataTheme = document.documentElement.getAttribute("data-theme") === "dark";
      return hasDataTheme ? "dark" : "light";
    }
    return "light";
  });
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage and system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;

    // Sync with what the blocking script already set
    const currentDataTheme = document.documentElement.getAttribute("data-theme");
    const blockingScriptResolvedTheme = currentDataTheme === "dark" ? "dark" : "light";

    const initialTheme = savedTheme || defaultTheme;

    setThemeState(initialTheme);
    setResolvedTheme(blockingScriptResolvedTheme);
    // Don't call updateDocumentTheme here since blocking script already set it correctly
    setMounted(true);
  }, [defaultTheme]);

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
