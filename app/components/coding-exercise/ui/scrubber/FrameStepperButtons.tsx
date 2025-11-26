import React from "react";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import type { Frame } from "@jiki/interpreters";
import styles from "../../CodingExercise.module.css";

interface FrameStepperButtonsProps {
  enabled: boolean;
}

export default function FrameStepperButtons({ enabled }: FrameStepperButtonsProps) {
  const orchestrator = useOrchestrator();
  const { prevFrame, nextFrame } = useOrchestratorStore(orchestrator);

  return (
    <>
      <button
        disabled={!enabled || !prevFrame}
        onClick={() => handleGoToPreviousFrame(orchestrator, prevFrame)}
        className={styles.navBtn}
        aria-label="Previous frame"
      >
        ‹
      </button>
      <button
        disabled={!enabled || !nextFrame}
        onClick={() => handleGoToNextFrame(orchestrator, nextFrame)}
        className={styles.navBtn}
        aria-label="Next frame"
      >
        ›
      </button>
    </>
  );
}

/* **************** */
/* EVENT HANDLERS */
/* **************** */

function handleGoToPreviousFrame(orchestrator: ReturnType<typeof useOrchestrator>, prevFrame: Frame | undefined) {
  if (prevFrame) {
    orchestrator.setCurrentTestTime(prevFrame.time);
  }
}

function handleGoToNextFrame(orchestrator: ReturnType<typeof useOrchestrator>, nextFrame: Frame | undefined) {
  if (nextFrame) {
    orchestrator.setCurrentTestTime(nextFrame.time);
  }
}
