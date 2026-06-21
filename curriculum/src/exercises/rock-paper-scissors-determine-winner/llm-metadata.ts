import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore combining conditions with the "and" operator:
    deciding a Rock/Paper/Scissors winner requires compound booleans (e.g. player1 chose
    rock AND player2 chose scissors). All 9 combinations are tested.
  `,

  tasks: {
    "determine-winner": {
      description: `
        The student reads both choices, compares them, and calls announceResult() with
        "player_1", "player_2", or "tie". A cleaner approach than enumerating all 9 cases
        is to default to "player_2", then override for the tie (choices equal) and the
        three player_1-wins cases (rock>scissors, scissors>paper, paper>rock).

        Common mistakes worth watching for:
        - Using "or" instead of "and" when both conditions must hold together.
        - Getting win conditions backwards (e.g. thinking rock beats paper).
        - Forgetting the tie case, or forgetting to call announceResult() at all.
      `
    }
  }
};
