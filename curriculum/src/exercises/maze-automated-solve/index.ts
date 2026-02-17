import "../../exercise-categories/maze/exercise.css";
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
    name: "move",
    signature: "move()",
    description:
      "Moves the character **one step forward** in the current direction. The character will only move if the target position is not blocked by a wall.",
    examples: ["move()"],
    category: "Movement"
  },
  {
    name: "turn_left",
    signature: "turn_left()",
    description:
      "Turns the character **90 degrees to the left** (counterclockwise). This changes the direction the character is facing.",
    examples: ["turn_left()"],
    category: "Movement"
  },
  {
    name: "turn_right",
    signature: "turn_right()",
    description:
      "Turns the character **90 degrees to the right** (clockwise). This changes the direction the character is facing.",
    examples: ["turn_right()"],
    category: "Movement"
  },
  {
    name: "can_move",
    signature: "can_move()",
    description: "Returns **true** if the space ahead of the character is not a wall, **false** otherwise.",
    examples: ["can_move()"],
    category: "Sensing"
  },
  {
    name: "can_turn_left",
    signature: "can_turn_left()",
    description: "Returns **true** if the space to the character's left is not a wall, **false** otherwise.",
    examples: ["can_turn_left()"],
    category: "Sensing"
  },
  {
    name: "can_turn_right",
    signature: "can_turn_right()",
    description: "Returns **true** if the space to the character's right is not a wall, **false** otherwise.",
    examples: ["can_turn_right()"],
    category: "Sensing"
  }
];

const exerciseDefinition: VisualExerciseDefinition = {
  type: "visual",
  ...metadata,
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
