import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches compound growth using Math.randomInt() in a loop. Unlike
    gold-panning's additive accumulator (total = total + random), this uses a multiplicative
    pattern where each year's growth depends on the current balance. Students must understand
    that balance * rate / 100 gives the growth amount, which is then added to the balance.
    This is a fundamentally different accumulator shape from gold-panning.
  `,

  tasks: {
    "grow-investment": {
      description: `
        Students need to:
        1. Create a balance variable initialized to 10
        2. Use a repeat(20) loop for 20 years
        3. Inside the loop, generate a random rate with Math.randomInt(0, 10)
        4. Calculate growth: balance * rate / 100
        5. Add growth to balance: balance = balance + growth
        6. After the loop, call checkBalance() with the final balance

        Common mistakes:
        - Using the original $10 instead of the current balance to calculate growth
        - Forgetting to divide by 100 (getting growth 100x too large)
        - Calling checkBalance() inside the loop instead of after it
        - Not storing the rate in a variable before using it
        - Using addition instead of multiplication for the growth calculation

        Teaching strategy:
        - The key insight is that growth depends on CURRENT balance, not the starting amount
        - Walk through the example: $11 at 5% = 11 * 5 / 100 = $0.55
        - Compare with gold-panning: there it was total = total + pan(), here it's
          balance = balance + (balance * rate / 100) — the balance appears on both sides
        - The compound effect means money grows faster over time
      `
    }
  }
};
