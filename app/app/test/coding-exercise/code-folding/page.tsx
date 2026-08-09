"use client";

import Orchestrator, { useOrchestratorStore } from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorProvider from "@/components/coding-exercise/lib/OrchestratorProvider";
import { CodeMirror } from "@/components/coding-exercise/ui/codemirror/CodeMirror";
import { createMockFrame } from "@/tests/mocks";
import { createMockExercise } from "@/tests/mocks/exercise";
import type { Frame } from "@jiki/interpreters/shared";
import { useEffect, useRef } from "react";
import styles from "../harness.module.css";

// Create frames for testing
function mockFrames(): Frame[] {
  return Array.from({ length: 15 }, (_, i) =>
    createMockFrame((i + 1) * 100000, {
      line: i + 1,
      generateDescription: () => `Frame ${i + 1}`
    })
  );
}

const TEST_CODE = `function add(a, b) {
  return a + b;
}

function multiply(x, y) {
  return x * y;
}

const result = add(2, 3);
console.log(result);`;

export default function CodeFoldingTestPage() {
  // Use ref to ensure single orchestrator instance (following CodingExercise pattern)
  const exercise = createMockExercise({
    slug: "test-code-folding",
    stubs: { javascript: TEST_CODE, python: TEST_CODE, jikiscript: TEST_CODE }
  });
  const orchestratorRef = useRef<Orchestrator>(
    new Orchestrator({
      exercise: exercise,
      language: "jikiscript",
      context: { type: "lesson", slug: "maze-solve-basic" },
      interpreterLocaleMessages: {},
      exerciseLocaleMessages: {},
      proseHash: "",
      codeHash: "",
      onGoToDashboard: () => {},
      levelTitle: "",
      isCompleted: false
    })
  );
  const orchestrator = orchestratorRef.current;

  // Get state from orchestrator store
  const { foldedLines } = useOrchestratorStore(orchestrator);

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
        duration: 15,
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
          duration: 15,
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

  const handleClearFolds = () => {
    orchestrator.setFoldedLines([]);
  };

  const handleFoldMultiple = () => {
    // Fold both functions (lines 1 and 5)
    orchestrator.setFoldedLines([1, 5]);
  };

  const handleToggleFold = (line: number) => {
    if (foldedLines.includes(line)) {
      orchestrator.setFoldedLines(foldedLines.filter((l) => l !== line));
    } else {
      orchestrator.setFoldedLines([...foldedLines, line].sort((a, b) => a - b));
    }
  };

  return (
    <OrchestratorProvider orchestrator={orchestrator}>
      <div className={styles.page} data-testid="code-folding-container">
        <h1 className={styles.pageTitle}>Code Folding E2E Test</h1>

        <div className={styles.grid2}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>CodeMirror Editor</h2>
            <div
              data-testid="editor-container"
              className={styles.editorBox}
              style={{ height: "500px", overflow: "auto" }}
            >
              <CodeMirror />
            </div>
            <div className={styles.hint}>
              Click on fold indicators (arrows) in the gutter to collapse/expand code blocks
            </div>
          </div>

          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Current Folded Lines</h2>
            <div data-testid="folded-lines-display" className={styles.mt}>
              {foldedLines.length > 0 ? (
                <div className={styles.chipList}>
                  {foldedLines.map((line) => (
                    <div key={line} data-testid={`folded-line-${line}`} className={styles.chip}>
                      Line {line}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.muted}>No lines folded</div>
              )}
            </div>

            <div data-testid="folded-lines-list" className={styles.smallText}>
              Folded Lines: {foldedLines.length > 0 ? foldedLines.join(", ") : "None"}
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Manual Controls</h2>
          <div className={styles.buttonRow}>
            <button data-testid="clear-all-folds" onClick={handleClearFolds} className={styles.button}>
              Expand All
            </button>
            <button data-testid="fold-multiple" onClick={handleFoldMultiple} className={styles.button}>
              Fold Both Functions
            </button>
          </div>
          <div className={styles.hint}>Foldable blocks: add function (line 1), multiply function (line 5)</div>
          <div className={`${styles.buttonRow} ${styles.mt}`}>
            {[1, 5, 9].map((line) => (
              <button
                key={line}
                data-testid={`toggle-fold-${line}`}
                onClick={() => handleToggleFold(line)}
                className={styles.button}
                data-active={foldedLines.includes(line)}
              >
                L{line}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Debug Info</h2>
          <div className={styles.debugText}>
            <div>
              Total Folded Lines: <span data-testid="fold-count">{foldedLines.length}</span>
            </div>
            <div>
              Editor Loaded: <span data-testid="editor-loaded">{orchestrator.getEditorView() ? "Yes" : "No"}</span>
            </div>
            <div className={styles.mt}>
              <div className={styles.semibold}>Code Structure:</div>
              <ul className={styles.debugList}>
                <li>• add function: Lines 1-3</li>
                <li>• multiply function: Lines 5-7</li>
                <li>• result assignment: Line 9</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </OrchestratorProvider>
  );
}
