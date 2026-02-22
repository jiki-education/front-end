import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches students to pass arguments to functions.
    Students use a pre-provided walk(steps) function that takes a number and moves forward that many cells.
    This builds on maze-solve-basic where they used move() with no arguments,
    introducing the concept that functions can accept inputs that change their behavior.
  `,

  tasks: {
    "solve-maze": {
      description: `
        Students navigate a maze using walk(steps), turnLeft(), and turnRight().
        The maze has longer corridors designed to make walk(3) and walk(2) more natural than calling move() repeatedly.
        Common mistakes: forgetting to pass the number argument, miscounting corridor lengths, confusing left/right after turns.
      `
    }
  }
};
