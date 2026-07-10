"use client";

import type { CompletionResponseData } from "@/components/coding-exercise/lib/types";
import { useExerciseCompletionModal } from "./hooks/useExerciseCompletionModal";

import { SuccessStep } from "./steps/SuccessStep";
import { DifficultyRatingStep } from "./steps/DifficultyRatingStep";
import { CompletedStep } from "./steps/CompletedStep";
import { ConceptUnlockedStep } from "./steps/ConceptUnlockedStep";
import { ProjectUnlockedStep } from "./steps/ProjectUnlockedStep";

interface ExerciseCompletionModalProps {
  onTidyCode?: () => void;
  onSolveBonuses?: () => void;
  outstandingBonusCount?: number;
  onCompleteExercise?: () => Promise<CompletionResponseData[]>;
  onGoToDashboard?: () => void;
  exerciseTitle?: string;
  exerciseSlug?: string;
  isProject?: boolean;
  unlockedProject?: {
    name: string;
    description: string;
    slug: string;
  };
  initialStep?: "success" | "difficulty-rating" | "completed" | "concept-unlocked" | "project-unlocked";
  completionResponse?: CompletionResponseData[];
}

export function ExerciseCompletionModal({
  onTidyCode,
  onSolveBonuses,
  outstandingBonusCount = 0,
  onCompleteExercise,
  onGoToDashboard,
  exerciseTitle = "Navigate the Maze",
  exerciseSlug = "maze-instructions",
  isProject = false,
  unlockedProject = {
    name: "Space Invaders",
    description: "Build a classic arcade game with aliens, lasers, and defensive barriers.",
    slug: "space-invaders"
  },
  initialStep = "success",
  completionResponse = []
}: ExerciseCompletionModalProps) {
  const {
    step,
    completionResponse: liveCompletionResponse,
    handlers
  } = useExerciseCompletionModal({
    onTidyCode,
    onSolveBonuses,
    outstandingBonusCount,
    onCompleteExercise,
    onGoToDashboard,
    exerciseTitle,
    exerciseSlug,
    isProject,
    unlockedProject,
    initialStep,
    completionResponse
  });

  switch (step) {
    case "concept-unlocked":
      return (
        <ConceptUnlockedStep
          completionResponse={liveCompletionResponse}
          onContinue={handlers.handleContinueFromConcept}
        />
      );

    case "project-unlocked":
      return (
        <ProjectUnlockedStep
          completionResponse={liveCompletionResponse}
          unlockedProject={unlockedProject}
          onContinue={handlers.handleContinueFromProject}
        />
      );

    case "difficulty-rating":
      return <DifficultyRatingStep exerciseTitle={exerciseTitle} onRatingsSubmit={handlers.handleRatingsSubmit} />;

    case "completed":
      return (
        <CompletedStep
          exerciseTitle={exerciseTitle}
          exerciseSlug={exerciseSlug}
          isProject={isProject}
          outstandingBonusCount={outstandingBonusCount}
          onContinue={handlers.handleContinue}
          onTidyCode={handlers.handleTidyCode}
          onSolveBonuses={handlers.handleSolveBonuses}
        />
      );

    case "success":
    default:
      return (
        <SuccessStep
          onCompleteExercise={handlers.handleCompleteExercise}
          isProject={isProject}
          outstandingBonusCount={outstandingBonusCount}
        />
      );
  }
}
