import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import styles from "../../CodingExercise.module.css";

interface PlayPauseButtonProps {
  disabled: boolean;
}

export default function PlayPauseButton({ disabled }: PlayPauseButtonProps) {
  const orchestrator = useOrchestrator();
  const { isPlaying, currentTest } = useOrchestratorStore(orchestrator);

  // Don't show button if there's no animation timeline
  const animationTimeline = currentTest?.animationTimeline;
  if (!animationTimeline) {
    return null;
  }

  const handleClick = () => {
    if (isPlaying) {
      orchestrator.pause();
    } else {
      orchestrator.play();
    }
  };

  return (
    <button
      data-ci={isPlaying ? "pause-button" : "play-button"}
      disabled={disabled}
      className={styles.playBtn}
      onClick={handleClick}
    >
      {isPlaying ? "⏸️" : "️▶"}
    </button>
  );
}
