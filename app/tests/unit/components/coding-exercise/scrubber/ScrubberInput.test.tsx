import type { Orchestrator } from "@/components/coding-exercise/lib/Orchestrator";
import ScrubberInput from "@/components/coding-exercise/ui/scrubber/ScrubberInput";
import { createMockAnimationTimeline, createMockFrame } from "@/tests/mocks";
import OrchestratorTestProvider from "@/tests/test-utils/OrchestratorTestProvider";
import type { Frame } from "@jiki/interpreters";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

// Helper to create mock frames
function createMockFrames(count: number): Frame[] {
  return Array.from({ length: count }, (_, i) =>
    createMockFrame(i * 100000, {
      // Each frame is 100ms apart
      line: i + 1,
      generateDescription: () => `Frame ${i}`
    })
  );
}

// Helper to create mock orchestrator
function createMockOrchestrator(): Orchestrator {
  return {
    exerciseSlug: "test-uuid",
    setCode: jest.fn(),
    setCurrentTestTime: jest.fn(),
    setCurrentTest: jest.fn(),
    setHasCodeBeenEdited: jest.fn(),
    setIsSpotlightActive: jest.fn(),
    getNearestCurrentFrame: jest.fn().mockReturnValue(null),
    runCode: jest.fn(),
    getStore: jest.fn(),
    snapToNearestFrame: jest.fn()
  } as unknown as Orchestrator;
}

