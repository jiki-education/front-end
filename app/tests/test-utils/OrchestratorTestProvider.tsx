import Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorProvider from "@/components/coding-exercise/lib/OrchestratorProvider";
import { createMockExercise } from "@/tests/mocks/exercise";
import type { ReactNode } from "react";

interface OrchestratorTestProviderProps {
  orchestrator?: Orchestrator;
  children: ReactNode;
}

export default function OrchestratorTestProvider({
  orchestrator = new Orchestrator(createMockExercise(), "jikiscript", { type: "lesson", slug: "test-lesson" }),
  children
}: OrchestratorTestProviderProps) {
  return <OrchestratorProvider orchestrator={orchestrator}>{children}</OrchestratorProvider>;
}
