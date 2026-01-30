"use client";

import type { ProgrammingLanguage } from "@/types/course";
import { ConfirmTooltip } from "./ConfirmTooltip";
import styles from "../ChooseLanguage.module.css";

type LanguageOption = ProgrammingLanguage | "random";

interface ButtonRowProps {
  step: "video" | "selector";
  hasVisitedSelector: boolean;
  selectedLanguage: LanguageOption | null;
  onBackToVideo: () => void;
  onSelectLanguage: () => void;
  onConfirmChoice: () => void;
}

export function ButtonRow({
  step,
  hasVisitedSelector,
  selectedLanguage,
  onBackToVideo,
  onSelectLanguage,
  onConfirmChoice
}: ButtonRowProps) {
  // Video step: only show button if user has visited selector before
  if (step === "video") {
    if (!hasVisitedSelector) {
      return null;
    }

    return (
      <div className={styles.buttonRow}>
        <div />
        <button className="ui-btn ui-btn-default ui-btn-primary ui-btn-purple" onClick={onSelectLanguage}>
          <span>Select Language</span>
          <svg style={{ width: 18, height: 18, fill: "currentColor" }} viewBox="0 0 24 24">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
          </svg>
        </button>
      </div>
    );
  }

  // Selector step: show back button and confirm button
  return (
    <div className={styles.buttonRow}>
      <button className="ui-btn ui-btn-default ui-btn-ghost ui-btn-purple" onClick={onBackToVideo}>
        <svg style={{ width: 18, height: 18, fill: "currentColor" }} viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
        <span>Back to video</span>
      </button>

      <ConfirmTooltip disabled={!!selectedLanguage}>
        <span className={styles.tooltipWrapper}>
          <button
            className={`ui-btn ui-btn-default ui-btn-primary ui-btn-purple ${!selectedLanguage ? "ui-btn-disabled" : ""}`}
            onClick={onConfirmChoice}
            disabled={!selectedLanguage}
          >
            <span>Confirm Choice</span>
            {selectedLanguage && (
              <svg style={{ width: 18, height: 18, fill: "currentColor" }} viewBox="0 0 24 24">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
              </svg>
            )}
          </button>
        </span>
      </ConfirmTooltip>
    </div>
  );
}
