"use client";
import { createMockFrame } from "@/tests/mocks";

import Orchestrator, { useOrchestratorStore } from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorProvider from "@/components/coding-exercise/lib/OrchestratorProvider";
import BreakpointStepperButtons from "@/components/coding-exercise/ui/scrubber/BreakpointStepperButtons";
import { createMockExercise } from "@/tests/mocks/exercise";
import type { Frame } from "@jiki/interpreters/shared";
import { useEffect, useRef } from "react";
import styles from "../harness.module.css";
import { useTranslations } from "next-intl";

// Create frames for testing
function mockFrames(): Frame[] {
  return [
    createMockFrame(0, { line: 1, generateDescription: () => "Frame 1" }),
    createMockFrame(100000, { line: 2, generateDescription: () => "Frame 2" }), // 100ms
    createMockFrame(200000, { line: 3, generateDescription: () => "Frame 3" }), // 200ms
    createMockFrame(300000, { line: 4, generateDescription: () => "Frame 4" }), // 300ms
    createMockFrame(400000, { line: 5, generateDescription: () => "Frame 5" }), // 400ms
    createMockFrame(500000, { line: 6, generateDescription: () => "Frame 6" }), // 500ms
    createMockFrame(600000, { line: 7, generateDescription: () => "Frame 7" }), // 600ms
    createMockFrame(700000, { line: 8, generateDescription: () => "Frame 8" }) // 700ms
  ];
}

export default function BreakpointStepperButtonsTestPage() {
  const t = useTranslations("codingExercise");
  // Use ref to ensure single orchestrator instance (following CodingExercise pattern)
  const exercise = createMockExercise({
    slug: "test-breakpoint-stepper",
    stubs: {
      javascript: `// Test code for breakpoint stepper\nconsole.log("Line 1");\nconsole.log("Line 2");\nconsole.log("Line 3");`,
      python: `// Test code for breakpoint stepper\nconsole.log("Line 1");\nconsole.log("Line 2");\nconsole.log("Line 3");`,
      jikiscript: `// Test code for breakpoint stepper\nconsole.log("Line 1");\nconsole.log("Line 2");\nconsole.log("Line 3");`
    }
  });
  const orchestratorRef = useRef<Orchestrator>(
    new Orchestrator({
      exercise: exercise,
      language: "jikiscript",
      context: { type: "lesson", slug: "test-lesson" },
      interpreterLocaleMessages: {},
      exerciseLocaleMessages: {},
      t: t,
      contentHash: "",
      onGoToDashboard: () => {}
    })
  );
  const orchestrator = orchestratorRef.current;

  // Get state from orchestrator store
  const { currentFrame, currentTestTime, breakpoints, foldedLines } = useOrchestratorStore(orchestrator);

  useEffect(() => {
    const frames = mockFrames();

    // Create test state similar to what would come from the test runner
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
    orchestrator.setBreakpoints([2, 4, 6]);
    orchestrator.setCurrentTestTime(0);

    // Expose orchestrator to window for E2E testing
    (window as any).testOrchestrator = orchestrator;

    return () => {
      delete (window as any).testOrchestrator;
    };
  }, [orchestrator]);

  const handleToggleBreakpoint = (line: number) => {
    if (breakpoints.includes(line)) {
      orchestrator.setBreakpoints(breakpoints.filter((b) => b !== line));
    } else {
      orchestrator.setBreakpoints([...breakpoints, line].sort((a, b) => a - b));
    }
  };

  const handleToggleFold = (line: number) => {
    if (foldedLines.includes(line)) {
      orchestrator.setFoldedLines(foldedLines.filter((l) => l !== line));
    } else {
      orchestrator.setFoldedLines([...foldedLines, line].sort((a, b) => a - b));
    }
  };

  const handleClearBreakpoints = () => {
    orchestrator.setBreakpoints([]);
  };

  const handleClearFolds = () => {
    orchestrator.setFoldedLines([]);
  };

  const handleSetAllBreakpoints = () => {
    orchestrator.setBreakpoints([1, 2, 3, 4, 5, 6, 7, 8]);
  };

  const time = currentTestTime || 0;

  if (!currentFrame) {
    return <div>Loading...</div>;
  }

  return (
    <OrchestratorProvider orchestrator={orchestrator}>
      <div className={styles.page} data-testid="breakpoint-stepper-container">
        <h1 className={styles.pageTitle}>Breakpoint Stepper Buttons E2E Test</h1>

        <div className={styles.mt}>
          <BreakpointStepperButtons enabled={true} />
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Current State</h2>
          <div data-testid="current-frame">Frame: {currentFrame.generateDescription()}</div>
          <div data-testid="frame-line">Line: {currentFrame.line}</div>
          <div data-testid="frame-time">Timeline Time: {time}</div>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Breakpoints</h2>
          <div data-testid="breakpoints">{breakpoints.length > 0 ? breakpoints.join(", ") : "None"}</div>
          <div className={`${styles.controlRow} ${styles.mt}`}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((line) => (
              <button
                key={line}
                data-testid={`toggle-breakpoint-${line}`}
                onClick={() => handleToggleBreakpoint(line)}
                className={styles.button}
                data-active={breakpoints.includes(line)}
                data-variant="red"
              >
                {line}
              </button>
            ))}
          </div>
          <div className={`${styles.controlRow} ${styles.mt}`}>
            <button data-testid="clear-breakpoints" onClick={handleClearBreakpoints} className={styles.button}>
              Clear All
            </button>
            <button data-testid="set-all-breakpoints" onClick={handleSetAllBreakpoints} className={styles.button}>
              Set All
            </button>
          </div>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Folded Lines</h2>
          <div data-testid="folded-lines">{foldedLines.length > 0 ? foldedLines.join(", ") : "None"}</div>
          <div className={`${styles.controlRow} ${styles.mt}`}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((line) => (
              <button
                key={line}
                data-testid={`toggle-fold-${line}`}
                onClick={() => handleToggleFold(line)}
                className={styles.button}
                data-active={foldedLines.includes(line)}
              >
                {line}
              </button>
            ))}
          </div>
          <div className={styles.mt}>
            <button data-testid="clear-folds" onClick={handleClearFolds} className={styles.button}>
              Clear All Folds
            </button>
          </div>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Manual Navigation</h2>
          <div className={styles.controlRow}>
            {mockFrames().map((frame, idx) => (
              <button
                key={idx}
                data-testid={`goto-frame-${idx + 1}`}
                onClick={() => orchestrator.setCurrentTestTime(frame.time)}
                className={styles.button}
                data-active={currentFrame.line === frame.line}
                data-variant="green"
              >
                F{idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Debug Info</h2>
          <div data-testid="prev-breakpoint">
            Prev Breakpoint: {orchestrator.getStore().getState().prevBreakpointFrame?.line ?? "None"}
          </div>
          <div data-testid="next-breakpoint">
            Next Breakpoint: {orchestrator.getStore().getState().nextBreakpointFrame?.line ?? "None"}
          </div>
        </div>
      </div>
    </OrchestratorProvider>
  );
}
