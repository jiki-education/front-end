"use client";

import React, { createContext } from "react";
import type { ReactNode } from "react";
import type { Theme, ThemeContextType } from "./types";

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

// Dark mode is not yet designed. Theme is forced to light until dark mode is ready.
// The full dynamic theme logic is intentionally dead code and can be re-enabled
// when dark mode design is ready. See the comment block below.
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={{ theme: "light", resolvedTheme: "light", setTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* DEAD CODE — re-enable when dark mode design is ready:

import { createContext, useEffect, useLayoutEffect, useState } from "react";
import type { ResolvedTheme } from "./types";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const STORAGE_KEY = "jiki-theme";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

function ThemeProviderDynamic({ children, defaultTheme = "system" }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initialTheme = savedTheme || defaultTheme;
    setThemeState(initialTheme);
    const systemPrefersDark = window.matchMedia(MEDIA_QUERY).matches;
    const newResolvedTheme = getResolvedTheme(initialTheme, systemPrefersDark);
    setResolvedTheme(newResolvedTheme);
    updateDocumentTheme(newResolvedTheme);
    setMounted(true);
  }, [defaultTheme]);

  useEffect(() => {
    if (!mounted) return;
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
    localStorage.setItem(STORAGE_KEY, newTheme);
  };

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

*/
