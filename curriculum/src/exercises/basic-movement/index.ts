import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseDefinition, FunctionDoc } from "../types";

const functions: FunctionDoc[] = [
  {
    name: "moveUp()",
    description:
      "Moves the character **one step up** in the maze. The character will only move if the target position is not blocked by a wall.",
    usage: "moveUp();"
  },
  {
    name: "moveDown()",
    description:
      "Moves the character **one step down** in the maze. The character will only move if the target position is not blocked by a wall.",
    usage: "moveDown();"
  },
  {
    name: "moveLeft()",
    description:
      "Moves the character **one step left** in the maze. The character will only move if the target position is not blocked by a wall.",
    usage: "moveLeft();"
  },
  {
    name: "moveRight()",
    description:
      "Moves the character **one step right** in the maze. The character will only move if the target position is not blocked by a wall.",
    usage: "moveRight();"
  }
];

const exerciseDefinition: VisualExerciseDefinition = {
  type: "visual",
  ...metadata, // Spreads all fields from metadata.json
  ExerciseClass,
  tasks,
  scenarios,
  functions
};

export default exerciseDefinition;
