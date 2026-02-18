import type { Level } from "./types";

const dictionaries: Level = {
  id: "dictionaries",
  title: "Dictionaries",
  description: "Learn to work with dictionaries (key-value pairs) to store and look up data efficiently.",
  educationalGoal:
    "Students learn to create, access, and manipulate dictionaries, enabling them to map keys to values and perform efficient lookups.",
  languageFeatures: {
    jikiscript: {
      languageFeatures: {
        allowedStdlibFunctions: [
          "concatenate",
          "keys",
          "string_to_number",
          "to_upper_case",
          "push",
          "has_key",
          "to_lower_case"
        ]
      }
    },
    javascript: {
      allowedNodes: [],
      languageFeatures: {}
    }
  }
};

export { dictionaries };
