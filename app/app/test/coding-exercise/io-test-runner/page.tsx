"use client";

import Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorProvider from "@/components/coding-exercise/lib/OrchestratorProvider";
import CodeEditor from "@/components/coding-exercise/ui/CodeEditor";
import RunButton from "@/components/coding-exercise/ui/RunButton";
import ScenariosPanel from "@/components/coding-exercise/ui/test-results-view/ScenariosPanel";
import { IOExercise } from "@jiki/curriculum";
import type { IOExerciseDefinition, IOScenario, Task } from "@jiki/curriculum";
import { useEffect, useState } from "react";

const initialCode = `function acronym with phrase do
  return "CAT"
end`;

const tasks: Task[] = [
  {
    id: "create-acronym",
    name: "Create acronym function",
    description: "Write a function that creates an acronym",
    requiredScenarios: ["png"],
    bonus: false
  }
];

const scenarios: IOScenario[] = [
  {
    slug: "png",
    name: "Basic acronym: PNG",
    description: "Convert 'Portable Network Graphics' to 'PNG'",
    taskId: "create-acronym",
    functionName: "acronym",
    args: ["Portable Network Graphics"],
    expected: "PNG"
  },
  {
    slug: "ror",
    name: "Lowercase words: ROR",
    description: "Convert 'Ruby on Rails' to 'ROR'",
    taskId: "create-acronym",
    functionName: "acronym",
    args: ["Ruby on Rails"],
    expected: "ROR"
  }
];

// Create a test exercise class
class TestIOExercise extends IOExercise {
  static slug = "io-test-runner-e2e";
  static availableFunctions = [];
}

export default function IOTestRunnerPage() {
  const [orchestrator, setOrchestrator] = useState<Orchestrator | null>(null);

  useEffect(() => {
    const exercise: IOExerciseDefinition = {
      type: "io",
      slug: "io-test-runner-e2e",
      title: "IO Test Runner E2E Exercise",
      instructions: "This is a test exercise for IO tests",
      estimatedMinutes: 5,
      levelId: "fundamentals",
      initialCode,
      ExerciseClass: TestIOExercise,
      tasks,
      scenarios
    };
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
      <IOTestRunnerContent />
    </OrchestratorProvider>
  );
}

function IOTestRunnerContent() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">IO Test Runner E2E Test Page</h1>
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

        {/* Right panel - Test Results */}
        <div className="w-1/2 flex flex-col bg-gray-50">
          <div className="flex-1">
            <ScenariosPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
