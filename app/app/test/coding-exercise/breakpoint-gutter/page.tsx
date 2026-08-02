"use client";

import Orchestrator, { useOrchestratorStore } from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorProvider from "@/components/coding-exercise/lib/OrchestratorProvider";
import { CodeMirror } from "@/components/coding-exercise/ui/codemirror/CodeMirror";
import { createMockFrame } from "@/tests/mocks";
import { createMockExercise } from "@/tests/mocks/exercise";
import type { Frame } from "@jiki/interpreters/shared";
import { useEffect, useRef } from "react";
import styles from "../harness.module.css";
import { useTranslations } from "next-intl";

function mockFrames(): Frame[] {
  return [
    createMockFrame(0, { line: 1 }),
    createMockFrame(100000, { line: 2 }), // 100ms
    createMockFrame(200000, { line: 3 }), // 200ms
    createMockFrame(300000, { line: 4 }), // 300ms
    createMockFrame(400000, { line: 5 }), // 400ms
    createMockFrame(500000, { line: 6 }), // 500ms
    createMockFrame(600000, { line: 7 }), // 600ms
    createMockFrame(700000, { line: 8 }) // 700ms
  ];
}

const TEST_CODE = `function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  const result = fibonacci(n - 1) + fibonacci(n - 2);
  console.log(\`fibonacci(\${n}) = \${result}\`);
  return result;
}

// Calculate fibonacci(5)
const answer = fibonacci(5);
console.log(\`Final answer: \${answer}\`);`;

export default function BreakpointGutterTestPage() {
  const t = useTranslations("codingExercise");
  // Use ref to ensure single orchestrator instance (following CodingExercise pattern)
  const exercise = createMockExercise({
    slug: "test-breakpoint-gutter",
    stubs: { javascript: TEST_CODE, python: TEST_CODE, jikiscript: TEST_CODE }
  });
  const orchestratorRef = useRef<Orchestrator>(
    new Orchestrator(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" }, {}, {}, t, "", () => {})
  );
  const orchestrator = orchestratorRef.current;

  // Get state from orchestrator store
  const { breakpoints } = useOrchestratorStore(orchestrator);

  useEffect(() => {
    const frames = mockFrames();

    // Create test state
    const testState = {
      type: "visual" as const,
      slug: "test-1",
      name: "Test 1",
      status: "pass" as const,
      expects: [],
      view: document.createElement("div"),
      frames,
      logLines: [],
      lintErrors: [],
      animationTimeline: {
        duration: 8,
        paused: true,
        seek: (_time: number) => {},
        play: () => {},
        pause: () => {},
        progress: 0,
        currentTime: 0,
        completed: false,
        hasPlayedOrScrubbed: false,
        seekEndOfTimeline: () => {},
        onUpdate: (_callback: any) => {},
        onComplete: (_callback: any) => {},
        clearUpdateCallbacks: () => {},
        clearCompleteCallbacks: () => {},
        timeline: {
          duration: 8,
          currentTime: 0
        }
      } as any,
      time: 0,
      currentFrame: frames[0]
    };

    // Initialize the orchestrator with test state
    orchestrator.setCurrentTest(testState);
    orchestrator.setCurrentTestTime(0);
    orchestrator.setShouldAutoRunCode(false);

    // Expose orchestrator to window for E2E testing
    (window as any).testOrchestrator = orchestrator;

    return () => {
      delete (window as any).testOrchestrator;
    };
  }, [orchestrator]);

  const handleClearBreakpoints = () => {
    orchestrator.setBreakpoints([]);
  };

  const handleSetMultipleBreakpoints = () => {
    orchestrator.setBreakpoints([2, 4, 6]);
  };

  const handleToggleBreakpoint = (line: number) => {
    if (breakpoints.includes(line)) {
      orchestrator.setBreakpoints(breakpoints.filter((b: number) => b !== line));
    } else {
      orchestrator.setBreakpoints([...breakpoints, line].sort((a: number, b: number) => a - b));
    }
  };

  return (
    <div className={styles.page} data-testid="breakpoint-gutter-container">
      <h1 className={styles.pageTitle}>Breakpoint Gutter E2E Test</h1>

      <div className={styles.grid2}>
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>CodeMirror Editor</h2>
          <div data-testid="editor-container" className={styles.editorBox} style={{ height: "400px" }}>
            <OrchestratorProvider orchestrator={orchestrator}>
              <CodeMirror />
            </OrchestratorProvider>
          </div>
          <div className={styles.hint}>Click on line numbers in the gutter to add/remove breakpoints</div>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Current Breakpoints</h2>
          <div data-testid="breakpoints-display" className={styles.mt}>
            {breakpoints.length > 0 ? (
              <div className={styles.stack}>
                {breakpoints.map((line: number) => (
                  <div key={line} data-testid={`breakpoint-line-${line}`} className={styles.chip} data-variant="red">
                    Line {line}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.muted}>No breakpoints set</div>
            )}
          </div>

          <div data-testid="breakpoints-list" className={styles.smallText}>
            Breakpoints: {breakpoints.length > 0 ? breakpoints.join(", ") : "None"}
          </div>
        </div>
      </div>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Manual Controls</h2>
        <div className={styles.controlRow}>
          <button data-testid="clear-all-breakpoints" onClick={handleClearBreakpoints} className={styles.button}>
            Clear All Breakpoints
          </button>
          <button
            data-testid="set-multiple-breakpoints"
            onClick={handleSetMultipleBreakpoints}
            className={styles.button}
          >
            Set Lines 2, 4, 6
          </button>
        </div>
        <div className={`${styles.controlRow} ${styles.mt}`}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((line) => (
            <button
              key={line}
              data-testid={`toggle-line-${line}`}
              onClick={() => handleToggleBreakpoint(line)}
              className={styles.button}
              data-active={breakpoints.includes(line)}
              data-variant="red"
            >
              L{line}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Debug Info</h2>
        <div className={`${styles.smallText} ${styles.stack}`}>
          <div>
            Total Breakpoints: <span data-testid="breakpoint-count">{breakpoints.length}</span>
          </div>
          <div>
            Editor Loaded: <span data-testid="editor-loaded">{orchestrator.getEditorView() ? "Yes" : "No"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
