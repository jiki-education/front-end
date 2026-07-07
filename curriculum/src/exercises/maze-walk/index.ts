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
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["creating-functions-with-inputs", "creating-functions", "repeat", "using-functions"],
  readonlyRanges: {
    javascript: [
      { fromLine: 1, toLine: 1 },
      { fromLine: 5, toLine: 11 }
    ],
    jikiscript: [
      { fromLine: 1, toLine: 1 },
      { fromLine: 5, toLine: 11 }
    ],
    python: [
      { fromLine: 1, toLine: 1 },
      { fromLine: 5, toLine: 9 }
    ]
  }
};

export default exerciseDefinition;
