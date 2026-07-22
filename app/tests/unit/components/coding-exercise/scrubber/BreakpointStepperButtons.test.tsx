import { useOrchestratorStore } from "@/components/coding-exercise/lib/Orchestrator";
import BreakpointStepperButtons from "@/components/coding-exercise/ui/scrubber/BreakpointStepperButtons";
import { createMockFrame, createMockOrchestrator } from "@/tests/mocks";
import OrchestratorTestProvider from "@/tests/test-utils/OrchestratorTestProvider";
import type { Frame } from "@jiki/interpreters";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

// Mock the orchestrator store hook
jest.mock("@/components/coding-exercise/lib/Orchestrator", () => ({
  useOrchestratorStore: jest.fn()
}));

// Helper to setup store mock
function setupStoreMock({
  currentFrame = null,
  breakpoints = [],
  prevBreakpointFrame = undefined,
  nextBreakpointFrame = undefined
}: {
  currentFrame?: Frame | null;
  breakpoints?: number[];
  prevBreakpointFrame?: Frame | undefined;
  nextBreakpointFrame?: Frame | undefined;
} = {}) {
  (useOrchestratorStore as jest.Mock).mockReturnValue({
    currentTest: currentFrame
      ? {
          currentFrame
        }
      : null,
    breakpoints,
    prevBreakpointFrame,
    nextBreakpointFrame
  });
}

