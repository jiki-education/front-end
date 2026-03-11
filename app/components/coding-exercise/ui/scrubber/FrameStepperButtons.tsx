import React from "react";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
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
        onClick={() => handleGoToPreviousFrame(orchestrator)}
        className={styles.navBtn}
        aria-label="Previous frame"
      >
        ‹
      </button>
      <button
        disabled={!enabled || !nextFrame}
        onClick={() => handleGoToNextFrame(orchestrator)}
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

function handleGoToPreviousFrame(orchestrator: ReturnType<typeof useOrchestrator>) {
  orchestrator.pause();
  const prevFrame = orchestrator.getStore().getState().prevFrame;
  if (prevFrame) {
    orchestrator.setCurrentTestTime(prevFrame.time);
  }
}

function handleGoToNextFrame(orchestrator: ReturnType<typeof useOrchestrator>) {
  orchestrator.pause();
  const nextFrame = orchestrator.getStore().getState().nextFrame;
  if (nextFrame) {
    orchestrator.setCurrentTestTime(nextFrame.time);
  }
}
