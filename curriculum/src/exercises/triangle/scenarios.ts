import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "invalid-triangles" as const,
    name: "tasks.invalidTriangles.name",
    description: "tasks.invalidTriangles.description",
    hints: [],
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
    name: "tasks.equilateralTriangles.name",
    description: "tasks.equilateralTriangles.description",
    hints: [],
    requiredScenarios: ["valid-equilateral"],
    bonus: false
  },
  {
    id: "isosceles-triangles" as const,
    name: "tasks.isoscelesTriangles.name",
    description: "tasks.isoscelesTriangles.description",
    hints: [],
    requiredScenarios: [
      "valid-isosceles-first-two-equal",
      "valid-isosceles-last-two-equal",
      "valid-isosceles-first-and-last-equal"
    ],
    bonus: false
  },
  {
    id: "scalene-triangles" as const,
    name: "tasks.scaleneTriangles.name",
    description: "tasks.scaleneTriangles.description",
    hints: [],
    requiredScenarios: ["valid-scalene"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "invalid-equilateral-all-zero",
    name: "scenarios.invalidEquilateralAllZero.name",
    description: "scenarios.invalidEquilateralAllZero.description",
    taskId: "invalid-triangles",
    functionName: "determine_triangle_type",
    args: [0, 0, 0],
    expected: "invalid"
  },
  {
    slug: "isosceles-first-inequality",
    name: "scenarios.isoscelesFirstInequality.name",
    description: "scenarios.isoscelesFirstInequality.description",
    taskId: "invalid-triangles",
    functionName: "determine_triangle_type",
    args: [1, 1, 3],
    expected: "invalid"
  },
  {
    slug: "isosceles-second-inequality",
    name: "scenarios.isoscelesSecondInequality.name",
    description: "scenarios.isoscelesSecondInequality.description",
    taskId: "invalid-triangles",
    functionName: "determine_triangle_type",
    args: [1, 3, 1],
    expected: "invalid"
  },
  {
    slug: "isosceles-third-inequality",
    name: "scenarios.isoscelesThirdInequality.name",
    description: "scenarios.isoscelesThirdInequality.description",
    taskId: "invalid-triangles",
    functionName: "determine_triangle_type",
    args: [3, 1, 1],
    expected: "invalid"
  },
  {
    slug: "scalene-triangle-inequality",
    name: "scenarios.scaleneTriangleInequality.name",
    description: "scenarios.scaleneTriangleInequality.description",
    taskId: "invalid-triangles",
    functionName: "determine_triangle_type",
    args: [7, 3, 2],
    expected: "invalid"
  },
  {
    slug: "valid-equilateral",
    name: "scenarios.validEquilateral.name",
    description: "scenarios.validEquilateral.description",
    taskId: "equilateral-triangles",
    functionName: "determine_triangle_type",
    args: [2, 2, 2],
    expected: "equilateral"
  },
  {
    slug: "valid-isosceles-first-two-equal",
    name: "scenarios.validIsoscelesFirstTwoEqual.name",
    description: "scenarios.validIsoscelesFirstTwoEqual.description",
    taskId: "isosceles-triangles",
    functionName: "determine_triangle_type",
    args: [4, 4, 3],
    expected: "isosceles"
  },
  {
    slug: "valid-isosceles-last-two-equal",
    name: "scenarios.validIsoscelesLastTwoEqual.name",
    description: "scenarios.validIsoscelesLastTwoEqual.description",
    taskId: "isosceles-triangles",
    functionName: "determine_triangle_type",
    args: [3, 4, 4],
    expected: "isosceles"
  },
  {
    slug: "valid-isosceles-first-and-last-equal",
    name: "scenarios.validIsoscelesFirstAndLastEqual.name",
    description: "scenarios.validIsoscelesFirstAndLastEqual.description",
    taskId: "isosceles-triangles",
    functionName: "determine_triangle_type",
    args: [4, 3, 4],
    expected: "isosceles"
  },
  {
    slug: "valid-scalene",
    name: "scenarios.validScalene.name",
    description: "scenarios.validScalene.description",
    taskId: "scalene-triangles",
    functionName: "determine_triangle_type",
    args: [5, 4, 6],
    expected: "scalene"
  }
];
