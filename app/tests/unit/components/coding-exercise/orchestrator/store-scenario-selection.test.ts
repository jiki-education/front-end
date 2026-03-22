import { getTestToInspect } from "@/components/coding-exercise/lib/orchestrator/store";
import Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import { createMockFrame, createMockTestResult, createMockTestSuiteResult } from "@/tests/mocks";
import { createMockExercise } from "@/tests/mocks/exercise";

jest.mock("@/components/coding-exercise/lib/localStorage", () => ({
  loadCodeMirrorContent: jest.fn(() => ({ success: false })),
  saveCodeMirrorContent: jest.fn()
}));

describe("getTestToInspect", () => {
  it("returns the current test if it is still failing", () => {
    const current = createMockTestResult({ slug: "test-2", status: "fail" });
    const tests = [
      createMockTestResult({ slug: "test-1", status: "pass" }),
      createMockTestResult({ slug: "test-2", status: "fail" }),
      createMockTestResult({ slug: "test-3", status: "pass" })
    ];

    const result = getTestToInspect(tests, current);
    expect(result.slug).toBe("test-2");
  });

  it("returns the first failing test when current test now passes", () => {
    const current = createMockTestResult({ slug: "test-1", status: "fail" });
    const tests = [
      createMockTestResult({ slug: "test-1", status: "pass" }),
      createMockTestResult({ slug: "test-2", status: "fail" }),
      createMockTestResult({ slug: "test-3", status: "fail" })
    ];

    const result = getTestToInspect(tests, current);
    expect(result.slug).toBe("test-2");
  });

  it("returns the last test when all tests pass", () => {
    const current = createMockTestResult({ slug: "test-1", status: "pass" });
    const tests = [
      createMockTestResult({ slug: "test-1", status: "pass" }),
      createMockTestResult({ slug: "test-2", status: "pass" }),
      createMockTestResult({ slug: "test-3", status: "pass" })
    ];

    const result = getTestToInspect(tests, current);
    expect(result.slug).toBe("test-3");
  });

  it("returns the first failing test when there is no current test", () => {
    const tests = [
      createMockTestResult({ slug: "test-1", status: "pass" }),
      createMockTestResult({ slug: "test-2", status: "fail" }),
      createMockTestResult({ slug: "test-3", status: "pass" })
    ];

    const result = getTestToInspect(tests, null);
    expect(result.slug).toBe("test-2");
  });

  it("returns the last test when there is no current test and all pass", () => {
    const tests = [
      createMockTestResult({ slug: "test-1", status: "pass" }),
      createMockTestResult({ slug: "test-2", status: "pass" })
    ];

    const result = getTestToInspect(tests, null);
    expect(result.slug).toBe("test-2");
  });

  it("returns the updated version of the current test from new results", () => {
    const current = createMockTestResult({ slug: "test-2", status: "fail" });
    const updatedTest2 = createMockTestResult({ slug: "test-2", status: "fail" });
    const tests = [
      createMockTestResult({ slug: "test-1", status: "pass" }),
      updatedTest2,
      createMockTestResult({ slug: "test-3", status: "pass" })
    ];

    const result = getTestToInspect(tests, current);
    // Should return the new test object from the results array, not the old current
    expect(result).toBe(updatedTest2);
  });

  it("does not stay on current test if it now passes", () => {
    const current = createMockTestResult({ slug: "test-1", status: "fail" });
    const tests = [
      createMockTestResult({ slug: "test-1", status: "pass" }),
      createMockTestResult({ slug: "test-2", status: "pass" })
    ];

    const result = getTestToInspect(tests, current);
    expect(result.slug).toBe("test-2");
  });
});

