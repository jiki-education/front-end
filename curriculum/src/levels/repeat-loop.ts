import type { Level } from "./types";

const repeatLoop: Level = {
  id: "repeat-loop",
  title: "Repeat Loop",
  description: "Learn how to repeat actions using loops to make your code more efficient.",
  taughtConcepts: ["Using repeat loops to run code multiple times"],
  languageFeatures: {
    javascript: {
      allowedNodes: ["RepeatStatement", "BlockStatement"],
      languageFeatures: {}
    }
  }
};

export { repeatLoop };
