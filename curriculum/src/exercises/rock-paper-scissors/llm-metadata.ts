import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Practising compound booleans with && to decide a Rock/Paper/Scissors winner.
    Single task; all 9 choice combinations are tested.
  `,

  tasks: {
    "determine-winner": {
      description: `
        Solution shape: rather than enumerating all 9 cases, default the result to one
        player, then override for the tie (choices equal) and the three cases where the
        other player wins.

        Common mistakes worth watching for:
        - Using || instead of && when both conditions must hold together.
        - Getting win conditions backwards (e.g. thinking rock beats paper).
        - Forgetting the tie case, or forgetting to call announceResult() at all.
      `
    }
  }
};
