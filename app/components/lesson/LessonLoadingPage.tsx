"use client";

import { useTranslations } from "next-intl";
import type { LessonType } from "@/types/lesson";
import styles from "./LessonLoadingPage.module.css";

interface LessonLoadingPageProps {
  title?: string;
  type?: LessonType;
}

export default function LessonLoadingPage({ title, type }: LessonLoadingPageProps) {
  const t = useTranslations("lesson.loadingPage");

  return (
    <div className={styles.page}>
      {/* Main loading container with subtle entrance animation */}
      <div className={styles.container}>
        {/* Background circles for depth - using transform for better performance */}
        <div className={styles.backgroundCircles}>
          <div className={styles.circleBlue} />
          <div className={styles.circlePurple} />
        </div>

        {/* Main content */}
        <div className={styles.card}>
          {/* Icon based on exercise type */}
          <div className={styles.iconRow}>
            <div className={styles.iconWrap}>
              {type === "video" ? (
                <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : type === "choose_language" ? (
                <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              ) : (
                <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              )}

              {/* Simplified spinning ring */}
              <div className={styles.spinnerRing} />
            </div>
          </div>

          {/* Exercise title if provided */}
          {title && <h2 className={styles.title}>{title}</h2>}

          {/* Loading text with simplified animation */}
          <div className={styles.textCenter}>
            <p className={styles.loadingText}>
              {t("loading")}
              <span className={styles.dots}>...</span>
            </p>
            <p className={styles.subtext}>{getLoadingMessage(t, type)}</p>
          </div>

          {/* Simplified progress bar */}
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} />
          </div>

          {/* Quick tips while loading */}
          <div className={styles.tipBox}>
            <p className={styles.tipText}>{getTipMessage(t, type)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

type LoadingPageTranslator = ReturnType<typeof useTranslations<"lesson.loadingPage">>;

function getLoadingMessage(t: LoadingPageTranslator, type?: LessonType): string {
  switch (type) {
    case "video":
      return t("message.video");
    case "choose_language":
      return t("message.chooseLanguage");
    case "exercise":
    case "quiz":
    case undefined:
      return t("message.exercise");
  }
}

function getTipMessage(t: LoadingPageTranslator, type?: LessonType): string {
  switch (type) {
    case "video":
      return t("tip.video");
    case "choose_language":
      return t("tip.chooseLanguage");
    case "exercise":
    case "quiz":
    case undefined:
      return t("tip.exercise");
  }
}
