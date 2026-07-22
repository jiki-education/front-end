import type { Orchestrator } from "@/components/coding-exercise/lib/Orchestrator";
import { useOrchestratorStore } from "@/components/coding-exercise/lib/Orchestrator";
import ScrubberInput from "@/components/coding-exercise/ui/scrubber/ScrubberInput";
import { createMockAnimationTimeline, createMockFrame } from "@/tests/mocks";
import OrchestratorTestProvider from "@/tests/test-utils/OrchestratorTestProvider";
import type { Frame } from "@jiki/interpreters";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

// Mock the orchestrator store hook so we can control prev/next frame and play state
jest.mock("@/components/coding-exercise/lib/Orchestrator", () => ({
  useOrchestratorStore: jest.fn()
}));

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
    play: jest.fn(),
    pause: jest.fn(),
    showInformationWidget: jest.fn(),
    goToPrevFrame: jest.fn(),
    goToNextFrame: jest.fn(),
    goToFirstFrame: jest.fn(),
    goToLastFrame: jest.fn(),
    goToPrevBreakpoint: jest.fn(),
    goToNextBreakpoint: jest.fn(),
    snapToNearestFrame: jest.fn()
  } as unknown as Orchestrator;
}

// Helper to setup store mock. ScrubberInput only reads isPlaying (for the
// space-bar toggle); frame navigation targets are resolved inside the orchestrator.
function setupStoreMock({ isPlaying = false }: { isPlaying?: boolean } = {}) {
  (useOrchestratorStore as jest.Mock).mockReturnValue({ isPlaying });
}