describe("ScrubberInput Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("range input properties", () => {
    it("should calculate min value based on frames count", () => {
      const mockOrchestrator = createMockOrchestrator();
      const mockTimeline = createMockAnimationTimeline({ duration: 5 });

      // Test with less than 2 frames
      const { rerender } = render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <ScrubberInput frames={createMockFrames(1)} animationTimeline={mockTimeline} time={0} enabled={true} />
        </OrchestratorTestProvider>
      );

      let slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuemin", "-1");

      // Test with 2 or more frames
      rerender(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <ScrubberInput frames={createMockFrames(3)} animationTimeline={mockTimeline} time={0} enabled={true} />
        </OrchestratorTestProvider>
      );

      slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuemin", "0");
    });

    it("should use duration directly without scaling", () => {
      const mockOrchestrator = createMockOrchestrator();
      const testCases = [
        { duration: 1000, expected: "1000" }, // Duration in microseconds
        { duration: 5500, expected: "5500" },
        { duration: 10000, expected: "10000" },
        { duration: 500, expected: "500" }
      ];

      testCases.forEach(({ duration, expected }) => {
        const mockTimeline = createMockAnimationTimeline({ duration });

        const { rerender } = render(
          <OrchestratorTestProvider orchestrator={mockOrchestrator}>
            <ScrubberInput frames={createMockFrames(3)} animationTimeline={mockTimeline} time={0} enabled={true} />
          </OrchestratorTestProvider>
        );

        const slider = screen.getByRole("slider");
        expect(slider).toHaveAttribute("aria-valuemax", expected.toString());

        rerender(<></>);
      });
    });

    it("should display the current time value", () => {
      const mockOrchestrator = createMockOrchestrator();
      const mockTimeline = createMockAnimationTimeline({ duration: 10000 }); // 10ms in microseconds

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <ScrubberInput frames={createMockFrames(5)} animationTimeline={mockTimeline} time={2500} enabled={true} />
        </OrchestratorTestProvider>
      );

      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuenow", "2500");
    });

    it("should handle null animationTimeline", () => {
      const mockOrchestrator = createMockOrchestrator();

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <ScrubberInput frames={createMockFrames(3)} animationTimeline={null} time={0} enabled={true} />
        </OrchestratorTestProvider>
      );

      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuemax", "0"); // Default duration of 0
    });

    it("should use animation timeline duration directly in microseconds without scaling", () => {
      // This tests the fix for the scrubber max value bug where duration was being
      // incorrectly multiplied by TIME_SCALE_FACTOR when it was already in microseconds
      const mockOrchestrator = createMockOrchestrator();
      const frames = createMockFrames(5); // 5 frames, last at 400000 microseconds
      const lastFrameTime = 400000; // Last frame at 400ms = 400000 microseconds
      const mockTimeline = createMockAnimationTimeline({ duration: lastFrameTime });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <ScrubberInput frames={frames} animationTimeline={mockTimeline} time={0} enabled={true} />
        </OrchestratorTestProvider>
      );

      const slider = screen.getByRole("slider");
      // Should be 400000 (the duration in microseconds), not 400000000 (duration * 1000)
      expect(slider).toHaveAttribute("aria-valuemax", "400000");
    });
  });

  describe("enabled/disabled state", () => {
    it("should be disabled when enabled prop is false", () => {
      const mockOrchestrator = createMockOrchestrator();
      const mockTimeline = createMockAnimationTimeline({ duration: 5 });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <ScrubberInput frames={createMockFrames(3)} animationTimeline={mockTimeline} time={0} enabled={false} />
        </OrchestratorTestProvider>
      );

      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-disabled", "true");
      expect(slider).toHaveAttribute("tabIndex", "-1");
    });

    it("should be enabled when enabled prop is true", () => {
      const mockOrchestrator = createMockOrchestrator();
      const mockTimeline = createMockAnimationTimeline({ duration: 5 });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <ScrubberInput frames={createMockFrames(3)} animationTimeline={mockTimeline} time={0} enabled={true} />
        </OrchestratorTestProvider>
      );

      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-disabled", "false");
      expect(slider).toHaveAttribute("tabIndex", "0");
    });
  });

  describe("onMouseDown handler", () => {
    it("should call setCurrentTestTime when mouse is pressed", () => {
      const mockOrchestrator = createMockOrchestrator();
      const mockTimeline = createMockAnimationTimeline({ duration: 500000 }); // 500ms in microseconds

      const TestWrapper = () => {
        const ref = React.useRef<HTMLDivElement>(null);
        return (
          <OrchestratorTestProvider orchestrator={mockOrchestrator}>
            <ScrubberInput
              ref={ref}
              frames={createMockFrames(5)}
              animationTimeline={mockTimeline}
              time={0}
              enabled={true}
            />
          </OrchestratorTestProvider>
        );
      };

      render(<TestWrapper />);

      const slider = screen.getByRole("slider");

      // Mock getBoundingClientRect to simulate slider dimensions
      slider.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        width: 100,
        top: 0,
        height: 20,
        right: 100,
        bottom: 20,
        x: 0,
        y: 0,
        toJSON: () => {}
      }));

      // Simulate mouse down at 60% position (clientX = 60)
      fireEvent.mouseDown(slider, { clientX: 60 });

      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenCalledTimes(1);
      // With 60% position on a 500000 microsecond timeline, should be around 300000
      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenCalledWith(300000);
    });

    it("should handle multiple mouse interactions", () => {
      const mockOrchestrator = createMockOrchestrator();
      const mockTimeline = createMockAnimationTimeline({ duration: 500000 }); // 500ms in microseconds

      const TestWrapper = () => {
        const ref = React.useRef<HTMLDivElement>(null);
        return (
          <OrchestratorTestProvider orchestrator={mockOrchestrator}>
            <ScrubberInput
              ref={ref}
              frames={createMockFrames(5)}
              animationTimeline={mockTimeline}
              time={0}
              enabled={true}
            />
          </OrchestratorTestProvider>
        );
      };

      render(<TestWrapper />);

      const slider = screen.getByRole("slider");

      // Mock getBoundingClientRect
      slider.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        width: 100,
        top: 0,
        height: 20,
        right: 100,
        bottom: 20,
        x: 0,
        y: 0,
        toJSON: () => {}
      }));

      // Simulate first mouse interaction
      fireEvent.mouseDown(slider, { clientX: 20 }); // 20% = 100000
      fireEvent.mouseUp(document);
      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenLastCalledWith(100000);

      // Simulate second mouse interaction
      fireEvent.mouseDown(slider, { clientX: 40 }); // 40% = 200000
      fireEvent.mouseUp(document);
      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenLastCalledWith(200000);

      // Simulate third mouse interaction
      fireEvent.mouseDown(slider, { clientX: 70 }); // 70% = 350000
      fireEvent.mouseUp(document);
      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenLastCalledWith(350000);

      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenCalledTimes(3);
    });
  });

  describe("onMouseUp handler (frame snapping)", () => {
    it("should snap to nearest frame on mouse up", () => {
      const mockOrchestrator = createMockOrchestrator();
      const mockTimeline = createMockAnimationTimeline({ duration: 10 });

      mockOrchestrator.snapToNearestFrame = jest.fn();

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <ScrubberInput
            frames={createMockFrames(5)}
            animationTimeline={mockTimeline}
            time={150} // Between frames
            enabled={true}
          />
        </OrchestratorTestProvider>
      );

      const slider = screen.getByRole("slider");

      // Mock getBoundingClientRect
      slider.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        width: 100,
        top: 0,
        height: 20,
        right: 100,
        bottom: 20,
        x: 0,
        y: 0,
        toJSON: () => {}
      }));

      // Mouse down followed by mouse up should trigger snap
      fireEvent.mouseDown(slider, { clientX: 50 });
      fireEvent.mouseUp(document);

      expect(mockOrchestrator.snapToNearestFrame).toHaveBeenCalled();
    });

    it("should call snapToNearestFrame regardless of frame availability", () => {
      const mockOrchestrator = createMockOrchestrator();
      const mockTimeline = createMockAnimationTimeline({ duration: 10 });

      mockOrchestrator.snapToNearestFrame = jest.fn();

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <ScrubberInput frames={createMockFrames(5)} animationTimeline={mockTimeline} time={150} enabled={true} />
        </OrchestratorTestProvider>
      );

      const slider = screen.getByRole("slider");

      // Mock getBoundingClientRect
      slider.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        width: 100,
        top: 0,
        height: 20,
        right: 100,
        bottom: 20,
        x: 0,
        y: 0,
        toJSON: () => {}
      }));

      // Mouse down followed by mouse up should trigger snap
      fireEvent.mouseDown(slider, { clientX: 50 });
      fireEvent.mouseUp(document);

      // snapToNearestFrame is always called, it handles the null case internally
      expect(mockOrchestrator.snapToNearestFrame).toHaveBeenCalled();
    });
  });

  describe("keyboard handlers", () => {
    it("should handle keyUp events", () => {
      const mockOrchestrator = createMockOrchestrator();
      const mockTimeline = createMockAnimationTimeline({ duration: 10 });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <ScrubberInput frames={createMockFrames(5)} animationTimeline={mockTimeline} time={0} enabled={true} />
        </OrchestratorTestProvider>
      );

      const input = screen.getByRole("slider");

      // Currently these are TODO implementations, so just verify they don't crash
      fireEvent.keyUp(input, { key: "ArrowRight" });
      fireEvent.keyUp(input, { key: "Space" });

      // No specific assertions as handlers are not yet implemented
      expect(true).toBe(true);
    });

    it("should handle keyDown events", () => {
      const mockOrchestrator = createMockOrchestrator();
      const mockTimeline = createMockAnimationTimeline({ duration: 10 });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <ScrubberInput frames={createMockFrames(5)} animationTimeline={mockTimeline} time={0} enabled={true} />
        </OrchestratorTestProvider>
      );

      const input = screen.getByRole("slider");

      // Currently these are TODO implementations, so just verify they don't crash
      fireEvent.keyDown(input, { key: "ArrowLeft" });
      fireEvent.keyDown(input, { key: "Enter" });

      // No specific assertions as handlers are not yet implemented
      expect(true).toBe(true);
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to the input element", () => {
      const mockOrchestrator = createMockOrchestrator();
      const mockTimeline = createMockAnimationTimeline({ duration: 5 });
      const ref = React.createRef<HTMLInputElement>();

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <ScrubberInput
            ref={ref}
            frames={createMockFrames(3)}
            animationTimeline={mockTimeline}
            time={0}
            enabled={true}
          />
        </OrchestratorTestProvider>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.getAttribute("role")).toBe("slider");
    });
  });

  describe("data-testid attribute", () => {
    it("should have the correct data-testid", () => {
      const mockOrchestrator = createMockOrchestrator();
      const mockTimeline = createMockAnimationTimeline({ duration: 5 });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <ScrubberInput frames={createMockFrames(3)} animationTimeline={mockTimeline} time={0} enabled={true} />
        </OrchestratorTestProvider>
      );

      const slider = screen.getByTestId("scrubber-range-input");
      expect(slider).toBeInTheDocument();
      expect(slider).toHaveAttribute("role", "slider");
    });
  });
});
