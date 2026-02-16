import type { Level } from "./types";

const repeatLoop: Level = {
  id: "repeat-loop",
  title: "Repeat Loop",
  description: "Learn how to repeat actions using loops to make your code more efficient.",
  educationalGoal: "Introduce the repeat loop as a way to run the same code multiple times without duplicating lines.",
  languageFeatures: {
    javascript: {
      allowedNodes: ["RepeatStatement", "BlockStatement"],
      languageFeatures: {}
    }
  }
};

export { repeatLoop };
