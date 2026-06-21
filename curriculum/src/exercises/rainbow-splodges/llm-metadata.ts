import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore using random numbers inside a loop to make
    visual art, feeding return values from one function into another. It is creative with
    flexible constraints rather than one exact answer.
  `,

  tasks: {
    "draw-splodges": {
      description: `
        The student draws many circles at random positions with random colours.

        The non-obvious traps (the instructions state the constraints; these are where
        students slip):
        - Declaring the random variables outside the loop, so every circle is identical.
        - Passing the hue number straight to circle() instead of converting via hsl().
        - Picking a position without accounting for radius, so circles spill outside the
          canvas.
      `
    }
  }
};
