/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Lottie from "react-lottie-player";
import { hideModal, showModal } from "../store";
import styles from "@/app/styles/components/modals.module.css";
import timelineStyles from "@/app/styles/components/exercise-timeline.module.css";
import projectStyles from "@/app/styles/components/project-card.module.css";
import checkmarkAnimationData from "@/public/static/animations/checkmark.json";

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
  initialStep?: "success" | "confirmation" | "completed" | "project-unlocked";
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
  initialStep = "success"
}: ExerciseCompletionModalProps) {
  const [step, setStep] = useState<"success" | "confirmation" | "completed" | "project-unlocked">(initialStep);

  // Update overlay class when step changes to project-unlocked
  useEffect(() => {
    if (step === "project-unlocked") {
      // Re-show the modal with the special overlay class
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
    unlockedProject
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (unlockedProject) {
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

  if (step === "project-unlocked") {
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
              <img src={unlockedProject.icon} alt={unlockedProject.name} />
            </div>
            <div className={projectStyles.projectCardSimpleName}>{unlockedProject.name}</div>
            <div className={projectStyles.projectCardSimpleDescription}>{unlockedProject.description}</div>
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
