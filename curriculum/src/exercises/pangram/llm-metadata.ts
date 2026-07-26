import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    A continuation of lower-pangram: the student's own lower-pangram code (an
    includes helper + isPangram) is carried into the editor, and they extend it
    to be case-insensitive. String methods are NOT available at this level, so
    the case conversion must be hand-written. The three helpers the instructions
    steer toward are includes(haystack, needle), indexOf(haystack, needle), and
    toLowerCase(someString) — deliberately named after the JS built-ins the next
    exercise (methodic-pangram) replaces them with.
  `,

  tasks: {
    "check-pangram": {
      description: `
        Anchor steps (building on the carried-in includes + isPangram):
        1. Write toLowerCase(someString): keep chars already in "abc..."; for the
           rest, find the char's position in "ABC..." with indexOf and map to the
           same position in "abc...". (This is the non-obvious part — there is no
           built-in toLowerCase at this level.)
        2. In isPangram, lowercase the sentence first, then loop a-z and use
           includes; return false on the first miss.
        3. Return true only if all 26 are present.

        Non-letter characters (digits, punctuation, underscores) must be ignored,
        not treated as failures. The classic slip is comparing case-sensitively
        instead of normalising first.
      `
    }
  }
};
