import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import { InspectedVisualTestPreviewView } from "./InspectedVisualTestPreviewView";
import { InspectedVisualTestResultView } from "./InspectedVisualTestResultView";

export function InspectedVisualTestView() {
  const orchestrator = useOrchestrator();
  const { currentTest } = useOrchestratorStore(orchestrator);

  if (currentTest && currentTest.type === "visual") {
    return <InspectedVisualTestResultView />;
  }

  return <InspectedVisualTestPreviewView />;
}
