import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore decomposing a classification problem into small,
    reusable helper functions that build on each other.
  `,

  tasks: {
    "classify-string": {
      description: `
        There is no built-in character-class check at this level, so the student must test characters
        against a literal alphabet/digit string (a contains-style helper). The non-obvious trap is the
        classification ORDER in whatAmI: an all-letters or all-digits string is ALSO alphanumeric, so
        "Alpha"/"Numeric" must be checked before "Alphanumeric", otherwise everything collapses to
        "Alphanumeric". Anything with symbols, spaces, or non-ASCII is "Unknown".
      `
    }
  }
};
