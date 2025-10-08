import type { Task } from "@jiki/curriculum";

/**
 * Creates a mock Task with sensible defaults and optional overrides
 */
export function createMockTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    name: "Test Task",
    bonus: false,
    ...overrides
  };
}
