import React, { forwardRef, useRef, useCallback, useEffect } from "react";
import type { Frame } from "@jiki/interpreters";
import type { AnimationTimeline } from "../../lib/AnimationTimeline";
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
    const isDraggingRef = useRef(false);

    const min = calculateMinInputValue(frames);
    const max = calculateMaxInputValue(animationTimeline ?? { duration: 0 });
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

        const newValue = getValueFromMousePosition(event.clientX);
        orchestrator.setCurrentTestTime(newValue);

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
        orchestrator.setCurrentTestTime(newValue);
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
        handleOnKeyDown(event as any, animationTimeline, frames);
      },
      [enabled, animationTimeline, frames]
    );

    const handleKeyUp = useCallback(
      (event: React.KeyboardEvent) => {
        if (!enabled) {
          return;
        }
        handleOnKeyUp(event as any, animationTimeline);
      },
      [enabled, animationTimeline]
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
        className={styles.scrubber}
        data-testid="scrubber-range-input"
        tabIndex={enabled ? 0 : -1}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        aria-disabled={!enabled}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
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

function handleOnKeyUp(_event: React.KeyboardEvent, _animationTimeline: AnimationTimeline | null) {
  // TODO: Implement keyboard shortcuts
}

function handleOnKeyDown(_event: React.KeyboardEvent, _animationTimeline: AnimationTimeline | null, _frames: Frame[]) {
  // TODO: Implement keyboard shortcuts
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
