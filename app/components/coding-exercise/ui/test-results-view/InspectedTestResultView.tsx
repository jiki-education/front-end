import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import { InspectedVisualTestResultView } from "./InspectedVisualTestResultView";
import { InspectedIOTestResultView } from "./InspectedIOTestResultView";

export function InspectedTestResultView() {
  const orchestrator = useOrchestrator();
  const { currentTest } = useOrchestratorStore(orchestrator);

  if (!currentTest) {
    return null;
  }

  if (currentTest.type === "visual") {
    return <InspectedVisualTestResultView />;
  }

  return <InspectedIOTestResultView />;
}
