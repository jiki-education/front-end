"use client";

import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import { RunCodePromptView } from "./RunCodePromptView";
import { SyntaxErrorView } from "./SyntaxErrorView";
import TestResultsView from "./TestResultsView";

export default function ScenariosPanel() {
  const orchestrator = useOrchestrator();
  const { hasSyntaxError, testSuiteResult } = useOrchestratorStore(orchestrator);

  if (hasSyntaxError) {
    return <SyntaxErrorView />;
  }

  if (!testSuiteResult) {
    return <RunCodePromptView />;
  }

  return <TestResultsView />;
}
