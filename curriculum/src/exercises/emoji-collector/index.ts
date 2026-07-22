import "../../exercise-categories/maze/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "move",
    signature: "move()",
    description: "functions.move.description",
    examples: ["move()"],
    category: "functions.move.category"
  },
  {
    name: "turnLeft",
    signature: "turnLeft()",
    description: "functions.turnLeft.description",
    examples: ["turnLeft()"],
    category: "functions.turnLeft.category"
  },
  {
    name: "turnRight",
    signature: "turnRight()",
    description: "functions.turnRight.description",
    examples: ["turnRight()"],
    category: "functions.turnRight.category"
  },
  {
    name: "look",
    signature: "look(direction)",
    description: "functions.look.description",
    examples: ['look("ahead")', 'look("down")'],
    category: "functions.look.category"
  },
  {
    name: "removeEmoji",
    signature: "removeEmoji()",
    description: "functions.removeEmoji.description",
    examples: ["removeEmoji()"],
    category: "functions.removeEmoji.category"
  },
  {
    name: "announceEmojis",
    signature: "announceEmojis(emojis)",
    description: "functions.announceEmojis.description",
    examples: ['announceEmojis({"💎": 3})'],
    category: "functions.announceEmojis.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["dictionaries", "updating-dictionaries", "if", "creating-functions-with-return-values", "repeat"],
  interpreterOptions: {
    maxTotalLoopIterations: 500
  }
};

export default exerciseDefinition;
