import type { Level } from "./types";

const lists: Level = {
  id: "lists",
  title: "Lists",
  description: "Learn to work with lists (arrays) to store and process collections of data.",
  taughtConcepts: ["Creating lists/arrays", "Iterating over lists", "Manipulating list contents"],
  languageFeatures: {
    jikiscript: {
      languageFeatures: {
        allowedStdlibFunctions: ["push"]
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
              "push",
              "pop",
              "shift",
              "unshift",
              "indexOf",
              "includes",
              "slice",
              "concat",
              "join",
              "splice",
              "sort",
              "reverse",
              "fill",
              "lastIndexOf",
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

export { lists };