describe("BreakpointStepperButtons Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock for useOrchestratorStore
    setupStoreMock();
  });

  describe("component visibility", () => {
    it("should not render when no breakpoints are set", () => {
      const mockOrchestrator = createMockOrchestrator();
      const currentFrame = createMockFrame(200, { line: 2 });

      setupStoreMock({
        currentFrame,
        breakpoints: [] // No breakpoints
      });

      const { container } = render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      expect(container.firstChild).toBeNull();
    });

    it("should not render when currentTest is null", () => {
      const mockOrchestrator = createMockOrchestrator();

      setupStoreMock({
        currentFrame: null,
        breakpoints: [1, 2, 3]
      });

      const { container } = render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      expect(container.firstChild).toBeNull();
    });

    it("should render when breakpoints exist and currentTest is set", () => {
      const mockOrchestrator = createMockOrchestrator();
      const currentFrame = createMockFrame(200, { line: 2 });

      setupStoreMock({
        currentFrame,
        breakpoints: [1, 2, 3]
      });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      expect(screen.getByLabelText("Previous breakpoint")).toBeInTheDocument();
      expect(screen.getByLabelText("Next breakpoint")).toBeInTheDocument();
    });
  });

  describe("button rendering", () => {
    it("should render buttons without a wrapping container", () => {
      const mockOrchestrator = createMockOrchestrator();
      const currentFrame = createMockFrame(200, { line: 2 });

      setupStoreMock({
        currentFrame,
        breakpoints: [1, 2, 3]
      });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      // Component now renders as a React Fragment, so buttons are rendered directly
      const prevButton = screen.getByLabelText("Previous breakpoint");
      const nextButton = screen.getByLabelText("Next breakpoint");

      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it("should render both previous and next buttons", () => {
      const mockOrchestrator = createMockOrchestrator();
      const currentFrame = createMockFrame(200, { line: 2 });

      setupStoreMock({
        currentFrame,
        breakpoints: [1, 2, 3]
      });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      expect(screen.getByLabelText("Previous breakpoint")).toBeInTheDocument();
      expect(screen.getByLabelText("Next breakpoint")).toBeInTheDocument();
    });
  });

  describe("previous button functionality", () => {
    it("should be enabled when previous breakpoint frame exists", () => {
      const mockOrchestrator = createMockOrchestrator();
      const prevFrame = createMockFrame(100, { line: 1 });
      const currentFrame = createMockFrame(300, { line: 3 });

      setupStoreMock({
        currentFrame,
        breakpoints: [1, 3],
        prevBreakpointFrame: prevFrame,
        nextBreakpointFrame: undefined
      });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous breakpoint");
      expect(prevButton).not.toBeDisabled();
    });

    it("should be disabled when no previous breakpoint frame exists", () => {
      const mockOrchestrator = createMockOrchestrator();
      const currentFrame = createMockFrame(100, { line: 1 });
      const nextFrame = createMockFrame(300, { line: 3 });

      setupStoreMock({
        currentFrame,
        breakpoints: [1, 3],
        prevBreakpointFrame: undefined,
        nextBreakpointFrame: nextFrame
      });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous breakpoint");
      expect(prevButton).toBeDisabled();
    });

    it("should be disabled when enabled prop is false", () => {
      const mockOrchestrator = createMockOrchestrator();
      const prevFrame = createMockFrame(100, { line: 1 });
      const currentFrame = createMockFrame(300, { line: 3 });

      setupStoreMock({
        currentFrame,
        breakpoints: [1, 3],
        prevBreakpointFrame: prevFrame,
        nextBreakpointFrame: undefined
      });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={false} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous breakpoint");
      expect(prevButton).toBeDisabled();
    });

    it("should call goToPrevBreakpoint on click", () => {
      const mockOrchestrator = createMockOrchestrator();
      const prevFrame = createMockFrame(100, { line: 1 });
      const currentFrame = createMockFrame(300, { line: 3 });

      setupStoreMock({
        currentFrame,
        breakpoints: [1, 3],
        prevBreakpointFrame: prevFrame,
        nextBreakpointFrame: undefined
      });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous breakpoint");
      fireEvent.click(prevButton);

      expect(mockOrchestrator.goToPrevBreakpoint).toHaveBeenCalledTimes(1);
    });

    it("should not call goToPrevBreakpoint when no previous breakpoint exists", () => {
      const mockOrchestrator = createMockOrchestrator();
      const currentFrame = createMockFrame(100, { line: 1 });

      setupStoreMock({
        currentFrame,
        breakpoints: [1, 3],
        prevBreakpointFrame: undefined,
        nextBreakpointFrame: undefined
      });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous breakpoint");
      fireEvent.click(prevButton);

      expect(mockOrchestrator.goToPrevBreakpoint).not.toHaveBeenCalled();
    });
  });

  describe("next button functionality", () => {
    it("should be enabled when next breakpoint frame exists", () => {
      const mockOrchestrator = createMockOrchestrator();
      const currentFrame = createMockFrame(100, { line: 1 });
      const nextFrame = createMockFrame(300, { line: 3 });

      setupStoreMock({
        currentFrame,
        breakpoints: [1, 3],
        prevBreakpointFrame: undefined,
        nextBreakpointFrame: nextFrame
      });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const nextButton = screen.getByLabelText("Next breakpoint");
      expect(nextButton).not.toBeDisabled();
    });

    it("should be disabled when no next breakpoint frame exists", () => {
      const mockOrchestrator = createMockOrchestrator();
      const prevFrame = createMockFrame(100, { line: 1 });
      const currentFrame = createMockFrame(300, { line: 3 });

      setupStoreMock({
        currentFrame,
        breakpoints: [1, 3],
        prevBreakpointFrame: prevFrame,
        nextBreakpointFrame: undefined
      });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const nextButton = screen.getByLabelText("Next breakpoint");
      expect(nextButton).toBeDisabled();
    });

    it("should be disabled when enabled prop is false", () => {
      const mockOrchestrator = createMockOrchestrator();
      const currentFrame = createMockFrame(100, { line: 1 });
      const nextFrame = createMockFrame(300, { line: 3 });

      setupStoreMock({
        currentFrame,
        breakpoints: [1, 3],
        prevBreakpointFrame: undefined,
        nextBreakpointFrame: nextFrame
      });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={false} />
        </OrchestratorTestProvider>
      );

      const nextButton = screen.getByLabelText("Next breakpoint");
      expect(nextButton).toBeDisabled();
    });

    it("should call goToNextBreakpoint on click", () => {
      const mockOrchestrator = createMockOrchestrator();
      const currentFrame = createMockFrame(100, { line: 1 });
      const nextFrame = createMockFrame(300, { line: 3 });

      setupStoreMock({
        currentFrame,
        breakpoints: [1, 3],
        prevBreakpointFrame: undefined,
        nextBreakpointFrame: nextFrame
      });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const nextButton = screen.getByLabelText("Next breakpoint");
      fireEvent.click(nextButton);

      expect(mockOrchestrator.goToNextBreakpoint).toHaveBeenCalledTimes(1);
    });

    it("should not call goToNextBreakpoint when no next breakpoint exists", () => {
      const mockOrchestrator = createMockOrchestrator();
      const currentFrame = createMockFrame(300, { line: 3 });

      setupStoreMock({
        currentFrame,
        breakpoints: [1, 3],
        prevBreakpointFrame: undefined,
        nextBreakpointFrame: undefined
      });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const nextButton = screen.getByLabelText("Next breakpoint");
      fireEvent.click(nextButton);

      expect(mockOrchestrator.goToNextBreakpoint).not.toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should handle both buttons disabled when no breakpoint frames available", () => {
      const mockOrchestrator = createMockOrchestrator();
      const currentFrame = createMockFrame(200, { line: 2 });

      setupStoreMock({
        currentFrame,
        breakpoints: [5, 10], // Breakpoints on non-existent lines
        prevBreakpointFrame: undefined,
        nextBreakpointFrame: undefined
      });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous breakpoint");
      const nextButton = screen.getByLabelText("Next breakpoint");

      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it("should handle only previous button enabled", () => {
      const mockOrchestrator = createMockOrchestrator();
      const prevFrame = createMockFrame(100, { line: 1 });
      const currentFrame = createMockFrame(300, { line: 3 });

      setupStoreMock({
        currentFrame,
        breakpoints: [1, 3],
        prevBreakpointFrame: prevFrame,
        nextBreakpointFrame: undefined
      });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous breakpoint");
      const nextButton = screen.getByLabelText("Next breakpoint");

      expect(prevButton).not.toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it("should handle only next button enabled", () => {
      const mockOrchestrator = createMockOrchestrator();
      const currentFrame = createMockFrame(100, { line: 1 });
      const nextFrame = createMockFrame(300, { line: 3 });

      setupStoreMock({
        currentFrame,
        breakpoints: [1, 3],
        prevBreakpointFrame: undefined,
        nextBreakpointFrame: nextFrame
      });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous breakpoint");
      const nextButton = screen.getByLabelText("Next breakpoint");

      expect(prevButton).toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });

    it("should handle both buttons enabled", () => {
      const mockOrchestrator = createMockOrchestrator();
      const prevFrame = createMockFrame(100, { line: 1 });
      const currentFrame = createMockFrame(300, { line: 3 });
      const nextFrame = createMockFrame(500, { line: 5 });

      setupStoreMock({
        currentFrame,
        breakpoints: [1, 3, 5],
        prevBreakpointFrame: prevFrame,
        nextBreakpointFrame: nextFrame
      });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous breakpoint");
      const nextButton = screen.getByLabelText("Next breakpoint");

      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe("both buttons interaction", () => {
    it("should allow navigation in both directions", () => {
      const mockOrchestrator = createMockOrchestrator();
      const prevFrame = createMockFrame(100, { line: 1 });
      const currentFrame = createMockFrame(300, { line: 3 });
      const nextFrame = createMockFrame(500, { line: 5 });

      setupStoreMock({
        currentFrame,
        breakpoints: [1, 3, 5],
        prevBreakpointFrame: prevFrame,
        nextBreakpointFrame: nextFrame
      });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous breakpoint");
      const nextButton = screen.getByLabelText("Next breakpoint");

      // Navigate to next breakpoint
      fireEvent.click(nextButton);
      expect(mockOrchestrator.goToNextBreakpoint).toHaveBeenCalledTimes(1);

      jest.clearAllMocks();

      // Navigate to previous breakpoint
      fireEvent.click(prevButton);
      expect(mockOrchestrator.goToPrevBreakpoint).toHaveBeenCalledTimes(1);
    });
  });

  describe("current frame on breakpoint", () => {
    it("should handle navigation when current frame is on a breakpoint", () => {
      const mockOrchestrator = createMockOrchestrator();
      const prevFrame = createMockFrame(100, { line: 1 });
      const currentFrame = createMockFrame(300, { line: 3 }); // On a breakpoint
      const nextFrame = createMockFrame(500, { line: 5 });

      setupStoreMock({
        currentFrame,
        breakpoints: [1, 3, 5], // Current frame is on line 3 which is a breakpoint
        prevBreakpointFrame: prevFrame,
        nextBreakpointFrame: nextFrame
      });

      render(
        <OrchestratorTestProvider orchestrator={mockOrchestrator}>
          <BreakpointStepperButtons enabled={true} />
        </OrchestratorTestProvider>
      );

      const prevButton = screen.getByLabelText("Previous breakpoint");
      const nextButton = screen.getByLabelText("Next breakpoint");

      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();

      // Should still navigate to different breakpoints
      fireEvent.click(prevButton);
      expect(mockOrchestrator.goToPrevBreakpoint).toHaveBeenCalledTimes(1);

      fireEvent.click(nextButton);
      expect(mockOrchestrator.goToNextBreakpoint).toHaveBeenCalledTimes(1);
    });
  });
});
