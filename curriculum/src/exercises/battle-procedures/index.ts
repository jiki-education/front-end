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
    name: "moveLeft",
    signature: "moveLeft()",
    description:
      "Moves the laser cannon **one position to the left**. If you try to move off the left edge of the screen, you'll lose the game!",
    examples: ["moveLeft()"],
    category: "Movement"
  },
  {
    name: "moveRight",
    signature: "moveRight()",
    description:
      "Moves the laser cannon **one position to the right**. If you try to move off the right edge of the screen, you'll lose the game!",
    examples: ["moveRight()"],
    category: "Movement"
  },
  {
    name: "shoot",
    signature: "shoot()",
    description:
      "Shoots the laser upwards. **Only shoot when there's an alien above you**, or you'll lose the game! The laser cannon overheats easily, so you must move before shooting again.",
    examples: ["shoot()"],
    category: "Action"
  },
  {
    name: "isAlienAbove",
    signature: "isAlienAbove()",
    description:
      "Returns `true` if there's an alien directly above the laser cannon, or `false` if not. Use this to check before shooting!",
    examples: ["if (isAlienAbove()) { shoot(); }"],
    category: "Detection"
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
