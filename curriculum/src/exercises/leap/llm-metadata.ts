import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore combining logical operators with the remainder
    operator (%) to express the leap-year divisibility rules. The interesting part is getting
    the operator precedence right when nesting the 100/400 exception inside the divisible-by-4 rule.
  `,

  tasks: {
    "determine-leap-year": {
      description: `
        The student writes isLeapYear combining the three divisibility checks.

        The precedence trap is the teaching point: the structure is divisible-by-4 AND
        (not-divisible-by-100 OR divisible-by-400), so the OR must be parenthesised. Watch for
        students who stop at divisible-by-4, or who invert the 100/400 exception.
      `
    },
    "solve-in-one-line": {
      description: `
        Bonus: collapse the logic into a single return expression. If the student already wrote it
        as one expression for the main task they are done; if they used nested ifs, guide them to
        merge the conditions rather than handing over the line.
      `
    }
  }
};
