import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This is the FIRST exercise where storing a return value in a variable is unavoidable:
    each roll's result is needed in two places (announce AND strike), so nesting calls
    cannot work. That is the whole point of the exercise.
  `,

  tasks: {
    "roll-and-strike": {
      description: `
        Anchor steps: roll/store/announce each of the three dice, then strike with the
        attack value and the summed damage.

        The two key misconceptions to watch for:
        - roll() returns a NEW random number every call, so the result must be "caught" in a
          variable; re-calling roll() to reuse a value gives a different number.
        - strike() needs base + bonus added together, not the individual damage values.
      `
    }
  }
};
