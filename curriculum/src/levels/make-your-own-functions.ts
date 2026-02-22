import type { Level } from "./types";

const makeYourOwnFunctions: Level = {
  id: "make-your-own-functions",
  title: "Make Your Own Functions",
  description: "Learn to write your own functions to organize and reuse code.",
  taughtConcepts: ['Writing your own functions (use "writing" not "declaring")', "Return values from functions"],
  languageFeatures: {
    javascript: {
      allowedNodes: ["FunctionDeclaration", "ReturnStatement"],
      languageFeatures: {}
    }
  }
};

export { makeYourOwnFunctions };
