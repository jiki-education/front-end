/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
// ESLint thinks the type assertion is unnecessary but TypeScript needs it to access HTMLInputElement
// properties like min, max, and value. This is a known issue with @testing-library/react types.
import { useOrchestratorStore } from "@/components/coding-exercise/lib/Orchestrator";
import Scrubber from "@/components/coding-exercise/ui/scrubber/Scrubber";
import {
  createMockFrame,
  createMockOrchestrator,
  createMockOrchestratorStore,
  createMockTestResult
} from "@/tests/mocks";
import OrchestratorTestProvider from "@/tests/test-utils/OrchestratorTestProvider";
import type { Frame } from "@jiki/interpreters";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

// Mock the orchestrator store hook
jest.mock("@/components/coding-exercise/lib/Orchestrator", () => ({
  useOrchestratorStore: jest.fn(),
  default: jest.fn()
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

// Helper to create mock store state (using our centralized mock but extracting just the state)
function createMockStoreState(overrides?: any) {
  const store = createMockOrchestratorStore(overrides);
  return store.getState();
}

describe("Scrubber Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("container rendering", () => {
    it("should render the scrubber container with data-testid", () => {
      const orchestrator = createMockOrchestrator();
      (useOrchestratorStore as jest.Mock).mockReturnValue(createMockStoreState());

      render(
        <OrchestratorTestProvider orchestrator={orchestrator}>
          <Scrubber />
        </OrchestratorTestProvider>
      );

      const container = screen.getByTestId("scrubber");
      expect(container).toBeInTheDocument();
      expect(container).toHaveAttribute("id", "scrubber");
    });

    it("should render all child components", () => {
      const orchestrator = createMockOrchestrator();

      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: createMockTestResult({ frames: createMockFrames(3) }),
          currentTestTime: 100,
          currentFrame: createMockFrames(3)[1]
        })
      );

      render(
        <OrchestratorTestProvider orchestrator={orchestrator}>
          <Scrubber />
        </OrchestratorTestProvider>
      );

      // Check ScrubberInput is rendered
      expect(screen.getByTestId("scrubber-range-input")).toBeInTheDocument();

      // Check FrameStepperButtons are rendered
      expect(screen.getByLabelText("Previous frame")).toBeInTheDocument();
      expect(screen.getByLabelText("Next frame")).toBeInTheDocument();
    });
  });

  describe("when currentTest is null", () => {
    it("should pass default values to child components", () => {
      const orchestrator = createMockOrchestrator();
      (useOrchestratorStore as jest.Mock).mockReturnValue(createMockStoreState());

      render(
        <OrchestratorTestProvider orchestrator={orchestrator}>
          <Scrubber />
        </OrchestratorTestProvider>
      );

      const input = screen.getByRole("slider") as HTMLInputElement;
      expect(input).toBeDisabled();
      expect(input.value).toBe("0"); // Default time
    });
  });

  describe("enabled/disabled state logic", () => {
    it("should be disabled when hasCodeBeenEdited is true", () => {
      const orchestrator = createMockOrchestrator();

      const frames = createMockFrames(3);
      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: createMockTestResult({ frames: frames }),
          currentTestTime: 0,
          currentFrame: frames[0],
          hasCodeBeenEdited: true
        })
      );

      render(
        <OrchestratorTestProvider orchestrator={orchestrator}>
          <Scrubber />
        </OrchestratorTestProvider>
      );

      const input = screen.getByRole("slider");
      const prevButton = screen.getByLabelText("Previous frame");
      const nextButton = screen.getByLabelText("Next frame");

      expect(input).toBeDisabled();
      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it("should be disabled when isSpotlightActive is true", () => {
      const orchestrator = createMockOrchestrator();

      const frames = createMockFrames(3);
      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: createMockTestResult({ frames: frames }),
          currentTestTime: 0,
          currentFrame: frames[0],
          isSpotlightActive: true
        })
      );

      render(
        <OrchestratorTestProvider orchestrator={orchestrator}>
          <Scrubber />
        </OrchestratorTestProvider>
      );

      const input = screen.getByRole("slider");
      expect(input).toBeDisabled();
    });

    it("should be disabled when less than 2 frames", () => {
      const orchestrator = createMockOrchestrator();

      const frames = createMockFrames(1);
      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: createMockTestResult({ frames: frames }),
          currentTestTime: 0,
          currentFrame: frames[0]
        })
      );

      render(
        <OrchestratorTestProvider orchestrator={orchestrator}>
          <Scrubber />
        </OrchestratorTestProvider>
      );

      const input = screen.getByRole("slider");
      expect(input).toBeDisabled();
    });

    it("should be enabled when all conditions are met", () => {
      const orchestrator = createMockOrchestrator();

      const frames = createMockFrames(2);
      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: createMockTestResult({ frames: frames }),
          currentTestTime: 0,
          currentFrame: frames[0],
          hasCodeBeenEdited: false,
          isSpotlightActive: false
        })
      );

      render(
        <OrchestratorTestProvider orchestrator={orchestrator}>
          <Scrubber />
        </OrchestratorTestProvider>
      );

      const input = screen.getByRole("slider");
      expect(input).not.toBeDisabled();
    });
  });

  describe("focus on container click", () => {
    it("should focus the range input when container is clicked", () => {
      const orchestrator = createMockOrchestrator();

      const frames = createMockFrames(3);
      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: createMockTestResult({ frames: frames }),
          currentTestTime: 0,
          currentFrame: frames[0]
        })
      );

      render(
        <OrchestratorTestProvider orchestrator={orchestrator}>
          <Scrubber />
        </OrchestratorTestProvider>
      );

      const container = screen.getByTestId("scrubber");
      const input = screen.getByRole("slider") as HTMLInputElement;

      // Mock the focus method
      const focusSpy = jest.spyOn(input, "focus");

      fireEvent.click(container);

      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe("prop passing to child components", () => {
    it("should pass correct props to ScrubberInput", () => {
      const orchestrator = createMockOrchestrator();
      const frames = createMockFrames(3);

      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: createMockTestResult({ frames: frames }),
          currentTestTime: 150,
          currentFrame: frames[2]
        })
      );

      render(
        <OrchestratorTestProvider orchestrator={orchestrator}>
          <Scrubber />
        </OrchestratorTestProvider>
      );

      const input = screen.getByRole("slider") as HTMLInputElement;
      expect(input.value).toBe("150");
      expect(input).not.toBeDisabled();
    });

    it("should pass correct props to FrameStepperButtons", () => {
      const frames = createMockFrames(4); // Creates frames at time: 0, 100000, 200000, 300000 microseconds

      // Create mock orchestrator with methods that can be updated
      const orchestrator = createMockOrchestrator();

      // Test navigation at first frame (position 0)
      // At first frame: no previous, has next
      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: createMockTestResult({ frames: frames }),
          currentTestTime: 0,
          currentFrame: frames[0],
          hasCodeBeenEdited: false,
          isSpotlightActive: false,
          prevFrame: undefined,
          nextFrame: frames[1]
        })
      );

      const { rerender } = render(
        <OrchestratorTestProvider orchestrator={orchestrator}>
          <Scrubber />
        </OrchestratorTestProvider>
      );

      expect(screen.getByLabelText("Previous frame")).toBeDisabled(); // No previous frame
      expect(screen.getByLabelText("Next frame")).not.toBeDisabled(); // Has next frame

      // Test navigation at middle position (between frames)
      // In middle: has both previous and next
      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: createMockTestResult({ frames: frames }),
          currentTestTime: 150000,
          currentFrame: frames[1], // 150ms in microseconds
          hasCodeBeenEdited: false,
          isSpotlightActive: false,
          prevFrame: frames[0],
          nextFrame: frames[2]
        })
      );

      rerender(
        <OrchestratorTestProvider orchestrator={orchestrator}>
          <Scrubber />
        </OrchestratorTestProvider>
      );

      expect(screen.getByLabelText("Previous frame")).not.toBeDisabled(); // Has previous frames
      expect(screen.getByLabelText("Next frame")).not.toBeDisabled(); // Has next frame

      // Test navigation at last frame (position 3)
      // At last frame: has previous, no next
      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: createMockTestResult({ frames: frames }),
          currentTestTime: 300000,
          currentFrame: frames[3], // 300ms in microseconds
          hasCodeBeenEdited: false,
          isSpotlightActive: false,
          prevFrame: frames[2],
          nextFrame: undefined
        })
      );

      rerender(
        <OrchestratorTestProvider orchestrator={orchestrator}>
          <Scrubber />
        </OrchestratorTestProvider>
      );

      expect(screen.getByLabelText("Previous frame")).not.toBeDisabled(); // Has previous frame
      expect(screen.getByLabelText("Next frame")).toBeDisabled(); // No next frame
    });
  });
});
