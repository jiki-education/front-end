import type { Level } from "./types";

const usingFunctions: Level = {
  id: "using-functions",
  title: "Using Functions",
  description:
    "Learn to use functions to control your program. Functions are pre-written pieces of code that perform specific tasks.",
  taughtConcepts: ['Using functions (use "using" not "calling")', "Order of function calls matters"],
  languageFeatures: {
    javascript: {
      allowedNodes: ["ExpressionStatement", "CallExpression", "IdentifierExpression", "LiteralExpression"],
      languageFeatures: {
        allowedGlobals: ["console"]
      }
    }
  }
};

export { usingFunctions };
