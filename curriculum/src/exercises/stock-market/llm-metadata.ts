import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student practise the compound-growth pattern: applying a
    percentage from an external function to a running balance inside a loop, where each
    year's growth depends on the current balance.
  `,

  tasks: {
    "grow-investment": {
      description: `
        The key insight is the percentage-as-multiplier formula:
        money = money * (100 + rate) / 100. A rate of 5 gives 1.05 (grow 5%); a rate of
        -10 gives 0.90 (shrink 10%). Adding the rate, or not dividing by 100, is the most
        common error.

        Order matters within each iteration: update money, then reportTax(year, money)
        with the updated balance, then increment year. Reporting before updating, or after
        incrementing, gives the wrong year/balance.

        announceToFamily must be called exactly once, after the loop, not every year.
      `
    }
  }
};
