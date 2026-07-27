import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore problem decomposition: the natural
    solution is a shiftLetter helper composed into encode, even though only encode
    is required by the spec.
  `,

  tasks: {
    "encode-message": {
      description: `
        Anchor steps the solution decomposes into:
        1. Shift a single letter: find its position with alphabet.indexOf, add the
           shift, wrap with % 26, index back into the alphabet. Pass non-letters
           (indexOf returns -1) through unchanged.
        2. Iterate the message, shifting letters and leaving spaces alone.

        Teaching note: the strongest nudge is toward decomposition. If a student is
        wrestling with everything inside encode, steer them to first solve "shift one
        letter". The wrap trap lives in the shift step: forgetting % 26 breaks any
        letter that shifts past 'z' (the wrap-around and ROT13 scenarios).
      `
    }
  }
};
