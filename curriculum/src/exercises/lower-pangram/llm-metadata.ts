import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Non-obvious context (not derivable from the instructions or solution):

    - A code check rides on the FINAL normal scenario (numbers-replacing-letters) and enforces that NO
      loop is nested inside another loop anywhere in the program (max loop-nesting depth 1). Checking
      every alphabet letter against every character is inherently a double iteration, so the only way to
      avoid a nested loop is to split the two loops across two functions — the alphabet loop in isPangram,
      the single-letter search in a helper. The check therefore forces the decomposition structurally,
      with no way to satisfy it while inlining (a decoy helper call or a wrapper function does not help).
      A student with fully correct output who inlined the search passes the first seven scenarios and fails
      only the last, with the "don't nest loops" message. That single red scenario means "extract the
      search", not "your logic is wrong".
    - Why extraction is worth it: inside a helper the search can return true the moment it finds the letter;
      inlined, the student is pushed into a found-flag plus a nested loop. Pulling the search out removes both.
    - The bonus task (decompose-tightly) is just a 16-line cap rewarding a tight solution. It is not the
      mechanism that forces decomposition (the nesting check is). Do not hand the student the number as a
      target to game; guide them to the clean shape and the line count falls out.
  `,

  tasks: {
    "check-lower-pangram": {
      description: `
        Common mistakes:
        - Forgetting to return false at the end of the search helper (after the loop)
        - Iterating through the sentence instead of the alphabet in isPangram
        - Not handling empty string (should return false)
        - Inlining the search as a nested loop instead of extracting it (fails the final scenario's code check)
      `
    },
    "decompose-tightly": {
      description: `
        Bonus, unlocked once the main task passes. The student already has a working decomposed
        solution; here they trim it to <=16 lines (Python <=10). If they are over, the usual cause is
        a needless wrapper function or leftover scaffolding — point them back at leaning on the helper.
      `
    }
  }
};
