import type { Level } from "./types";

const stringManipulation: Level = {
  id: "string-manipulation",
  title: "String Manipulation",
  description: "Learn to build strings by joining values together using concatenation and template literals.",
  educationalGoal:
    "Students learn to construct strings dynamically. String concatenation via + already works (BinaryExpression). Template literals add a cleaner syntax for embedding expressions in strings.",
  languageFeatures: {
    jikiscript: {
      languageFeatures: {
        allowedStdlibFunctions: ["concatenate", "number_to_string"]
      }
    },
    javascript: {
      allowedNodes: ["TemplateLiteralExpression"],
      languageFeatures: {}
    }
  }
};

export { stringManipulation };
