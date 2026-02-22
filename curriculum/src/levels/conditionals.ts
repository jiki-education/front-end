import type { Level } from "./types";

const conditionals: Level = {
  id: "conditionals",
  title: "Conditionals",
  description: "Learn how to make decisions in your code using if, else if, and else.",
  taughtConcepts: ["If statements", "Else if chains", "Else blocks"],
  languageFeatures: {
    javascript: {
      allowedNodes: ["IfStatement"],
      languageFeatures: {}
    }
  }
};

export { conditionals };
