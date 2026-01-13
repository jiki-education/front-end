import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "create-shopping-list" as const,
    name: "Create Shopping List",
    description:
      "Write a function that takes the contents of your fridge and a recipe's ingredients, and returns the items you need to buy (items in the recipe that aren't in the fridge).",
    hints: [
      "Consider writing a helper function to check if an item exists in a list",
      "Loop through each recipe item and check if it's in the fridge",
      "Use push() to add items to your shopping list"
    ],
    requiredScenarios: ["empty-fridge", "you-have-everything", "one-thing", "few-things"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "empty-fridge",
    name: "Empty fridge",
    description: "When the fridge is empty, you need to buy everything",
    taskId: "create-shopping-list",
    functionName: "shopping_list",
    args: [[], ["peas", "tomatoes", "garlic", "basil", "olives"]],
    expected: ["peas", "tomatoes", "garlic", "basil", "olives"]
  },
  {
    slug: "you-have-everything",
    name: "You have everything",
    description: "When you have all ingredients, the shopping list is empty",
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
    name: "One thing",
    description: "When you're missing just one ingredient",
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
    name: "A few things",
    description: "When you're missing a few ingredients",
    taskId: "create-shopping-list",
    functionName: "shopping_list",
    args: [
      ["chilis", "pickles", "tahini"],
      ["chilis", "cucumber", "pickles", "tahini", "hummus"]
    ],
    expected: ["cucumber", "hummus"]
  }
];
