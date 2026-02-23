import { useState, useEffect } from "react";
import { hideModal, showModal } from "../../store";
import styles from "@/app/styles/components/modals.module.css";
import SoundManager from "@/lib/sound/SoundManager";
import type { CompletionResponseData } from "@/components/coding-exercise/lib/types";

export type ModalStep =
  | "success"
  | "confirmation"
  | "difficulty-rating"
  | "completed"
  | "concept-unlocked"
  | "project-unlocked";

interface UseExerciseCompletionModalProps {
  onTidyCode?: () => void;
  onCompleteExercise?: () => void;
  onGoToDashboard?: () => void;
  exerciseTitle: string;
  exerciseSlug: string;
  unlockedProject: {
    name: string;
    description: string;
    slug: string;
  };
  initialStep: ModalStep;
  completionResponse: CompletionResponseData[];
}

export function useExerciseCompletionModal({
  onTidyCode,
  onCompleteExercise,
  onGoToDashboard,
  exerciseTitle,
  exerciseSlug,
  unlockedProject,
  initialStep,
  completionResponse
}: UseExerciseCompletionModalProps) {
  const [step, setStep] = useState<ModalStep>(initialStep);

  // Play success sound when the modal opens on the success step
  useEffect(() => {
    if (step === "success") {
      const soundManager = SoundManager.getInstance();
      soundManager.play("success");
    }
  }, [step]);

  // Update overlay class when step changes to project-unlocked
  useEffect(() => {
    if (step === "project-unlocked") {
      // Re-show the modal with the special overlay class and preserve completionResponse
      showModal(
        "exercise-completion-modal",
        {
          onTidyCode,
          onCompleteExercise,
          onGoToDashboard,
          exerciseTitle,
          exerciseSlug,
          unlockedProject,
          completionResponse,
          initialStep: "project-unlocked"
        },
        styles.projectModalOverlay
      );
    }
  }, [
    step,
    onTidyCode,
    onCompleteExercise,
    onGoToDashboard,
    exerciseTitle,
    exerciseSlug,
    unlockedProject,
    completionResponse
  ]);

  const handleTidyCode = () => {
    onTidyCode?.();
    hideModal();
  };

  const handleShowConfirmation = () => {
    // If this modal was auto-opened after tests passed (initialStep is "success"),
    // skip confirmation and go directly to completion.
    // If manually opened from header (initialStep is "confirmation"),
    // show the confirmation step.
    if (initialStep === "success") {
      handleCompleteExercise();
    } else {
      setStep("confirmation");
    }
  };

  const handleCancel = () => {
    setStep("success");
  };

  const handleCompleteExercise = () => {
    setStep("difficulty-rating");
  };

  const handleRatingsSubmit = (_difficultyRating: number, _funRating: number) => {
    // TODO: Send both ratings to API when endpoint is ready
    setStep("completed");
    onCompleteExercise?.();
  };

  const handleContinue = () => {
    // Check if we have unlocked concepts to show first
    const unlockedConcept = completionResponse.find((item) => item.type === "concept_unlocked")?.data.concept;
    const unlockedProjectData = completionResponse.find((item) => item.type === "project_unlocked")?.data.project;

    if (unlockedConcept) {
      setStep("concept-unlocked");
    } else if (unlockedProjectData) {
      setStep("project-unlocked");
    } else {
      hideModal();
    }
  };

  const handleContinueFromConcept = () => {
    // After showing concept, check if we have unlocked projects
    const unlockedProjectData = completionResponse.find((item) => item.type === "project_unlocked")?.data.project;

    if (unlockedProjectData) {
      setStep("project-unlocked");
    } else {
      hideModal();
    }
  };

  const handleGoToDashboard = () => {
    onGoToDashboard?.();
    hideModal();
  };

  return {
    step,
    handlers: {
      handleTidyCode,
      handleShowConfirmation,
      handleCancel,
      handleCompleteExercise,
      handleRatingsSubmit,
      handleContinue,
      handleContinueFromConcept,
      handleGoToDashboard
    }
  };
}
