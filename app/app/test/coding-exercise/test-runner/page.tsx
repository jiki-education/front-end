"use client";

import CodeEditor from "@/components/coding-exercise/ui/CodeEditor";
import RunButton from "@/components/coding-exercise/ui/RunButton";
import ScenariosPanel from "@/components/coding-exercise/ui/test-results-view/ScenariosPanel";
import Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorProvider from "@/components/coding-exercise/lib/OrchestratorProvider";
import { createTestExercise } from "@/tests/mocks/createTestExercise";
import { useEffect, useState } from "react";

const initialCode = `move()
move()
move()
move()
move()`;

export default function TestRunnerTestPage() {
  const [orchestrator, setOrchestrator] = useState<Orchestrator | null>(null);

  useEffect(() => {
    const exercise = createTestExercise({
      slug: "test-runner-e2e",
      initialCode,
      title: "Test Runner E2E Exercise"
    });
    const orch = new Orchestrator(exercise);
    setOrchestrator(orch);

    // Expose orchestrator to window for E2E testing
    (window as any).testOrchestrator = orch;

    return () => {
      delete (window as any).testOrchestrator;
    };
  }, []);

  if (!orchestrator) {
    return <div>Loading...</div>;
  }

  return (
    <OrchestratorProvider orchestrator={orchestrator}>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Test Runner E2E Test Page</h1>
        </div>

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left panel - Code Editor */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col bg-white">
            <div className="border-b border-gray-200 px-4 py-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Code Editor</h2>
              <RunButton />
            </div>
            <div className="flex-1 overflow-hidden">
              <CodeEditor />
            </div>
          </div>

          {/* Right panel - Test Results and Visualization */}
          <div className="w-1/2 flex flex-col bg-gray-50">
            {/* Exercise visualization */}
            <div className="flex-1 border-b border-gray-200 bg-white p-6">
              <div id="view-container" className="h-full flex items-center justify-center">
                <div className="exercise-container">
                  {/* This will be populated by the exercise view */}
                  <div className="text-gray-500">Exercise visualization will appear here when tests run</div>
                </div>
              </div>
            </div>

            {/* Test results and scrubber */}
            <div className="flex-shrink-0">
              <ScenariosPanel />
            </div>
          </div>
        </div>
      </div>
    </OrchestratorProvider>
  );
}
