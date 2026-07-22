import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore conditionals by converting 24-hour time to
    12-hour am/pm format. The teaching moment is recognising it as TWO separate problems:
    deciding am/pm, and converting the hour number.
  `,

  tasks: {
    "display-time": {
      description: `
        Anchor steps: read the hour/minute, decide am/pm, convert the hour, then displayTime().

        Edge cases that drive the scenarios (and the usual mistakes):
        - Noon: use hour >= 12 (not > 12) or 12:00 wrongly shows as am.
        - Midnight: hour 0 must display as 12, not 0.
        - A common structural error is nesting the hour conversion inside the am/pm if,
          rather than handling them as two independent decisions.
      `
    }
  }
};
