"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import CodingExerciseContent from "./CodingExerciseContent";
import { useExerciseLoader } from "./hooks/useExerciseLoader";
import type { ExerciseContext } from "./lib/types";
import type { LastSubmissionData } from "@/lib/api/types/conversation";
import { showExerciseIntroVideo } from "@/lib/modal/app";
import { hasSeenIntroVideo, markIntroVideoSeen } from "@/lib/exercises/introVideoSeen";
import styles from "./CodingExercise.module.css";
import "./codemirror.css";

interface CodingExerciseProps {
  language: "javascript" | "jikiscript" | "python";
  context: ExerciseContext;
  levelId?: string;
  isCompleted: boolean;
  serverSubmission?: LastSubmissionData | null;
  onReady: () => void;
}

export default function CodingExercise({
  language,
  context,
  levelId,
  isCompleted,
  serverSubmission,
  onReady
}: CodingExerciseProps) {
  const t = useTranslations("codingExercise");
  const router = useRouter();
  const continueHref = context.type === "challenge" ? "/challenges" : "/dashboard";
  const { orchestrator, isLoading, loadError, awaitingCodeChoice } = useExerciseLoader({
    language,
    exerciseSlug: context.slug,
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

  // An exercise's intro video plays once, the first time it is opened. It waits
  // for the load to settle so it doesn't stack on top of the loading modal, and
  // the seen flag is written as it opens so a reload can't replay it.
  const introVideo = context.type === "lesson" ? context.introVideo : undefined;
  useEffect(() => {
    if (isLoading || awaitingCodeChoice || loadError || !introVideo || hasSeenIntroVideo(context.slug)) {
      return;
    }
    markIntroVideoSeen(context.slug);
    showExerciseIntroVideo({ video: introVideo });
  }, [isLoading, awaitingCodeChoice, loadError, introVideo, context.slug]);

  // Error state
  if (loadError) {
    return (
      <div className={styles.stateScreen}>
        <div className={styles.errorText}>{t("loadError", { error: loadError })}</div>
      </div>
    );
  }

  // Loading — the parent renders LessonLoadingModal as an overlay until onReady
  // fires. While the student picks between code versions, the choice modal is
  // the whole UI and the orchestrator doesn't exist yet.
  if (isLoading || awaitingCodeChoice) {
    return null;
  }

  // At this point, orchestrator is guaranteed to be set
  return <CodingExerciseContent orchestrator={orchestrator!} />;
}