describe("ScrubberInput Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupStoreMock();
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

    it("should fall back to the last frame's time when there is no animationTimeline (IO tests)", () => {
      const mockOrchestrator = createMockOrchestrator();

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <ScrubberInput frames={createMockFrames(3)} animationTimeline={null} time={0} enabled={true} />
        </OrchestratorTestProvider>
      );

      const slider = screen.getByRole("slider");
      // IO tests have no animationTimeline, so the range spans up to the last frame's time.
      // createMockFrames(3) => frames at 0, 100000, 200000 microseconds.
      expect(slider).toHaveAttribute("aria-valuemax", "200000");
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
      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenCalledWith(300000, "nearest");
    });

    it("should surface the information widget when dragging, matching the stepper buttons", () => {
      const mockOrchestrator = createMockOrchestrator();
      const mockTimeline = createMockAnimationTimeline({ duration: 500000 });

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

      fireEvent.mouseDown(slider, { clientX: 60 });

      expect(mockOrchestrator.showInformationWidget).toHaveBeenCalledTimes(1);
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
      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenLastCalledWith(100000, "nearest");

      // Simulate second mouse interaction
      fireEvent.mouseDown(slider, { clientX: 40 }); // 40% = 200000
      fireEvent.mouseUp(document);
      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenLastCalledWith(200000, "nearest");

      // Simulate third mouse interaction
      fireEvent.mouseDown(slider, { clientX: 70 }); // 70% = 350000
      fireEvent.mouseUp(document);
      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenLastCalledWith(350000, "nearest");

      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenCalledTimes(3);
    });
  });

  describe("RTL direction (mirrored timeline)", () => {
    // The scrubber mirrors under dir="rtl": time runs right→left, so pointer
    // mapping measures from the right edge and arrow keys swap prev/next.
    let realGetComputedStyle: typeof window.getComputedStyle;

    beforeEach(() => {
      // jsdom does not derive the `direction` computed value from the `dir`
      // attribute, so stub getComputedStyle to report RTL (real browsers do this
      // via CSS inheritance). Component reads `getComputedStyle(el).direction`.
      realGetComputedStyle = window.getComputedStyle;
      jest
        .spyOn(window, "getComputedStyle")
        .mockImplementation((el: Element) => ({ ...realGetComputedStyle(el), direction: "rtl" }));
    });

    afterEach(() => {
      (window.getComputedStyle as jest.Mock).mockRestore();
    });

    function renderRTLSlider(mockOrchestrator: Orchestrator) {
      const mockTimeline = createMockAnimationTimeline({ duration: 500000 });
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
      return slider;
    }

    it("maps pointer position from the right edge", () => {
      const mockOrchestrator = createMockOrchestrator();
      const slider = renderRTLSlider(mockOrchestrator);

      // clientX=60 sits 40% from the right edge, so on a 500000us timeline → 200000
      // (the LTR case at the same clientX yields 300000).
      fireEvent.mouseDown(slider, { clientX: 60 });

      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenCalledWith(200000, "nearest");
    });

    it("ArrowLeft advances and ArrowRight rewinds", () => {
      const mockOrchestrator = createMockOrchestrator();
      const slider = renderRTLSlider(mockOrchestrator);

      fireEvent.keyDown(slider, { key: "ArrowLeft" });
      expect(mockOrchestrator.goToNextFrame).toHaveBeenCalledTimes(1);
      expect(mockOrchestrator.goToPrevFrame).not.toHaveBeenCalled();

      fireEvent.keyDown(slider, { key: "ArrowRight" });
      expect(mockOrchestrator.goToPrevFrame).toHaveBeenCalledTimes(1);
    });

    it("Shift+ArrowLeft steps to the next breakpoint", () => {
      const mockOrchestrator = createMockOrchestrator();
      const slider = renderRTLSlider(mockOrchestrator);

      fireEvent.keyDown(slider, { key: "ArrowLeft", shiftKey: true });

      expect(mockOrchestrator.goToNextBreakpoint).toHaveBeenCalledTimes(1);
      expect(mockOrchestrator.goToPrevBreakpoint).not.toHaveBeenCalled();
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
    function renderScrubber(mockOrchestrator: Orchestrator, enabled = true) {
      const mockTimeline = createMockAnimationTimeline({ duration: 10 });
      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <ScrubberInput frames={createMockFrames(5)} animationTimeline={mockTimeline} time={0} enabled={enabled} />
        </OrchestratorTestProvider>
      );
      return screen.getByRole("slider");
    }

    it("ArrowLeft goes to the previous frame", () => {
      const mockOrchestrator = createMockOrchestrator();
      const input = renderScrubber(mockOrchestrator);

      fireEvent.keyDown(input, { key: "ArrowLeft" });

      expect(mockOrchestrator.goToPrevFrame).toHaveBeenCalledTimes(1);
    });

    it("ArrowRight goes to the next frame", () => {
      const mockOrchestrator = createMockOrchestrator();
      const input = renderScrubber(mockOrchestrator);

      fireEvent.keyDown(input, { key: "ArrowRight" });

      expect(mockOrchestrator.goToNextFrame).toHaveBeenCalledTimes(1);
    });

    it("Shift+ArrowLeft goes to the previous breakpoint", () => {
      const mockOrchestrator = createMockOrchestrator();
      const input = renderScrubber(mockOrchestrator);

      fireEvent.keyDown(input, { key: "ArrowLeft", shiftKey: true });

      expect(mockOrchestrator.goToPrevBreakpoint).toHaveBeenCalledTimes(1);
      expect(mockOrchestrator.goToPrevFrame).not.toHaveBeenCalled();
    });

    it("Shift+ArrowRight goes to the next breakpoint", () => {
      const mockOrchestrator = createMockOrchestrator();
      const input = renderScrubber(mockOrchestrator);

      fireEvent.keyDown(input, { key: "ArrowRight", shiftKey: true });

      expect(mockOrchestrator.goToNextBreakpoint).toHaveBeenCalledTimes(1);
      expect(mockOrchestrator.goToNextFrame).not.toHaveBeenCalled();
    });

    it("ArrowDown goes to the first frame", () => {
      const mockOrchestrator = createMockOrchestrator();
      const input = renderScrubber(mockOrchestrator);

      fireEvent.keyDown(input, { key: "ArrowDown" });

      expect(mockOrchestrator.goToFirstFrame).toHaveBeenCalledTimes(1);
    });

    it("ArrowUp goes to the last frame", () => {
      const mockOrchestrator = createMockOrchestrator();
      const input = renderScrubber(mockOrchestrator);

      fireEvent.keyDown(input, { key: "ArrowUp" });

      expect(mockOrchestrator.goToLastFrame).toHaveBeenCalledTimes(1);
    });

    it("Space plays when paused", () => {
      setupStoreMock({ isPlaying: false });
      const mockOrchestrator = createMockOrchestrator();
      const input = renderScrubber(mockOrchestrator);

      fireEvent.keyDown(input, { key: " " });

      expect(mockOrchestrator.play).toHaveBeenCalledTimes(1);
      expect(mockOrchestrator.pause).not.toHaveBeenCalled();
    });

    it("Space pauses when playing", () => {
      setupStoreMock({ isPlaying: true });
      const mockOrchestrator = createMockOrchestrator();
      const input = renderScrubber(mockOrchestrator);

      fireEvent.keyDown(input, { key: " " });

      expect(mockOrchestrator.pause).toHaveBeenCalledTimes(1);
      expect(mockOrchestrator.play).not.toHaveBeenCalled();
    });

    it("does nothing when disabled", () => {
      const mockOrchestrator = createMockOrchestrator();
      const input = renderScrubber(mockOrchestrator, false);

      fireEvent.keyDown(input, { key: "ArrowRight" });

      expect(mockOrchestrator.goToNextFrame).not.toHaveBeenCalled();
    });

    it("ignores unrelated keys", () => {
      const mockOrchestrator = createMockOrchestrator();
      const input = renderScrubber(mockOrchestrator);

      fireEvent.keyDown(input, { key: "Enter" });

      expect(mockOrchestrator.goToPrevFrame).not.toHaveBeenCalled();
      expect(mockOrchestrator.goToNextFrame).not.toHaveBeenCalled();
      expect(mockOrchestrator.play).not.toHaveBeenCalled();
      expect(mockOrchestrator.pause).not.toHaveBeenCalled();
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
