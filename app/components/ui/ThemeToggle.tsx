"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/lib/theme";
import type { Theme } from "@/lib/theme";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("common.themeToggle");

  const handleToggle = () => {
    const themes: Theme[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun />;
      case "dark":
        return <Moon />;
      case "system":
        return <Monitor />;
      default:
        return <Sun />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case "light":
        return t("switchToDark");
      case "dark":
        return t("switchToSystem");
      case "system":
        return t("switchToLight");
      default:
        return t("toggle");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`${styles.button} focus-ring`}
      aria-label={getLabel()}
      title={getLabel()}
      aria-describedby="theme-toggle-description"
    >
      <span className={styles.icon}>{getIcon()}</span>
      <span id="theme-toggle-description" className="sr-only">
        {t("description", { theme })}
      </span>
    </button>
  );
}
