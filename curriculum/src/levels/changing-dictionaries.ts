import type { Level } from "./types";

// Changing dictionaries adds no new language-feature restrictions on top of the
// `dictionaries` level: mutation is syntax (`dict[key] = value`), and the `has`
// check (`has_key`) is already unlocked in `dictionaries`. The level exists to
// mirror the API's milestone structure and gather the "building/updating"
// exercises under their own slug.
const changingDictionaries: Level = {
  id: "changing-dictionaries",
  title: "Changing Dictionaries",
  description: "Learn how to add, update, and remove entries as you build dictionaries up.",
  taughtConcepts: ["Adding and updating dictionary entries", "Building dictionaries in a loop"],
  languageFeatures: {
    jikiscript: {
      languageFeatures: {
        allowedStdlibFunctions: []
      }
    },
    javascript: {
      languageFeatures: {}
    }
  }
};

export { changingDictionaries };
