import type { Level } from "./types";

export const variablesLevel: Level = {
  id: "variables",
  title: "Variables",
  description: "Learn to store and reuse values using variables.",
  taughtConcepts: ["Declaring variables", "Using variables in expressions", "Basic arithmetic"],

  languageFeatures: {
    javascript: {
      allowedNodes: ["VariableDeclaration", "IdentifierExpression", "BinaryExpression", "GroupingExpression"],
      languageFeatures: {
        allowShadowing: false,
        requireVariableInstantiation: true,
        allowTruthiness: false,
        allowTypeCoercion: false,
        enforceStrictEquality: true
      }
    }
  }
};
