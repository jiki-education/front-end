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
      languageFeatures: {
        allowedGlobals: ["Math"],
        // MemberExpression is unlocked here so Math.floor()/Math.random() work, but that also
        // opens member access on strings/arrays. Deny all string/array members by default until
        // methods-and-properties explicitly grants them (allowedStdlib accumulates additively).
        allowedStdlib: {
          string: { properties: [], methods: [] },
          array: { properties: [], methods: [] }
        }
      }
    }
  }
};

export { functionsThatReturnThings };
