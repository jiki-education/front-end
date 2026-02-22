import type { Level } from "./types";

const stringIteration: Level = {
  id: "string-iteration",
  title: "String Iteration",
  description: "Learn to iterate through strings character by character to analyze and transform text.",
  taughtConcepts: ["Iterating through strings character by character"],
  languageFeatures: {
    javascript: {
      allowedNodes: ["ForOfStatement", "IndexExpression"],
      languageFeatures: {}
    }
  }
};

export { stringIteration };
