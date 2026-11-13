import { createMockExercise } from "@/tests/mocks/exercise";
import { createOrchestratorStore } from "@/components/coding-exercise/lib/orchestrator/store";
import { showModal } from "@/lib/modal";
import { markLessonComplete } from "@/lib/api/lessons";
import { markChallengeComplete } from "@/lib/api/challenges";
import type { TestResult, TestSuiteResult } from "@/components/coding-exercise/lib/test-results-types";
import type { ExerciseContext } from "@/components/coding-exercise/lib/types";

jest.mock("@/lib/modal", () => ({
  showModal: jest.fn()
}));

jest.mock("@/lib/api/lessons", () => ({
  markLessonComplete: jest.fn().mockResolvedValue({ meta: { events: [] } })
}));

jest.mock("@/lib/api/challenges", () => ({
  markChallengeComplete: jest.fn().mockResolvedValue({ meta: { events: [] } })
}));

jest.mock("@/components/coding-exercise/lib/orchestrator/TimelineManager", () => ({
  TimelineManager: {
    findNearestFrame: jest.fn((frames) => frames[0]),
    findPrevFrame: jest.fn(),
    findNextFrame: jest.fn()
  }
}));

jest.mock("@/components/coding-exercise/lib/orchestrator/BreakpointManager", () => ({
  BreakpointManager: {
    findPrevBreakpointFrame: jest.fn(),
    findNextBreakpointFrame: jest.fn()
  }
}));

// The mock exercise has required scenarios test-scenario-1/2 and a bonus
// scenario test-scenario-bonus. `passed` only reflects the required ones.
describe("bonus_passed on the complete call", () => {
  let registeredOnComplete: (() => void) | null = null;

  const createMockTest = (slug: string, status: "pass" | "fail"): TestResult =>
    ({
      type: "visual" as const,
      slug,
      name: slug,
      status,
      expects: [],
      view: document.createElement("div"),
      frames: [
        {
          time: 0,
          timeInMs: 0,
          line: 1,
          code: "move()",
          status: "SUCCESS" as const,
          generateDescription: () => "Frame 1"
        }
      ],
      logLines: [],
      lintErrors: [],
      animationTimeline: {
        play: jest.fn(),
        pause: jest.fn(),
        seek: jest.fn(),
        onUpdate: jest.fn(),
        onComplete: jest.fn((cb: () => void) => {
          registeredOnComplete = cb;
        }),
        clearUpdateCallbacks: jest.fn(),
        clearCompleteCallbacks: jest.fn(),
        completed: false,
        currentTime: 0,
        duration: 1_000_000
      }
    }) as any;

  const suite = (bonusStatus: "pass" | "fail"): TestSuiteResult => ({
    tests: [
      createMockTest("test-scenario-1", "pass"),
      createMockTest("test-scenario-2", "pass"),
      createMockTest("test-scenario-bonus", bonusStatus)
    ],
    passed: true
  });

  const createStore = (context: ExerciseContext = { type: "lesson", slug: "look-around" }) =>
    createOrchestratorStore({
      exercise: createMockExercise(),
      language: "javascript",
      context
    } as any);

  async function completeWith(store: ReturnType<typeof createStore>, result: TestSuiteResult) {
    store.getState().setTestSuiteResult(result);
    registeredOnComplete!();
    const props = (showModal as jest.Mock).mock.calls[0][1];
    await props.onCompleteExercise();
  }

  beforeEach(() => {
    jest.clearAllMocks();
    registeredOnComplete = null;
  });

  test("sends bonus_passed true when every bonus scenario passes", async () => {
    await completeWith(createStore(), suite("pass"));
    expect(markLessonComplete).toHaveBeenCalledWith("look-around", true);
  });

  test("sends bonus_passed false when a bonus scenario is still failing", async () => {
    await completeWith(createStore(), suite("fail"));
    expect(markLessonComplete).toHaveBeenCalledWith("look-around", false);
  });

  test("challenges complete without a bonus flag", async () => {
    await completeWith(createStore({ type: "challenge", slug: "structured-house" }), suite("pass"));
    expect(markChallengeComplete).toHaveBeenCalledWith("structured-house");
    expect(markLessonComplete).not.toHaveBeenCalled();
  });
});
