import type { Orchestrator } from "@/components/coding-exercise/lib/Orchestrator";

// Helper to create a mock Orchestrator
export function createMockOrchestrator(): Orchestrator {
  return {
    exerciseUuid: "test-uuid",
    setCode: jest.fn(),
    setCurrentTestTime: jest.fn(),
    setCurrentTest: jest.fn(),
    setHasCodeBeenEdited: jest.fn(),
    setIsSpotlightActive: jest.fn(),
    getNearestCurrentFrame: jest.fn().mockReturnValue(null),
    snapToNearestFrame: jest.fn(),
    runCode: jest.fn(),
    getStore: jest.fn(),
    goToPrevBreakpoint: jest.fn(),
    goToNextBreakpoint: jest.fn(),
    setCurrentTask: jest.fn()
  } as unknown as Orchestrator;
}
