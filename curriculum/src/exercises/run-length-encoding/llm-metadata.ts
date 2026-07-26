import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise has the student write two complementary functions, encode and decode, for
    run-length encoding. It exercises counting runs while iterating (encode) and a nested loop that
    repeats a character a counted number of times (decode), plus building a multi-digit number from
    individual digit characters.

    encode: walk the string tracking the previous character and a running count. When the character
    changes, append the count (only if greater than 1) followed by the character, then reset. Handle
    flushing the final run after the loop, and the empty-string case.

    decode: walk the string. Digits build up a count with count = count * 10 + Number(digit). On a
    non-digit, repeat that character count times (treating a missing count as 1), append to the
    result, and reset the count to 0.
  `,

  tasks: {
    encode: {
      description: `
        The student implements encode. Common issues: writing a count of 1 in front of single
        characters, and forgetting to flush the last run after the loop ends. Whitespace must be
        treated as an ordinary character. Note: the student does not see these steps broken down.
      `
    },
    decode: {
      description: `
        The student implements decode. The key subtlety is multi-digit counts: the count must be
        accumulated across consecutive digits (count = count * 10 + Number(digit)) before expanding,
        so "12W" yields twelve Ws rather than one W then two Ws. Expanding uses a nested loop that
        runs count times. Note: the student does not see these steps broken down.
      `
    }
  }
};
