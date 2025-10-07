import { createOrchestratorStore } from "@/components/coding-exercise/lib/orchestrator/store";
import { mockFrame } from "@/tests/mocks";

// Mock localStorage functions
jest.mock("@/components/coding-exercise/lib/localStorage", () => ({
  loadCodeMirrorContent: jest.fn(() => ({ success: false })),
  saveCodeMirrorContent: jest.fn()
}));

describe("Store Frame Changes", () => {
  describe("setCurrentFrame", () => {
    it("should update informationWidgetData when frame changes", () => {
      const store = createOrchestratorStore("test-uuid", "test code");
      const state = store.getState();

      const testFrame = mockFrame(100000, {
        line: 5,
        generateDescription: () => "Test frame description",
        status: "SUCCESS"
      });

      // Need to set a current test first for setCurrentFrame to work
      // Set shouldAutoPlay to false to prevent auto-play in tests
      state.setShouldPlayOnTestChange(false);
      state.setCurrentTest({
        frames: [testFrame],
        slug: "test-1",
        name: "Test 1",
        status: "pass",
        expects: [],
        view: document.createElement("div"),
        animationTimeline: {
          play: jest.fn(),
          onUpdate: jest.fn(),
          onComplete: jest.fn(),
          clearUpdateCallbacks: jest.fn(),
          clearCompleteCallbacks: jest.fn(),
          duration: 100000
        }
      } as any);

      state.setCurrentFrame(testFrame);

      const newState = store.getState();
      expect(newState.currentFrame).toBe(testFrame);
      expect(newState.highlightedLine).toBe(5);
      expect(newState.informationWidgetData).toEqual({
        html: "Test frame description",
        line: 5,
        status: "SUCCESS"
      });
    });

    it("should handle frames without descriptions", () => {
      const store = createOrchestratorStore("test-uuid", "test code");
      const state = store.getState();

      const testFrame = mockFrame(100000, {
        line: 10,
        generateDescription: () => "",
        status: "ERROR"
      });

      // Need to set a current test first
      // Set shouldAutoPlay to false to prevent auto-play in tests
      state.setShouldPlayOnTestChange(false);
      state.setCurrentTest({
        frames: [testFrame],
        slug: "test-1",
        name: "Test 1",
        status: "fail",
        expects: [],
        view: document.createElement("div"),
        animationTimeline: {
          play: jest.fn(),
          onUpdate: jest.fn(),
          onComplete: jest.fn(),
          clearUpdateCallbacks: jest.fn(),
          clearCompleteCallbacks: jest.fn(),
          duration: 100000
        }
      } as any);

      state.setCurrentFrame(testFrame);

      const newState = store.getState();
      expect(newState.informationWidgetData).toEqual({
        html: "",
        line: 10,
        status: "ERROR"
      });
    });

    it("should update navigation frames after setting current frame", () => {
      const store = createOrchestratorStore("test-uuid", "test code");
      const state = store.getState();

      const frame1 = mockFrame(0, { line: 1 });
      const frame2 = mockFrame(100000, { line: 2 });
      const frame3 = mockFrame(200000, { line: 3 });

      // Set up test with multiple frames
      // Set shouldAutoPlay to false to prevent auto-play in tests
      state.setShouldPlayOnTestChange(false);
      state.setCurrentTest({
        frames: [frame1, frame2, frame3],
        slug: "test-1",
        name: "Test 1",
        status: "pass",
        expects: [],
        view: document.createElement("div"),
        animationTimeline: {
          play: jest.fn(),
          onUpdate: jest.fn(),
          onComplete: jest.fn(),
          clearUpdateCallbacks: jest.fn(),
          clearCompleteCallbacks: jest.fn(),
          duration: 200000
        }
      } as any);

      // Set current frame to middle frame
      state.setCurrentFrame(frame2);

      const newState = store.getState();
      expect(newState.prevFrame).toBe(frame1);
      expect(newState.nextFrame).toBe(frame3);
    });
  });
});
