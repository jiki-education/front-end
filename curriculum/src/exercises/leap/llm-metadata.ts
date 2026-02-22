import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches logical operators (and, or) and the remainder operator (%)
    in the context of determining leap years. Students must combine multiple divisibility
    checks into a single conditional expression.
    Key concepts: remainder operator, logical operators, function definition, return values.
  `,

  tasks: {
    "determine-leap-year": {
      description: `
        Students need to write a function that checks three divisibility rules:
        1. Divisible by 4 → leap year
        2. But divisible by 100 → NOT a leap year
        3. But divisible by 400 → leap year

        Common mistakes:
        - Only checking divisibility by 4 and missing the 100/400 rules
        - Getting the logic backwards (returning true when it should be false)
        - Not using parentheses correctly when combining and/or
        - Using nested if statements when a single expression would work

        Guide students to think about the rules step by step, then combine them.
        The key insight is: divisible by 4 AND (not divisible by 100 OR divisible by 400).
      `
    },
    "solve-in-one-line": {
      description: `
        The bonus challenge asks students to solve it in one line of code.
        The optimal solution is a single return statement:
        return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)

        If students already used this approach for the main task, they've already completed the bonus.
        If they used nested if statements, guide them to combine conditions into one expression.
      `
    }
  }
};
