import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches combining conditions using the "and" operator.
    Students compare two players' Rock/Paper/Scissors choices and announce
    the winner. It builds on basic conditionals by requiring compound
    boolean expressions (e.g. player1 chose rock AND player2 chose scissors).

    All 9 possible combinations of rock, paper, scissors are tested.
  `,

  tasks: {
    "determine-winner": {
      description: `
        Students need to:
        1. Call getPlayer1Choice() and getPlayer2Choice() to get both choices
        2. Store them in variables
        3. Use if/else if to check all combinations
        4. Call announceResult() with "player_1", "player_2", or "tie"

        The elegant approach: default to "player_2", then check for tie and player_1-wins cases.
        - Tie: both choices are equal
        - Player 1 wins: rock vs scissors, scissors vs paper, paper vs rock
        - Everything else: player 2 wins (handled by default)

        Common mistakes:
        - Not storing choices in variables (calling getPlayer1Choice() multiple times)
        - Forgetting to handle the tie case
        - Getting the win conditions backwards (e.g. rock beats paper)
        - Using "or" instead of "and" to combine conditions
        - Not calling announceResult() at the end
        - Writing separate if blocks instead of if/else if chains

        Teaching strategy:
        - Encourage starting with the simplest case (tie) first
        - Build up one scenario at a time
        - Point out that defaulting to one result and checking for exceptions is cleaner
        - The "and" operator is key: both conditions must be true simultaneously
      `
    }
  }
};
