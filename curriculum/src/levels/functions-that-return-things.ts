import type { Level } from "./types";

const functionsThatReturnThings: Level = {
  id: "functions-that-return-things",
  title: "Functions That Return Things",
  description: "Learn how to use the values that functions return.",
  educationalGoal:
    "Students learn that functions can produce values, not just perform actions. They use return values in variable assignments and expressions.",
  languageFeatures: {
    jikiscript: {
      languageFeatures: {
        allowedStdlibFunctions: ["random_number"]
      }
    },
    javascript: {
      allowedNodes: ["MemberExpression"],
      languageFeatures: {}
    }
  }
};

export { functionsThatReturnThings };
