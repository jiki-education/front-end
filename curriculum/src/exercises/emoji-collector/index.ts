import "../../exercise-categories/maze/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "move",
    signature: "move()",
    description:
      "Moves the character **one step forward** in the current direction. The character will only move if the target position is not blocked by a wall.",
    examples: ["move()"],
    category: "Movement"
  },
  {
    name: "turnLeft",
    signature: "turnLeft()",
    description:
      "Turns the character **90 degrees to the left** (counterclockwise). This changes the direction the character is facing.",
    examples: ["turnLeft()"],
    category: "Movement"
  },
  {
    name: "turnRight",
    signature: "turnRight()",
    description:
      "Turns the character **90 degrees to the right** (clockwise). This changes the direction the character is facing.",
    examples: ["turnRight()"],
    category: "Movement"
  },
  {
    name: "look",
    signature: "look(direction)",
    description:
      'Returns the **emoji** in the given direction. Use `"ahead"`, `"left"`, or `"right"` to look around, or `"down"` to see the current square.',
    examples: ['look("ahead")', 'look("down")'],
    category: "Sensing"
  },
  {
    name: "removeEmoji",
    signature: "removeEmoji()",
    description:
      "Removes the emoji from the **current square**. Use this after collecting an emoji to avoid counting it again.",
    examples: ["removeEmoji()"],
    category: "Collection"
  },
  {
    name: "announceEmojis",
    signature: "announceEmojis(emojis)",
    description:
      "Announces your collected emojis. Pass a **dictionary** where keys are emoji strings and values are counts.",
    examples: ['announceEmojis({"💎": 3})'],
    category: "Collection"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  interpreterOptions: {
    maxTotalLoopIterations: 500
  }
};

export default exerciseDefinition;
