import { showConfirmation } from "@/lib/modal";
import UndoArrowIcon from "@/icons/undo-arrow.svg";
import { useOrchestratorStore } from "../lib/Orchestrator";
import { useOrchestrator } from "../lib/OrchestratorContext";
import styles from "../CodingExercise.module.css";

export default function RunButton() {
  const orchestrator = useOrchestrator();
  const { status } = useOrchestratorStore(orchestrator);

  const handleRunCode = () => {
    void orchestrator.runCode();
  };

  const handleReset = () => {
    showConfirmation({
      title: "Reset your code?",
      message:
        "This will reset your code back to the start. Don't worry — this won't lose your conversations with Jiki.",
      confirmText: "Yes, reset",
      cancelText: "Cancel",
      onConfirm: () => orchestrator.resetExercise()
    });
  };

  return (
    <div className={styles.floatingPill}>
      <button
        data-testid="reset-button"
        onClick={handleReset}
        className={styles.pillBtnReset}
        aria-label="Reset exercise"
      >
        <UndoArrowIcon width={16} height={16} />
      </button>
      <div className={styles.pillDivider} />
      <button
        data-testid="run-button"
        onClick={handleRunCode}
        disabled={status === "running"}
        className={styles.pillBtnRun}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        {status === "running" ? "Running..." : "Run Code"}
      </button>
    </div>
  );
}
