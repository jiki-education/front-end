import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise has the student implement the Luhn checksum. It is the natural companion to the
    ISBN verifier: another weighted checksum, but this time the weighting depends on each digit's
    position counted from the right, which is a great motivation for a counted for loop.

    To complete this exercise, the student needs to:
    1. Iterate through the string, skipping spaces with continue and collecting the digits
    2. Return false immediately on any character that isn't a digit or a space
    3. Reject inputs that have 1 or fewer digits once spaces are removed
    4. Loop over the collected digits with an index so each digit's position is known
    5. Double every second digit counting from the right (distance from the right is odd)
    6. Subtract 9 from any doubled value that exceeds 9
    7. Sum all the digits and return whether the total is divisible by 10
  `,

  tasks: {
    "double-and-sum": {
      description: `
        The student needs the core algorithm working on clean, valid inputs (steps 1, 4-7). The most
        common early mistakes are doubling from the left instead of the right, or doubling the wrong
        set of digits. Point them at "distance from the right = length - 1 - index" and doubling when
        that distance is odd. Note: the student does not see these steps broken down.
      `
    },
    "spot-invalid-numbers": {
      description: `
        The student has the algorithm running and now needs it to correctly reject numbers whose
        checksum simply doesn't add up to a multiple of 10. If valid numbers pass but these fail,
        the bug is usually in the doubling/subtract-9 step. Note: the student does not see these steps broken down.
      `
    },
    "reject-bad-input": {
      description: `
        The student now needs the guard clauses (steps 2-3): reject any non-digit, non-space
        character, and reject inputs left with a single digit or fewer. A common miss is the " 0"
        case, which must be false because only one digit remains after spaces are ignored.
        The final scenario also enforces a counted for loop (ForStatement) in the source: a
        for...of loop with a manually maintained counter will not satisfy it.
        Note: the student does not see these steps broken down.
      `
    }
  }
};
