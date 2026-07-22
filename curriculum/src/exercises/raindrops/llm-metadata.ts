import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore the FizzBuzz pattern (here: raindrop sounds)
    using the modulo operator and accumulating a result string. The crucial idea is that
    the divisibility checks are SEPARATE if statements (not else-if) so multiple sounds
    can build up.
  `,

  tasks: {
    plings: {
      description: `
        First step: return "Pling" when divisible by 3, building onto an empty result
        string. Watch for else-if here, which would block later accumulation.
      `
    },
    plangs: {
      description: `
        The student has divisibility-by-3 working and now adds the divisibility-by-5 case
        as a separate if. 15 (both) must give "PlingPlang".
      `
    },
    plongs: {
      description: `
        The student has 3 and 5 working and now adds divisibility-by-7. 105 (3, 5, and 7)
        must give "PlingPlangPlong"; wrong combinations usually mean else-if crept in or
        the accumulation order is off.
      `
    },
    "no-sound": {
      description: `
        Final step: when no rule matched (result still ""), return the number itself as a
        string. The non-obvious part is converting the number to a string (e.g. with a
        template literal) rather than returning the number directly.
      `
    },
    "solve-in-sixteen-lines": {
      description: `
        Bonus: the solution must be at most 16 non-blank, non-comment lines. The reference
        solution (accumulator with four separate ifs) is exactly 16 lines; students over
        the limit have usually written a branch-per-combination else-if chain with early
        returns, so steer them back to accumulating into one result string.
      `
    }
  }
};
