import { useState, useEffect, useRef } from "react";
import { hideModal, showModal } from "../../store";
import styles from "@/app/styles/components/modals.module.css";
import SoundManager from "@/lib/sound/SoundManager";
import { launchConfetti, cleanupCanvas } from "@/lib/confetti";
import { rateLesson } from "@/lib/api/lessons";
import type { CompletionResponseData } from "@/components/coding-exercise/lib/types";

export type ModalStep =
  | "success"
  | "difficulty-rating"
  | "completed"
  | "concept-unlocked"
  | "challenge-unlocked"
  | "ask-jiki-upsell";

// The steps that follow rating, in order. Each one except "completed" only
// appears when the completion response carries its event.
const STEPS_AFTER_RATING: ModalStep[] = ["concept-unlocked", "challenge-unlocked", "ask-jiki-upsell", "completed"];

interface UseExerciseCompletionModalProps {
  onTidyCode?: () => void;
  onSolveBonuses?: () => void;
  outstandingBonusCount: number;
  onCompleteExercise?: () => Promise<CompletionResponseData[]>;
  onGoToDashboard?: () => void;
  exerciseTitle: string;
  exerciseSlug: string;
  isChallenge: boolean;
  unlockedChallenge: {
    slug: string;
  };
  initialStep: ModalStep;
  completionResponse: CompletionResponseData[];
}

export function useExerciseCompletionModal({
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

  // Shows this modal again on the given step, e.g. after checkout replaced it
  const reshow = (atStep: ModalStep) => {
    showModal("exercise-completion-modal", {
      onTidyCode,
      onSolveBonuses,
      outstandingBonusCount,
      onCompleteExercise,
      onGoToDashboard,
      exerciseTitle,
      exerciseSlug,
      isChallenge,
      unlockedChallenge,
      completionResponse: completionResponseRef.current,
      initialStep: atStep
    });
  };

  // Update overlay class when step changes to challenge-unlocked
  useEffect(() => {
    if (step === "challenge-unlocked") {
      showModal(
        "exercise-completion-modal",
        {
          onTidyCode,
          onSolveBonuses,
          outstandingBonusCount,
          onCompleteExercise,
          onGoToDashboard,
          exerciseTitle,
          exerciseSlug,
          isChallenge,
          unlockedChallenge,
          completionResponse,
          initialStep: "challenge-unlocked"
        },
        styles.challengeModalOverlay
      );
    }
  }, [
    step,
    onTidyCode,
    onSolveBonuses,
    outstandingBonusCount,
    onCompleteExercise,
    onGoToDashboard,
    exerciseTitle,
    exerciseSlug,
    isChallenge,
    unlockedChallenge,
    completionResponse
  ]);

  const handleTidyCode = () => {
    onTidyCode?.();
    hideModal();
  };

  const handleSolveBonuses = () => {
    onSolveBonuses?.();
    hideModal();
  };

  const advanceAfterCompletion = async () => {
    // Wait for the completion API call to finish before reading the response,
    // in case the user advances before onCompleteExercise has resolved.
    const events = completionPromiseRef.current ? await completionPromiseRef.current : completionResponseRef.current;
    setStep(nextStepAfter("difficulty-rating", events));
  };

  const handleCompleteExercise = async () => {
    const promise = Promise.resolve(onCompleteExercise?.()).then((result) => result ?? []);
    completionPromiseRef.current = promise;

    if (isChallenge) {
      const events = await promise;
      completionResponseRef.current = events;
      setCompletionResponse(events);
      await advanceAfterCompletion();
      return;
    }

    setStep("difficulty-rating");
    const events = await promise;
    completionResponseRef.current = events;
    setCompletionResponse(events);
  };

  const handleRatingsSubmit = async (difficultyRating: number, funRating: number) => {
    // Best-effort rating; the API client reports genuine /internal failures centrally.
    rateLesson(exerciseSlug, difficultyRating, funRating).catch(() => {});
    await advanceAfterCompletion();
  };

  const handleContinueFromConcept = () => {
    setStep(nextStepAfter("concept-unlocked", completionResponseRef.current));
  };

  const handleContinueFromChallenge = () => {
    setStep(nextStepAfter("challenge-unlocked", completionResponseRef.current));
  };

  const handleContinueFromUpsell = () => {
    setStep("completed");
  };

  // Checkout replaces this modal, so dismissing checkout brings it back on the step the student left
  const handleCheckoutCancel = () => {
    reshow(step);
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
      handleSolveBonuses,
      handleCompleteExercise,
      handleRatingsSubmit,
      handleContinueFromConcept,
      handleContinueFromChallenge,
      handleContinueFromUpsell,
      handleCheckoutCancel,
      handleContinue
    }
  };
}

// Picks the first step after `current` whose event is in the completion
// response, falling back to "completed". From a step before them all (such as
// "difficulty-rating"), every step after rating is a candidate.
export function nextStepAfter(current: ModalStep, events: CompletionResponseData[]): ModalStep {
  const remaining = STEPS_AFTER_RATING.slice(STEPS_AFTER_RATING.indexOf(current) + 1);
  return remaining.find((step) => stepApplies(step, events)) ?? "completed";
}

function stepApplies(step: ModalStep, events: CompletionResponseData[]): boolean {
  switch (step) {
    case "concept-unlocked": {
      const conceptEvent = events.find((item) => item.type === "concept_unlocked");
      return Boolean(conceptEvent?.data.concept_slug ?? conceptEvent?.data.concept);
    }
    case "challenge-unlocked":
      return Boolean(events.find((item) => item.type === "challenge_unlocked")?.data.challenge);
    case "ask-jiki-upsell":
      return events.some((item) => item.type === "ask_jiki_upsell");
    case "completed":
    case "success":
    case "difficulty-rating":
      return true;
  }
}
