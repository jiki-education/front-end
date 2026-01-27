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

  // Scrubbing requires 2+ frames
  const isScrubberEnabled = !!currentTest && !hasCodeBeenEdited && !isSpotlightActive && frames.length >= 2;

  // Information widget toggle only requires a current test with at least 1 frame
  const isInformationToggleEnabled = !!currentTest && !hasCodeBeenEdited && !isSpotlightActive && frames.length >= 1;

  // Tooltip reasons - separated by what they affect
  const getGlobalDisabledReason = () => {
    if (hasCodeBeenEdited) {
      return "Scrubber disabled: Code has been edited. Run tests to re-enable.";
    }
    if (isSpotlightActive) {
      return "Scrubber disabled: Spotlight mode is active.";
    }
    return null;
  };

  const getScrubberOnlyDisabledReason = () => {
    if (frames.length < 2) {
      return "Scrubber disabled: Not enough frames to scrub through.";
    }
    return null;
  };

  const globalDisabledReason = getGlobalDisabledReason();
  const scrubberOnlyDisabledReason = getScrubberOnlyDisabledReason();

  const scrubberControls = (
    <>
      {currentTest?.type === "visual" && <PlayPauseButton disabled={!isScrubberEnabled} />}
      <ScrubberInput
        ref={rangeRef}
        frames={frames}
        animationTimeline={animationTimeline}
        time={time}
        enabled={isScrubberEnabled}
      />
      <FrameStepperButtons enabled={isScrubberEnabled} />
      <BreakpointStepperButtons enabled={isScrubberEnabled} />
    </>
  );

  const wrappedScrubberControls = <div className={styles.scrubberControlsWrapper}>{scrubberControls}</div>;

  const toggleButton = <InformationWidgetToggleButton disabled={!isInformationToggleEnabled} />;

  // If global reason (code edited, spotlight), wrap entire control bar with tooltip
  if (globalDisabledReason) {
    return (
      <Tooltip
        content={globalDisabledReason}
        placement="top"
        disabled={false}
        className={styles.disabledTooltip}
        disableFlip
      >
        <div
          data-testid="scrubber"
          id="scrubber"
          onClick={() => rangeRef.current?.focus()}
          tabIndex={-1}
          className={styles.controlBar}
        >
          {wrappedScrubberControls}
          {toggleButton}
        </div>
      </Tooltip>
    );
  }

  // If only scrubber-specific reason (not enough frames), wrap only scrubber controls
  return (
    <div
      data-testid="scrubber"
      id="scrubber"
      onClick={() => rangeRef.current?.focus()}
      tabIndex={-1}
      className={styles.controlBar}
    >
      {scrubberOnlyDisabledReason ? (
        <Tooltip
          content={scrubberOnlyDisabledReason}
          placement="top"
          disabled={false}
          className={styles.disabledTooltip}
          disableFlip
        >
          {wrappedScrubberControls}
        </Tooltip>
      ) : (
        wrappedScrubberControls
      )}
      {toggleButton}
    </div>
  );
}
