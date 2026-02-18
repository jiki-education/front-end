import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches students to define functions with parameters. Students create a walk(steps)
    function that uses a repeat loop with the steps parameter to call move() multiple times. This builds
    on the previous exercise (maze-turn-around) where they defined a parameterless function, now adding
    the concept of inputs to functions.
  `,

  tasks: {
    "write-walk": {
      description: `
        Students define a walk function that takes a steps parameter and uses repeat to move that many
        times. The key concept is using the parameter inside the function body as the repeat count.
        The navigation code (walk/turn calls) is already provided — students only write the function.
        Common mistakes: forgetting the parameter name, not using repeat with the parameter, or
        trying to call walk() without defining it first.
      `
    }
  }
};
