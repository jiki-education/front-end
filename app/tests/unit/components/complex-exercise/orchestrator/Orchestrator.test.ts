import Orchestrator, { useOrchestratorStore } from "@/components/complex-exercise/lib/Orchestrator";
import * as localStorage from "@/components/complex-exercise/lib/localStorage";
import { mockAnimationTimeline, mockFrame } from "@/tests/mocks";
import { createTestExercise } from "@/tests/mocks/createTestExercise";
import { renderHook } from "@testing-library/react";

// Mock localStorage functions
jest.mock("@/components/complex-exercise/lib/localStorage", () => ({
  loadCodeMirrorContent: jest.fn(),
  saveCodeMirrorContent: jest.fn()
}));

const mockLoadCodeMirrorContent = localStorage.loadCodeMirrorContent as jest.MockedFunction<
  typeof localStorage.loadCodeMirrorContent
>;

describe("Orchestrator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock - no localStorage data
    mockLoadCodeMirrorContent.mockReturnValue({
      success: false,
      error: "No data found for this exercise"
    });
  });

  describe("constructor", () => {
    it("should initialize with provided exercise definition", () => {
      const exercise = createTestExercise({
        slug: "test-uuid",
        initialCode: "const x = 1;"
      });
      const orchestrator = new Orchestrator(exercise);
      const state = orchestrator.getStore().getState();

      expect(state.exerciseUuid).toBe("test-uuid");
      expect(state.code).toBe("const x = 1;");
    });

    it("should initialize with default values", () => {
      const exercise = createTestExercise({
        slug: "test-uuid",
        initialCode: ""
      });
      const orchestrator = new Orchestrator(exercise);
      const state = orchestrator.getStore().getState();

      expect(state.output).toBe("");
      expect(state.status).toBe("idle");
      expect(state.error).toBeNull();
      expect(state.hasCodeBeenEdited).toBe(false);
      expect(state.isSpotlightActive).toBe(false);
      expect(state.foldedLines).toEqual([]);
    });

    it("should create separate instances with separate stores", () => {
      const exercise1 = createTestExercise({ slug: "uuid1", initialCode: "code1" });
      const exercise2 = createTestExercise({ slug: "uuid2", initialCode: "code2" });
      const orchestrator1 = new Orchestrator(exercise1);
      const orchestrator2 = new Orchestrator(exercise2);

      const state1 = orchestrator1.getStore().getState();
      const state2 = orchestrator2.getStore().getState();

      expect(state1.exerciseUuid).toBe("uuid1");
      expect(state2.exerciseUuid).toBe("uuid2");
      expect(state1.code).toBe("code1");
      expect(state2.code).toBe("code2");
    });
  });

  describe("getStore", () => {
    it("should return the store instance", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const store = orchestrator.getStore();

      expect(store).toBeDefined();
      expect(typeof store.getState).toBe("function");
      expect(typeof store.subscribe).toBe("function");
    });
  });

  describe("animation completion", () => {
    it("should set isPlaying to false when animation completes", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const mockTimeline = mockAnimationTimeline();

      orchestrator.setCurrentTest({
        slug: "test-1",
        name: "Test 1",
        status: "pass" as const,
        expects: [],
        view: document.createElement("div"),
        frames: [mockFrame(0, { line: 1 })],
        animationTimeline: mockTimeline
      });

      // Start playing
      orchestrator.play();
      expect(orchestrator.getStore().getState().isPlaying).toBe(true);

      // Simulate animation completion by triggering onComplete callback
      const onCompleteCallback = (mockTimeline.onComplete as jest.Mock).mock.calls[0][0];
      onCompleteCallback(mockTimeline);

      // Should set isPlaying to false
      expect(orchestrator.getStore().getState().isPlaying).toBe(false);
    });

    it("should register onComplete callback when setting current test", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const mockTimeline = mockAnimationTimeline();

      orchestrator.setCurrentTest({
        slug: "test-1",
        name: "Test 1",
        status: "pass" as const,
        expects: [],
        view: document.createElement("div"),
        frames: [mockFrame(0, { line: 1 })],
        animationTimeline: mockTimeline
      });

      // Verify onComplete callback was registered
      expect(mockTimeline.onComplete).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should clear complete callbacks when changing tests", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const mockTimeline1 = mockAnimationTimeline();
      const mockTimeline2 = mockAnimationTimeline();

      // Set first test
      orchestrator.setCurrentTest({
        slug: "test-1",
        name: "Test 1",
        status: "pass" as const,
        expects: [],
        view: document.createElement("div"),
        frames: [mockFrame(0, { line: 1 })],
        animationTimeline: mockTimeline1
      });

      // Set second test - should clear callbacks from first timeline
      orchestrator.setCurrentTest({
        slug: "test-2",
        name: "Test 2",
        status: "pass" as const,
        expects: [],
        view: document.createElement("div"),
        frames: [mockFrame(0, { line: 1 })],
        animationTimeline: mockTimeline2
      });

      expect(mockTimeline1.clearCompleteCallbacks).toHaveBeenCalled();
      expect(mockTimeline2.onComplete).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should allow multiple play/complete cycles", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const mockTimeline = mockAnimationTimeline();

      orchestrator.setCurrentTest({
        slug: "test-1",
        name: "Test 1",
        status: "pass" as const,
        expects: [],
        view: document.createElement("div"),
        frames: [mockFrame(0, { line: 1 }), mockFrame(100000, { line: 2 })],
        animationTimeline: mockTimeline
      });

      const onCompleteCallback = (mockTimeline.onComplete as jest.Mock).mock.calls[0][0];

      // First cycle: play and complete
      Object.defineProperty(mockTimeline, "completed", { value: false, writable: true });
      orchestrator.play();
      expect(orchestrator.getStore().getState().isPlaying).toBe(true);

      Object.defineProperty(mockTimeline, "completed", { value: true, writable: true });
      onCompleteCallback(mockTimeline);
      expect(orchestrator.getStore().getState().isPlaying).toBe(false);

      // Second cycle: play should reset and start again
      orchestrator.play();
      expect(orchestrator.getStore().getState().currentTestTime).toBe(0);
      expect(orchestrator.getStore().getState().isPlaying).toBe(true);

      // Complete again
      onCompleteCallback(mockTimeline);
      expect(orchestrator.getStore().getState().isPlaying).toBe(false);
    });
  });

  describe("frame synchronization", () => {
    it("should only update currentFrame when landing exactly on a frame", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);

      // Create custom test frames
      const testFrames = [
        mockFrame(0, { line: 1 }),
        mockFrame(100000, { line: 2 }),
        mockFrame(200000, { line: 3 }),
        mockFrame(300000, { line: 4 }),
        mockFrame(400000, { line: 5 })
      ];

      // Set up test state with custom frames
      orchestrator.setCurrentTest({
        slug: "test-1",
        name: "Test 1",
        status: "pass" as const,
        expects: [],
        view: document.createElement("div"),
        frames: testFrames,
        animationTimeline: mockAnimationTimeline()
      });

      const state = orchestrator.getStore().getState();

      // Initial frame should be the first one
      expect(state.currentFrame?.line).toBe(1);

      // Change timeline time to between frames (should NOT update currentFrame)
      orchestrator.setCurrentTestTime(150000);
      let updatedState = orchestrator.getStore().getState();
      expect(updatedState.currentFrame?.line).toBe(1); // Should stay at 1

      // Change timeline time to exact frame position (should update currentFrame)
      orchestrator.setCurrentTestTime(200000);
      updatedState = orchestrator.getStore().getState();
      expect(updatedState.currentFrame?.line).toBe(3); // Should update to line 3
    });

    it("should recalculate navigation frames when setFoldedLines is called", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);

      // Create custom test frames
      const testFrames = [
        mockFrame(0, { line: 1 }),
        mockFrame(100000, { line: 2 }),
        mockFrame(200000, { line: 3 }),
        mockFrame(300000, { line: 4 })
      ];

      // Set up test state with custom frames at line 2
      orchestrator.setCurrentTest({
        slug: "test-1",
        name: "Test 1",
        status: "pass" as const,
        expects: [],
        view: document.createElement("div"),
        frames: testFrames,
        animationTimeline: mockAnimationTimeline()
      });

      // Set to line 2's time
      let state = orchestrator.getStore().getState();
      state.setCurrentTestTime(100000, "exact");

      // Refresh it
      state = orchestrator.getStore().getState();
      expect(state.currentFrame?.line).toBe(2);

      // Fold line 2
      orchestrator.setFoldedLines([2]);

      // When folding the current frame's line, it moves to the next non-folded frame
      state = orchestrator.getStore().getState();
      expect(state.currentFrame?.line).toBe(3);

      // Navigation frames should skip the folded line
      expect(state.prevFrame?.line).toBe(1);
      expect(state.nextFrame?.line).toBe(4);
    });
  });

  describe("useOrchestratorStore hook", () => {
    it("should return the current state", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "initial code" });
      const orchestrator = new Orchestrator(exercise);

      const { result } = renderHook(() => useOrchestratorStore(orchestrator));

      expect(result.current.exerciseUuid).toBe("test-uuid");
      expect(result.current.code).toBe("initial code");
      expect(result.current.output).toBe("");
      expect(result.current.status).toBe("idle");
      expect(result.current.error).toBeNull();
      expect(result.current.hasCodeBeenEdited).toBe(false);
      expect(result.current.isSpotlightActive).toBe(false);
      expect(result.current.foldedLines).toEqual([]);
      expect(result.current.currentTest).toBeDefined();
    });

    it("should use shallow equality to prevent unnecessary renders", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "code" });
      const orchestrator = new Orchestrator(exercise);

      const { result, rerender } = renderHook(() => useOrchestratorStore(orchestrator));

      const firstResult = result.current;

      // Rerender without changing anything
      rerender();

      const secondResult = result.current;

      // Should be the same object reference due to useShallow
      expect(firstResult).toBe(secondResult);
    });
  });

  describe("information widget methods", () => {
    let orchestrator: Orchestrator;

    beforeEach(() => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "initial code" });
      orchestrator = new Orchestrator(exercise);
    });

    describe("showInformationWidget", () => {
      it("should delegate to editorManager when it exists", () => {
        const mockShowInformationWidget = jest.fn();
        (orchestrator as any).editorManager = {
          showInformationWidget: mockShowInformationWidget
        };

        orchestrator.showInformationWidget();

        expect(mockShowInformationWidget).toHaveBeenCalled();
      });

      it("should not throw when editorManager is null", () => {
        (orchestrator as any).editorManager = null;

        expect(() => orchestrator.showInformationWidget()).not.toThrow();
      });
    });

    describe("hideInformationWidget", () => {
      it("should delegate to editorManager when it exists", () => {
        const mockHideInformationWidget = jest.fn();
        (orchestrator as any).editorManager = {
          hideInformationWidget: mockHideInformationWidget
        };

        orchestrator.hideInformationWidget();

        expect(mockHideInformationWidget).toHaveBeenCalled();
      });

      it("should not throw when editorManager is null", () => {
        (orchestrator as any).editorManager = null;

        expect(() => orchestrator.hideInformationWidget()).not.toThrow();
      });
    });
  });

  describe("initializeExerciseData", () => {
    it("should initialize data automatically in constructor", () => {
      // Arrange
      const exercise = createTestExercise({
        slug: "test-uuid",
        initialCode: "initial code"
      });
      const orchestrator = new Orchestrator(exercise);

      // Assert - initializeExerciseData is now called in the constructor
      const state = orchestrator.getStore().getState();
      expect(state.code).toBe("initial code");
      expect(state.defaultCode).toBe("initial code");
    });

    it("should prefer localStorage when it exists and is newer", () => {
      // Arrange
      const localCode = "localStorage code";
      const serverCode = "server code";
      const serverTime = new Date();
      const localTime = new Date(serverTime.getTime() + 120000); // 2 minutes later

      mockLoadCodeMirrorContent.mockReturnValue({
        success: true,
        data: {
          code: localCode,
          storedAt: localTime.toISOString(),
          exerciseId: "test-uuid",
          version: 1
        }
      });

      const exercise = createTestExercise({
        slug: "test-uuid",
        initialCode: serverCode
      });
      const orchestrator = new Orchestrator(exercise);

      // Act - initializeExerciseData is called automatically in constructor

      // Assert
      const state = orchestrator.getStore().getState();
      expect(state.code).toBe(localCode);
      expect(state.defaultCode).toBe(localCode);
    });
  });

  describe("play() method", () => {
    it("should play timeline when shouldAutoPlay is true", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const mockTimeline = mockAnimationTimeline();

      orchestrator.setCurrentTest({
        slug: "test-1",
        name: "Test 1",
        status: "pass" as const,
        expects: [],
        view: document.createElement("div"),
        frames: [mockFrame(0, { line: 1 })],
        animationTimeline: mockTimeline
      });

      orchestrator.play();

      expect(mockTimeline.play).toHaveBeenCalled();
    });

    it("should play animation timeline when play() is called regardless of shouldAutoPlay flag", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const mockTimeline = mockAnimationTimeline();

      orchestrator.setCurrentTest({
        slug: "test-1",
        name: "Test 1",
        status: "pass" as const,
        expects: [],
        view: document.createElement("div"),
        frames: [mockFrame(0, { line: 1 })],
        animationTimeline: mockTimeline
      });

      orchestrator.play();

      // play() should still call the timeline even when shouldAutoPlay is false
      expect(mockTimeline.play).toHaveBeenCalled();
    });

    it("should set isPlaying to true when playing", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const mockTimeline = mockAnimationTimeline();

      orchestrator.setCurrentTest({
        slug: "test-1",
        name: "Test 1",
        status: "pass" as const,
        expects: [],
        view: document.createElement("div"),
        frames: [mockFrame(0, { line: 1 })],
        animationTimeline: mockTimeline
      });

      orchestrator.play();

      const state = orchestrator.getStore().getState();
      expect(state.isPlaying).toBe(true);
    });

    it("should hide information widget when manually playing", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const mockTimeline = mockAnimationTimeline();

      orchestrator.setCurrentTest({
        slug: "test-1",
        name: "Test 1",
        status: "pass" as const,
        expects: [],
        view: document.createElement("div"),
        frames: [mockFrame(0, { line: 1 })],
        animationTimeline: mockTimeline
      });

      // Pause to stop auto-play
      orchestrator.pause();

      // Set widget visible while paused
      orchestrator.setShouldShowInformationWidget(true);

      // Manually play
      orchestrator.play();

      const state = orchestrator.getStore().getState();
      expect(state.shouldShowInformationWidget).toBe(false);
    });

    it("should not throw when currentTest is null", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);

      expect(() => orchestrator.play()).not.toThrow();
    });

    it("should reset time to 0 when playing after completion", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const mockTimeline = mockAnimationTimeline();

      // Make timeline appear completed
      Object.defineProperty(mockTimeline, "completed", { value: true, writable: true });

      orchestrator.setCurrentTest({
        slug: "test-1",
        name: "Test 1",
        status: "pass" as const,
        expects: [],
        view: document.createElement("div"),
        frames: [mockFrame(0, { line: 1 }), mockFrame(100000, { line: 2 })],
        animationTimeline: mockTimeline
      });

      // Set time to end
      orchestrator.setCurrentTestTime(100000);

      // Play should reset time to 0
      orchestrator.play();

      const state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(0);
      expect(mockTimeline.play).toHaveBeenCalled();
    });

    it("should NOT reset time when playing if not completed", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const mockTimeline = mockAnimationTimeline();

      // Timeline is NOT completed
      Object.defineProperty(mockTimeline, "completed", { value: false, writable: true });

      orchestrator.setCurrentTest({
        slug: "test-1",
        name: "Test 1",
        status: "pass" as const,
        expects: [],
        view: document.createElement("div"),
        frames: [mockFrame(0, { line: 1 }), mockFrame(100000, { line: 2 })],
        animationTimeline: mockTimeline
      });

      // Set time to middle
      orchestrator.setCurrentTestTime(50000);

      // Play should NOT reset time
      orchestrator.play();

      const state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(50000);
      expect(mockTimeline.play).toHaveBeenCalled();
    });
  });

  describe("pause() method", () => {
    it("should pause the timeline", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const mockTimeline = mockAnimationTimeline();

      orchestrator.setCurrentTest({
        slug: "test-1",
        name: "Test 1",
        status: "pass" as const,
        expects: [],
        view: document.createElement("div"),
        frames: [mockFrame(0, { line: 1 })],
        animationTimeline: mockTimeline
      });

      orchestrator.pause();

      expect(mockTimeline.pause).toHaveBeenCalled();
    });

    it("should set shouldAutoPlay to false", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const mockTimeline = mockAnimationTimeline();

      orchestrator.setCurrentTest({
        slug: "test-1",
        name: "Test 1",
        status: "pass" as const,
        expects: [],
        view: document.createElement("div"),
        frames: [mockFrame(0, { line: 1 })],
        animationTimeline: mockTimeline
      });

      orchestrator.pause();

      const state = orchestrator.getStore().getState();
      expect(state.shouldPlayOnTestChange).toBe(false);
    });

    it("should set isPlaying to false", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);
      const mockTimeline = mockAnimationTimeline();

      orchestrator.setCurrentTest({
        slug: "test-1",
        name: "Test 1",
        status: "pass" as const,
        expects: [],
        view: document.createElement("div"),
        frames: [mockFrame(0, { line: 1 })],
        animationTimeline: mockTimeline
      });

      // Start playing first
      orchestrator.getStore().getState().setIsPlaying(true);

      orchestrator.pause();

      const state = orchestrator.getStore().getState();
      expect(state.isPlaying).toBe(false);
    });

    it("should not throw when currentTest is null", () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "" });
      const orchestrator = new Orchestrator(exercise);

      expect(() => orchestrator.pause()).not.toThrow();
    });
  });

  describe("runCode() method", () => {
    beforeEach(() => {
      // Mock the test runner module
      jest.mock("@/components/complex-exercise/lib/test-runner/runTests", () => ({
        runTests: jest.fn()
      }));
    });

    it("should delegate to testSuiteManager.runCode with current code and exercise", async () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "const x = 1;" });
      const orchestrator = new Orchestrator(exercise);

      // Mock testSuiteManager.runCode to simulate successful execution
      const testSuiteManager = (orchestrator as any).testSuiteManager;
      const mockRunCode = jest.spyOn(testSuiteManager, "runCode").mockResolvedValue(undefined);

      await orchestrator.runCode();

      // Verify testSuiteManager.runCode was called with current code and exercise
      expect(mockRunCode).toHaveBeenCalledWith("const x = 1;", exercise);
    });

    it("should NOT call play() when syntax error occurs", async () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "invalid code" });
      const orchestrator = new Orchestrator(exercise);

      // Mock testSuiteManager.runCode to simulate successful execution (but with syntax error state)
      const testSuiteManager = (orchestrator as any).testSuiteManager;
      const mockRunCode = jest.spyOn(testSuiteManager, "runCode").mockResolvedValue(undefined);

      // Manually set hasSyntaxError to true to simulate error state
      orchestrator.getStore().getState().setHasSyntaxError(true);

      // Mock the play method
      const mockPlay = jest.spyOn(orchestrator, "play");

      await orchestrator.runCode();

      // Verify testSuiteManager.runCode was called
      expect(mockRunCode).toHaveBeenCalled();

      // Verify play was NOT called due to syntax error
      expect(mockPlay).not.toHaveBeenCalled();
    });

    it("should use editor value if available", async () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "initial" });
      const orchestrator = new Orchestrator(exercise);

      // Mock getCurrentEditorValue to return different code
      jest.spyOn(orchestrator as any, "getCurrentEditorValue").mockReturnValue("editor code");

      // Mock testSuiteManager.runCode
      const testSuiteManager = (orchestrator as any).testSuiteManager;
      const mockRunCode = jest.spyOn(testSuiteManager, "runCode").mockResolvedValue(undefined);

      // Mock play to avoid side effects
      jest.spyOn(orchestrator, "play").mockImplementation(() => {});

      await orchestrator.runCode();

      // Should use editor code, not store code
      expect(mockRunCode).toHaveBeenCalledWith("editor code", exercise);
    });

    it("should use store code if editor value is not available", async () => {
      const exercise = createTestExercise({ slug: "test-uuid", initialCode: "store code" });
      const orchestrator = new Orchestrator(exercise);

      // Mock getCurrentEditorValue to return undefined
      jest.spyOn(orchestrator as any, "getCurrentEditorValue").mockReturnValue(undefined);

      // Mock testSuiteManager.runCode
      const testSuiteManager = (orchestrator as any).testSuiteManager;
      const mockRunCode = jest.spyOn(testSuiteManager, "runCode").mockResolvedValue(undefined);

      // Mock play to avoid side effects
      jest.spyOn(orchestrator, "play").mockImplementation(() => {});

      await orchestrator.runCode();

      // Should use store code
      expect(mockRunCode).toHaveBeenCalledWith("store code", exercise);
    });
  });
});
