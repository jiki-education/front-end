import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore multi-branch conditionals and
    early returns by classifying a triangle. The branches are order-dependent:
    validity first, then equilateral, then isosceles, then scalene as default.
  `,

  tasks: {
    "invalid-triangles": {
      description: `
        First milestone: reject invalid triangles before any classification.

        The non-obvious part is the triangle inequality: ALL THREE pairings
        must be checked (a+b vs c, a+c vs b, b+c vs a), and using <= (not <)
        is what also catches zero-length sides and degenerate cases where two
        sides sum to exactly the third. A single inequality check, or using <,
        is the usual mistake.
      `
    },
    "equilateral-triangles": {
      description: `
        Student has invalid handling working; now add the equilateral branch
        (all three sides equal). This branch MUST come after the validity
        checks. Note: the student does not see these steps broken down.
      `
    },
    "isosceles-triangles": {
      description: `
        Student has invalid + equilateral working; now add the isosceles branch
        (any two sides equal). Key trap: it must be checked AFTER equilateral,
        since equilateral is a special case that also satisfies "two equal".
        Note: the student does not see these steps broken down.
      `
    },
    "scalene-triangles": {
      description: `
        Final branch. Once invalid, equilateral and isosceles have returned,
        scalene is simply the leftover default case (no extra checks needed).
        Note: the student does not see these steps broken down.
      `
    }
  }
};
