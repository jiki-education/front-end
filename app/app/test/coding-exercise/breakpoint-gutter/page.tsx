"use client";

import { useRef, useEffect } from "react";
import Orchestrator, { useOrchestratorStore } from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorProvider from "@/components/coding-exercise/lib/OrchestratorProvider";
import { CodeMirror } from "@/components/coding-exercise/ui/codemirror/CodeMirror";
import type { Frame } from "@jiki/interpreters";
import { mockFrame } from "@/tests/mocks";
import { createTestExercise } from "@/tests/mocks/createTestExercise";

function mockFrames(): Frame[] {
  return [
    mockFrame(0, { line: 1 }),
    mockFrame(100000, { line: 2 }), // 100ms
    mockFrame(200000, { line: 3 }), // 200ms
    mockFrame(300000, { line: 4 }), // 300ms
    mockFrame(400000, { line: 5 }), // 400ms
    mockFrame(500000, { line: 6 }), // 500ms
    mockFrame(600000, { line: 7 }), // 600ms
    mockFrame(700000, { line: 8 }) // 700ms
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
  // Use ref to ensure single orchestrator instance (following CodingExercise pattern)
  const exercise = createTestExercise({ slug: "test-breakpoint-gutter", initialCode: TEST_CODE });
  const orchestratorRef = useRef<Orchestrator>(new Orchestrator(exercise));
  const orchestrator = orchestratorRef.current;

  // Get state from orchestrator store
  const { breakpoints } = useOrchestratorStore(orchestrator);

  useEffect(() => {
    const frames = mockFrames();

    // Create test state
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
    <div className="p-8" data-testid="breakpoint-gutter-container">
      <h1 className="text-2xl mb-4">Breakpoint Gutter E2E Test</h1>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <h2 className="font-bold mb-2">CodeMirror Editor</h2>
          <div data-testid="editor-container" className="border rounded" style={{ height: "400px" }}>
            <OrchestratorProvider orchestrator={orchestrator}>
              <CodeMirror />
            </OrchestratorProvider>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Click on line numbers in the gutter to add/remove breakpoints
          </div>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-bold mb-2">Current Breakpoints</h2>
          <div data-testid="breakpoints-display" className="mb-4">
            {breakpoints.length > 0 ? (
              <div className="space-y-1">
                {breakpoints.map((line: number) => (
                  <div
                    key={line}
                    data-testid={`breakpoint-line-${line}`}
                    className="inline-block px-2 py-1 mr-2 bg-red-500 text-white rounded"
                  >
                    Line {line}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No breakpoints set</div>
            )}
          </div>

          <div data-testid="breakpoints-list" className="text-sm">
            Breakpoints: {breakpoints.length > 0 ? breakpoints.join(", ") : "None"}
          </div>
        </div>
      </div>

      <div className="mb-4 p-4 border rounded">
        <h2 className="font-bold mb-2">Manual Controls</h2>
        <div className="space-x-2">
          <button
            data-testid="clear-all-breakpoints"
            onClick={handleClearBreakpoints}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
          >
            Clear All Breakpoints
          </button>
          <button
            data-testid="set-multiple-breakpoints"
            onClick={handleSetMultipleBreakpoints}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
          >
            Set Lines 2, 4, 6
          </button>
        </div>
        <div className="mt-2 space-x-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((line) => (
            <button
              key={line}
              data-testid={`toggle-line-${line}`}
              onClick={() => handleToggleBreakpoint(line)}
              className={`px-2 py-1 border rounded ${
                breakpoints.includes(line) ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
            >
              L{line}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 p-4 border rounded">
        <h2 className="font-bold mb-2">Debug Info</h2>
        <div className="text-sm space-y-1">
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
