import type { Orchestrator } from "@/components/coding-exercise/lib/Orchestrator";

// Helper to create a mock Orchestrator
export function createMockOrchestrator(): Orchestrator {
  return {
    exerciseSlug: "test-uuid",
    setCode: jest.fn(),
    setCurrentTestTime: jest.fn(),
    setCurrentTest: jest.fn(),
    setHasCodeBeenEdited: jest.fn(),
    setIsSpotlightActive: jest.fn(),
    getNearestCurrentFrame: jest.fn().mockReturnValue(null),
    pause: jest.fn(),
    snapToNearestFrame: jest.fn(),
    runCode: jest.fn(),
    getStore: jest.fn(),
    play: jest.fn(),
    showInformationWidget: jest.fn(),
    goToPrevFrame: jest.fn(),
    goToNextFrame: jest.fn(),
    goToFirstFrame: jest.fn(),
    goToLastFrame: jest.fn(),
    goToPrevBreakpoint: jest.fn(),
    goToNextBreakpoint: jest.fn(),
    setCurrentTask: jest.fn()
  } as unknown as Orchestrator;
}
