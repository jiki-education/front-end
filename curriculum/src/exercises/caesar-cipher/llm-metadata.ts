import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore problem decomposition: the natural
    solution is several small helper functions composed together, even though only
    encode is required by the spec.
  `,

  tasks: {
    "encode-message": {
      description: `
        Anchor steps the solution decomposes into:
        1. Find a character's position in the alphabet.
        2. Shift a single letter (wrap with % 26; pass non-letters through unchanged).
        3. Iterate the message, shifting letters and leaving spaces alone.

        Teaching note: the strongest nudge is toward decomposition. If a student is
        wrestling with everything inside encode, steer them to first solve "shift one
        letter", and before that "find a letter's position". The off-by-one trap lives
        in the position-finding step, and the wrap trap in the shift step.
      `
    }
  }
};
