import type { Level } from "./types";

const objects: Level = {
  id: "objects",
  title: "Objects",
  description: "Learn to work with objects by creating instances from classes and using their properties and methods.",
  taughtConcepts: [
    "Creating objects from classes",
    "Accessing and modifying properties",
    "Working with object instances"
  ],
  languageFeatures: {
    jikiscript: {},
    javascript: {
      allowedNodes: ["NewExpression"],
      languageFeatures: {}
    }
  }
};

export { objects };
