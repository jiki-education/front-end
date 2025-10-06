import type { Level } from "./types";

export const variablesLevel: Level = {
  id: "variables",
  title: "Variables and Assignments",
  description: "Learn to declare variables, assign values, and perform basic operations",
  educationalGoal: "",

  languageFeatures: {
    javascript: {
      allowedNodes: [
        // Everything from fundamentals
        "ExpressionStatement",
        "LiteralExpression",
        "IdentifierExpression",
        "MemberExpression",
        // New additions for variables
        "VariableDeclaration",
        "AssignmentExpression",
        "BinaryExpression", // For basic math operations
        "UpdateExpression" // For ++ and --
      ],
      languageFeatures: {
        allowShadowing: false,
        requireVariableInstantiation: true,
        allowTruthiness: false,
        allowTypeCoercion: false,
        enforceStrictEquality: true
      }
    },
    python: {
      allowedNodes: [
        // Everything from fundamentals
        "ExpressionStatement",
        "LiteralExpression",
        "IdentifierExpression",
        // New additions for variables
        "AssignmentStatement",
        "BinaryExpression", // For math operations
        "UnaryExpression" // For unary operations
      ],
      languageFeatures: {
        allowTruthiness: false,
        allowTypeCoercion: false
      }
    }
    // Python support will be added when NodeType is defined in interpreters
  }
};
