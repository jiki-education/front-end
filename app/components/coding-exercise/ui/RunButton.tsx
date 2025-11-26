import { useOrchestratorStore } from "../lib/Orchestrator";
import { useOrchestrator } from "../lib/OrchestratorContext";
import styles from "../CodingExercise.module.css";

export default function RunButton() {
  const orchestrator = useOrchestrator();
  const { status } = useOrchestratorStore(orchestrator);

  const handleRunCode = () => {
    void orchestrator.runCode();
  };

  return (
    <button
      data-testid="run-button"
      onClick={handleRunCode}
      disabled={status === "running"}
      className={styles.checkButton}
    >
      {status === "running" ? "Running..." : "Run Code"}
    </button>
  );
}