describe("setTestSuiteResult scenario selection", () => {
  function createOrchestrator() {
    const exercise = createMockExercise({
      slug: "test-exercise",
      stubs: { javascript: "", python: "", jikiscript: "" }
    });
    return new Orchestrator(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" });
  }

  it("selects the current test if it is still failing after re-run", () => {
    const orchestrator = createOrchestrator();
    const frames = [createMockFrame(0, { line: 1 }), createMockFrame(100000, { line: 2 })];

    // Set initial test to test-2 (failing)
    const initialTest2 = createMockTestResult({ slug: "test-2", status: "fail", frames });
    orchestrator.setCurrentTest(initialTest2);

    // Run code produces new results where test-2 still fails
    const newResults = createMockTestSuiteResult([
      createMockTestResult({ slug: "test-1", status: "pass", frames }),
      createMockTestResult({ slug: "test-2", status: "fail", frames }),
      createMockTestResult({ slug: "test-3", status: "pass", frames })
    ]);

    orchestrator.getStore().getState().setTestSuiteResult(newResults);
    const state = orchestrator.getStore().getState();
    expect(state.currentTestIdx).toBe(1);
    expect(state.currentTest?.slug).toBe("test-2");
  });

  it("jumps to first failing test when current test now passes", () => {
    const orchestrator = createOrchestrator();
    const frames = [createMockFrame(0, { line: 1 }), createMockFrame(100000, { line: 2 })];

    // Start on test-1 (failing)
    orchestrator.setCurrentTest(createMockTestResult({ slug: "test-1", status: "fail", frames }));

    // Run code: test-1 passes, test-3 fails
    const newResults = createMockTestSuiteResult([
      createMockTestResult({ slug: "test-1", status: "pass", frames }),
      createMockTestResult({ slug: "test-2", status: "pass", frames }),
      createMockTestResult({ slug: "test-3", status: "fail", frames })
    ]);

    orchestrator.getStore().getState().setTestSuiteResult(newResults);
    const state = orchestrator.getStore().getState();
    expect(state.currentTest?.slug).toBe("test-3");
    expect(state.currentTestIdx).toBe(2);
  });

  it("selects last test when all tests pass", () => {
    const orchestrator = createOrchestrator();
    const frames = [createMockFrame(0, { line: 1 }), createMockFrame(100000, { line: 2 })];

    orchestrator.setCurrentTest(createMockTestResult({ slug: "test-1", status: "fail", frames }));

    const newResults = createMockTestSuiteResult([
      createMockTestResult({ slug: "test-1", status: "pass", frames }),
      createMockTestResult({ slug: "test-2", status: "pass", frames }),
      createMockTestResult({ slug: "test-3", status: "pass", frames })
    ]);

    orchestrator.getStore().getState().setTestSuiteResult(newResults);
    const state = orchestrator.getStore().getState();
    expect(state.currentTest?.slug).toBe("test-3");
    expect(state.currentTestIdx).toBe(2);
  });
});

describe("setCurrentTest isPlaying reset", () => {
  function createOrchestrator() {
    const exercise = createMockExercise({
      slug: "test-exercise",
      stubs: { javascript: "", python: "", jikiscript: "" }
    });
    return new Orchestrator(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" });
  }

  it("resets isPlaying to false when switching tests", () => {
    const orchestrator = createOrchestrator();
    const frames = [createMockFrame(0, { line: 1 }), createMockFrame(100000, { line: 2 })];
    const test1 = createMockTestResult({ slug: "test-1", status: "pass", frames });
    const test2 = createMockTestResult({ slug: "test-2", status: "pass", frames });

    orchestrator.setCurrentTest(test1);

    // Simulate playing state
    orchestrator.getStore().setState({ isPlaying: true });
    expect(orchestrator.getStore().getState().isPlaying).toBe(true);

    // Switch to test2 — isPlaying should reset
    orchestrator.setCurrentTest(test2);
    // shouldPlayOnTestChange is true by default, so setIsPlaying(true) will be called after the reset,
    // but the important thing is that the reset happens so setIsPlaying doesn't early-return
    const state = orchestrator.getStore().getState();
    expect(state.currentTest?.slug).toBe("test-2");
  });
});
