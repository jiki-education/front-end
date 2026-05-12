"use client";

import type { ExerciseSlug } from "@jiki/curriculum";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CodingExerciseContent from "./CodingExerciseContent";
import { useExerciseLoader } from "./hooks/useExerciseLoader";
import type { ExerciseContext } from "./lib/types";
import "./codemirror.css";

interface CodingExerciseProps {
  language: "javascript" | "jikiscript" | "python";
  exerciseSlug: ExerciseSlug;
  context: ExerciseContext;
  levelId?: string;
  isCompleted: boolean;
  onReady: () => void;
}

export default function CodingExercise({
  language,
  exerciseSlug,
  context,
  levelId,
  isCompleted,
  onReady
}: CodingExerciseProps) {
  const router = useRouter();
  const { orchestrator, isLoading, loadError } = useExerciseLoader({
    language,
    exerciseSlug,
    context,
    levelId,
    isCompleted,
    onGoToDashboard: () => router.push("/dashboard")
  });

  useEffect(() => {
    if (!isLoading && !loadError) {
      onReady();
    }
  }, [isLoading, loadError, onReady]);

  // Error state
  if (loadError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-lg text-red-600">Error loading exercise: {loadError}</div>
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
