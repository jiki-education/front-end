import { createOrchestratorStore } from "@/components/coding-exercise/lib/orchestrator/store";
import type { TestResult } from "@/components/coding-exercise/lib/test-results-types";
import { createMockExercise } from "@/tests/mocks/exercise";

// Mock modal system
jest.mock("@/lib/modal", () => ({
  showModal: jest.fn()
}));

// Mock TimelineManager
jest.mock("@/components/coding-exercise/lib/orchestrator/TimelineManager", () => ({
  TimelineManager: {
    findNearestFrame: jest.fn((frames) => frames[0]),
    findPrevFrame: jest.fn(),
    findNextFrame: jest.fn()
  }
}));

// Mock BreakpointManager
jest.mock("@/components/coding-exercise/lib/orchestrator/BreakpointManager", () => ({
  BreakpointManager: {
    findPrevBreakpointFrame: jest.fn(),
    findNextBreakpointFrame: jest.fn()
  }
}));

describe("Store Animation Replay Bug", () => {
  const createMockTest = (slug: string, frames: any[] = []): TestResult => ({
    type: "visual" as const,
    slug,
    name: slug,
    status: "pass" as const,
    expects: [],
    view: document.createElement("div"),
    frames,
    logLines: [],
    animationTimeline: {
      play: jest.fn(),
      pause: jest.fn(),
      seek: jest.fn(),
      onUpdate: jest.fn(),
      onComplete: jest.fn(),
      clearUpdateCallbacks: jest.fn(),
      clearCompleteCallbacks: jest.fn(),
      completed: false,
      currentTime: 0
    } as any
  });

  it("should reset isPlaying when setting new test suite results", () => {
    const exercise = createMockExercise({ slug: "test-uuid", stubs: { javascript: "", python: "", jikiscript: "" } });
    const store = createOrchestratorStore(exercise, "jikiscript");

    // First test run - with frames (will auto-play)
    const firstTest = createMockTest("test-1", [
      {
        time: 0,
        timeInMs: 0,
        line: 1,
        code: "move()",
        status: "SUCCESS" as const,
        generateDescription: () => "Frame 1"
      }
    ]);

    const firstResults = {
      tests: [firstTest],
      status: "pass" as const
    };

    store.getState().setTestSuiteResult(firstResults);

    // Verify animation started playing
    expect(store.getState().isPlaying).toBe(true);
    expect(firstTest.animationTimeline!.play).toHaveBeenCalledTimes(1);

    // Second test run - with different frames
    const secondTest = createMockTest("test-2", [
      {
        time: 0,
        timeInMs: 0,
        line: 1,
        code: "move()",
        status: "SUCCESS" as const,
        generateDescription: () => "Frame 1"
      },
      {
        time: 100,
        timeInMs: 0.1,
        line: 2,
        code: "turn_left()",
        status: "SUCCESS" as const,
        generateDescription: () => "Frame 2"
      }
    ]);

    const secondResults = {
      tests: [secondTest],
      status: "pass" as const
    };

    store.getState().setTestSuiteResult(secondResults);

    // BUG: Without resetting isPlaying, the second animation won't play
    // because setIsPlaying(true) will return early if isPlaying is already true
    expect(store.getState().isPlaying).toBe(true);
    expect(secondTest.animationTimeline!.play).toHaveBeenCalledTimes(1);
  });

  it("should allow animation to play after empty/failed first run", () => {
    const exercise = createMockExercise({ slug: "test-uuid", stubs: { javascript: "", python: "", jikiscript: "" } });
    const store = createOrchestratorStore(exercise, "jikiscript");

    // First test run - empty repeat loop (no frames)
    const firstTest = createMockTest("test-1", []);

    const firstResults = {
      tests: [firstTest],
      status: "fail" as const
    };

    // Manually set isPlaying to true to simulate the bug state
    // (In reality this might happen if animation completed but state wasn't reset)
    store.getState().setTestSuiteResult(firstResults);

    // Simulate isPlaying being stuck at true from previous run
    store.getState().setIsPlaying(true);

    // Second test run - valid movement code with frames
    const secondTest = createMockTest("test-2", [
      {
        time: 0,
        timeInMs: 0,
        line: 1,
        code: "move()",
        status: "SUCCESS" as const,
        generateDescription: () => "Frame 1"
      },
      {
        time: 100,
        timeInMs: 0.1,
        line: 2,
        code: "move()",
        status: "SUCCESS" as const,
        generateDescription: () => "Frame 2"
      }
    ]);

    const secondResults = {
      tests: [secondTest],
      status: "pass" as const
    };

    store.getState().setTestSuiteResult(secondResults);

    // The bug: If isPlaying isn't reset, setIsPlaying(true) will return early
    // and animationTimeline.play() won't be called
    expect(secondTest.animationTimeline!.play).toHaveBeenCalledTimes(1);
  });
});
