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
    name: "walk",
    signature: "walk(steps)",
    description:
      "Moves the character **forward by the given number of steps** in the current direction. Each step moves one cell. The character will stop and report an error if it hits a wall.",
    examples: ["walk(3)", "walk(1)"],
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
