import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Learning objective: decompose a startsWith check into a reusable helper plus a main
    \`handleGuest\` function (this is a "multiple functions" level exercise).
  `,

  tasks: {
    "check-the-name": {
      description: `
        Anchor steps:
        1. Define \`handleGuest(name, allowedPrefix)\` using the two inputs directly (no ask/get functions).
        2. Guard: if the allowed prefix is longer than the name, it can't match, so return false.
        3. Loop over the allowed prefix, comparing each character against the same position in the name,
           returning false on the first mismatch.
        4. Return true if every character matched.

        Length must be computed by iterating (no .length helper is provided), so students reuse the
        pattern from Sign Painter Price. They need it twice here, for both the prefix and the name, to
        write the guard. Reading past the end of a string is a runtime error, so the guard is required:
        without it, a name shorter than the prefix (which the empty-name scenario triggers) crashes
        instead of returning false. The two traps worth watching are missing that guard and inverting
        the comparison logic.
      `
    },
    "solve-tightly": {
      description: `
        Bonus (optional): solve the whole exercise in 20 lines or fewer (14 in Python). This only
        rewards the tidy decomposition, it does not change the required logic.

        The tight version pulls the length-counting loop into a single \`getLength(word)\` helper that
        \`handleGuest\` calls for both the prefix and the name. Students who overshoot the line limit have
        almost always inlined that counting loop twice instead of reusing one helper; point them at
        extracting the duplicated loop, not at rewriting their logic. Don't sacrifice the required length
        guard to save a line.
      `
    }
  }
};
