import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

export const llmMetadata: {
  description: string;
  tasks: Record<TaskId, { description: string }>;
} = {
  description:
    "This exercise allows a student to explore writing one generalised program that passes multiple scenarios. This is an early exercise with scenarios: the SAME code must work when askNumberOfFlowers() returns different values (1, 3, 4, 9), so the answer cannot hardcode a count.",
  tasks: {
    "plant-flowers-evenly": {
      description:
        "Anchor steps: store askNumberOfFlowers() in a variable, derive even spacing from it, then loop that many times planting at each position. The non-obvious bit is the gap formula 100 / (count + 1) so flowers don't sit on the edges; the headline trap is hardcoding the count (passes one scenario, fails the rest)."
    }
  }
};
