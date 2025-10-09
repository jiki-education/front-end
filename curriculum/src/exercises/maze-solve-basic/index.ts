import "./exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { ExerciseDefinition, FunctionDoc } from "../types";

const functions: FunctionDoc[] = [
  {
    name: "move()",
    description:
      "Moves the character **one step forward** in the current direction. The character will only move if the target position is not blocked by a wall.",
    usage: "move();"
  },
  {
    name: "turn_left()",
    description:
      "Turns the character **90 degrees to the left** (counterclockwise). This changes the direction the character is facing.",
    usage: "turn_left();"
  },
  {
    name: "turn_right()",
    description:
      "Turns the character **90 degrees to the right** (clockwise). This changes the direction the character is facing.",
    usage: "turn_right();"
  }
];

const exerciseDefinition: ExerciseDefinition = {
  ...metadata, // Spreads all fields from metadata.json
  ExerciseClass,
  tasks,
  scenarios,
  functions
};

export default exerciseDefinition;
