import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "map-descriptions" as const,
    name: "Map descriptions to components",
    description:
      "Write a function that takes a weather description string and returns the list of drawing components for that weather type.",
    hints: [
      "Use if/else if to check the description",
      "Each weather type maps to a specific list of components",
      'Return a list of strings like ["sun"] or ["cloud", "rain"]'
    ],
    requiredScenarios: ["sunny", "dull", "miserable", "hopeful", "rainbow-territory", "exciting", "snowboarding-time"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "sunny",
    name: "Sunny",
    description: "Sunny days only need a sun",
    taskId: "map-descriptions",
    functionName: "description_to_elements",
    args: ["sunny"],
    expected: ["sun"]
  },
  {
    slug: "dull",
    name: "Dull",
    description: "Dull days need clouds",
    taskId: "map-descriptions",
    functionName: "description_to_elements",
    args: ["dull"],
    expected: ["cloud"]
  },
  {
    slug: "miserable",
    name: "Miserable",
    description: "Miserable days need clouds and rain",
    taskId: "map-descriptions",
    functionName: "description_to_elements",
    args: ["miserable"],
    expected: ["cloud", "rain"]
  },
  {
    slug: "hopeful",
    name: "Hopeful",
    description: "Hopeful days need sun and cloud",
    taskId: "map-descriptions",
    functionName: "description_to_elements",
    args: ["hopeful"],
    expected: ["sun", "cloud"]
  },
  {
    slug: "rainbow-territory",
    name: "Rainbow Territory",
    description: "Rainbow territory needs sun, cloud, and rain",
    taskId: "map-descriptions",
    functionName: "description_to_elements",
    args: ["rainbow-territory"],
    expected: ["sun", "cloud", "rain"]
  },
  {
    slug: "exciting",
    name: "Exciting",
    description: "Exciting days need cloud and snow",
    taskId: "map-descriptions",
    functionName: "description_to_elements",
    args: ["exciting"],
    expected: ["cloud", "snow"]
  },
  {
    slug: "snowboarding-time",
    name: "Snowboarding Time",
    description: "Snowboarding time needs sun, cloud, and snow",
    taskId: "map-descriptions",
    functionName: "description_to_elements",
    args: ["snowboarding-time"],
    expected: ["sun", "cloud", "snow"]
  }
];
