import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore positioning a shape relative to the canvas
    edges using arithmetic on a few fact variables, so the position holds when those
    variables change.
  `,

  tasks: {
    "position-sun": {
      description: `
        The student positions a single sun in a corner using the fact variables
        \`canvasSize\`, \`gap\`, \`radius\`, and \`color\` (= "yellow"). There is no sky
        rectangle. The derived position pushes in from the edges by gap + radius:
        sunX = canvasSize - gap - radius, sunY = gap + radius, then
        circle(sunX, sunY, radius, color).

        Common mistakes worth watching for:
        - Forgetting to subtract the radius, so the sun clips the edge.
        - Swapping the x and y formulas.
        - Hardcoding the final numbers instead of using the expressions.
      `
    }
  }
};
