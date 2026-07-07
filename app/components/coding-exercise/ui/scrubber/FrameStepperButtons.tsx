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
        onClick={() => orchestrator.goToPrevFrame()}
        className={styles.navBtn}
        aria-label="Previous frame"
      >
        ‹
      </button>
      <button
        disabled={!enabled || !nextFrame}
        onClick={() => orchestrator.goToNextFrame()}
        className={styles.navBtn}
        aria-label="Next frame"
      >
        ›
      </button>
    </>
  );
}
