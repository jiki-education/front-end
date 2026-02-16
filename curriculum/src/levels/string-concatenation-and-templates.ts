import type { Level } from "./types";

const stringConcatenationAndTemplates: Level = {
  id: "string-concatenation-and-templates",
  title: "String Concatenation and Templates",
  description: "Learn to build strings by joining values together using concatenation and template literals.",
  educationalGoal:
    "Students learn to construct strings dynamically. String concatenation via + already works (BinaryExpression). Template literals add a cleaner syntax for embedding expressions in strings.",
  languageFeatures: {
    javascript: {
      allowedNodes: ["TemplateLiteralExpression"],
      languageFeatures: {}
    }
  }
};

export { stringConcatenationAndTemplates };
