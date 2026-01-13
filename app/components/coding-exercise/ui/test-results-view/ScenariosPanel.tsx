"use client";

import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import { SyntaxErrorView } from "./SyntaxErrorView";
import TestResultsView from "./TestResultsView";

export default function ScenariosPanel() {
  const orchestrator = useOrchestrator();
  const { hasSyntaxError } = useOrchestratorStore(orchestrator);

  if (hasSyntaxError) {
    return <SyntaxErrorView />;
  }

  return <TestResultsView />;
}
