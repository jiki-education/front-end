import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "moveLeft",
    signature: "moveLeft()",
    description: "functions.moveLeft.description",
    examples: ["moveLeft()"],
    category: "functions.moveLeft.category"
  },
  {
    name: "moveRight",
    signature: "moveRight()",
    description: "functions.moveRight.description",
    examples: ["moveRight()"],
    category: "functions.moveRight.category"
  },
  {
    name: "shoot",
    signature: "shoot()",
    description: "functions.shoot.description",
    examples: ["shoot()"],
    category: "functions.shoot.category"
  },
  {
    name: "getStartingAliensInRow",
    signature: "getStartingAliensInRow(idx)",
    description: "functions.getStartingAliensInRow.description",
    examples: [
      "let bottomRow = getStartingAliensInRow(1);",
      "let middleRow = getStartingAliensInRow(2);",
      "let topRow = getStartingAliensInRow(3);"
    ],
    category: "functions.getStartingAliensInRow.category"
  },
  {
    name: "fireFireworks",
    signature: "fireFireworks()",
    description: "functions.fireFireworks.description",
    examples: ["fireFireworks()"],
    category: "functions.fireFireworks.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["arrays", "variables", "if", "repeat", "using-functions-with-return-values"],
  // Nested loop (for inside the game repeat); bootcamp's 100-tick game-over cap maps to
  // ~1214 cumulative iterations here, so allow headroom for suboptimal solutions.
  interpreterOptions: { maxTotalLoopIterations: 2000 }
};

export default exerciseDefinition;
