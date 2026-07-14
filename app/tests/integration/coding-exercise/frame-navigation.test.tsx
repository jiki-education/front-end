import Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import { createMockFrame } from "@/tests/mocks";
import { createMockExercise } from "@/tests/mocks/exercise";
import type { Frame } from "@jiki/interpreters";
import "@testing-library/jest-dom";
import { createMockInterpretResult } from "@/tests/mocks";
import { TestExercise } from "@jiki/curriculum";

// Helper to setup orchestrator with test frames
function setupOrchestrator(frames: Frame[], foldedLines: number[] = []) {
  const exercise = createMockExercise({
    slug: "test-uuid",
    stubs: { javascript: "// test code", python: "// test code", jikiscript: "// test code" }
  });
  const orchestrator = new Orchestrator(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" });

  orchestrator.getStore().setState({
    currentTest: {
      type: "visual" as const,
      slug: "test-1",
      name: "Test 1",
      status: "pass" as const,
      expects: [],
      view: document.createElement("div"),
      exercise: new TestExercise(),
      result: createMockInterpretResult(),
      frames,
      logLines: [],
      lintErrors: [],
      animationTimeline: {
        duration: 5,
        paused: true,
        seek: jest.fn(),
        play: jest.fn(),
        pause: jest.fn(),
        progress: 0,
        currentTime: 0,
        completed: false,
        hasPlayedOrScrubbed: false,
        seekEndOfTimeline: jest.fn(),
        onUpdate: jest.fn(),
        timeline: {
          duration: 5,
          currentTime: 0
        }
      } as any
    },
    foldedLines
  });

  // Trigger recalculation of prev/next frames
  orchestrator.setCurrentTestTime(100);
  orchestrator.setCurrentTestTime(0);

  return orchestrator;
}

function buildFrames() {
  return [
    createMockFrame(0, { line: 1 }),
    createMockFrame(100, { line: 2 }),
    createMockFrame(200, { line: 3 }),
    createMockFrame(300, { line: 4 }),
    createMockFrame(400, { line: 5 })
  ];
}

describe("Frame Navigation Integration", () => {
  describe("Orchestrator frame methods", () => {
    it("goToNextFrame moves to the next frame", () => {
      const orchestrator = setupOrchestrator(buildFrames());
      orchestrator.setCurrentTestTime(200);

      orchestrator.goToNextFrame();

      const state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(300);
      expect(state.currentFrame?.line).toBe(4);
    });

    it("goToPrevFrame moves to the previous frame", () => {
      const orchestrator = setupOrchestrator(buildFrames());
      orchestrator.setCurrentTestTime(200);

      orchestrator.goToPrevFrame();

      const state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(100);
      expect(state.currentFrame?.line).toBe(2);
    });

    it("goToFirstFrame moves to the first frame", () => {
      const orchestrator = setupOrchestrator(buildFrames());
      orchestrator.setCurrentTestTime(400);

      orchestrator.goToFirstFrame();

      const state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(0);
      expect(state.currentFrame?.line).toBe(1);
    });

    it("goToLastFrame moves to the last frame", () => {
      const orchestrator = setupOrchestrator(buildFrames());
      orchestrator.setCurrentTestTime(0);

      orchestrator.goToLastFrame();

      const state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(400);
      expect(state.currentFrame?.line).toBe(5);
    });

    it("goToNextFrame at the last frame stays put", () => {
      const orchestrator = setupOrchestrator(buildFrames());
      orchestrator.setCurrentTestTime(400);

      orchestrator.goToNextFrame();

      const state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(400);
      expect(state.currentFrame?.line).toBe(5);
    });

    it("goToPrevFrame at the first frame stays put", () => {
      const orchestrator = setupOrchestrator(buildFrames());
      orchestrator.setCurrentTestTime(0);

      orchestrator.goToPrevFrame();

      const state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(0);
      expect(state.currentFrame?.line).toBe(1);
    });

    it("skips folded lines when navigating", () => {
      const orchestrator = setupOrchestrator(buildFrames(), [2, 3]);
      orchestrator.setCurrentTestTime(0);

      orchestrator.goToNextFrame();

      const state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(300);
      expect(state.currentFrame?.line).toBe(4);
    });
  });

  describe("shared navigation behaviour", () => {
    // Every stepper (frame + breakpoint) and the scrubber keyboard shortcuts route
    // through the same path, so they all pause playback and surface the widget.
    it("pauses playback and shows the information widget", () => {
      const orchestrator = setupOrchestrator(buildFrames());
      orchestrator.setCurrentTestTime(0);

      const pauseSpy = jest.spyOn(orchestrator, "pause");
      const showWidgetSpy = jest.spyOn(orchestrator, "showInformationWidget");

      orchestrator.goToNextFrame();

      expect(pauseSpy).toHaveBeenCalledTimes(1);
      expect(showWidgetSpy).toHaveBeenCalledTimes(1);
    });

    it("pauses and shows the widget even when there is nowhere to move", () => {
      const orchestrator = setupOrchestrator(buildFrames());
      orchestrator.setCurrentTestTime(400);

      const pauseSpy = jest.spyOn(orchestrator, "pause");
      const showWidgetSpy = jest.spyOn(orchestrator, "showInformationWidget");

      orchestrator.goToNextFrame();

      expect(pauseSpy).toHaveBeenCalledTimes(1);
      expect(showWidgetSpy).toHaveBeenCalledTimes(1);
    });
  });
});
