"use client";

import { useState } from "react";
import styles from "@/app/styles/components/modals.module.css";

interface DifficultyRatingStepProps {
  exerciseTitle: string;
  onRatingsSubmit: (difficultyRating: number, funRating: number) => void;
}

export function DifficultyRatingStep({ exerciseTitle, onRatingsSubmit }: DifficultyRatingStepProps) {
  const [difficultyRating, setDifficultyRating] = useState<number>(3);
  const [funRating, setFunRating] = useState<number>(3);
  const funEmojis = ["😢", "😞", "😐", "😊", "😁"];

  const handleSubmit = () => {
    onRatingsSubmit(difficultyRating, funRating);
  };

  return (
    <>
      <h2 className={styles.modalTitle}>Rate your experience</h2>
      <p className={styles.modalMessage}>Help us improve by rating {exerciseTitle} on difficulty and fun.</p>

      <div className={styles.difficultyRatingContainer}>
        <div className={styles.difficultyRatingTitle}>Rate the difficulty</div>

        <div className={styles.difficultySliderContainer}>
          <div className={styles.difficultySlider}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                className={`${styles.difficultyDot} ${difficultyRating === rating ? styles.selected : ""}`}
                onClick={() => setDifficultyRating(rating)}
                aria-label={`Rate difficulty as ${rating} out of 5`}
              />
            ))}
          </div>

          <div className={styles.difficultyLabels}>
            <span className={`${styles.difficultyLabel} ${styles.leftLabel}`}>Too easy</span>
            <span className={`${styles.difficultyLabel} ${styles.centerLabel}`}>Just right</span>
            <span className={`${styles.difficultyLabel} ${styles.rightLabel}`}>Too hard</span>
          </div>
        </div>
      </div>

      <div className={styles.funRatingContainer}>
        <div className={styles.funRatingTitle}>Rate the fun factor</div>

        <div className={styles.funSliderContainer}>
          <div className={styles.funSlider}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                className={`${styles.funDot} ${funRating === rating ? styles.selected : ""}`}
                onClick={() => setFunRating(rating)}
                aria-label={`Rate fun as ${rating} out of 5`}
              >
                {funEmojis[rating - 1]}
              </button>
            ))}
          </div>

          <div className={styles.funLabels}>
            <span className={`${styles.funLabel} ${styles.leftLabel}`}>No fun</span>
            <span className={`${styles.funLabel} ${styles.centerLabel}`}>Pretty good</span>
            <span className={`${styles.funLabel} ${styles.rightLabel}`}>Amazing!</span>
          </div>
        </div>
      </div>

      <div className={styles.modalButtonsDivider}></div>
      <div className={styles.modalButtons}>
        <button onClick={handleSubmit} className={styles.btnPrimary}>
          Continue
        </button>
      </div>
    </>
  );
}
