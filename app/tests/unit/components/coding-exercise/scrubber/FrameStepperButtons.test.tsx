import type { Orchestrator } from "@/components/coding-exercise/lib/Orchestrator";
import { useOrchestratorStore } from "@/components/coding-exercise/lib/Orchestrator";
import FrameStepperButtons from "@/components/coding-exercise/ui/scrubber/FrameStepperButtons";
import { createMockFrame } from "@/tests/mocks";
import OrchestratorTestProvider from "@/tests/test-utils/OrchestratorTestProvider";
import type { Frame } from "@jiki/interpreters";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

// Mock the orchestrator store hook
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

// Helper to create mock orchestrator with store that returns given frames
function createMockOrchestrator(
  prevFrame: Frame | undefined = undefined,
  nextFrame: Frame | undefined = undefined
): Orchestrator {
  return {
    exerciseSlug: "test-uuid",
    setCode: jest.fn(),
    setCurrentTestTime: jest.fn(),
    setCurrentTest: jest.fn(),
    setHasCodeBeenEdited: jest.fn(),
    setIsSpotlightActive: jest.fn(),
    getNearestCurrentFrame: jest.fn().mockReturnValue(null),
    pause: jest.fn(),
    runCode: jest.fn(),
    getStore: jest.fn().mockReturnValue({
      getState: jest.fn().mockReturnValue({ prevFrame, nextFrame })
    })
  } as unknown as Orchestrator;
}

// Helper to setup store mock
function setupStoreMock(
  currentFrame: Frame | null = null,
  time: number = 0,
  prevFrame: Frame | undefined = undefined,
  nextFrame: Frame | undefined = undefined
) {
  (useOrchestratorStore as jest.Mock).mockReturnValue({
    currentTest: currentFrame ? { currentFrame, time } : null,
    prevFrame,
    nextFrame
  });
}

