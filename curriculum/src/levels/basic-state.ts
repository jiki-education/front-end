import type { Level } from "./types";

const basicState: Level = {
  id: "basic-state",
  title: "Basic State",
  description: "Learn how to update variables and track changing values over time.",
  taughtConcepts: ["Reassigning variables", "Updating state inside loops"],
  languageFeatures: {
    javascript: {
      allowedNodes: ["AssignmentExpression", "UnaryExpression"],
      languageFeatures: {}
    }
  }
};

export { basicState };
