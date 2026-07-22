import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore a data-driven lookup-table approach: a list
    of [name, time] pairs replaces a long if/else chain, then iteration accumulates a total.
  `,

  tasks: {
    "can-fit-in": {
      description: `
        Anchor steps:
        1. A name->time lookup helper (the data-driven part worth steering toward).
        2. Loop the queue, subtracting each cut's time from the remaining minutes.
        3. Compare what's left against the next cut's time.

        Trap worth watching: the boundary case must still fit, so the final comparison
        is >= (not >). The "cutting-it-fine" / "busy-day-but-time" scenarios test exactly this.
      `
    }
  }
};
