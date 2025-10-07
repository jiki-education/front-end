import Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorProvider from "@/components/coding-exercise/lib/OrchestratorProvider";
import { createTestExercise } from "@/tests/mocks/createTestExercise";
import type { ReactNode } from "react";

interface OrchestratorTestProviderProps {
  orchestrator?: Orchestrator;
  children: ReactNode;
}

export default function OrchestratorTestProvider({
  orchestrator = new Orchestrator(createTestExercise()),
  children
}: OrchestratorTestProviderProps) {
  return <OrchestratorProvider orchestrator={orchestrator}>{children}</OrchestratorProvider>;
}
