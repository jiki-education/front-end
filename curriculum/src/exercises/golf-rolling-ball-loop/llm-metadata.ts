import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    The student's first repeat-loop exercise: roll the ball into a hole 60 steps
    away by repeating a single roll() rather than writing it 60 times.
  `,

  tasks: {
    "roll-ball": {
      description: `
        The whole lesson is recognising a fixed-count repeated action as a loop.
        A student writing roll() many times by hand has the right output but missed
        the point; nudge toward the loop instead.
      `
    }
  }
};
