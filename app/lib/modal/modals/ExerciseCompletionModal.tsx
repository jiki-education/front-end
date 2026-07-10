"use client";

import type { CompletionResponseData } from "@/components/coding-exercise/lib/types";
import { useExerciseCompletionModal } from "./hooks/useExerciseCompletionModal";

import { SuccessStep } from "./steps/SuccessStep";
import { DifficultyRatingStep } from "./steps/DifficultyRatingStep";
import { CompletedStep } from "./steps/CompletedStep";
import { ConceptUnlockedStep } from "./steps/ConceptUnlockedStep";
import { ChallengeUnlockedStep } from "./steps/ChallengeUnlockedStep";

interface ExerciseCompletionModalProps {
  onTidyCode?: () => void;
  onSolveBonuses?: () => void;
  outstandingBonusCount?: number;
  onCompleteExercise?: () => Promise<CompletionResponseData[]>;
  onGoToDashboard?: () => void;
  exerciseTitle?: string;
  exerciseSlug?: string;
  isChallenge?: boolean;
  unlockedChallenge?: {
    name: string;
    description: string;
    slug: string;
  };
  initialStep?: "success" | "difficulty-rating" | "completed" | "concept-unlocked" | "challenge-unlocked";
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
  isChallenge = false,
  unlockedChallenge = {
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
    isChallenge,
    unlockedChallenge,
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

    case "challenge-unlocked":
      return (
        <ChallengeUnlockedStep
          completionResponse={liveCompletionResponse}
          unlockedChallenge={unlockedChallenge}
          onContinue={handlers.handleContinueFromChallenge}
        />
      );

    case "difficulty-rating":
      return <DifficultyRatingStep exerciseTitle={exerciseTitle} onRatingsSubmit={handlers.handleRatingsSubmit} />;

    case "completed":
      return (
        <CompletedStep
          exerciseTitle={exerciseTitle}
          exerciseSlug={exerciseSlug}
          isChallenge={isChallenge}
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
          isChallenge={isChallenge}
          outstandingBonusCount={outstandingBonusCount}
        />
      );
  }
}
