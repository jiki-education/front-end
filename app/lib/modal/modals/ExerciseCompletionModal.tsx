/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Lottie from "react-lottie-player";
import { hideModal, showModal } from "../store";
import styles from "@/app/styles/components/modals.module.css";
import timelineStyles from "@/app/styles/components/exercise-timeline.module.css";
import projectStyles from "@/app/styles/components/project-card.module.css";
import checkmarkAnimationData from "@/public/static/animations/checkmark.json";
import SoundManager from "@/lib/sound/SoundManager";
import type { CompletionResponseData } from "@/components/coding-exercise/lib/types";

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
  initialStep?: "success" | "confirmation" | "completed" | "concept-unlocked" | "project-unlocked";
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
  const [step, setStep] = useState<"success" | "confirmation" | "completed" | "concept-unlocked" | "project-unlocked">(
    initialStep
  );

  // completionResponse is now passed as a prop instead of reading from orchestrator context

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
          onGoToProject,
          onGoToDashboard,
          exerciseTitle,
          exerciseIcon,
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
    onGoToProject,
    onGoToDashboard,
    exerciseTitle,
    exerciseIcon,
    unlockedProject,
    completionResponse
  ]);

  const handleTidyCode = () => {
    onTidyCode?.();
    hideModal();
  };

  const handleShowConfirmation = () => {
    setStep("confirmation");
  };

  const handleCancel = () => {
    setStep("success");
  };

  const handleCompleteExercise = () => {
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

  const handleGoToProject = () => {
    onGoToProject?.();
    hideModal();
  };

  const handleGoToDashboard = () => {
    onGoToDashboard?.();
    hideModal();
  };

  if (step === "concept-unlocked") {
    const unlockedConcept = completionResponse.find((item) => item.type === "concept_unlocked")?.data.concept;

    if (!unlockedConcept) {
      // Fallback if no concept data
      return (
        <>
          <h2 className={styles.modalTitle}>Concept unlocked!</h2>
          <p className={styles.modalMessage}>You&apos;ve unlocked a new concept to explore.</p>
          <div className={styles.modalButtonsDivider}></div>
          <div className={styles.modalButtons}>
            <button onClick={handleContinueFromConcept} className={styles.btnPrimary}>
              Continue
            </button>
          </div>
        </>
      );
    }

    return (
      <>
        <h2 className={styles.modalTitle}>Concept unlocked!</h2>
        <p className={styles.modalMessage}>
          You&apos;ve unlocked a new concept: <strong>{unlockedConcept.title}</strong>
        </p>
        <div className={styles.conceptUnlockedCard}>
          <h3 className={styles.conceptTitle}>{unlockedConcept.title}</h3>
          <p className={styles.conceptDescription}>{unlockedConcept.description}</p>
        </div>
        <div className={styles.modalButtonsDivider}></div>
        <div className={styles.modalButtons}>
          <button onClick={handleContinueFromConcept} className={styles.btnPrimary}>
            Continue
          </button>
        </div>
      </>
    );
  }

  if (step === "project-unlocked") {
    const unlockedProjectData = completionResponse.find((item) => item.type === "project_unlocked")?.data.project;

    // Fallback to hardcoded data if no project data in response
    const projectToShow = unlockedProjectData
      ? {
          name: unlockedProjectData.title,
          description: unlockedProjectData.description,
          icon: `/static/images/project-icons/icon-${unlockedProjectData.slug}.png` // TODO: Get actual icon from project data
        }
      : unlockedProject;

    return (
      <>
        <h2 className={styles.modalTitle}>Project unlocked!</h2>
        <p className={styles.modalMessage}>All that practice means you&apos;re ready for a new project.</p>
        <div className={projectStyles.projectCardSimple}>
          <div className={projectStyles.projectCardSimpleBackground}></div>
          <div className={projectStyles.projectCardSimpleBack}></div>
          <div className={projectStyles.projectCardSimpleFront}>
            <div className={projectStyles.projectCardSimpleNewLabel}>New</div>
            <div className={projectStyles.projectCardSimpleIcon}>
              <img src={projectToShow.icon} alt={projectToShow.name} />
            </div>
            <div className={projectStyles.projectCardSimpleName}>{projectToShow.name}</div>
            <div className={projectStyles.projectCardSimpleDescription}>{projectToShow.description}</div>
          </div>
        </div>
        <div className={styles.modalButtonsDivider}></div>
        <div className={styles.modalButtons}>
          <button onClick={handleGoToProject} className={styles.btnSecondary}>
            Go to Project
          </button>
          <button onClick={handleGoToDashboard} className={styles.btnPrimary}>
            Go to Dashboard
          </button>
        </div>
      </>
    );
  }

  if (step === "completed") {
    return (
      <>
        <div className={timelineStyles.exerciseTimeline}>
          <div className={`${timelineStyles.timelineLine} ${timelineStyles.timelineLineGreen}`}></div>
          <div className={`${timelineStyles.timelineBox} ${timelineStyles.timelineBoxGreen}`}></div>
          <div className={`${timelineStyles.timelineLine} ${timelineStyles.timelineLineAnimate}`}></div>
          <div className={timelineStyles.exerciseIconBox}>
            <img src={exerciseIcon} alt="Exercise icon" />
            <div className={timelineStyles.exerciseIconGreenOverlay}></div>
          </div>
          <div
            className={`${timelineStyles.timelineLine} ${timelineStyles.timelineLineDashed} ${timelineStyles.timelineLineAnimateHalf}`}
          ></div>
          <div className={`${timelineStyles.timelineBox} ${timelineStyles.timelineBoxGrey}`}></div>
          <div className={`${timelineStyles.timelineLine} ${timelineStyles.timelineLineDashed}`}></div>
        </div>
        <h2 className={styles.modalTitle}>Exercise completed!</h2>
        <p className={styles.modalMessage}>
          Great work completing {exerciseTitle}! Ready to continue to the next exercise?
        </p>
        <div className={styles.modalButtonsDivider}></div>
        <div className={styles.modalButtons}>
          <button onClick={handleContinue} className={styles.btnPrimary}>
            Continue
          </button>
        </div>
      </>
    );
  }

  if (step === "confirmation") {
    return (
      <>
        <h2 className={styles.modalTitle}>Are you sure?</h2>
        <p className={styles.modalMessage}>
          Are you sure you want to mark this exercise as complete? You can always come back and improve your solution
          later.
        </p>
        <div className={styles.modalButtonsDivider}></div>
        <div className={styles.modalButtons}>
          <button onClick={handleCancel} className={styles.btnSecondary}>
            Cancel
          </button>
          <button onClick={handleCompleteExercise} className={styles.btnPrimary}>
            Yes, Complete
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.modalCheckmark}>
        <Lottie animationData={checkmarkAnimationData} play loop={false} style={{ height: 144, width: 144 }} />
      </div>
      <h2 className={styles.modalTitle}>All tests passed!</h2>
      <p className={styles.modalMessage}>
        Great work! You&apos;re ready to complete this exercise and move on to the next challenge.
      </p>
      <div className={styles.modalButtonsDivider}></div>
      <div className={styles.modalButtons}>
        <button onClick={handleTidyCode} className={styles.btnSecondary}>
          Tidy code first
        </button>
        <button onClick={handleShowConfirmation} className={styles.btnPrimary}>
          Complete Exercise
        </button>
      </div>
    </>
  );
}
