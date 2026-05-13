"use client";

import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import { SyntaxErrorView } from "./SyntaxErrorView";
import TestResultsView from "./TestResultsView";
import { UnhandledErrorView } from "./UnhandledErrorView";

export default function ScenariosPanel() {
  const orchestrator = useOrchestrator();
  const { hasSyntaxError, hasUnhandledError } = useOrchestratorStore(orchestrator);

  if (hasUnhandledError) {
    return <UnhandledErrorView />;
  }

  if (hasSyntaxError) {
    return <SyntaxErrorView />;
  }

  return <TestResultsView />;
}
