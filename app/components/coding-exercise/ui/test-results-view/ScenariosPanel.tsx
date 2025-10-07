"use client";

import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import FrameDescription from "../FrameDescription";
import Scrubber from "../scrubber/Scrubber";
import { RunCodePromptView } from "./RunCodePromptView";
import { SyntaxErrorView } from "./SyntaxErrorView";
import TestResultsView from "./TestResultsView";

export default function ScenariosPanel() {
  const orchestrator = useOrchestrator();
  const { hasSyntaxError, testSuiteResult, currentTest } = useOrchestratorStore(orchestrator);

  if (hasSyntaxError) {
    return <SyntaxErrorView />;
  }

  if (!testSuiteResult) {
    return <RunCodePromptView />;
  }

  return (
    <>
      <div className="border-t border-gray-200 p-4 max-h-[50%] flex flex-col overflow-hidden">
        <TestResultsView />
      </div>

      {/* Scrubber - show when there is a current test (will be disabled if no frames) */}
      {currentTest && (
        <div className="border-t border-gray-200 px-4 py-2">
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-gray-700">Timeline:</div>
            <Scrubber />
            <FrameDescription />
          </div>
        </div>
      )}
    </>
  );
}
