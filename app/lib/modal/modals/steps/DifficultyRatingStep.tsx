"use client";

import { useState } from "react";
import modalStyles from "@/app/styles/components/modals.module.css";
import ratingStyles from "./DifficultyRatingStep.module.css";
import { assembleClassNames } from "@/lib/assemble-classnames";

interface DifficultyRatingStepProps {
  exerciseTitle: string;
  onRatingsSubmit: (difficultyRating: number, funRating: number) => void;
}

export function DifficultyRatingStep({ exerciseTitle, onRatingsSubmit }: DifficultyRatingStepProps) {
  const [difficultyRating, setDifficultyRating] = useState<number>(2); // Default to "Just right" (index 2)
  const [funRating, setFunRating] = useState<number>(4); // Default to "Amazing!" (index 4)
  const difficultyLabels = ["Too easy", "Easy", "Just right", "Hard", "Too hard"];
  const funEmojis = ["😫", "😐", "🙂", "😊", "😄"];
  const funLabels = ["Frustrating", "", "Pretty good", "", "Amazing!"];

  const handleSubmit = () => {
    onRatingsSubmit(difficultyRating + 1, funRating + 1); // Convert 0-indexed to 1-5 rating
  };

  return (
    <>
      <h2 className={modalStyles.modalTitle}>Rate your experience</h2>
      <p className={modalStyles.modalMessage}>Help us improve {exerciseTitle} by rating it.</p>

      <div className={ratingStyles.ratingSection}>
        <div className={ratingStyles.ratingLabel}>Rate the difficulty</div>

        <div className="relative">
          <div className="relative">
            <div className={ratingStyles.sliderTrack}></div>
            <div className={ratingStyles.sliderOptions}>
              {difficultyLabels.map((label, index) => (
                <button
                  key={index}
                  className={`${ratingStyles.sliderOption} ${difficultyRating === index ? ratingStyles.selected : ""}`}
                  onClick={() => setDifficultyRating(index)}
                  aria-label={`Rate difficulty as ${label}`}
                >
                  <div className={ratingStyles.sliderDot}></div>
                  <span className={ratingStyles.sliderLabel} data-text={label}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={assembleClassNames(ratingStyles.ratingSection, ratingStyles.highlighted)}>
        <div className={ratingStyles.ratingLabel}>Rate the fun factor</div>

        <div className="relative">
          <div className={ratingStyles.emojiRatingLine}></div>
          <div className={ratingStyles.emojiRating}>
            {funEmojis.map((emoji, index) => (
              <button
                key={index}
                className={`${ratingStyles.emojiOption} ${funRating === index ? ratingStyles.selected : ""}`}
                onClick={() => setFunRating(index)}
                aria-label={`Rate fun as ${funLabels[index] || `option ${index + 1}`}`}
              >
                <div className={ratingStyles.emojiCircle}>{emoji}</div>
                <span className={ratingStyles.emojiLabel} data-text={funLabels[index]}>
                  {funLabels[index]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={modalStyles.modalButtons}>
        <button onClick={handleSubmit} className={modalStyles.btnPrimary}>
          Continue
        </button>
      </div>
    </>
  );
}
