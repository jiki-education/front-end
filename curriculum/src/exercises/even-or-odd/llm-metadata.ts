import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches the remainder (modulo) operator and basic conditionals.
    Students learn to determine if a number is even or odd using number % 2.
    Key concepts: remainder operator, conditional logic, return values.
  `,

  tasks: {
    "identify-even-or-odd": {
      description: `
        Students need to use the remainder operator (%) to check if a number is divisible by 2.
        If number % 2 equals 0, return "Even", otherwise return "Odd".

        Common mistakes:
        - Forgetting that 0 is even
        - Using division instead of remainder
        - Returning lowercase "even"/"odd" instead of capitalized
        - Overcomplicating with multiple if statements when a simple if/return pattern works
      `
    },
    "solve-in-six-lines": {
      description: `
        The bonus challenge asks students to solve it in 6 lines or fewer.
        The optimal solution uses early return: if number % 2 equals 0, return "Even", then return "Odd".
        No else statement is needed since return exits the function.
      `
    }
  }
};
