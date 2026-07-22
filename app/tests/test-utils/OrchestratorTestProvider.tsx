import type Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorProvider from "@/components/coding-exercise/lib/OrchestratorProvider";
import { createMockExercise } from "@/tests/mocks/exercise";
import { makeTestOrchestrator } from "@/tests/test-utils/makeTestOrchestrator";
import type { ReactNode } from "react";

interface OrchestratorTestProviderProps {
  orchestrator?: Orchestrator;
  children: ReactNode;
}

export default function OrchestratorTestProvider({
  orchestrator = makeTestOrchestrator(createMockExercise()),
  children
}: OrchestratorTestProviderProps) {
  return <OrchestratorProvider orchestrator={orchestrator}>{children}</OrchestratorProvider>;
}
