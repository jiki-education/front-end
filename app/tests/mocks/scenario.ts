import type { Scenario } from "@jiki/curriculum";

/**
 * Creates a mock Scenario with sensible defaults and optional overrides
 */
export function createMockScenario(overrides: Partial<Scenario> = {}): Scenario {
  return {
    slug: "scenario-1",
    name: "Test Scenario",
    description: "Test description",
    taskId: "task-1",
    setup: jest.fn(),
    expectations: jest.fn(),
    ...overrides
  };
}
