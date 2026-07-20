import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "create-shopping-list" as const,
    name: "tasks.createShoppingList.name",
    description: "tasks.createShoppingList.description",
    hints: [],
    requiredScenarios: ["empty-fridge", "you-have-everything", "one-thing", "few-things"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "empty-fridge",
    name: "scenarios.emptyFridge.name",
    description: "scenarios.emptyFridge.description",
    taskId: "create-shopping-list",
    functionName: "shopping_list",
    args: [[], ["peas", "tomatoes", "garlic", "basil", "olives"]],
    expected: ["peas", "tomatoes", "garlic", "basil", "olives"]
  },
  {
    slug: "you-have-everything",
    name: "scenarios.youHaveEverything.name",
    description: "scenarios.youHaveEverything.description",
    taskId: "create-shopping-list",
    functionName: "shopping_list",
    args: [
      ["salsa", "guac", "chillis", "spring greens", "cilantro"],
      ["salsa", "guac", "chillis", "spring greens", "cilantro"]
    ],
    expected: []
  },
  {
    slug: "one-thing",
    name: "scenarios.oneThing.name",
    description: "scenarios.oneThing.description",
    taskId: "create-shopping-list",
    functionName: "shopping_list",
    args: [
      ["miso", "seaweed", "spring onions"],
      ["tofu", "miso", "seaweed", "spring onions"]
    ],
    expected: ["tofu"]
  },
  {
    slug: "few-things",
    name: "scenarios.fewThings.name",
    description: "scenarios.fewThings.description",
    taskId: "create-shopping-list",
    functionName: "shopping_list",
    args: [
      ["chilis", "pickles", "tahini"],
      ["chilis", "cucumber", "pickles", "tahini", "hummus"]
    ],
    expected: ["cucumber", "hummus"]
  }
];
