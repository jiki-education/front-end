"use client";

import type { ExerciseSlug } from "@jiki/curriculum";
import LessonLoadingModal from "@/components/common/LessonLoadingModal/LessonLoadingModal";
import CodingExerciseContent from "./CodingExerciseContent";
import { useExerciseLoader } from "./hooks/useExerciseLoader";
import type { ExerciseContext } from "./lib/types";
import "./codemirror.css";

interface CodingExerciseProps {
  language: "javascript" | "jikiscript" | "python";
  exerciseSlug: ExerciseSlug;
  context: ExerciseContext;
  levelId?: string;
}

export default function CodingExercise({ language, exerciseSlug, context, levelId }: CodingExerciseProps) {
  const { orchestrator, isLoading, loadError } = useExerciseLoader({
    language,
    exerciseSlug,
    context,
    levelId
  });

  // Error state
  if (loadError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-lg text-red-600">Error loading exercise: {loadError}</div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return <LessonLoadingModal />;
  }

  // At this point, orchestrator is guaranteed to be set
  return <CodingExerciseContent orchestrator={orchestrator!} />;
}
