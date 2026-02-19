import type { Level } from "./types";

const functionsThatReturnThings: Level = {
  id: "functions-that-return-things",
  title: "Functions That Return Things",
  description: "Learn how to use the values that functions return.",
  taughtConcepts: ["Functions can return values", "Storing return values in variables"],
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
