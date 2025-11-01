"use client";
import { createMockFrame } from "@/tests/mocks";

import Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import { TimelineManager } from "@/components/coding-exercise/lib/orchestrator/TimelineManager";
import OrchestratorProvider from "@/components/coding-exercise/lib/OrchestratorProvider";
import FrameStepperButtons from "@/components/coding-exercise/ui/scrubber/FrameStepperButtons";
import { createMockExercise } from "@/tests/mocks/exercise";
import type { Frame } from "@jiki/interpreters";
import { useEffect, useState } from "react";
import { FrameInfo } from "../ui-utils/FrameInfo";
import { LineFoldingControls } from "../ui-utils/LineFoldingControls";

// Create test frames similar to mockFrames
function mockFrames(): Frame[] {
  return [
    createMockFrame(0, { line: 1, generateDescription: () => "Frame 1" }),
    createMockFrame(100000, { line: 2, generateDescription: () => "Frame 2" }), // 100ms
    createMockFrame(200000, { line: 3, generateDescription: () => "Frame 3" }), // 200ms
    createMockFrame(300000, { line: 4, generateDescription: () => "Frame 4" }), // 300ms
    createMockFrame(400000, { line: 5, generateDescription: () => "Frame 5" }) // 400ms
  ];
}

export default function FrameStepperButtonsTestPage() {
  const [orchestrator, setOrchestrator] = useState<Orchestrator | null>(null);

  useEffect(() => {
    const exercise = createMockExercise({
      slug: "test-exercise",
      initialCode: "// Test code for frame stepping"
    });
    const orch = new Orchestrator(exercise);

    // Create test frames and set up the test state
    const frames = mockFrames();

    // Initialize the orchestrator's test state with frames
    // Calculate initial prev/next frames
    const initialPrevFrame = TimelineManager.findPrevFrame(frames, frames[0], []);
    const initialNextFrame = TimelineManager.findNextFrame(frames, frames[0], []);

    orch.getStore().setState({
      currentTest: {
        type: "visual" as const,
        slug: "test-1",
        name: "Test 1",
        status: "pass" as const,
        expects: [],
        view: document.createElement("div"),
        frames,
        logLines: [],
        animationTimeline: {
          duration: 5,
          paused: true,
          seek: (_time: number) => {
            // Don't call setCurrentTestTime here to avoid circular dependency
            // The orchestrator will handle the timeline updates
          },
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
            duration: 5,
            currentTime: 0
          }
        } as any
      },
      // Current test time and frame at top level
      currentTestTime: 0,
      currentFrame: frames[0],
      // Frame navigation state at top level
      prevFrame: initialPrevFrame,
      nextFrame: initialNextFrame
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
      <div className="p-8">
        <h1 className="text-2xl mb-4">FrameStepper Buttons E2E Test Page</h1>

        <div className="mb-4">
          <h2 className="font-bold mb-2">Controls:</h2>
          <div data-testid="frame-stepper-container">
            <FrameStepperButtons enabled={true} />
          </div>
        </div>

        <FrameInfo orchestrator={orchestrator} />
        <LineFoldingControls orchestrator={orchestrator} />
      </div>
    </OrchestratorProvider>
  );
}
