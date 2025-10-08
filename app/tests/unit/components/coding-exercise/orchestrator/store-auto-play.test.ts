import { createOrchestratorStore } from "@/components/coding-exercise/lib/orchestrator/store";
import type { TestResult } from "@/components/coding-exercise/lib/test-results-types";

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

describe("Store Auto-Play Behavior", () => {
  const createMockTest = (slug: string, time = 0): TestResult => ({
    slug,
    name: slug,
    status: "pass" as const,
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
      },
      {
        time: 100,
        timeInMs: 0.1,
        line: 2,
        code: "move()",
        status: "SUCCESS" as const,
        generateDescription: () => "Frame 2"
      }
    ],
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
      currentTime: time
    } as any
  });

  describe("setTestSuiteResult", () => {
    it("should set shouldAutoPlay to true", () => {
      const store = createOrchestratorStore("test-uuid", "");
      store.getState().setShouldPlayOnTestChange(false);

      const testResults = {
        tests: [createMockTest("test-1")],
        status: "pass" as const
      };

      store.getState().setTestSuiteResult(testResults);

      expect(store.getState().shouldPlayOnTestChange).toBe(true);
    });

    it("should reset testCurrentTimes before setting first test", () => {
      const store = createOrchestratorStore("test-uuid", "");
      const test1 = createMockTest("test-1");
      const test2 = createMockTest("test-2");

      // First set tests and save a time for test-2
      store.getState().setCurrentTest(test1);
      store.getState().setCurrentTest(test2);
      store.getState().setCurrentTestTime(100);
      expect(store.getState().testCurrentTimes).toHaveProperty("test-2");
      expect(store.getState().testCurrentTimes["test-2"]).toBe(100);

      const testResults = {
        tests: [createMockTest("test-1"), createMockTest("test-2")],
        status: "pass" as const
      };

      store.getState().setTestSuiteResult(testResults);

      // Should have test-1 at 0 (new first test), but test-2 should be cleared
      expect(store.getState().testCurrentTimes).toEqual({ "test-1": 0 });
    });

    it("should set hasCodeBeenEdited to false and status to success", () => {
      const store = createOrchestratorStore("test-uuid", "");
      store.getState().setHasCodeBeenEdited(true);
      store.getState().setStatus("idle");

      const testResults = {
        tests: [createMockTest("test-1")],
        status: "pass" as const
      };

      store.getState().setTestSuiteResult(testResults);

      expect(store.getState().hasCodeBeenEdited).toBe(false);
      expect(store.getState().status).toBe("success");
    });

    it("should call setCurrentTest with first test", () => {
      const store = createOrchestratorStore("test-uuid", "");
      const test1 = createMockTest("test-1");
      const test2 = createMockTest("test-2");

      const testResults = {
        tests: [test1, test2],
        status: "pass" as const
      };

      store.getState().setTestSuiteResult(testResults);

      expect(store.getState().currentTest?.slug).toBe("test-1");
    });

    it("should hide information widget when auto-playing first test", () => {
      const store = createOrchestratorStore("test-uuid", "");

      // Show widget before running tests
      store.getState().setShouldShowInformationWidget(true);

      const testResults = {
        tests: [createMockTest("test-1")],
        status: "pass" as const
      };

      store.getState().setTestSuiteResult(testResults);

      // Widget should be hidden due to auto-play
      expect(store.getState().shouldShowInformationWidget).toBe(false);
    });
  });

  describe("setCurrentTest", () => {
    it("should not set currentTestTime in initial state update", () => {
      const store = createOrchestratorStore("test-uuid", "");
      const test = createMockTest("test-1");

      // The initial set should not include currentTestTime
      // We verify this by checking that currentTestTime is only set via setCurrentTestTime call
      const setCurrentTestTimeSpy = jest.spyOn(store.getState(), "setCurrentTestTime");

      store.getState().setCurrentTest(test);

      // setCurrentTestTime should be called (not set directly in state)
      expect(setCurrentTestTimeSpy).toHaveBeenCalled();
    });

    it("should call setCurrentTestTime with force=true", () => {
      const store = createOrchestratorStore("test-uuid", "");
      const test = createMockTest("test-1");

      const setCurrentTestTimeSpy = jest.spyOn(store.getState(), "setCurrentTestTime");

      store.getState().setCurrentTest(test);

      expect(setCurrentTestTimeSpy).toHaveBeenCalledWith(0, "nearest", true);
    });

    it("should auto-play if shouldAutoPlay is true", () => {
      const store = createOrchestratorStore("test-uuid", "");
      const test = createMockTest("test-1");
      store.getState().setShouldPlayOnTestChange(true);

      store.getState().setCurrentTest(test);

      expect(store.getState().isPlaying).toBe(true);
      expect(test.animationTimeline.play).toHaveBeenCalled();
    });

    it("should not auto-play if shouldAutoPlay is false", () => {
      const store = createOrchestratorStore("test-uuid", "");
      const test = createMockTest("test-1");
      store.getState().setShouldPlayOnTestChange(false);

      store.getState().setCurrentTest(test);

      expect(store.getState().isPlaying).toBe(false);
      expect(test.animationTimeline.play).not.toHaveBeenCalled();
    });

    it("should hide information widget when switching tests with auto-play", () => {
      const store = createOrchestratorStore("test-uuid", "");
      const test1 = createMockTest("test-1");
      const test2 = createMockTest("test-2");

      // Set first test (auto-plays)
      store.getState().setCurrentTest(test1);

      // Pause and show widget
      store.getState().setIsPlaying(false);
      store.getState().setShouldPlayOnTestChange(true);
      store.getState().setShouldShowInformationWidget(true);

      // Switch to second test (should auto-play and hide widget)
      store.getState().setCurrentTest(test2);

      expect(store.getState().shouldShowInformationWidget).toBe(false);
      expect(store.getState().isPlaying).toBe(true);
    });
  });

  describe("setCurrentTestTime with force flag", () => {
    it("should update state when force=true even if time is same", () => {
      const store = createOrchestratorStore("test-uuid", "");
      const test = createMockTest("test-1");
      store.getState().setCurrentTest(test);

      // Set time to 0 (which is already the current time)
      const stateBefore = store.getState();
      store.getState().setCurrentTestTime(0, "exact", true);
      const stateAfter = store.getState();

      // Should still update (force=true bypasses early return)
      expect(stateBefore).not.toBe(stateAfter);
    });

    it("should skip update when time is same and force=false", () => {
      const store = createOrchestratorStore("test-uuid", "");
      const test = createMockTest("test-1");
      store.getState().setCurrentTest(test);

      // Set current time to 100
      store.getState().setCurrentTestTime(100, "exact", true);

      const stateBefore = store.getState();
      // Try to set to 100 again without force
      store.getState().setCurrentTestTime(100, "exact", false);
      const stateAfter = store.getState();

      // Should not update (early return)
      expect(stateBefore).toBe(stateAfter);
    });

    it("should persist time to testCurrentTimes map", () => {
      const store = createOrchestratorStore("test-uuid", "");
      const test = createMockTest("test-1");
      store.getState().setCurrentTest(test);

      store.getState().setCurrentTestTime(150);

      expect(store.getState().testCurrentTimes["test-1"]).toBe(150);
    });
  });

  describe("setIsPlaying", () => {
    it("should call animationTimeline.play when playing=true", () => {
      const store = createOrchestratorStore("test-uuid", "");
      const test = createMockTest("test-1");
      store.getState().setCurrentTest(test);

      store.getState().setIsPlaying(true);

      expect(test.animationTimeline.play).toHaveBeenCalled();
    });

    it("should hide information widget when playing=true", () => {
      const store = createOrchestratorStore("test-uuid", "");
      const test = createMockTest("test-1");

      // Disable auto-play to start paused
      store.getState().setShouldPlayOnTestChange(false);
      store.getState().setCurrentTest(test);

      // Set widget visible while paused
      store.getState().setShouldShowInformationWidget(true);

      // Manually set playing
      store.getState().setIsPlaying(true);

      expect(store.getState().shouldShowInformationWidget).toBe(false);
    });

    it("should not call play when playing=false", () => {
      const store = createOrchestratorStore("test-uuid", "");
      const test = createMockTest("test-1");

      // Don't auto-play on setCurrentTest
      store.getState().setShouldPlayOnTestChange(false);
      store.getState().setCurrentTest(test);

      // Clear the mock from setCurrentTest
      (test.animationTimeline.play as jest.Mock).mockClear();

      // Now call setIsPlaying(false)
      store.getState().setIsPlaying(false);

      expect(test.animationTimeline.play).not.toHaveBeenCalled();
    });
  });

  describe("Success Modal Flow", () => {
    let showModal: jest.Mock;

    beforeEach(() => {
      // Get the mocked showModal function
      showModal = jest.requireMock("@/lib/modal").showModal;
      showModal.mockClear();
    });

    describe("setTestSuiteResult spotlight behavior", () => {
      it("should set isSpotlightActive to true when all tests pass for the FIRST time", () => {
        const store = createOrchestratorStore("test-uuid", "");

        // Verify initial state
        expect(store.getState().hasEverHadSuccessfulRun).toBe(false);
        expect(store.getState().isSpotlightActive).toBe(false);

        const testResults = {
          tests: [createMockTest("test-1"), createMockTest("test-2")],
          status: "pass" as const
        };

        store.getState().setTestSuiteResult(testResults);

        // Should activate spotlight on first success
        expect(store.getState().isSpotlightActive).toBe(true);
        expect(store.getState().hasEverHadSuccessfulRun).toBe(true);
      });

      it("should NOT set isSpotlightActive when all tests pass for the SECOND time", () => {
        const store = createOrchestratorStore("test-uuid", "");

        const testResults = {
          tests: [createMockTest("test-1"), createMockTest("test-2")],
          status: "pass" as const
        };

        // First successful run
        store.getState().setTestSuiteResult(testResults);
        expect(store.getState().isSpotlightActive).toBe(true);
        expect(store.getState().hasEverHadSuccessfulRun).toBe(true);

        // Manually turn off spotlight (simulating modal completion)
        store.getState().setIsSpotlightActive(false);

        // Second successful run
        store.getState().setTestSuiteResult(testResults);

        // Should NOT activate spotlight again
        expect(store.getState().isSpotlightActive).toBe(false);
        expect(store.getState().hasEverHadSuccessfulRun).toBe(true);
      });

      it("should set isSpotlightActive to false when any test fails", () => {
        const store = createOrchestratorStore("test-uuid", "");
        const failedTest = createMockTest("test-1");
        failedTest.status = "fail";

        const testResults = {
          tests: [failedTest, createMockTest("test-2")],
          status: "fail" as const
        };

        store.getState().setTestSuiteResult(testResults);

        expect(store.getState().isSpotlightActive).toBe(false);
        expect(store.getState().hasEverHadSuccessfulRun).toBe(false);
      });

      it("should track hasEverHadSuccessfulRun correctly across multiple runs", () => {
        const store = createOrchestratorStore("test-uuid", "");

        // Initially false
        expect(store.getState().hasEverHadSuccessfulRun).toBe(false);

        // Failed run - should remain false
        const failedResults = {
          tests: [{ ...createMockTest("test-1"), status: "fail" as const }],
          status: "fail" as const
        };
        store.getState().setTestSuiteResult(failedResults);
        expect(store.getState().hasEverHadSuccessfulRun).toBe(false);

        // Successful run - should become true
        const successResults = {
          tests: [createMockTest("test-1")],
          status: "pass" as const
        };
        store.getState().setTestSuiteResult(successResults);
        expect(store.getState().hasEverHadSuccessfulRun).toBe(true);

        // Another failed run - should remain true (once successful, always marked as such)
        store.getState().setTestSuiteResult(failedResults);
        expect(store.getState().hasEverHadSuccessfulRun).toBe(true);
      });

      it("should NOT reset wasSuccessModalShown when running tests again", () => {
        const store = createOrchestratorStore("test-uuid", "");

        // Simulate modal was shown previously
        store.getState().setWasSuccessModalShown(true);
        expect(store.getState().wasSuccessModalShown).toBe(true);

        const testResults = {
          tests: [createMockTest("test-1")],
          status: "pass" as const
        };

        // Run tests again (without code changes)
        store.getState().setTestSuiteResult(testResults);

        // Modal state should persist - it should NOT be reset
        expect(store.getState().wasSuccessModalShown).toBe(true);
      });
    });

    describe("onComplete callback modal display", () => {
      it("should show success modal when all tests pass and modal not shown yet", () => {
        const store = createOrchestratorStore("test-uuid", "");
        const test1 = createMockTest("test-1");

        const testResults = {
          tests: [test1],
          status: "pass" as const
        };

        store.getState().setTestSuiteResult(testResults);

        // Get the onComplete callback that was registered
        const onCompleteCallback = (test1.animationTimeline.onComplete as jest.Mock).mock.calls[0][0];

        // Trigger the callback
        onCompleteCallback();

        expect(showModal).toHaveBeenCalledWith("exercise-success-modal");
        expect(store.getState().wasSuccessModalShown).toBe(true);
        expect(store.getState().isSpotlightActive).toBe(false);
      });

      it("should not show modal when wasSuccessModalShown is true", () => {
        const store = createOrchestratorStore("test-uuid", "");
        const test1 = createMockTest("test-1");

        const testResults = {
          tests: [test1],
          status: "pass" as const
        };

        store.getState().setTestSuiteResult(testResults);

        // Manually set wasSuccessModalShown to true
        store.getState().setWasSuccessModalShown(true);

        // Get the onComplete callback
        const onCompleteCallback = (test1.animationTimeline.onComplete as jest.Mock).mock.calls[0][0];

        // Trigger the callback
        onCompleteCallback();

        expect(showModal).not.toHaveBeenCalled();
        // Spotlight should remain active since modal wasn't shown
        expect(store.getState().isSpotlightActive).toBe(true);
      });

      it("should not show modal when not all tests pass", () => {
        const store = createOrchestratorStore("test-uuid", "");
        const failedTest = createMockTest("test-1");
        failedTest.status = "fail";

        const testResults = {
          tests: [failedTest],
          status: "fail" as const
        };

        store.getState().setTestSuiteResult(testResults);

        // Get the onComplete callback
        const onCompleteCallback = (failedTest.animationTimeline.onComplete as jest.Mock).mock.calls[0][0];

        // Trigger the callback
        onCompleteCallback();

        expect(showModal).not.toHaveBeenCalled();
      });

      it("should disable spotlight after showing modal", () => {
        const store = createOrchestratorStore("test-uuid", "");
        const test1 = createMockTest("test-1");

        const testResults = {
          tests: [test1],
          status: "pass" as const
        };

        store.getState().setTestSuiteResult(testResults);

        // Verify spotlight is active before modal
        expect(store.getState().isSpotlightActive).toBe(true);

        // Get and trigger the onComplete callback
        const onCompleteCallback = (test1.animationTimeline.onComplete as jest.Mock).mock.calls[0][0];
        onCompleteCallback();

        // Spotlight should be disabled after modal shows
        expect(store.getState().isSpotlightActive).toBe(false);
      });
    });
  });
});
