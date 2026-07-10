import React, { forwardRef, useRef, useCallback, useEffect } from "react";
import type { Frame } from "@jiki/interpreters/shared";
import type { AnimationTimeline } from "../../lib/AnimationTimeline";
import type { Orchestrator } from "../../lib/Orchestrator";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import styles from "../../CodingExercise.module.css";

interface ScrubberInputProps {
  frames: Frame[];
  animationTimeline: AnimationTimeline | null;
  time: number | undefined;
  enabled: boolean;
}

const ScrubberInput = forwardRef<HTMLDivElement, ScrubberInputProps>(
  ({ frames, animationTimeline, time, enabled }, ref) => {
    const orchestrator = useOrchestrator();
    const { isPlaying } = useOrchestratorStore(orchestrator);
    const isDraggingRef = useRef(false);

    const min = calculateMinInputValue(frames);
    // IO tests have no animationTimeline, so fall back to the last frame's time
    // (matching the timeline duration for visual tests, which is floored to the last frame).
    const max = animationTimeline
      ? calculateMaxInputValue(animationTimeline)
      : Math.round(frames[frames.length - 1]?.time ?? 0);
    const currentValue = time ?? 0;

    // Calculate progress percentage
    const progress = max > min ? ((currentValue - min) / (max - min)) * 100 : 0;

    const getValueFromMousePosition = useCallback(
      (clientX: number) => {
        if (!ref || typeof ref === "function" || !ref.current) {
          return currentValue;
        }

        const rect = ref.current.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return Math.round(min + (max - min) * percentage);
      },
      [min, max, currentValue, ref]
    );

    const handleMouseDown = useCallback(
      (event: React.MouseEvent) => {
        if (!enabled) {
          return;
        }

        event.preventDefault();
        isDraggingRef.current = true;

        orchestrator.pause();
        const newValue = getValueFromMousePosition(event.clientX);
        orchestrator.setCurrentTestTime(newValue, "nearest");
        // Match the stepper buttons and keyboard scrubbing (moveToFrame), which
        // surface the information widget. Shown once here; it stays visible and
        // its content tracks the highlighted line as the drag continues.
        orchestrator.showInformationWidget();

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [enabled, getValueFromMousePosition, orchestrator]
    );

    const handleMouseMove = useCallback(
      (event: MouseEvent) => {
        if (!isDraggingRef.current) {
          return;
        }

        const newValue = getValueFromMousePosition(event.clientX);
        orchestrator.setCurrentTestTime(newValue, "nearest");
      },
      [getValueFromMousePosition, orchestrator]
    );

    const handleMouseUp = useCallback(() => {
      isDraggingRef.current = false;
      orchestrator.snapToNearestFrame();

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orchestrator]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (!enabled) {
          return;
        }
        handleOnKeyDown(event, orchestrator, isPlaying);
      },
      [enabled, orchestrator, isPlaying]
    );

    // Cleanup event listeners on unmount
    useEffect(() => {
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        ref={ref}
        className={`${styles.scrubber} ${!enabled ? styles.disabled : ""}`}
        data-testid="scrubber-range-input"
        tabIndex={enabled ? 0 : -1}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        aria-disabled={!enabled}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.scrubberProgress} style={{ width: `${progress}%` }} />
      </div>
    );
  }
);

ScrubberInput.displayName = "ScrubberInput";

export default ScrubberInput;

/* **************** */
/* EVENT HANDLERS */
/* **************** */

function handleOnKeyDown(event: React.KeyboardEvent, orchestrator: Orchestrator, isPlaying: boolean) {
  switch (event.key) {
    case "ArrowLeft":
      // Preventing default stops the range input from also nudging itself,
      // which would fight the frame we're snapping to.
      event.preventDefault();
      // Holding Shift steps between breakpoints instead of individual frames.
      if (event.shiftKey) {
        orchestrator.goToPrevBreakpoint();
      } else {
        orchestrator.goToPrevFrame();
      }
      break;

    case "ArrowRight":
      event.preventDefault();
      if (event.shiftKey) {
        orchestrator.goToNextBreakpoint();
      } else {
        orchestrator.goToNextFrame();
      }
      break;

    case "ArrowDown":
      event.preventDefault();
      orchestrator.goToFirstFrame();
      break;

    case "ArrowUp":
      event.preventDefault();
      orchestrator.goToLastFrame();
      break;

    case " ":
      event.preventDefault();
      if (isPlaying) {
        orchestrator.pause();
      } else {
        orchestrator.play();
      }
      break;

    default:
      break;
  }
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
