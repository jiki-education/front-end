import React, { forwardRef } from "react";
import type { Frame } from "@jiki/interpreters";
import type { AnimationTimeline } from "../../lib/AnimationTimeline";
import { useOrchestrator } from "../../lib/OrchestratorContext";

interface ScrubberInputProps {
  frames: Frame[];
  animationTimeline: AnimationTimeline | null;
  time: number | undefined;
  enabled: boolean;
}

const ScrubberInput = forwardRef<HTMLInputElement, ScrubberInputProps>(
  ({ frames, animationTimeline, time, enabled }, ref) => {
    const orchestrator = useOrchestrator();
    return (
      <input
        data-testid="scrubber-range-input"
        disabled={!enabled}
        type="range"
        className="w-full"
        onKeyUp={(event) => handleOnKeyUp(event, animationTimeline)}
        onKeyDown={(event) => handleOnKeyDown(event, animationTimeline, frames)}
        min={calculateMinInputValue(frames)}
        max={calculateMaxInputValue(animationTimeline ?? { duration: 0 })}
        ref={ref}
        onInput={updateInputBackground}
        value={time ?? 0}
        onChange={(event) => {
          handleChange(event, orchestrator);
          updateInputBackground();
        }}
        onMouseUp={() => handleOnMouseUp(orchestrator)}
      />
    );
  }
);

ScrubberInput.displayName = "ScrubberInput";

export default ScrubberInput;

/* **************** */
/* EVENT HANDLERS */
/* **************** */

function handleChange(event: React.ChangeEvent<HTMLInputElement>, orchestrator: ReturnType<typeof useOrchestrator>) {
  const newValue = Number(event.target.value);
  orchestrator.setCurrentTestTime(newValue);
  // updateInputBackground() - commented out
}

function handleOnKeyUp(_event: React.KeyboardEvent<HTMLInputElement>, _animationTimeline: AnimationTimeline | null) {
  // TODO: Implement keyboard shortcuts
}

function handleOnKeyDown(
  _event: React.KeyboardEvent<HTMLInputElement>,
  _animationTimeline: AnimationTimeline | null,
  _frames: Frame[]
) {
  // TODO: Implement keyboard shortcuts
}

// When we're sliding along the scrubber, we can sort of sit in between two
// frames, and that's fine. It allows the user to watch the animation back.
// But when they let go of the mouse we need to lock onto a frame. So this
// does that. It grabs the nearest frame to the current scrub and moves to it.
function handleOnMouseUp(orchestrator: ReturnType<typeof useOrchestrator>) {
  orchestrator.snapToNearestFrame();
}

function updateInputBackground() {
  // TODO: Implement if needed for visual feedback
}

/* **************** */
/* HELPER FUNCTIONS */
/* **************** */

function calculateMinInputValue(frames: Frame[]) {
  return frames.length < 2 ? -1 : 0;
}

function calculateMaxInputValue(animationTimeline: AnimationTimeline | { duration: number }) {
  // The duration is already in microseconds (from frame.time)
  return Math.round(animationTimeline.duration);
}
