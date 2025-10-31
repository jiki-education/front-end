import type { Level } from "./types";

export const fundamentalsLevel: Level = {
  id: "fundamentals",
  title: "Programming Fundamentals",
  description: "Learn the basics: function calls and literal values",
  educationalGoal: "",

  languageFeatures: {
    jikiscript: {
      languageFeatures: {
        allowedStdlibFunctions: ["concatenate", "to_upper_case"]
      }
    },
    javascript: {
      allowedNodes: [
        "ExpressionStatement",
        "LiteralExpression",
        "IdentifierExpression",
        "MemberExpression" // For console.log or object.method()
      ],
      languageFeatures: {
        allowTruthiness: false,
        allowTypeCoercion: false,
        enforceStrictEquality: true,
        allowShadowing: false
      }
    },
    python: {
      allowedNodes: [
        "ExpressionStatement",
        "LiteralExpression",
        "IdentifierExpression"
        // Note: Python doesn't have MemberExpression equivalent yet
      ],
      languageFeatures: {
        allowTruthiness: false,
        allowTypeCoercion: false
      }
    }
  }
};
