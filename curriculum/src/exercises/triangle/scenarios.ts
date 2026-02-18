import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "invalid-triangles" as const,
    name: "Invalid triangles",
    description:
      "Detect invalid triangles. A triangle is invalid if any side is zero, or if the sum of any two sides is less than or equal to the third side.",
    hints: [
      "Check if the sum of any two sides is less than or equal to the third",
      "Remember to check all three combinations of sides",
      "A triangle with all sides zero is also invalid"
    ],
    requiredScenarios: [
      "invalid-equilateral-all-zero",
      "isosceles-first-inequality",
      "isosceles-second-inequality",
      "isosceles-third-inequality",
      "scalene-triangle-inequality"
    ],
    bonus: false
  },
  {
    id: "equilateral-triangles" as const,
    name: "Equilateral triangles",
    description: "Detect equilateral triangles where all three sides are the same length.",
    hints: ["Check if all three sides are equal to each other"],
    requiredScenarios: ["valid-equilateral"],
    bonus: false
  },
  {
    id: "isosceles-triangles" as const,
    name: "Isosceles triangles",
    description: "Detect isosceles triangles where exactly two sides are the same length.",
    hints: [
      "Check if any pair of sides is equal",
      "Remember that any two of the three sides could be the matching pair"
    ],
    requiredScenarios: [
      "valid-isosceles-first-two-equal",
      "valid-isosceles-last-two-equal",
      "valid-isosceles-first-and-last-equal"
    ],
    bonus: false
  },
  {
    id: "scalene-triangles" as const,
    name: "Scalene triangles",
    description: "Detect scalene triangles where all three sides have different lengths.",
    hints: ["If it's not invalid, equilateral, or isosceles, it must be scalene"],
    requiredScenarios: ["valid-scalene"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "invalid-equilateral-all-zero",
    name: "Equilateral with all sides zero (0, 0, 0)",
    description: "A triangle with all sides zero should return \"invalid\".",
    taskId: "invalid-triangles",
    functionName: "determine_triangle_type",
    args: [0, 0, 0],
    expected: "invalid"
  },
  {
    slug: "isosceles-first-inequality",
    name: "Isosceles with invalid side lengths (1, 1, 3)",
    description: "A triangle with too short sides should return \"invalid\".",
    taskId: "invalid-triangles",
    functionName: "determine_triangle_type",
    args: [1, 1, 3],
    expected: "invalid"
  },
  {
    slug: "isosceles-second-inequality",
    name: "Isosceles with invalid side lengths (1, 3, 1)",
    description: "A triangle with too short sides should return \"invalid\".",
    taskId: "invalid-triangles",
    functionName: "determine_triangle_type",
    args: [1, 3, 1],
    expected: "invalid"
  },
  {
    slug: "isosceles-third-inequality",
    name: "Isosceles with invalid side lengths (3, 1, 1)",
    description: "A triangle with too short sides should return \"invalid\".",
    taskId: "invalid-triangles",
    functionName: "determine_triangle_type",
    args: [3, 1, 1],
    expected: "invalid"
  },
  {
    slug: "scalene-triangle-inequality",
    name: "Scalene with invalid side lengths (7, 3, 2)",
    description: "A triangle with too short sides should return \"invalid\".",
    taskId: "invalid-triangles",
    functionName: "determine_triangle_type",
    args: [7, 3, 2],
    expected: "invalid"
  },
  {
    slug: "valid-equilateral",
    name: "Equilateral triangle (2, 2, 2)",
    description: "A triangle with all sides equal should return \"equilateral\".",
    taskId: "equilateral-triangles",
    functionName: "determine_triangle_type",
    args: [2, 2, 2],
    expected: "equilateral"
  },
  {
    slug: "valid-isosceles-first-two-equal",
    name: "Isosceles triangle (4, 4, 3)",
    description: "A triangle with the first two sides equal should return \"isosceles\".",
    taskId: "isosceles-triangles",
    functionName: "determine_triangle_type",
    args: [4, 4, 3],
    expected: "isosceles"
  },
  {
    slug: "valid-isosceles-last-two-equal",
    name: "Isosceles triangle (3, 4, 4)",
    description: "A triangle with the last two sides equal should return \"isosceles\".",
    taskId: "isosceles-triangles",
    functionName: "determine_triangle_type",
    args: [3, 4, 4],
    expected: "isosceles"
  },
  {
    slug: "valid-isosceles-first-and-last-equal",
    name: "Isosceles triangle (4, 3, 4)",
    description: "A triangle with the same first and last sides should return \"isosceles\".",
    taskId: "isosceles-triangles",
    functionName: "determine_triangle_type",
    args: [4, 3, 4],
    expected: "isosceles"
  },
  {
    slug: "valid-scalene",
    name: "Scalene triangle (5, 4, 6)",
    description: "A triangle with all sides different should return \"scalene\".",
    taskId: "scalene-triangles",
    functionName: "determine_triangle_type",
    args: [5, 4, 6],
    expected: "scalene"
  }
];
