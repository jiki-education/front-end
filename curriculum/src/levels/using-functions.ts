import type { Level } from "./types";

const usingFunctions: Level = {
  id: "using-functions",
  title: "Using Functions",
  description:
    "Learn to use functions to control your program. Functions are pre-written pieces of code that perform specific tasks.",
  educationalGoal:
    "Introduce function calls as the fundamental way to make programs do things. Students learn that programming is about calling functions to perform actions.",
  languageFeatures: {
    javascript: {
      allowedNodes: ["ExpressionStatement", "CallExpression", "IdentifierExpression", "LiteralExpression"],
      languageFeatures: {}
    }
  }
};

export { usingFunctions };
