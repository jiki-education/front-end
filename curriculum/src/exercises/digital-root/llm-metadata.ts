import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student practise a while loop (a loop that runs until a condition is met,
    rather than a fixed number of times) alongside iterating over the digits of a number.

    The digital root of a number is found by repeatedly summing its digits until a single digit remains.

    To complete this exercise, the student needs to:
    1. Turn the number into a string so it can be iterated character by character
    2. Sum the digits, using Number() to convert each character to a number
    3. Replace the number with that sum
    4. Repeat steps 1-3 while the number still has more than one digit (i.e. is >= 10)
    5. Return the number once it is a single digit

    The natural shape is an outer while loop (for the "keep collapsing" part) wrapping an inner
    for...of loop (for summing the digits of the current number).
  `,

  tasks: {
    "sum-the-digits": {
      description: `
        The student needs to sum the digits of the number once. At this stage they can pass the
        single-digit and single-pass scenarios even without the outer loop, by summing the digits
        and returning the result. Diagnosing here: check they build a running total and convert each
        character with Number(). Note: the student does not see these steps broken down.
      `
    },
    "collapse-to-single-digit": {
      description: `
        The student now needs to wrap the digit-summing in an outer while loop so the process repeats
        until a single digit remains (number < 10). A common mistake is summing only once. Guide them
        toward "while (number >= 10)". This task carries a required code check: the solution MUST use a
        while loop (a for-with-break or recursion will fail the check even if the output is correct).
        Note: the student does not see these steps broken down.
      `
    }
  }
};
