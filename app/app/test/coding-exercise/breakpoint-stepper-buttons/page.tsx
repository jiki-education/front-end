"use client";
import { mockFrame } from "@/tests/mocks";

import React, { useEffect, useRef } from "react";
import Orchestrator, { useOrchestratorStore } from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorProvider from "@/components/coding-exercise/lib/OrchestratorProvider";
import BreakpointStepperButtons from "@/components/coding-exercise/ui/scrubber/BreakpointStepperButtons";
import { createTestExercise } from "@/tests/mocks/createTestExercise";
import type { Frame } from "@jiki/interpreters";

// Create frames for testing
function mockFrames(): Frame[] {
  return [
    mockFrame(0, { line: 1, generateDescription: () => "Frame 1" }),
    mockFrame(100000, { line: 2, generateDescription: () => "Frame 2" }), // 100ms
    mockFrame(200000, { line: 3, generateDescription: () => "Frame 3" }), // 200ms
    mockFrame(300000, { line: 4, generateDescription: () => "Frame 4" }), // 300ms
    mockFrame(400000, { line: 5, generateDescription: () => "Frame 5" }), // 400ms
    mockFrame(500000, { line: 6, generateDescription: () => "Frame 6" }), // 500ms
    mockFrame(600000, { line: 7, generateDescription: () => "Frame 7" }), // 600ms
    mockFrame(700000, { line: 8, generateDescription: () => "Frame 8" }) // 700ms
  ];
}

export default function BreakpointStepperButtonsTestPage() {
  // Use ref to ensure single orchestrator instance (following CodingExercise pattern)
  const exercise = createTestExercise({
    slug: "test-breakpoint-stepper",
    initialCode: `// Test code for breakpoint stepper\nconsole.log("Line 1");\nconsole.log("Line 2");\nconsole.log("Line 3");`
  });
  const orchestratorRef = useRef<Orchestrator>(new Orchestrator(exercise));
  const orchestrator = orchestratorRef.current;

  // Get state from orchestrator store
  const { currentFrame, currentTestTime, breakpoints, foldedLines } = useOrchestratorStore(orchestrator);

  useEffect(() => {
    const frames = mockFrames();

    // Create test state similar to what would come from the test runner
    const testState = {
      slug: "test-1",
      name: "Test 1",
      status: "pass" as const,
      expects: [],
      view: document.createElement("div"),
      frames,
      logLines: [],
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
      <div className="p-8" data-testid="breakpoint-stepper-container">
        <h1 className="text-2xl mb-4">Breakpoint Stepper Buttons E2E Test</h1>

        <div className="mb-4">
          <BreakpointStepperButtons enabled={true} />
        </div>

        <div className="mb-4 p-4 border rounded">
          <h2 className="font-bold mb-2">Current State</h2>
          <div data-testid="current-frame">Frame: {currentFrame.generateDescription()}</div>
          <div data-testid="frame-line">Line: {currentFrame.line}</div>
          <div data-testid="frame-time">Timeline Time: {time}</div>
        </div>

        <div className="mb-4 p-4 border rounded">
          <h2 className="font-bold mb-2">Breakpoints</h2>
          <div data-testid="breakpoints">{breakpoints.length > 0 ? breakpoints.join(", ") : "None"}</div>
          <div className="mt-2 space-x-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((line) => (
              <button
                key={line}
                data-testid={`toggle-breakpoint-${line}`}
                onClick={() => handleToggleBreakpoint(line)}
                className={`px-2 py-1 border rounded ${
                  breakpoints.includes(line) ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
              >
                {line}
              </button>
            ))}
          </div>
          <div className="mt-2 space-x-2">
            <button
              data-testid="clear-breakpoints"
              onClick={handleClearBreakpoints}
              className="px-3 py-1 border rounded bg-gray-200"
            >
              Clear All
            </button>
            <button
              data-testid="set-all-breakpoints"
              onClick={handleSetAllBreakpoints}
              className="px-3 py-1 border rounded bg-gray-200"
            >
              Set All
            </button>
          </div>
        </div>

        <div className="mb-4 p-4 border rounded">
          <h2 className="font-bold mb-2">Folded Lines</h2>
          <div data-testid="folded-lines">{foldedLines.length > 0 ? foldedLines.join(", ") : "None"}</div>
          <div className="mt-2 space-x-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((line) => (
              <button
                key={line}
                data-testid={`toggle-fold-${line}`}
                onClick={() => handleToggleFold(line)}
                className={`px-2 py-1 border rounded ${
                  foldedLines.includes(line) ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {line}
              </button>
            ))}
          </div>
          <div className="mt-2">
            <button
              data-testid="clear-folds"
              onClick={handleClearFolds}
              className="px-3 py-1 border rounded bg-gray-200"
            >
              Clear All Folds
            </button>
          </div>
        </div>

        <div className="mb-4 p-4 border rounded">
          <h2 className="font-bold mb-2">Manual Navigation</h2>
          <div className="space-x-2">
            {mockFrames().map((frame, idx) => (
              <button
                key={idx}
                data-testid={`goto-frame-${idx + 1}`}
                onClick={() => orchestrator.setCurrentTestTime(frame.time)}
                className={`px-2 py-1 border rounded ${
                  currentFrame.line === frame.line ? "bg-green-500 text-white" : "bg-gray-200"
                }`}
              >
                F{idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 p-4 border rounded">
          <h2 className="font-bold mb-2">Debug Info</h2>
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