describe("FrameStepperButtons Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock for useOrchestratorStore
    setupStoreMock();
  });

  describe("button rendering", () => {
    it("should render both previous and next buttons", () => {
      const mockOrchestrator = createMockOrchestrator();

      // Setup store mock with current frame
      setupStoreMock();
      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <FrameStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      expect(screen.getByLabelText("Previous frame")).toBeInTheDocument();
      expect(screen.getByLabelText("Next frame")).toBeInTheDocument();
    });

    it("should render buttons without a wrapping container", () => {
      const mockOrchestrator = createMockOrchestrator();

      // Setup store mock with current frame
      setupStoreMock();
      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <FrameStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      // Component now renders as a React Fragment, so buttons are rendered directly
      const prevButton = screen.getByLabelText("Previous frame");
      const nextButton = screen.getByLabelText("Next frame");

      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });
  });

  describe("previous button functionality", () => {
    it("should be enabled when previous frame exists", () => {
      const frames = createMockFrames(5);
      const mockOrchestrator = createMockOrchestrator(frames[1], frames[3]);

      // Setup store mock with current frame and prev/next frames
      setupStoreMock(frames[2], 200, frames[1], frames[3]);
      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <FrameStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous frame");
      expect(prevButton).not.toBeDisabled();
    });

    it("should be disabled when no previous frame exists", () => {
      const mockOrchestrator = createMockOrchestrator(undefined, undefined);
      const frames = createMockFrames(5);

      // Setup store mock with no previous frame
      setupStoreMock(frames[0], 0, undefined, frames[1]);
      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <FrameStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous frame");
      expect(prevButton).toBeDisabled();
    });

    it("should be disabled when enabled prop is false", () => {
      const frames = createMockFrames(5);
      const mockOrchestrator = createMockOrchestrator(frames[1], frames[3]);

      // Setup store mock with previous frame available
      setupStoreMock(frames[2], 200, frames[1], frames[3]);
      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <FrameStepperButtons enabled={false} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous frame");
      expect(prevButton).toBeDisabled();
    });

    it("should pause and navigate to previous frame on click", () => {
      const frames = createMockFrames(5);
      const mockOrchestrator = createMockOrchestrator(frames[2], frames[4]);

      // Setup store mock with previous frame available
      setupStoreMock(frames[3], 300, frames[2], frames[4]);
      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <FrameStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous frame");
      fireEvent.click(prevButton);

      expect(mockOrchestrator.pause).toHaveBeenCalledTimes(1);
      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenCalledWith(200000);
      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenCalledTimes(1);
    });

    it("should not navigate when no previous frame exists after pause", () => {
      const frames = createMockFrames(5);
      // Store returns no prevFrame after pause
      const mockOrchestrator = createMockOrchestrator(undefined, frames[1]);

      // Setup store mock with no previous frame
      setupStoreMock(frames[0], 0, undefined, frames[1]);
      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <FrameStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous frame");
      fireEvent.click(prevButton);

      // Button is disabled so handler doesn't fire
      expect(mockOrchestrator.pause).not.toHaveBeenCalled();
      expect(mockOrchestrator.setCurrentTestTime).not.toHaveBeenCalled();
    });
  });

  describe("next button functionality", () => {
    it("should be enabled when next frame exists", () => {
      const frames = createMockFrames(5);
      const mockOrchestrator = createMockOrchestrator(frames[1], frames[3]);

      // Setup store mock with next frame available
      setupStoreMock(frames[2], 200, frames[1], frames[3]);
      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <FrameStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const nextButton = screen.getByLabelText("Next frame");
      expect(nextButton).not.toBeDisabled();
    });

    it("should be disabled when no next frame exists", () => {
      const frames = createMockFrames(5);
      const mockOrchestrator = createMockOrchestrator(frames[3], undefined);

      // Setup store mock with no next frame
      setupStoreMock(frames[4], 400, frames[3], undefined);
      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <FrameStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const nextButton = screen.getByLabelText("Next frame");
      expect(nextButton).toBeDisabled();
    });

    it("should be disabled when enabled prop is false", () => {
      const frames = createMockFrames(5);
      const mockOrchestrator = createMockOrchestrator(frames[1], frames[3]);

      // Setup store mock with next frame available
      setupStoreMock(frames[2], 200, frames[1], frames[3]);
      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <FrameStepperButtons enabled={false} />
        </OrchestratorTestProvider>
      );

      const nextButton = screen.getByLabelText("Next frame");
      expect(nextButton).toBeDisabled();
    });

    it("should pause and navigate to next frame on click", () => {
      const frames = createMockFrames(5);
      const mockOrchestrator = createMockOrchestrator(frames[1], frames[3]);

      // Setup store mock with next frame available
      setupStoreMock(frames[2], 200, frames[1], frames[3]);
      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <FrameStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const nextButton = screen.getByLabelText("Next frame");
      fireEvent.click(nextButton);

      expect(mockOrchestrator.pause).toHaveBeenCalledTimes(1);
      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenCalledWith(300000);
      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenCalledTimes(1);
    });

    it("should not navigate when no next frame exists after pause", () => {
      const frames = createMockFrames(5);
      // Store returns no nextFrame after pause
      const mockOrchestrator = createMockOrchestrator(frames[3], undefined);

      // Setup store mock with no next frame
      setupStoreMock(frames[4], 400, frames[3], undefined);
      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <FrameStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const nextButton = screen.getByLabelText("Next frame");
      fireEvent.click(nextButton);

      // Button is disabled so handler doesn't fire
      expect(mockOrchestrator.pause).not.toHaveBeenCalled();
      expect(mockOrchestrator.setCurrentTestTime).not.toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should handle both buttons disabled when no frames", () => {
      const mockOrchestrator = createMockOrchestrator();

      // Setup store mock with no prev or next frames
      setupStoreMock(null, 0, undefined, undefined);
      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <FrameStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous frame");
      const nextButton = screen.getByLabelText("Next frame");

      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it("should handle only previous button enabled", () => {
      const frames = createMockFrames(3);
      const mockOrchestrator = createMockOrchestrator(frames[1], undefined);

      // Setup store mock with only previous frame available
      setupStoreMock(frames[2], 200, frames[1], undefined);
      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <FrameStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous frame");
      const nextButton = screen.getByLabelText("Next frame");

      expect(prevButton).not.toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it("should handle only next button enabled", () => {
      const frames = createMockFrames(3);
      const mockOrchestrator = createMockOrchestrator(undefined, frames[1]);

      // Setup store mock with only next frame available
      setupStoreMock(frames[0], 0, undefined, frames[1]);
      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <FrameStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous frame");
      const nextButton = screen.getByLabelText("Next frame");

      expect(prevButton).toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe("both buttons interaction", () => {
    it("should allow navigation in both directions", () => {
      const frames = createMockFrames(5);
      const mockOrchestrator = createMockOrchestrator(frames[1], frames[3]);

      // Setup store mock with both prev and next frames available
      setupStoreMock(frames[2], 200, frames[1], frames[3]);
      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <FrameStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous frame");
      const nextButton = screen.getByLabelText("Next frame");

      // Navigate to next frame
      fireEvent.click(nextButton);
      expect(mockOrchestrator.pause).toHaveBeenCalledTimes(1);
      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenCalledWith(300000);

      jest.clearAllMocks();

      // Navigate to previous frame
      fireEvent.click(prevButton);
      expect(mockOrchestrator.pause).toHaveBeenCalledTimes(1);
      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenCalledWith(100000);
    });
  });
});
