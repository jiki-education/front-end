"use client";

import Orchestrator, { useOrchestratorStore } from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorProvider from "@/components/coding-exercise/lib/OrchestratorProvider";
import { CodeMirror } from "@/components/coding-exercise/ui/codemirror/CodeMirror";
import { createMockFrame } from "@/tests/mocks";
import { createMockExercise } from "@/tests/mocks/exercise";
import type { Frame } from "@jiki/interpreters";
import { useEffect, useRef } from "react";

// Create frames for testing
function mockFrames(): Frame[] {
  return Array.from({ length: 15 }, (_, i) =>
    createMockFrame((i + 1) * 100000, {
      line: i + 1,
      generateDescription: () => `Frame ${i + 1}`
    })
  );
}

const TEST_CODE = `function calculateStats(numbers) {
  // Calculate sum
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }

  // Calculate average
  const average = sum / numbers.length;

  // Find min and max
  let min = numbers[0];
  let max = numbers[0];
  for (const num of numbers) {
    if (num < min) {
      min = num;
    }
    if (num > max) {
      max = num;
    }
  }

  return {
    sum: sum,
    average: average,
    min: min,
    max: max
  };
}

// Test the function
const data = [10, 20, 30, 40, 50];
const stats = calculateStats(data);
console.log("Statistics:", stats);`;

export default function CodeFoldingTestPage() {
  // Use ref to ensure single orchestrator instance (following CodingExercise pattern)
  const exercise = createMockExercise({ slug: "test-code-folding", initialCode: TEST_CODE });
  const orchestratorRef = useRef<Orchestrator>(new Orchestrator(exercise));
  const orchestrator = orchestratorRef.current;

  // Get state from orchestrator store
  const { foldedLines } = useOrchestratorStore(orchestrator);

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
    // Fold the for loops (lines 4-6 and 14-20)
    orchestrator.setFoldedLines([4, 14]);
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
      <div className="p-8" data-testid="code-folding-container">
        <h1 className="text-2xl mb-4">Code Folding E2E Test</h1>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h2 className="font-bold mb-2">CodeMirror Editor</h2>
            <div
              data-testid="editor-container"
              className="border rounded"
              style={{ height: "500px", overflow: "auto" }}
            >
              <CodeMirror />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Click on fold indicators (arrows) in the gutter to collapse/expand code blocks
            </div>
          </div>

          <div className="border rounded p-4">
            <h2 className="font-bold mb-2">Current Folded Lines</h2>
            <div data-testid="folded-lines-display" className="mb-4">
              {foldedLines.length > 0 ? (
                <div className="space-y-1">
                  {foldedLines.map((line) => (
                    <div
                      key={line}
                      data-testid={`folded-line-${line}`}
                      className="inline-block px-2 py-1 mr-2 bg-blue-500 text-white rounded"
                    >
                      Line {line}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No lines folded</div>
              )}
            </div>

            <div data-testid="folded-lines-list" className="text-sm">
              Folded Lines: {foldedLines.length > 0 ? foldedLines.join(", ") : "None"}
            </div>
          </div>
        </div>

        <div className="mb-4 p-4 border rounded">
          <h2 className="font-bold mb-2">Manual Controls</h2>
          <div className="space-x-2">
            <button
              data-testid="clear-all-folds"
              onClick={handleClearFolds}
              className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
            >
              Expand All
            </button>
            <button
              data-testid="fold-multiple"
              onClick={handleFoldMultiple}
              className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
            >
              Fold For Loops
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Foldable blocks: for loops (lines 4-6, 14-20), function body (lines 1-28)
          </div>
          <div className="mt-2 space-x-2">
            {[1, 4, 14].map((line) => (
              <button
                key={line}
                data-testid={`toggle-fold-${line}`}
                onClick={() => handleToggleFold(line)}
                className={`px-2 py-1 border rounded ${
                  foldedLines.includes(line) ? "bg-blue-500 text-white" : "bg-gray-200"
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
              Total Folded Lines: <span data-testid="fold-count">{foldedLines.length}</span>
            </div>
            <div>
              Editor Loaded: <span data-testid="editor-loaded">{orchestrator.getEditorView() ? "Yes" : "No"}</span>
            </div>
            <div className="mt-2">
              <div className="font-semibold">Code Structure:</div>
              <ul className="ml-4 text-xs">
                <li>• Function definition: Lines 1-28</li>
                <li>• First for loop: Lines 4-6</li>
                <li>• Second for loop: Lines 14-20</li>
                <li>• Return statement: Lines 22-27</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </OrchestratorProvider>
  );
}
