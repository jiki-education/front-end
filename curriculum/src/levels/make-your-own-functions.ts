import type { Level } from "./types";

const makeYourOwnFunctions: Level = {
  id: "make-your-own-functions",
  title: "Make Your Own Functions",
  description: "Learn to write your own functions to organize and reuse code.",
  educationalGoal:
    "Students learn to declare their own functions, extracting repeated logic into named, reusable blocks.",
  languageFeatures: {
    javascript: {
      allowedNodes: ["FunctionDeclaration"],
      languageFeatures: {}
    }
  }
};

export { makeYourOwnFunctions };
