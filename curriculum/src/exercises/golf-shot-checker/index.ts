import "../../exercise-categories/golf/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import { progressionMetrics } from "./progressionMetrics";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "moveTo",
    signature: "moveTo(x, y)",
    description: "Moves the ball to position **(x, y)**.",
    examples: ["moveTo(30, 75)", "moveTo(50, 84)"],
    category: "Movement"
  },
  {
    name: "getShotLength",
    signature: "getShotLength()",
    description: "Returns the **length of the shot** — how many units the ball travels to the right.",
    examples: ["let shotLength = getShotLength()"],
    category: "Information"
  },
  {
    name: "fireFireworks",
    signature: "fireFireworks()",
    description: "Fires celebratory fireworks!",
    examples: ["fireFireworks()"],
    category: "Action"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  conceptSlugs: ["logical-and", "if", "repeat", "updating-variables", "using-functions-with-return-values"],
  tasks,
  scenarios,
  progressionMetrics,
  functions,
  interpreterOptions: { maxTotalLoopIterations: 200 }
};

export default exerciseDefinition;
