import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches conditional logic and function design through triangle classification.
    Students must determine whether three side lengths form a valid triangle and, if so,
    classify it as equilateral, isosceles, or scalene. Key concepts: input validation,
    multi-branch conditionals, logical operators (and/or), and mathematical reasoning
    about the triangle inequality theorem.
  `,

  tasks: {
    "invalid-triangles": {
      description: `
        Students need to check validity using the triangle inequality theorem:
        the sum of any two sides must be greater than the third side.
        This requires checking all three combinations (a+b > c, a+c > b, b+c > a).
        Note that using <= catches both zero-length sides and inequality violations.

        Common mistakes:
        - Only checking one inequality instead of all three
        - Using < instead of <= (missing the degenerate case where sides sum to exactly the third)
        - Not handling the all-zeros case

        Teaching strategy:
        - Start with the zero case as the simplest invalid example
        - Then show why (1, 1, 3) fails: 1 + 1 = 2, which is not greater than 3
        - Emphasize checking all three combinations
      `
    },
    "equilateral-triangles": {
      description: `
        After invalid triangles are handled, check if all three sides are equal.
        This is the simplest classification: side1 == side2 and side2 == side3.

        Common mistakes:
        - Checking all three pairs instead of just two (redundant but not wrong)
        - Forgetting to check validity first (placing equilateral check before invalid check)
      `
    },
    "isosceles-triangles": {
      description: `
        Check if any two sides are equal. Need to check all three pairs:
        side1 == side2, side2 == side3, or side1 == side3.

        Common mistakes:
        - Only checking one pair of sides
        - Not using 'or' to combine the checks
        - Confusing isosceles with equilateral (equilateral should be checked first)

        Teaching strategy:
        - Show test cases where each different pair is the matching one
        - Emphasize that equilateral must be checked first since it's a special case of isosceles
      `
    },
    "scalene-triangles": {
      description: `
        If the triangle is valid and not equilateral or isosceles, it must be scalene.
        This is simply the default/else case — no additional checks needed.

        Teaching strategy:
        - Point out the process-of-elimination approach
        - The function returns early for invalid, equilateral, and isosceles
        - Scalene is whatever's left
      `
    }
  }
};
