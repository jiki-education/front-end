import { createMockExercise } from "@/tests/mocks/exercise";
import { createOrchestratorStore } from "@/components/coding-exercise/lib/orchestrator/store";
import { showModal } from "@/lib/modal";
import type { TestResult, TestSuiteResult } from "@/components/coding-exercise/lib/test-results-types";

jest.mock("@/lib/modal", () => ({
  showModal: jest.fn()
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

// The spotlight makes the whole exercise inert and is only ever cleared by the
// completion modal, which normally hangs off the inspected timeline's onComplete.
// These tests cover the deadline that backstops that single callback.
describe("Completion modal fallback deadline", () => {
  const SLACK_MS = 2000;

  // Captures the onComplete handler the store registers, so a test can decide
  // whether the animation "finishes" or silently never reports back.
  let registeredOnComplete: (() => void) | null = null;

  const createMockTest = (slug: string, status: "pass" | "fail" = "pass"): TestResult =>
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
        // Microseconds, so 2000ms of playback.
        duration: 2_000_000
      }
    }) as any;

  const passingSuite = (tests: TestResult[]): TestSuiteResult => ({
    tests,
    passed: tests.every((t) => t.status === "pass")
  });

  const createStore = () =>
    createOrchestratorStore({
      exercise: createMockExercise(),
      language: "javascript",
      context: { type: "lesson", slug: "look-around" }
    } as any);

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    registeredOnComplete = null;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("shows the completion modal and clears the spotlight when onComplete never fires", () => {
    const store = createStore();
    const test = createMockTest("cover-old-ground");

    store.getState().setTestSuiteResult(passingSuite([test]));

    // The spotlight is up and the page is inert; nothing has completed yet.
    expect(store.getState().isSpotlightActive).toBe(true);
    expect(showModal).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000 + SLACK_MS);

    expect(showModal).toHaveBeenCalledTimes(1);
    expect(showModal).toHaveBeenCalledWith("exercise-completion-modal", expect.anything());
    expect(store.getState().isSpotlightActive).toBe(false);
  });

  test("does not fire while the animation could still legitimately be playing", () => {
    const store = createStore();
    store.getState().setTestSuiteResult(passingSuite([createMockTest("cover-old-ground")]));

    // One tick short of the animation's own duration plus the slack.
    jest.advanceTimersByTime(2000 + SLACK_MS - 1);

    expect(showModal).not.toHaveBeenCalled();
    expect(store.getState().isSpotlightActive).toBe(true);
  });

  test("seeks the timeline to the end so the modal isn't laid over a half-played animation", () => {
    const store = createStore();
    const test = createMockTest("cover-old-ground");

    store.getState().setTestSuiteResult(passingSuite([test]));
    jest.advanceTimersByTime(2000 + SLACK_MS);

    // Muted, so the seek doesn't fire onComplete and re-enter the completion path.
    expect(test.animationTimeline!.seek).toHaveBeenCalledWith(2_000_000, true);
  });

  test("does not show the modal twice when onComplete fires normally", () => {
    const store = createStore();
    store.getState().setTestSuiteResult(passingSuite([createMockTest("cover-old-ground")]));

    expect(registeredOnComplete).not.toBeNull();
    registeredOnComplete!();

    expect(showModal).toHaveBeenCalledTimes(1);
    expect(store.getState().isSpotlightActive).toBe(false);

    // The deadline is cancelled by the normal path, so time passing changes nothing.
    jest.advanceTimersByTime(2000 + SLACK_MS);
    expect(showModal).toHaveBeenCalledTimes(1);
  });

  test("is not armed when the suite hasn't passed", () => {
    const store = createStore();
    store.getState().setTestSuiteResult(passingSuite([createMockTest("cover-old-ground", "fail")]));

    expect(store.getState().isSpotlightActive).toBe(false);

    jest.advanceTimersByTime(2000 + SLACK_MS);
    expect(showModal).not.toHaveBeenCalled();
  });

  test("a deadline from an earlier run can't fire against a later one", () => {
    const store = createStore();
    store.getState().setTestSuiteResult(passingSuite([createMockTest("cover-old-ground")]));

    // Student edits and re-runs before the first deadline would have expired.
    jest.advanceTimersByTime(500);
    store.getState().setTestSuiteResult(passingSuite([createMockTest("cover-old-ground")]));

    // The first run's deadline would have landed here. It was cancelled, so nothing fires.
    jest.advanceTimersByTime(2000 + SLACK_MS - 500);
    expect(showModal).not.toHaveBeenCalled();

    // The second run's deadline, measured from its own start, lands 500ms later.
    jest.advanceTimersByTime(500);
    expect(showModal).toHaveBeenCalledTimes(1);
  });
});
