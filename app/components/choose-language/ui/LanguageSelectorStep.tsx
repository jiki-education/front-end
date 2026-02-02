"use client";

import type { ProgrammingLanguage } from "@/types/course";
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
  return (
    <div className={styles.questionBox}>
      <h2 className={styles.questionTitle}>Choose which language you want to learn?</h2>

      <div className={styles.optionsList}>
        {languageOptions.includes("javascript") && (
          <button
            className={`${styles.optionBtn} ${selectedLanguage === "javascript" ? styles.selected : ""}`}
            onClick={() => onLanguageSelect("javascript")}
          >
            <span>JavaScript</span>
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
            <span>Python</span>
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
          <span>Choose for me</span>
          <span className={styles.optionCheckbox}>
            <svg viewBox="0 0 24 24">
              <polyline points="4 12 9 17 20 6" />
            </svg>
          </span>
        </button>
      </div>

      <p className={styles.warningText}>You can&apos;t change once selected.</p>
    </div>
  );
}
