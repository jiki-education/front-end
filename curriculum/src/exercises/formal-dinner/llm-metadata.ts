import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student decompose a matching problem into helpers: strip
    an honorific off a name, implement an endsWith check from scratch, and use them
    to test each guest. Suffix matching (not equality) is the crux.

    Anchor steps:
    1. removeHonorific: extract everything after the first space.
    2. endsWith: check whether one string ends with another.
    3. Loop the guest list, returning true on the first name that ends with the surname.
  `,

  tasks: {
    "check-formal-guest-list": {
      description: `
        Non-obvious traps to watch for:
        - endsWith is off-by-one prone; the comparison must start at word.length - substr.length.
        - Guard the case where the surname is longer than the name (return false, don't index out of range).
        - The match is a suffix check, not full-string equality.
        - A good teaching path is to build and test each helper independently before wiring them together.
      `
    },
    "bonus-multi-word-surname": {
      description: `
        Bonus: multi-word surnames like "Lloyd Webber". Since the honorific is only
        the FIRST word, "Baron Lloyd Webber" must yield "Lloyd Webber". A
        removeHonorific that takes everything after the first space already handles
        this; one that grabs only the next single word does not. Watch too for
        partial matches ("Webber" matching when "Lloyd Webber" was wanted).
      `
    }
  }
};
