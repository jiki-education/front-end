import React from "react";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import styles from "../../CodingExercise.module.css";

interface BreakpointStepperButtonsProps {
  enabled: boolean;
}

export default function BreakpointStepperButtons({ enabled }: BreakpointStepperButtonsProps) {
  const orchestrator = useOrchestrator();
  const { currentTest, breakpoints, prevBreakpointFrame, nextBreakpointFrame } = useOrchestratorStore(orchestrator);

  return (
    <>
      {currentTest && breakpoints.length > 0 && (
        <>
          <button
            disabled={!enabled || !prevBreakpointFrame}
            onClick={() => orchestrator.goToPrevBreakpoint()}
            className={styles.codeNavBtn}
            aria-label="Previous breakpoint"
          >
            ‹
          </button>
          <button
            disabled={!enabled || !nextBreakpointFrame}
            onClick={() => orchestrator.goToNextBreakpoint()}
            className={styles.codeNavBtn}
            aria-label="Next breakpoint"
          >
            ›
          </button>
        </>
      )}
    </>
  );
}
