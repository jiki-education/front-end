import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Single task: build small helper functions that compose into a classifier.
  `,

  tasks: {
    "classify-string": {
      description: `
        There is no built-in character-class check at this level, so the student must test characters
        against a literal alphabet/digit string. The idiomatic way is to call .includes() on the literal
        (e.g. "0123456789".includes(char)), though a hand-rolled contains-style helper works too. The
        non-obvious trap is the classification ORDER in whatAmI: an all-letters or all-digits string is
        ALSO alphanumeric, so "Alpha"/"Numeric" must be checked before "Alphanumeric", otherwise
        everything collapses to "Alphanumeric". Anything with symbols, spaces, or non-ASCII is "Unknown".
        The "42 Rubber Duck!" scenario additionally enforces a line limit via assertMaxLinesOfCode (42 for
        JavaScript, 35 for Python, 50 for Jikiscript); in JavaScript that means using the string's own
        .includes() method rather than writing a separate contains() helper.
      `
    },
    "use-continue": {
      description: `
        The student's solution must contain a continue statement (ContinueStatement), requiring the use of
        continue to move past an already-classified character rather than nesting further conditions. It
        does not change the required behaviour.
      `
    }
  }
};
