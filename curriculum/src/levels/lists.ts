import type { Level } from "./types";

const lists: Level = {
  id: "lists",
  title: "Lists",
  description: "Learn to work with lists (arrays) to store and process collections of data.",
  educationalGoal:
    "Students learn to create, iterate over, and manipulate lists, enabling them to work with collections of values rather than individual items.",
  languageFeatures: {
    jikiscript: {
      languageFeatures: {
        allowedStdlibFunctions: ["concatenate", "keys", "string_to_number", "to_upper_case", "push"]
      }
    },
    javascript: {
      allowedNodes: [],
      languageFeatures: {}
    }
  }
};

export { lists };
