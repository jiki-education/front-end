import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches the classic FizzBuzz pattern using raindrop sounds.
    Students learn to use the modulo operator for divisibility checks, accumulate
    results using string concatenation, and convert numbers to strings.
    Key concepts: modulo operator, if statements (not else-if), string accumulation,
    and number-to-string conversion.
  `,

  tasks: {
    plings: {
      description: `
        Students need to check if a number is divisible by 3 using modulo (number % 3 == 0).
        If so, return "Pling".
        Common mistakes: using else-if instead of separate if statements (which prevents accumulation).
        Encourage starting with a result variable set to an empty string and building onto it.
      `
    },
    plangs: {
      description: `
        Students add divisibility-by-5 check. The key insight is that these checks must be
        separate if statements (not else-if) so multiple sounds can accumulate.
        For number 15 (divisible by both 3 and 5), the result should be "PlingPlang".
        Use concatenate() to build the string: concatenate(result, "Plang").
      `
    },
    plongs: {
      description: `
        Students add divisibility-by-7 check. By now the pattern should be clear.
        Number 105 is the key test - it's divisible by 3, 5, AND 7, giving "PlingPlangPlong".
        If students are getting wrong combinations, check that they're using separate if statements
        and accumulating in the right order (Pling before Plang before Plong).
      `
    },
    "no-sound": {
      description: `
        Students handle the fallback case: if the number isn't divisible by 3, 5, or 7,
        return the number as a string. Use number_to_string() for the conversion.
        Check if the result is still empty ("") after all three divisibility checks.
        Common mistake: forgetting to use number_to_string() and returning the number directly.
      `
    }
  }
};
