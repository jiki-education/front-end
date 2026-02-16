import type { Level } from "./types";

const conditionals: Level = {
  id: "conditionals",
  title: "Conditionals",
  description: "Learn how to make decisions in your code using if, else if, and else.",
  educationalGoal:
    "Introduce conditional execution. Students learn to branch their code based on conditions using if statements, else if chains, and else blocks.",
  languageFeatures: {
    javascript: {
      allowedNodes: ["IfStatement"],
      languageFeatures: {}
    }
  }
};

export { conditionals };
