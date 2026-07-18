import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "map-descriptions" as const,
    name: "tasks.mapDescriptions.name",
    description: "tasks.mapDescriptions.description",
    hints: [],
    requiredScenarios: ["sunny", "dull", "miserable", "hopeful", "rainbow-territory", "exciting", "snowboarding-time"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "sunny",
    name: "scenarios.sunny.name",
    description: "scenarios.sunny.description",
    taskId: "map-descriptions",
    functionName: "description_to_elements",
    args: ["sunny"],
    expected: ["sun"]
  },
  {
    slug: "dull",
    name: "scenarios.dull.name",
    description: "scenarios.dull.description",
    taskId: "map-descriptions",
    functionName: "description_to_elements",
    args: ["dull"],
    expected: ["cloud"]
  },
  {
    slug: "miserable",
    name: "scenarios.miserable.name",
    description: "scenarios.miserable.description",
    taskId: "map-descriptions",
    functionName: "description_to_elements",
    args: ["miserable"],
    expected: ["cloud", "rain"]
  },
  {
    slug: "hopeful",
    name: "scenarios.hopeful.name",
    description: "scenarios.hopeful.description",
    taskId: "map-descriptions",
    functionName: "description_to_elements",
    args: ["hopeful"],
    expected: ["sun", "cloud"]
  },
  {
    slug: "rainbow-territory",
    name: "scenarios.rainbowTerritory.name",
    description: "scenarios.rainbowTerritory.description",
    taskId: "map-descriptions",
    functionName: "description_to_elements",
    args: ["rainbow-territory"],
    expected: ["sun", "cloud", "rain"]
  },
  {
    slug: "exciting",
    name: "scenarios.exciting.name",
    description: "scenarios.exciting.description",
    taskId: "map-descriptions",
    functionName: "description_to_elements",
    args: ["exciting"],
    expected: ["cloud", "snow"]
  },
  {
    slug: "snowboarding-time",
    name: "scenarios.snowboardingTime.name",
    description: "scenarios.snowboardingTime.description",
    taskId: "map-descriptions",
    functionName: "description_to_elements",
    args: ["snowboarding-time"],
    expected: ["sun", "cloud", "snow"]
  }
];
