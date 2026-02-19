import type { Level } from "./types";

const advancedLists: Level = {
  id: "advanced-lists",
  title: "Advanced Lists",
  description: "Learn to use for loops, control loop flow with continue and break, and convert types with Number().",
  taughtConcepts: [
    "For loops",
    "Skipping iterations with continue",
    "Exiting loops early with break",
    "Converting to numbers with Number()"
  ],
  languageFeatures: {
    javascript: {
      allowedNodes: ["ForStatement", "ContinueStatement", "BreakStatement", "UpdateExpression"],
      languageFeatures: {
        allowedGlobals: ["Number"]
      }
    }
  }
};

export { advancedLists };
