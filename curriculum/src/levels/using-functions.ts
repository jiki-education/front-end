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
      // TODO: CallExpression needs to be implemented in the interpreter
      // For now using ExpressionStatement which wraps function calls
      allowedNodes: ["ExpressionStatement"],
      languageFeatures: {}
    },
    python: {
      allowedNodes: [
        "ExpressionStatement" // Wraps function calls
        // Note: Python interpreter may need to add CallExpression support
      ],
      languageFeatures: {}
    }
  }
};

export { usingFunctions };
