import React from "react";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import type { Frame } from "@jiki/interpreters";

interface FrameStepperButtonsProps {
  enabled: boolean;
}

export default function FrameStepperButtons({ enabled }: FrameStepperButtonsProps) {
  const orchestrator = useOrchestrator();
  const { prevFrame, nextFrame } = useOrchestratorStore(orchestrator);

  return (
    <div data-testid="frame-stepper-buttons" className="frame-stepper-buttons flex gap-1">
      <button
        disabled={!enabled || !prevFrame}
        onClick={() => handleGoToPreviousFrame(orchestrator, prevFrame)}
        className="p-1 border rounded disabled:opacity-50"
        aria-label="Previous frame"
      >
        ←
      </button>
      <button
        disabled={!enabled || !nextFrame}
        onClick={() => handleGoToNextFrame(orchestrator, nextFrame)}
        className="p-1 border rounded disabled:opacity-50"
        aria-label="Next frame"
      >
        →
      </button>
    </div>
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
