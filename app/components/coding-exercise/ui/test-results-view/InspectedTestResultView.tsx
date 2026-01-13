import { useOrchestrator } from "../../lib/OrchestratorContext";
import { InspectedIOTestView } from "./InspectedIOTestView";
import { InspectedVisualTestView } from "./InspectedVisualTestView";

export function InspectedTestResultView() {
  const orchestrator = useOrchestrator();
  const exercise = orchestrator.getExercise();

  if (exercise.type === "visual") {
    return <InspectedVisualTestView />;
  }

  return <InspectedIOTestView />;
}
