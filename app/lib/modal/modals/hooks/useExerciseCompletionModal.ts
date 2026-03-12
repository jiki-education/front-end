import { useState, useEffect, useRef } from "react";
import { hideModal, showModal } from "../../store";
import styles from "@/app/styles/components/modals.module.css";
import SoundManager from "@/lib/sound/SoundManager";
import { launchConfetti, cleanupCanvas } from "@/lib/confetti";
import { rateLesson } from "@/lib/api/lessons";
import type { CompletionResponseData } from "@/components/coding-exercise/lib/types";

export type ModalStep = "success" | "difficulty-rating" | "completed" | "concept-unlocked" | "project-unlocked";

interface UseExerciseCompletionModalProps {
  onTidyCode?: () => void;
  onCompleteExercise?: () => Promise<CompletionResponseData[]>;
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
  completionResponse: initialCompletionResponse
}: UseExerciseCompletionModalProps) {
  const [step, setStep] = useState<ModalStep>(initialStep);
  const [completionResponse, setCompletionResponse] = useState<CompletionResponseData[]>(initialCompletionResponse);
  const completionResponseRef = useRef<CompletionResponseData[]>(initialCompletionResponse);
  const completionPromiseRef = useRef<Promise<CompletionResponseData[]> | null>(null);

  // Play success sound and launch confetti when the modal opens on the success step
  useEffect(() => {
    if (step === "success") {
      const soundManager = SoundManager.getInstance();
      soundManager.play("success");
      launchConfetti();
    }
    return () => {
      cleanupCanvas();
    };
  }, [step]);

  // Update overlay class when step changes to project-unlocked
  useEffect(() => {
    if (step === "project-unlocked") {
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

  const handleCompleteExercise = async () => {
    setStep("difficulty-rating");
    const promise = Promise.resolve(onCompleteExercise?.()).then((result) => result ?? []);
    completionPromiseRef.current = promise;
    const events = await promise;
    completionResponseRef.current = events;
    setCompletionResponse(events);
  };

  const handleRatingsSubmit = async (difficultyRating: number, funRating: number) => {
    rateLesson(exerciseSlug, difficultyRating, funRating).catch(console.error);

    // Wait for the completion API call to finish before reading the response,
    // in case the user submits ratings before onCompleteExercise has resolved.
    const events = completionPromiseRef.current ? await completionPromiseRef.current : completionResponseRef.current;

    const conceptEvent = events.find((item) => item.type === "concept_unlocked");
    const unlockedConcept = conceptEvent?.data.concept_slug ?? conceptEvent?.data.concept;
    const unlockedProjectData = events.find((item) => item.type === "project_unlocked")?.data.project;

    if (unlockedConcept) {
      setStep("concept-unlocked");
    } else if (unlockedProjectData) {
      setStep("project-unlocked");
    } else {
      setStep("completed");
    }
  };

  const handleContinueFromConcept = () => {
    const unlockedProjectData = completionResponseRef.current.find((item) => item.type === "project_unlocked")?.data
      .project;

    if (unlockedProjectData) {
      setStep("project-unlocked");
    } else {
      setStep("completed");
    }
  };

  const handleContinueFromProject = () => {
    setStep("completed");
  };

  const handleContinue = () => {
    onGoToDashboard?.();
    hideModal();
  };

  return {
    step,
    completionResponse,
    handlers: {
      handleTidyCode,
      handleCompleteExercise,
      handleRatingsSubmit,
      handleContinueFromConcept,
      handleContinueFromProject,
      handleContinue
    }
  };
}
