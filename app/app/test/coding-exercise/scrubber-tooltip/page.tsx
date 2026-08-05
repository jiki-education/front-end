"use client";

import Orchestrator, { useOrchestratorStore } from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorProvider from "@/components/coding-exercise/lib/OrchestratorProvider";
import Scrubber from "@/components/coding-exercise/ui/scrubber/Scrubber";
import { createMockFrame } from "@/tests/mocks";
import { createMockExercise } from "@/tests/mocks/exercise";
import type { Frame } from "@jiki/interpreters/shared";
import { useEffect, useRef } from "react";
import styles from "../harness.module.css";
import { useTranslations } from "next-intl";

// Create frames for testing
function mockFrames(): Frame[] {
  return [
    createMockFrame(0, { line: 1, generateDescription: () => "Frame 1" }),
    createMockFrame(100000, { line: 2, generateDescription: () => "Frame 2" }),
    createMockFrame(250000, { line: 3, generateDescription: () => "Frame 3" }),
    createMockFrame(400000, { line: 4, generateDescription: () => "Frame 4" })
  ];
}

export default function ScrubberTooltipTestPage() {
  const t = useTranslations("codingExercise");
  const exercise = createMockExercise({
    slug: "test-scrubber-tooltip",
    stubs: {
      javascript: `console.log("Line 1");\nconsole.log("Line 2");`,
      python: `console.log("Line 1");\nconsole.log("Line 2");`,
      jikiscript: `console.log("Line 1");\nconsole.log("Line 2");`
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

  const { hasCodeBeenEdited, currentTest } = useOrchestratorStore(orchestrator);

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
        duration: 400000,
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
          duration: 400,
          currentTime: 0
        }
      } as any,
      time: 0,
      currentFrame: frames[0]
    };

    orchestrator.setCurrentTest(testState);
    orchestrator.setCurrentTestTime(0);

    // Expose orchestrator for E2E testing
    (window as any).testOrchestrator = orchestrator;

    return () => {
      delete (window as any).testOrchestrator;
    };
  }, [orchestrator]);

  return (
    <OrchestratorProvider orchestrator={orchestrator}>
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Scrubber Tooltip E2E Test</h1>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Scrubber Component</h2>
          <div className={styles.flexCenter}>
            <Scrubber />
          </div>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>State Info</h2>
          <div data-testid="code-edited-status">Code Edited: {hasCodeBeenEdited ? "Yes" : "No"}</div>
          <div data-testid="frames-count">Frames: {currentTest?.frames.length || 0}</div>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Test Controls</h2>
          <div className={styles.controlRow}>
            <button
              data-testid="toggle-code-edited"
              onClick={() => {
                const store = orchestrator.getStore();
                store.getState().setHasCodeBeenEdited(!hasCodeBeenEdited);
              }}
              className={styles.button}
            >
              Toggle Code Edited
            </button>
            <button
              data-testid="run-code"
              onClick={async () => {
                await orchestrator.runCode();
              }}
              className={styles.button}
            >
              Run Code
            </button>
            <button
              data-testid="set-single-frame"
              onClick={() => {
                const singleFrame = createMockFrame(0, { line: 1, generateDescription: () => "Frame 1" });
                const singleFrameTest = {
                  type: "visual" as const,
                  slug: "test-1",
                  name: "Test 1",
                  status: "pass" as const,
                  expects: [],
                  view: document.createElement("div"),
                  frames: [singleFrame],
                  logLines: [],
                  lintErrors: [],
                  animationTimeline: {
                    duration: 100000,
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
                      duration: 100,
                      currentTime: 0
                    }
                  } as any,
                  time: 0,
                  currentFrame: singleFrame
                };
                orchestrator.setCurrentTest(singleFrameTest);
              }}
              className={styles.button}
            >
              Set Single Frame
            </button>
          </div>
        </div>
      </div>
    </OrchestratorProvider>
  );
}
