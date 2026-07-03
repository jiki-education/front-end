"use client";

import type { ProgrammingLanguage } from "@/types/course";
import { useTranslations } from "next-intl";
import styles from "../ChooseLanguage.module.css";

type LanguageOption = ProgrammingLanguage | "random";

interface LanguageSelectorStepProps {
  languageOptions: ProgrammingLanguage[];
  selectedLanguage: LanguageOption | null;
  onLanguageSelect: (language: LanguageOption) => void;
}

export function LanguageSelectorStep({
  languageOptions,
  selectedLanguage,
  onLanguageSelect
}: LanguageSelectorStepProps) {
  const t = useTranslations("misc.chooseLanguage");
  return (
    <div className={styles.questionBox}>
      <h2 className={styles.questionTitle}>{t("questionTitle")}</h2>

      <div className={styles.optionsList}>
        {languageOptions.includes("javascript") && (
          <button
            className={`${styles.optionBtn} ${selectedLanguage === "javascript" ? styles.selected : ""}`}
            onClick={() => onLanguageSelect("javascript")}
          >
            <span>{t("javascript")}</span>
            <span className={styles.optionCheckbox}>
              <svg viewBox="0 0 24 24">
                <polyline points="4 12 9 17 20 6" />
              </svg>
            </span>
          </button>
        )}

        {languageOptions.includes("python") && (
          <button
            className={`${styles.optionBtn} ${selectedLanguage === "python" ? styles.selected : ""}`}
            onClick={() => onLanguageSelect("python")}
          >
            <span>{t("python")}</span>
            <span className={styles.optionCheckbox}>
              <svg viewBox="0 0 24 24">
                <polyline points="4 12 9 17 20 6" />
              </svg>
            </span>
          </button>
        )}

        <button
          className={`${styles.optionBtn} ${selectedLanguage === "random" ? styles.selected : ""}`}
          onClick={() => onLanguageSelect("random")}
        >
          <span>{t("chooseForMe")}</span>
          <span className={styles.optionCheckbox}>
            <svg viewBox="0 0 24 24">
              <polyline points="4 12 9 17 20 6" />
            </svg>
          </span>
        </button>
      </div>

      <p className={styles.warningText}>{t("cantChange")}</p>
    </div>
  );
}
