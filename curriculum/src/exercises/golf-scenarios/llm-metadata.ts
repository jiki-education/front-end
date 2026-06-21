import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore using a function's return value to drive a loop:
    getShotLength() returns a number that must control how far the ball rolls. The four
    scenarios exist to prove the same code works for any returned value (no hardcoding).
  `,

  tasks: {
    "roll-and-celebrate": {
      description: `
        The student needs to store getShotLength() in a variable and loop that many times,
        incrementing x before each rollTo so the ball passes through every position.

        The most common trap is hardcoding the loop count to one scenario's value instead of
        using the returned shotLength, which then fails the other scenarios.
      `
    }
  }
};
