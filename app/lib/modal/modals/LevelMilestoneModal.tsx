"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import Lottie from "react-lottie-player";
import { hideModal } from "../store";
import styles from "@/app/styles/components/modals.module.css";
import checkmarkAnimationData from "@/public/static/animations/checkmark.json";
import SoundManager from "@/lib/sound/SoundManager";

interface LevelMilestoneModalProps {
  levelTitle?: string;
  completedLessonsCount?: number;
  totalLessonsCount?: number;
  xpEarned?: number;
  onContinue?: () => void;
  onGoToDashboard?: () => void;
}

export function LevelMilestoneModal({
  levelTitle = "Getting Started",
  completedLessonsCount = 5,
  totalLessonsCount = 5,
  xpEarned = 50,
  onContinue,
  onGoToDashboard
}: LevelMilestoneModalProps) {
  const t = useTranslations("modals.levelMilestone");
  // Play celebration sound when the modal opens
  useEffect(() => {
    const soundManager = SoundManager.getInstance();
    soundManager.play("success");
  }, []);

  const handleContinue = () => {
    onContinue?.();
    hideModal();
  };

  const handleGoToDashboard = () => {
    onGoToDashboard?.();
    hideModal();
  };

  return (
    <>
      <div className={styles.modalCheckmark}>
        <Lottie animationData={checkmarkAnimationData} play loop={false} style={{ height: 144, width: 144 }} />
      </div>

      <h2 className={styles.modalTitle}>{t("title")}</h2>

      <p className={styles.modalMessage}>
        {t.rich("message", { levelTitle, strong: (chunks) => <strong>{chunks}</strong> })}
      </p>

      {/* Level Achievement Summary */}
      <div className={styles.achievementSummary}>
        <div className={styles.achievementItem}>
          <div className={styles.achievementIcon}>📚</div>
          <div className={styles.achievementDetails}>
            <div className={styles.achievementValue}>
              {completedLessonsCount}/{totalLessonsCount}
            </div>
            <div className={styles.achievementLabel}>{t("lessonsCompleted")}</div>
          </div>
        </div>

        <div className={styles.achievementItem}>
          <div className={styles.achievementIcon}>⭐</div>
          <div className={styles.achievementDetails}>
            <div className={styles.achievementValue}>+{xpEarned}</div>
            <div className={styles.achievementLabel}>{t("xpEarned")}</div>
          </div>
        </div>
      </div>

      <p className={styles.modalMessage}>{t("readyNext")}</p>

      <div className={styles.modalButtonsDivider}></div>

      <div className={styles.modalButtons}>
        <button onClick={handleGoToDashboard} className="ui-btn ui-btn-tertiary ui-btn-large flex-1">
          {t("goToDashboard")}
        </button>
        <button onClick={handleContinue} className="ui-btn ui-btn-primary ui-btn-large flex-1">
          {t("continueNextLevel")}
        </button>
      </div>
    </>
  );
}
