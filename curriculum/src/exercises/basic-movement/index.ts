import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseDefinition, FunctionInfo } from "../types";

import solutionJavascript from "./solution.javascript";
import solutionPython from "./solution.py";
import solutionJikiscript from "./solution.jiki";
import stubJavascript from "./stub.javascript";
import stubPython from "./stub.py";
import stubJikiscript from "./stub.jiki";

const functions: FunctionInfo[] = [
  {
    name: "moveUp",
    signature: "moveUp()",
    description:
      "Moves the character **one step up** in the maze. The character will only move if the target position is not blocked by a wall.",
    examples: ["moveUp()"],
    category: "Movement"
  },
  {
    name: "moveDown",
    signature: "moveDown()",
    description:
      "Moves the character **one step down** in the maze. The character will only move if the target position is not blocked by a wall.",
    examples: ["moveDown()"],
    category: "Movement"
  },
  {
    name: "moveLeft",
    signature: "moveLeft()",
    description:
      "Moves the character **one step left** in the maze. The character will only move if the target position is not blocked by a wall.",
    examples: ["moveLeft()"],
    category: "Movement"
  },
  {
    name: "moveRight",
    signature: "moveRight()",
    description:
      "Moves the character **one step right** in the maze. The character will only move if the target position is not blocked by a wall.",
    examples: ["moveRight()"],
    category: "Movement"
  }
];

const exerciseDefinition: VisualExerciseDefinition = {
  type: "visual",
  ...metadata, // Spreads all fields from metadata.json
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  solutions: {
    javascript: solutionJavascript,
    python: solutionPython,
    jikiscript: solutionJikiscript
  },
  stubs: {
    javascript: stubJavascript,
    python: stubPython,
    jikiscript: stubJikiscript
  }
};

export default exerciseDefinition;
