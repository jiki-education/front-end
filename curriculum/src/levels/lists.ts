import type { Level } from "./types";

const lists: Level = {
  id: "lists",
  title: "Lists",
  description: "Learn to work with lists (arrays) to store and process collections of data.",
  taughtConcepts: ["Creating lists/arrays", "Iterating over lists", "Manipulating list contents"],
  languageFeatures: {
    jikiscript: {
      languageFeatures: {
        allowedStdlibFunctions: ["concatenate", "number_to_string", "keys", "string_to_number", "to_upper_case", "push"]
      }
    },
    javascript: {
      allowedNodes: [],
      languageFeatures: {}
    }
  }
};

export { lists };
