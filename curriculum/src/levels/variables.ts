import type { Level } from "./types";

export const variablesLevel: Level = {
  id: "variables",
  title: "Variables",
  description: "Learn to store and reuse values using variables.",
  educationalGoal:
    "Students learn to declare variables, use them in expressions, and perform arithmetic. Variables make code flexible and readable.",

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
