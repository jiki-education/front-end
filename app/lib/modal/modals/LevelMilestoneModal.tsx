"use client";

import { useState, useEffect } from "react";
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
  const [showAnimation, setShowAnimation] = useState(true);

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
      {showAnimation && (
        <div className={styles.modalCheckmark}>
          <Lottie 
            animationData={checkmarkAnimationData} 
            play 
            loop={false} 
            style={{ height: 144, width: 144 }}
            onComplete={() => setShowAnimation(false)}
          />
        </div>
      )}
      
      <h2 className={styles.modalTitle}>🎉 Level Complete!</h2>
      
      <p className={styles.modalMessage}>
        Congratulations! You&apos;ve successfully completed <strong>{levelTitle}</strong> and mastered all its concepts.
      </p>

      {/* Level Achievement Summary */}
      <div className={styles.achievementSummary}>
        <div className={styles.achievementItem}>
          <div className={styles.achievementIcon}>📚</div>
          <div className={styles.achievementDetails}>
            <div className={styles.achievementValue}>{completedLessonsCount}/{totalLessonsCount}</div>
            <div className={styles.achievementLabel}>Lessons Completed</div>
          </div>
        </div>
        
        <div className={styles.achievementItem}>
          <div className={styles.achievementIcon}>⭐</div>
          <div className={styles.achievementDetails}>
            <div className={styles.achievementValue}>+{xpEarned}</div>
            <div className={styles.achievementLabel}>XP Earned</div>
          </div>
        </div>
      </div>

      <p className={styles.modalMessage}>
        You&apos;re now ready to unlock the next level and continue your learning journey!
      </p>

      <div className={styles.modalButtonsDivider}></div>
      
      <div className={styles.modalButtons}>
        <button onClick={handleGoToDashboard} className={styles.btnSecondary}>
          Go to Dashboard
        </button>
        <button onClick={handleContinue} className={styles.btnPrimary}>
          Continue to Next Level
        </button>
      </div>
    </>
  );
}