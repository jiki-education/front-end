"use client";

import type { ExerciseSlug } from "@jiki/curriculum";
import LessonLoadingPage from "@/components/lesson/LessonLoadingPage";
import CodingExerciseContent from "./CodingExerciseContent";
import { useExerciseLoader } from "./hooks/useExerciseLoader";
import "./codemirror.css";

interface CodingExerciseProps {
  language: "javascript" | "jikiscript" | "python";
  exerciseSlug: ExerciseSlug;
  projectSlug?: string;
  isProject?: boolean;
}

export default function CodingExercise({
  language,
  exerciseSlug,
  projectSlug,
  isProject = false
}: CodingExerciseProps) {
  const { orchestrator, isLoading, loadError } = useExerciseLoader({
    language,
    exerciseSlug,
    projectSlug,
    isProject
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
    return <LessonLoadingPage type="exercise" />;
  }

  // At this point, orchestrator is guaranteed to be set
  return <CodingExerciseContent orchestrator={orchestrator!} />;
}