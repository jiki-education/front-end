import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";

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
      className="play-pause-button"
      onClick={handleClick}
    >
      <span style={{ fontSize: "32px", lineHeight: 1 }}>{isPlaying ? "⏸️" : "▶️"}</span>
    </button>
  );
}
