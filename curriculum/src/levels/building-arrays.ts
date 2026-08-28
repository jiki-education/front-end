import type { Level } from "./types";

const buildingArrays: Level = {
  id: "building-arrays",
  title: "Building Arrays",
  description: "Learn how to build up arrays piece by piece using push and other mutating methods.",
  taughtConcepts: ["Building arrays with push", "Mutating array contents"],
  languageFeatures: {
    jikiscript: {
      languageFeatures: {
        allowedStdlibFunctions: ["push"]
      }
    },
    javascript: {
      languageFeatures: {
        allowedStdlib: {
          array: {
            methods: ["push", "pop", "shift", "unshift", "splice", "sort", "reverse", "toReversed", "fill"]
          }
        }
      }
    }
  }
};

export { buildingArrays };
