import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore deriving related dimensions and positions
    from a single source variable using arithmetic, so the whole shape rescales when
    that variable changes.
  `,

  tasks: {
    "build-relational-snowman": {
      description: `
        The student derives everything from a single \`size\` variable (the fixed
        variables are \`snowmanX\` and \`size\`); the snowman sits on the ground and
        stacks upward. The three radii are multiples of size (headRadius = size * 2,
        bodyRadius = size * 3, baseRadius = size * 4), and each y is computed so the
        circles touch (sum of the two radii), starting from the bottom (baseY uses
        \`100 - size - baseRadius\`).

        Common mistakes worth watching for:
        - Hardcoding numbers instead of expressions, so changing \`size\` doesn't rescale.
        - Spacing circles by a single radius rather than the sum of both radii, so they
          overlap or gap.
        - Building the stack from the top instead of from the ground.
      `
    }
  }
};
