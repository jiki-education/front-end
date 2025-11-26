import { useRef } from "react";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import Tooltip from "@/components/ui/Tooltip";
import BreakpointStepperButtons from "./BreakpointStepperButtons";
import FrameStepperButtons from "./FrameStepperButtons";
import InformationWidgetToggleButton from "./InformationWidgetToggleButton";
import PlayPauseButton from "./PlayPauseButton";
import ScrubberInput from "./ScrubberInput";
import styles from "../../CodingExercise.module.css";

export default function Scrubber() {
  const orchestrator = useOrchestrator();
  const { currentTest, currentTestTime, hasCodeBeenEdited, isSpotlightActive } = useOrchestratorStore(orchestrator);
  const rangeRef = useRef<HTMLDivElement>(null);

  // Default values when no test is available
  const frames = currentTest?.frames ?? [];
  const animationTimeline = currentTest?.animationTimeline ?? null;
  const time = currentTestTime;
  const isEnabled = !!currentTest && !hasCodeBeenEdited && !isSpotlightActive && frames.length >= 2;

  // Determine the disabled reason for the tooltip
  const getDisabledReason = () => {
    if (hasCodeBeenEdited) {
      return "Scrubber disabled: Code has been edited. Run tests to re-enable.";
    }
    if (frames.length < 2) {
      return "Scrubber disabled: Not enough frames to scrub through.";
    }
    if (isSpotlightActive) {
      return "Scrubber disabled: Spotlight mode is active.";
    }
    return null;
  };

  const disabledReason = getDisabledReason();

  const scrubberContent = (
    <div
      data-testid="scrubber"
      id="scrubber"
      onClick={() => {
        // we wanna focus the range input, so keyboard shortcuts work
        rangeRef.current?.focus();
      }}
      tabIndex={-1}
      className={styles.controlBar}
    >
      {currentTest?.type === "visual" && <PlayPauseButton disabled={!isEnabled} />}
      <ScrubberInput
        ref={rangeRef}
        frames={frames}
        animationTimeline={animationTimeline}
        time={time}
        enabled={isEnabled}
      />
      <FrameStepperButtons enabled={isEnabled} />
      <BreakpointStepperButtons enabled={isEnabled} />
      <InformationWidgetToggleButton disabled={hasCodeBeenEdited || isSpotlightActive} />
    </div>
  );

  // Wrap with tooltip only if there's a disabled reason
  if (disabledReason) {
    return (
      <Tooltip content={disabledReason} placement="top" disabled={false}>
        {scrubberContent}
      </Tooltip>
    );
  }

  return scrubberContent;
}
