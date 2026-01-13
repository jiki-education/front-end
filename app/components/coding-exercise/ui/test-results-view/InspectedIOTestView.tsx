import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import { InspectedIOTestPreviewView } from "./InspectedIOTestPreviewView";
import { InspectedIOTestResultView } from "./InspectedIOTestResultView";

export function InspectedIOTestView() {
  const orchestrator = useOrchestrator();
  const { currentTest } = useOrchestratorStore(orchestrator);

  if (currentTest && currentTest.type === "io") {
    return <InspectedIOTestResultView />;
  }

  return <InspectedIOTestPreviewView />;
}
