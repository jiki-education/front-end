"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import modalStyles from "@/app/styles/components/modals.module.css";
import ratingStyles from "./DifficultyRatingStep.module.css";
import { assembleClassNames } from "@/lib/assemble-classnames";

interface DifficultyRatingStepProps {
  exerciseTitle: string;
  onRatingsSubmit: (difficultyRating: number, funRating: number) => void;
}

export function DifficultyRatingStep({ exerciseTitle, onRatingsSubmit }: DifficultyRatingStepProps) {
  const t = useTranslations("modals.exerciseCompletion.difficultyRating");
  const [difficultyRating, setDifficultyRating] = useState<number | null>(null);
  const [funRating, setFunRating] = useState<number | null>(null);
  const difficultyLabels = [
    t("difficultyTooEasy"),
    t("difficultyEasy"),
    t("difficultyJustRight"),
    t("difficultyHard"),
    t("difficultyTooHard")
  ];
  const funEmojis = ["😫", "😐", "🙂", "😊", "😄"];
  const funLabels = [t("funFrustrating"), "", t("funPrettyGood"), "", t("funAmazing")];

  const canSubmit = difficultyRating !== null && funRating !== null;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }
    onRatingsSubmit(difficultyRating + 1, funRating + 1); // Convert 0-indexed to 1-5 rating
  };

  return (
    <>
      <h2 className={modalStyles.modalTitle}>{t("title")}</h2>
      <p className={modalStyles.modalMessage}>{t("message", { title: exerciseTitle })}</p>

      <div className={ratingStyles.ratingSection}>
        <div className={ratingStyles.ratingLabel}>{t("rateDifficulty")}</div>

        <div className="relative">
          <div className="relative">
            <div className={ratingStyles.sliderTrack}></div>
            <div className={ratingStyles.sliderOptions}>
              {difficultyLabels.map((label, index) => (
                <button
                  key={index}
                  className={`${ratingStyles.sliderOption} ${difficultyRating === index ? ratingStyles.selected : ""}`}
                  onClick={() => setDifficultyRating(index)}
                  aria-label={t("rateDifficultyAriaLabel", { label })}
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
        <div className={ratingStyles.ratingLabel}>{t("rateFun")}</div>

        <div className="relative">
          <div className={ratingStyles.emojiRatingLine}></div>
          <div className={ratingStyles.emojiRating}>
            {funEmojis.map((emoji, index) => (
              <button
                key={index}
                className={`${ratingStyles.emojiOption} ${funRating === index ? ratingStyles.selected : ""}`}
                onClick={() => setFunRating(index)}
                aria-label={t("rateFunAriaLabel", {
                  label: funLabels[index] || t("funOptionFallback", { number: index + 1 })
                })}
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
        <button onClick={handleSubmit} disabled={!canSubmit} className="ui-btn ui-btn-primary ui-btn-large flex-1">
          {t("continue")}
        </button>
      </div>
    </>
  );
}
