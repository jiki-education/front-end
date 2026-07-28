"use client";

// Test page initializes orchestrator in useEffect for E2E testing

import Orchestrator, { useOrchestratorStore } from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorProvider, { useOrchestratorContext } from "@/components/coding-exercise/lib/OrchestratorProvider";
import CodeEditor from "@/components/coding-exercise/ui/CodeEditor";
import ScenariosPanel from "@/components/coding-exercise/ui/test-results-view/ScenariosPanel";
import { assembleClassNames } from "@/lib/assemble-classnames";
import { createMockExercise } from "@/tests/mocks/exercise";
import { useEffect, useRef, useState } from "react";
import styles from "../harness.module.css";

const initialCode = `move()
move()
move()
move()
move()`;

export default function TestRunnerTestPage() {
  const [orchestrator, setOrchestrator] = useState<Orchestrator | null>(null);

  useEffect(() => {
    const exercise = createMockExercise({
      slug: "test-runner-e2e",
      stubs: { javascript: initialCode, python: initialCode, jikiscript: initialCode },
      title: "Test Runner E2E Exercise",
      // The auto-play, test-switching and test-runner specs that drive this page
      // rely on an exercise that never fully completes (so it keeps a failing
      // scenario to play/switch through). The shared mock's third task is a
      // bonus, which would be excluded from the "passed" check and let the
      // exercise complete, popping the completion modal and suppressing
      // auto-play. Treat every task as required here; the bonus-scenario
      // behaviour itself is covered by unit tests.
      tasks: [
        { id: "test-task-1", name: "Basic Test Task", bonus: false },
        { id: "test-task-bonus", name: "Third Test Task", bonus: false }
      ]
    });
    const orch = new Orchestrator(
      exercise,
      "jikiscript",
      { type: "lesson", slug: "test-lesson" },
      {},
      {},
      "",
      () => {}
    );
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
      <TestRunnerContent />
    </OrchestratorProvider>
  );
}

function TestRunnerContent() {
  const orchestrator = useOrchestratorContext();
  const { isSpotlightActive } = useOrchestratorStore(orchestrator);
  const viewContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.screen}>
      {/* Header */}
      <div className={styles.screenHeader}>
        <h1 className={styles.screenTitle}>Test Runner E2E Test Page</h1>
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

        {/* Right panel - Test Results and Visualization */}
        <div className={`${styles.screenPanel} ${styles.screenPanelRight}`}>
          {/* Exercise visualization */}
          <div className={styles.screenViz}>
            <div
              className={assembleClassNames(styles.screenVizInner, isSpotlightActive && "spotlight")}
              ref={viewContainerRef}
              id="view-container"
            >
              <div className="exercise-container">
                {/* This will be populated by the exercise view */}
                <div className={styles.screenVizPlaceholder}>
                  Exercise visualization will appear here when tests run
                </div>
              </div>
            </div>
          </div>

          {/* Test results and scrubber */}
          <div className={styles.screenResults}>
            <ScenariosPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
