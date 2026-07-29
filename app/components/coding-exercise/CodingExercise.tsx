"use client";

import type { ExerciseSlug } from "@jiki/curriculum";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import CodingExerciseContent from "./CodingExerciseContent";
import { useExerciseLoader } from "./hooks/useExerciseLoader";
import type { ExerciseContext } from "./lib/types";
import type { LastSubmissionData } from "@/lib/api/types/conversation";
import styles from "./CodingExercise.module.css";
import "./codemirror.css";

interface CodingExerciseProps {
  language: "javascript" | "jikiscript" | "python";
  exerciseSlug: ExerciseSlug;
  context: ExerciseContext;
  levelId?: string;
  isCompleted: boolean;
  serverSubmission?: LastSubmissionData | null;
  onReady: () => void;
}

export default function CodingExercise({
  language,
  exerciseSlug,
  context,
  levelId,
  isCompleted,
  serverSubmission,
  onReady
}: CodingExerciseProps) {
  const t = useTranslations("codingExercise");
  const router = useRouter();
  const continueHref = context.type === "challenge" ? "/challenges" : "/dashboard";
  const { orchestrator, isLoading, loadError } = useExerciseLoader({
    language,
    exerciseSlug,
    context,
    levelId,
    isCompleted,
    serverSubmission,
    onGoToDashboard: () => router.push(continueHref)
  });

  // Fire onReady once loading settles — success OR error — so the parent
  // dismisses the loading modal and the error UI becomes visible.
  useEffect(() => {
    if (!isLoading) {
      onReady();
    }
  }, [isLoading, onReady]);

  // Error state
  if (loadError) {
    return (
      <div className={styles.stateScreen}>
        <div className={styles.errorText}>{t("loadError", { error: loadError })}</div>
      </div>
    );
  }

  // Loading — the parent renders LessonLoadingModal as an overlay until onReady fires
  if (isLoading) {
    return null;
  }

  // At this point, orchestrator is guaranteed to be set
  return <CodingExerciseContent orchestrator={orchestrator!} />;
}
