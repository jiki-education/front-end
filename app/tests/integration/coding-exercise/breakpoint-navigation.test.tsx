import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import BreakpointStepperButtons from "@/components/coding-exercise/ui/scrubber/BreakpointStepperButtons";
import type { Frame } from "@jiki/interpreters";
import OrchestratorTestProvider from "@/tests/test-utils/OrchestratorTestProvider";
import { mockFrame } from "@/tests/mocks";
import { createTestExercise } from "@/tests/mocks/createTestExercise";

// Helper to create mock frames
function createMockFrame(line: number, timeInMicroseconds: number): Frame {
  return mockFrame(timeInMicroseconds, { line });
}

// Helper to setup orchestrator with test data
function setupOrchestrator(frames: Frame[], breakpoints: number[] = [], foldedLines: number[] = []) {
  const exercise = createTestExercise({ slug: "test-uuid", initialCode: "// test code" });
  const orchestrator = new Orchestrator(exercise);

  // Set up test state with proper animation timeline mock
  orchestrator.getStore().setState({
    currentTest: {
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
    breakpoints,
    foldedLines
  });

  // Trigger recalculation of breakpoint frames
  // Set to non-zero first to avoid early return, then to 0
  orchestrator.setCurrentTestTime(100);
  orchestrator.setCurrentTestTime(0);

  return orchestrator;
}

describe("Breakpoint Navigation Integration", () => {
  describe("Orchestrator breakpoint methods", () => {
    it("should navigate to previous breakpoint", () => {
      const frames = [
        createMockFrame(1, 0),
        createMockFrame(2, 100),
        createMockFrame(3, 200),
        createMockFrame(4, 300),
        createMockFrame(5, 400)
      ];
      const breakpoints = [1, 3, 5];
      const orchestrator = setupOrchestrator(frames, breakpoints);

      // Move to frame at line 5
      orchestrator.setCurrentTestTime(400);

      // Navigate to previous breakpoint (line 3)
      orchestrator.goToPrevBreakpoint();

      const state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(200);
      expect(state.currentFrame?.line).toBe(3);
    });

    it("should navigate to next breakpoint", () => {
      const frames = [
        createMockFrame(1, 0),
        createMockFrame(2, 100),
        createMockFrame(3, 200),
        createMockFrame(4, 300),
        createMockFrame(5, 400)
      ];
      const breakpoints = [1, 3, 5];
      const orchestrator = setupOrchestrator(frames, breakpoints);

      // Start at frame 1
      orchestrator.setCurrentTestTime(0);

      // Navigate to next breakpoint (line 3)
      orchestrator.goToNextBreakpoint();

      const state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(200);
      expect(state.currentFrame?.line).toBe(3);
    });

    it("should not navigate when no breakpoint exists", () => {
      const frames = [createMockFrame(1, 0), createMockFrame(2, 100), createMockFrame(3, 200)];
      const breakpoints = [2]; // Only breakpoint at line 2
      const orchestrator = setupOrchestrator(frames, breakpoints);

      // Move to last frame
      orchestrator.setCurrentTestTime(200);

      // Try to navigate to next breakpoint (none exists)
      orchestrator.goToNextBreakpoint();

      const state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(200); // Should stay at same position
      expect(state.currentFrame?.line).toBe(3);
    });

    it("should skip folded lines when navigating", () => {
      const frames = [
        createMockFrame(1, 0),
        createMockFrame(2, 100),
        createMockFrame(3, 200),
        createMockFrame(4, 300),
        createMockFrame(5, 400)
      ];
      const breakpoints = [1, 2, 3, 4, 5];
      const foldedLines = [2, 3]; // Fold lines 2 and 3
      const orchestrator = setupOrchestrator(frames, breakpoints, foldedLines);

      // Start at frame 1
      orchestrator.setCurrentTestTime(0);

      // Navigate to next breakpoint (should skip to line 4)
      orchestrator.goToNextBreakpoint();

      const state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(300);
      expect(state.currentFrame?.line).toBe(4);
    });
  });

  describe("Store updates", () => {
    it("should update breakpoint frames when breakpoints change", () => {
      const frames = [createMockFrame(1, 0), createMockFrame(2, 100), createMockFrame(3, 200), createMockFrame(4, 300)];
      const orchestrator = setupOrchestrator(frames, []);

      // Initially no breakpoints
      let state = orchestrator.getStore().getState();
      expect(state.prevBreakpointFrame).toBeUndefined();
      expect(state.nextBreakpointFrame).toBeUndefined();

      // Add breakpoints
      orchestrator.getStore().getState().setBreakpoints([2, 4]);

      // Check breakpoint frames are updated
      state = orchestrator.getStore().getState();
      expect(state.nextBreakpointFrame?.line).toBe(2);
    });

    it("should update breakpoint frames when folded lines change", () => {
      const frames = [createMockFrame(1, 0), createMockFrame(2, 100), createMockFrame(3, 200), createMockFrame(4, 300)];
      const breakpoints = [2, 3, 4];
      const orchestrator = setupOrchestrator(frames, breakpoints);

      // Move to line 4
      orchestrator.setCurrentTestTime(300);

      // Initially line 3 is available as prev breakpoint
      let state = orchestrator.getStore().getState();
      expect(state.prevBreakpointFrame?.line).toBe(3);

      // Fold line 3
      orchestrator.setFoldedLines([3]);

      // Now line 2 should be prev breakpoint
      state = orchestrator.getStore().getState();
      expect(state.prevBreakpointFrame?.line).toBe(2);
    });

    it("should update breakpoint frames when timeline time changes", () => {
      const frames = [
        createMockFrame(1, 0),
        createMockFrame(2, 100),
        createMockFrame(3, 200),
        createMockFrame(4, 300),
        createMockFrame(5, 400)
      ];
      const breakpoints = [1, 3, 5];
      const orchestrator = setupOrchestrator(frames, breakpoints);

      // Start at frame 1
      let state = orchestrator.getStore().getState();
      expect(state.prevBreakpointFrame).toBeUndefined();
      expect(state.nextBreakpointFrame?.line).toBe(3);

      // Move to frame 3
      orchestrator.setCurrentTestTime(200);

      state = orchestrator.getStore().getState();
      expect(state.prevBreakpointFrame?.line).toBe(1);
      expect(state.nextBreakpointFrame?.line).toBe(5);

      // Move to frame 5
      orchestrator.setCurrentTestTime(400);

      state = orchestrator.getStore().getState();
      expect(state.prevBreakpointFrame?.line).toBe(3);
      expect(state.nextBreakpointFrame).toBeUndefined();
    });
  });

  describe("Component integration", () => {
    it("should render and handle navigation through orchestrator", () => {
      const frames = [
        createMockFrame(1, 0),
        createMockFrame(2, 100),
        createMockFrame(3, 200),
        createMockFrame(4, 300),
        createMockFrame(5, 400)
      ];
      const breakpoints = [1, 3, 5];
      const orchestrator = setupOrchestrator(frames, breakpoints);

      // Move to line 3
      orchestrator.setCurrentTestTime(200);

      render(
        <OrchestratorTestProvider orchestrator={orchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      // Both buttons should be enabled
      const prevButton = screen.getByLabelText("Previous breakpoint");
      const nextButton = screen.getByLabelText("Next breakpoint");

      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();

      // Click next to go to line 5
      fireEvent.click(nextButton);

      let state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(400);
      expect(state.currentFrame?.line).toBe(5);

      // Click prev to go back to line 3
      fireEvent.click(prevButton);

      state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(200);
      expect(state.currentFrame?.line).toBe(3);
    });

    it("should update button states when orchestrator state changes", async () => {
      const frames = [createMockFrame(1, 0), createMockFrame(2, 100), createMockFrame(3, 200)];
      const orchestrator = setupOrchestrator(frames, []);

      const { rerender } = render(
        <OrchestratorTestProvider orchestrator={orchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      // Initially no breakpoints, so component shouldn't render
      expect(screen.queryByLabelText("Previous breakpoint")).not.toBeInTheDocument();

      // Add breakpoints
      act(() => {
        orchestrator.getStore().getState().setBreakpoints([1, 3]);
      });

      // Re-render to pick up state changes
      rerender(
        <OrchestratorTestProvider orchestrator={orchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      // Now buttons should be visible
      await waitFor(() => {
        expect(screen.getByLabelText("Previous breakpoint")).toBeInTheDocument();
        expect(screen.getByLabelText("Next breakpoint")).toBeInTheDocument();
      });

      // Prev should be disabled (at first frame), next should be enabled
      expect(screen.getByLabelText("Previous breakpoint")).toBeDisabled();
      expect(screen.getByLabelText("Next breakpoint")).not.toBeDisabled();
    });
  });

  describe("Complex scenarios", () => {
    it("should handle multiple frames on same line with breakpoints", () => {
      const frames = [
        createMockFrame(1, 0),
        createMockFrame(2, 100),
        createMockFrame(2, 150), // Another frame on line 2
        createMockFrame(3, 200),
        createMockFrame(3, 250), // Another frame on line 3
        createMockFrame(4, 300)
      ];
      const breakpoints = [2, 3];
      const orchestrator = setupOrchestrator(frames, breakpoints);

      // Start at frame 1
      orchestrator.setCurrentTestTime(0);

      // Navigate to next breakpoint (should go to first frame on line 2)
      orchestrator.goToNextBreakpoint();

      let state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(100);
      expect(state.currentFrame?.line).toBe(2);

      // Move to second frame on line 2
      orchestrator.setCurrentTestTime(150);

      // Navigate to next breakpoint (should go to first frame on line 3)
      orchestrator.goToNextBreakpoint();

      state = orchestrator.getStore().getState();
      expect(state.currentTestTime).toBe(200);
      expect(state.currentFrame?.line).toBe(3);
    });

    it("should handle all breakpoints being folded", () => {
      const frames = [createMockFrame(1, 0), createMockFrame(2, 100), createMockFrame(3, 200), createMockFrame(4, 300)];
      const breakpoints = [2, 3];
      const foldedLines = [2, 3]; // All breakpoints are folded
      const orchestrator = setupOrchestrator(frames, breakpoints, foldedLines);

      // Move to frame 4
      orchestrator.setCurrentTestTime(300);

      // Check that no breakpoint frames are available
      const state = orchestrator.getStore().getState();
      expect(state.prevBreakpointFrame).toBeUndefined();
      expect(state.nextBreakpointFrame).toBeUndefined();

      // Try to navigate - should stay in place
      orchestrator.goToPrevBreakpoint();
      expect(orchestrator.getStore().getState().currentTestTime).toBe(300);

      orchestrator.goToNextBreakpoint();
      expect(orchestrator.getStore().getState().currentTestTime).toBe(300);
    });
  });
});
