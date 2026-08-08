"use client";

// Test page initializes orchestrator in useEffect for E2E testing

import Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorProvider from "@/components/coding-exercise/lib/OrchestratorProvider";
import CodeEditor from "@/components/coding-exercise/ui/CodeEditor";
import ScenariosPanel from "@/components/coding-exercise/ui/test-results-view/ScenariosPanel";
import { IOExercise } from "@jiki/curriculum";
import type { IOExerciseDefinition, IOScenario, Task } from "@jiki/curriculum";
import { useEffect, useState } from "react";
import styles from "../harness.module.css";

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
  protected get slug() {
    return "io-test-runner-e2e";
  }

  availableFunctions = [];
}

export default function IOTestRunnerPage() {
  const [orchestrator, setOrchestrator] = useState<Orchestrator | null>(null);

  useEffect(() => {
    const exercise: IOExerciseDefinition = {
      type: "io",
      slug: "io-test-runner-e2e",
      title: "IO Test Runner E2E Exercise",
      description: "",
      instructions: "This is a test exercise for IO tests",
      levelId: "fundamentals",
      functions: [],
      stubs: { javascript: initialCode, python: initialCode, jikiscript: initialCode },
      solutions: { javascript: "", python: "", jikiscript: "" },
      ExerciseClass: TestIOExercise,
      tasks,
      scenarios
    };
    const orch = new Orchestrator({
      exercise: exercise,
      language: "jikiscript",
      context: { type: "lesson", slug: "maze-solve-basic" },
      interpreterLocaleMessages: {},
      exerciseLocaleMessages: {},
      contentHash: "",
      onGoToDashboard: () => {},
      levelTitle: "",
      isCompleted: false
    });
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
    <div className={styles.screen}>
      {/* Header */}
      <div className={styles.screenHeader}>
        <h1 className={styles.screenTitle}>IO Test Runner E2E Test Page</h1>
      </div>

      {/* Main content area */}
      <div className={styles.screenBody}>
        {/* Left panel - Code Editor */}
        <div className={`${styles.screenPanel} ${styles.screenPanelLeft}`}>
          <div className={styles.screenPanelHeader}>
            <h2 className={styles.screenPanelTitle}>Code Editor</h2>
          </div>
          <div className={styles.screenFill}>
            <CodeEditor />
          </div>
        </div>

        {/* Right panel - Test Results */}
        <div className={`${styles.screenPanel} ${styles.screenPanelRight}`}>
          <div className={styles.screenFlex}>
            <ScenariosPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
