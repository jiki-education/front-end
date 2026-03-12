import { useOrchestrator } from "../../lib/OrchestratorContext";
import { IOInspectedView } from "./io/IOInspectedView";
import { VisualInspectedView } from "./visual/VisualInspectedView";

export function InspectedTestResultView() {
  const orchestrator = useOrchestrator();
  const exercise = orchestrator.getExercise();

  if (exercise.type === "visual") {
    return <VisualInspectedView />;
  }

  return <IOInspectedView />;
}
