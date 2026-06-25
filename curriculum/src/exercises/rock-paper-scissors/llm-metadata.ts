import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Decide the winner of a Rock/Paper/Scissors game between Yuki and Ando, exploring
    compound booleans with the "and" operator (e.g. Yuki chose rock AND Ando chose
    scissors). All 9 combinations are tested.
  `,

  tasks: {
    "determine-winner": {
      description: `
        The student reads both choices, compares them, and calls announceResult() with
        "Yuki", "Ando", or "tie". A cleaner approach than enumerating all 9 cases is to
        default to "Ando", then override for the tie (choices equal) and the three
        Yuki-wins cases (rock>scissors, scissors>paper, paper>rock).

        Common mistakes worth watching for:
        - Using "or" instead of "and" when both conditions must hold together.
        - Getting win conditions backwards (e.g. thinking rock beats paper).
        - Forgetting the tie case, or forgetting to call announceResult() at all.
      `
    }
  }
};
