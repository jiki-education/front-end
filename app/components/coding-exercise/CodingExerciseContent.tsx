import OrchestratorProvider from "./lib/OrchestratorProvider";
import CodingExerciseInner from "./CodingExerciseInner";
import type Orchestrator from "./lib/Orchestrator";

interface CodingExerciseContentProps {
  orchestrator: Orchestrator;
}

export default function CodingExerciseContent({ orchestrator }: CodingExerciseContentProps) {
  return (
    <OrchestratorProvider orchestrator={orchestrator}>
      <CodingExerciseInner />
    </OrchestratorProvider>
  );
}
