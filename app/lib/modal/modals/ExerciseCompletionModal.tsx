"use client";

import type { CompletionResponseData } from "@/components/coding-exercise/lib/types";
import { useExerciseCompletionModal } from "./hooks/useExerciseCompletionModal";

import { SuccessStep } from "./steps/SuccessStep";
import { ConfirmationStep } from "./steps/ConfirmationStep";
import { DifficultyRatingStep } from "./steps/DifficultyRatingStep";
import { CompletedStep } from "./steps/CompletedStep";
import { ConceptUnlockedStep } from "./steps/ConceptUnlockedStep";
import { ProjectUnlockedStep } from "./steps/ProjectUnlockedStep";

interface ExerciseCompletionModalProps {
  onTidyCode?: () => void;
  onCompleteExercise?: () => void;
  onGoToProject?: () => void;
  onGoToDashboard?: () => void;
  exerciseTitle?: string;
  exerciseIcon?: string;
  unlockedProject?: {
    name: string;
    description: string;
    icon: string;
  };
  initialStep?:
    | "success"
    | "confirmation"
    | "difficulty-rating"
    | "completed"
    | "concept-unlocked"
    | "project-unlocked";
  completionResponse?: CompletionResponseData[];
}

export function ExerciseCompletionModal({
  onTidyCode,
  onCompleteExercise,
  onGoToProject,
  onGoToDashboard,
  exerciseTitle = "Navigate the Maze",
  exerciseIcon = "/static/images/project-icons/icon-space-invaders.png",
  unlockedProject = {
    name: "Space Invaders",
    description: "Build a classic arcade game with aliens, lasers, and defensive barriers.",
    icon: "/static/images/project-icons/icon-space-invaders.png"
  },
  initialStep = "success",
  completionResponse = []
}: ExerciseCompletionModalProps) {
  const { step, handlers } = useExerciseCompletionModal({
    onTidyCode,
    onCompleteExercise,
    onGoToProject,
    onGoToDashboard,
    exerciseTitle,
    exerciseIcon,
    unlockedProject,
    initialStep,
    completionResponse
  });

  switch (step) {
    case "concept-unlocked":
      return (
        <ConceptUnlockedStep completionResponse={completionResponse} onContinue={handlers.handleContinueFromConcept} />
      );

    case "project-unlocked":
      return (
        <ProjectUnlockedStep
          completionResponse={completionResponse}
          unlockedProject={unlockedProject}
          onGoToProject={handlers.handleGoToProject}
          onGoToDashboard={handlers.handleGoToDashboard}
        />
      );

    case "difficulty-rating":
      return <DifficultyRatingStep exerciseTitle={exerciseTitle} onRatingsSubmit={handlers.handleRatingsSubmit} />;

    case "completed":
      return (
        <CompletedStep exerciseTitle={exerciseTitle} exerciseIcon={exerciseIcon} onContinue={handlers.handleContinue} />
      );

    case "confirmation":
      return <ConfirmationStep onCancel={handlers.handleCancel} onCompleteExercise={handlers.handleCompleteExercise} />;

    case "success":
    default:
      return <SuccessStep onTidyCode={handlers.handleTidyCode} onShowConfirmation={handlers.handleShowConfirmation} />;
  }
}
