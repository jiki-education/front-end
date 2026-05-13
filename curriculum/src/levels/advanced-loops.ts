import type { Level } from "./types";

const advancedLoops: Level = {
  id: "advanced-loops",
  title: "Advanced Loops",
  description:
    "Learn to use for and while loops, control loop flow with continue and break, and convert types with Number().",
  taughtConcepts: [
    "For loops",
    "While loops",
    "Skipping iterations with continue",
    "Exiting loops early with break",
    "Converting to numbers with Number()"
  ],
  languageFeatures: {
    javascript: {
      allowedNodes: ["ForStatement", "WhileStatement", "ContinueStatement", "BreakStatement", "UpdateExpression"],
      languageFeatures: {
        allowedGlobals: ["Number"]
      }
    }
  }
};

export { advancedLoops };
