import type { Level } from "./types";

const dictionaries: Level = {
  id: "dictionaries",
  title: "Dictionaries",
  description: "Learn to work with dictionaries (key-value pairs) to store and look up data efficiently.",
  taughtConcepts: ["Creating dictionaries", "Key-value lookups", "Iterating over dictionaries"],
  languageFeatures: {
    jikiscript: {
      languageFeatures: {
        allowedStdlibFunctions: ["has_key", "to_lower_case"]
      }
    },
    javascript: {
      allowedNodes: [],
      languageFeatures: {
        allowedGlobals: ["Object"]
      }
    }
  }
};

export { dictionaries };
