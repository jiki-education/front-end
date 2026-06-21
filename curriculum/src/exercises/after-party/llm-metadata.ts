import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore decomposing a problem into helper functions and doing
    bounded prefix matching character-by-character.
  `,

  tasks: {
    "check-guest-list": {
      description: `
        The crux is that a first name only matches if it is a whole word at the start of a list entry: the
        character after the prefix must be a space OR the prefix must be the entire name. This is why "Brad"
        must NOT match "Bradley". Encourage decomposing into a startsWith-style helper, since indexOf/startsWith
        aren't available at this level. Common slip: declaring a match purely on character equality and missing
        the boundary check.
      `
    },
    "bonus-single-names": {
      description: `
        Bonus, builds on the same boundary logic: a single-name entry like "Cher" should match "Cher" exactly
        but not "Cheryl". If the boundary check from the first task is correct, this already passes, so the
        student rarely needs new code here, just verification that prefix === whole-name counts as a match.
      `
    }
  }
};
