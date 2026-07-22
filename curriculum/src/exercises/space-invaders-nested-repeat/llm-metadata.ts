import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore nested repeat loops. It builds on the single-loop exercise by adding a fourth row of aliens; the 7-line limit forces an inner repeat for the per-column shots rather than writing shoot() repeatedly.
  `,

  tasks: {
    "nested-repeat-shoot": {
      description: `
        An inner repeat (one shot per row) nested inside an outer repeat (one per column), with movement around the inner loop to position the cannon.

        Common mistakes:
        - Writing shoot() out four times (hits the line limit)
        - Wrong inner count (assuming 3 rows like the previous exercise instead of 4)
        - Forgetting the second move() after the inner loop

        Teaching strategy: ask what changed (4 rows, not 3), get a repeat for the shots, then wrap it in another repeat for the columns.
      `
    }
  }
};
