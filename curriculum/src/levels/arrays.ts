import type { Level } from "./types";

const arrays: Level = {
  id: "arrays",
  title: "Arrays",
  description: "Learn how to read and work with arrays to store and process collections of data.",
  taughtConcepts: ["Creating arrays", "Indexing into arrays", "Iterating over arrays"],
  languageFeatures: {
    jikiscript: {
      languageFeatures: {
        allowedStdlibFunctions: []
      }
    },
    javascript: {
      allowedNodes: ["ArrayExpression"],
      languageFeatures: {
        allowedStdlib: {
          array: {
            properties: ["length"],
            methods: [
              "at",
              "indexOf",
              "lastIndexOf",
              "includes",
              "slice",
              "concat",
              "join",
              "toString",
              "entries",
              "keys",
              "values"
            ]
          }
        }
      }
    }
  }
};

export { arrays };
