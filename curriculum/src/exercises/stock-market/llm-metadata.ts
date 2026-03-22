import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches compound growth using external functions in a loop. Students use
    marketGrowth(year) to get a random growth percentage, apply a multiplicative formula
    (money * (100 + rate) / 100), report tax each year, and announce the final
    balance. This teaches calling functions with arguments, using return values in expressions,
    and the compound growth pattern where each year's growth depends on the current balance.
  `,

  tasks: {
    "grow-investment": {
      description: `
        Students need to:
        1. Create a money variable initialized to 10
        2. Create a year variable initialized to the current year (2026)
        3. Use a repeat(20) loop for 20 years
        4. Inside the loop, calculate: money = money * (100 + marketGrowth(year)) / 100
        5. Call reportTax(year, money) inside the loop
        6. Increment year by 1
        7. After the loop, call announceToFamily(money)

        Common mistakes:
        - Forgetting to increment the year variable
        - Calling announceToFamily() inside the loop instead of after it
        - Not dividing by 100 (getting values 100x too large)
        - Using addition instead of the multiplicative formula
        - Calling reportTax() after the loop instead of inside it
        - Reporting tax after incrementing year (wrong year reported)
        - Getting the order wrong: must calculate new money before reporting

        Teaching strategy:
        - The formula money * (100 + rate) / 100 is the key insight
        - If rate is 5, then (100 + 5) / 100 = 1.05, so money grows by 5%
        - If rate is -10, then (100 + -10) / 100 = 0.90, so money shrinks by 10%
        - reportTax must be called each year with the year AND the updated balance
        - announceToFamily is called once at the end with the final balance
        - The order matters: calculate growth, report tax, THEN increment year
      `
    }
  }
};
