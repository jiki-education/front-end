import Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import { createMockFrame, createMockTestResult } from "@/tests/mocks";
import { createMockExercise } from "@/tests/mocks/exercise";

// Mock localStorage functions to prevent actual localStorage usage
jest.mock("@/components/coding-exercise/lib/localStorage", () => ({
  loadCodeMirrorContent: jest.fn(() => ({ success: false })),
  saveCodeMirrorContent: jest.fn()
}));

describe("Store Test Time Persistence", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("testCurrentTimes initialization", () => {
    it("should initialize testCurrentTimes as an empty object", () => {
      const exercise = createMockExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const state = orchestrator.getStore().getState();

      expect(state.testCurrentTimes).toEqual({});
    });
  });

  describe("setCurrentTestTime", () => {
    it("should save the current time to testCurrentTimes when updating time", () => {
      const exercise = createMockExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const test = createMockTestResult({
        frames: [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 })
        ],
        slug: "test-1"
      });

      orchestrator.setCurrentTest(test);
      orchestrator.setCurrentTestTime(150000);

      const state = orchestrator.getStore().getState();
      expect(state.testCurrentTimes["test-1"]).toBe(150000);
    });

    it("should update the saved time when scrubbing multiple times", () => {
      const exercise = createMockExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const test = createMockTestResult({
        frames: [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 })
        ],
        slug: "test-1"
      });

      orchestrator.setCurrentTest(test);

      // First scrub
      orchestrator.setCurrentTestTime(50000);
      let state = orchestrator.getStore().getState();
      expect(state.testCurrentTimes["test-1"]).toBe(50000);

      // Second scrub
      orchestrator.setCurrentTestTime(150000);
      state = orchestrator.getStore().getState();
      expect(state.testCurrentTimes["test-1"]).toBe(150000);

      // Third scrub
      orchestrator.setCurrentTestTime(75000);
      state = orchestrator.getStore().getState();
      expect(state.testCurrentTimes["test-1"]).toBe(75000);
    });

    it("should maintain separate times for different tests", () => {
      const exercise = createMockExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const test1 = createMockTestResult({
        frames: [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 })
        ],
        slug: "test-1"
      });
      const test2 = createMockTestResult({
        frames: [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 })
        ],
        slug: "test-2"
      });

      // Set time for test 1
      orchestrator.setCurrentTest(test1);
      orchestrator.setCurrentTestTime(100000);

      // Set time for test 2
      orchestrator.setCurrentTest(test2);
      orchestrator.setCurrentTestTime(200000);

      const state = orchestrator.getStore().getState();
      expect(state.testCurrentTimes["test-1"]).toBe(100000);
      expect(state.testCurrentTimes["test-2"]).toBe(200000);
    });
  });

  describe("setCurrentTest", () => {
    it("should use the test's initial time when no saved time exists", () => {
      const exercise = createMockExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const test = createMockTestResult({
        frames: [
          createMockFrame(50000, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 })
        ],
        slug: "test-1"
      });

      orchestrator.setCurrentTest(test);

      const state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(50000);
      expect(state.testCurrentTimes["test-1"]).toBe(50000);
    });

    it("should restore the saved time when switching back to a test", () => {
      const exercise = createMockExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const test1 = createMockTestResult({
        frames: [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 })
        ],
        slug: "test-1"
      });
      const test2 = createMockTestResult({
        frames: [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 })
        ],
        slug: "test-2"
      });

      // Set test 1 and scrub to a position
      orchestrator.setCurrentTest(test1);
      orchestrator.setCurrentTestTime(150000);

      // Switch to test 2
      orchestrator.setCurrentTest(test2);
      orchestrator.setCurrentTestTime(75000);

      // Switch back to test 1 - should restore the saved position
      orchestrator.setCurrentTest(test1);

      const state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(150000); // Restored position
      expect(state.currentTest?.slug).toBe("test-1");
    });

    it("should handle switching between multiple tests and preserve all positions", () => {
      const exercise = createMockExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const test1 = createMockTestResult({
        frames: [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 })
        ],
        slug: "test-1"
      });
      const test2 = createMockTestResult({
        frames: [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 })
        ],
        slug: "test-2"
      });
      const test3 = createMockTestResult({
        frames: [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 })
        ],
        slug: "test-3"
      });

      // Set positions for all three tests
      orchestrator.setCurrentTest(test1);
      orchestrator.setCurrentTestTime(100000);

      orchestrator.setCurrentTest(test2);
      orchestrator.setCurrentTestTime(200000);

      orchestrator.setCurrentTest(test3);
      orchestrator.setCurrentTestTime(300000);

      // Verify all positions are saved
      let state = orchestrator.getStore().getState();
      expect(state.testCurrentTimes["test-1"]).toBe(100000);
      expect(state.testCurrentTimes["test-2"]).toBe(200000);
      expect(state.testCurrentTimes["test-3"]).toBe(300000);

      // Switch back to test 2 and verify restoration
      orchestrator.setCurrentTest(test2);
      state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(200000);

      // Switch to test 1 and verify restoration
      orchestrator.setCurrentTest(test1);
      state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(100000);

      // Switch to test 3 and verify restoration
      orchestrator.setCurrentTest(test3);
      state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(300000);
    });

    it("should handle setting a null test", () => {
      const exercise = createMockExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const test = createMockTestResult({
        frames: [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 })
        ],
        slug: "test-1"
      });

      orchestrator.setCurrentTest(test);
      orchestrator.setCurrentTestTime(150000);

      // Set null test
      orchestrator.setCurrentTest(null);

      const state = orchestrator.getStore().getState();
      expect(state.currentTest).toBeNull();
      // Saved times should still be preserved
      expect(state.testCurrentTimes["test-1"]).toBe(150000);
    });

    it("should update the saved time even when switching to the same test", () => {
      const exercise = createMockExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const test = createMockTestResult({
        frames: [
          createMockFrame(0, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 })
        ],
        slug: "test-1"
      });

      orchestrator.setCurrentTest(test);
      orchestrator.setCurrentTestTime(100000);

      // Create a new test object with same slug but different initial time
      const sameTestNewTime = createMockTestResult({
        frames: [
          createMockFrame(50000, { line: 1 }),
          createMockFrame(100000, { line: 2 }),
          createMockFrame(200000, { line: 3 })
        ],
        slug: "test-1"
      });
      orchestrator.setCurrentTest(sameTestNewTime);

      const state = orchestrator.getStore().getState();
      // Should use the saved time, not the new test's initial time
      expect(state.currentTestTime).toBe(100000);
    });
  });

  describe("frame synchronization with persisted times", () => {
    it("should correctly set currentFrame when restoring a saved time that matches a frame", () => {
      const exercise = createMockExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const frames = [
        createMockFrame(0, { line: 1 }),
        createMockFrame(100000, { line: 2 }),
        createMockFrame(200000, { line: 3 })
      ];
      const test1 = createMockTestResult({ frames, slug: "test-1" });
      const test2 = createMockTestResult({ frames, slug: "test-2" });

      // Set test 1 and move to exact frame position
      orchestrator.setCurrentTest(test1);
      orchestrator.setCurrentTestTime(100000); // Exact frame at line 2

      // Switch to test 2
      orchestrator.setCurrentTest(test2);

      // Switch back to test 1
      orchestrator.setCurrentTest(test1);

      const state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(100000);
      expect(state.currentFrame?.line).toBe(2);
    });

    it("should handle restoring a time between frames", () => {
      const exercise = createMockExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const frames = [
        createMockFrame(0, { line: 1 }),
        createMockFrame(100000, { line: 2 }),
        createMockFrame(200000, { line: 3 })
      ];
      const test = createMockTestResult({ frames, slug: "test-1" });

      orchestrator.setCurrentTest(test);
      orchestrator.setCurrentTestTime(150000); // Between frames

      // Switch away and back
      orchestrator.setCurrentTest(null);
      orchestrator.setCurrentTest(test);

      const state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(150000);
      // The time is correctly restored - frame calculation happens via TimelineManager
    });
  });
});
