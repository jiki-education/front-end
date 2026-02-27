import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "move",
    signature: "move()",
    description:
      "Moves the laser cannon **one position to the right**. If you move off the right edge of the screen, you lose!",
    examples: ["move()"],
    category: "Movement"
  },
  {
    name: "shoot",
    signature: "shoot()",
    description: "Shoots the laser upwards. **Only shoot when there's an alien above you**, or you lose the game!",
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

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions
};

export default exerciseDefinition;
