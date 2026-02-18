import type { Level } from "./types";

const multipleFunctions: Level = {
  id: "multiple-functions",
  title: "Using Multiple Functions Together",
  description: "Learn to combine multiple functions to solve more complex problems.",
  educationalGoal:
    "Students learn to decompose problems into smaller functions and combine them to build more sophisticated solutions.",
  languageFeatures: {
    jikiscript: {
      languageFeatures: {
        allowedStdlibFunctions: [
          "concatenate",
          "number_to_string",
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

export { multipleFunctions };
