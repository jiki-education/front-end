import { useOrchestratorStore } from "../lib/Orchestrator";
import { useOrchestrator } from "../lib/OrchestratorContext";

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
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {status === "running" ? "Running..." : "Run Code"}
    </button>
  );
}
