import type { Level } from "./types";

const basicState: Level = {
  id: "basic-state",
  title: "Basic State",
  description: "Learn how to update variables and track changing values over time.",
  educationalGoal:
    "Introduce variable reassignment and state mutation. Students learn to update variables inside loops to create animations and track changing state.",
  languageFeatures: {
    javascript: {
      allowedNodes: ["AssignmentExpression", "UnaryExpression"],
      languageFeatures: {}
    }
  }
};

export { basicState };
