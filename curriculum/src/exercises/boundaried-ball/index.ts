import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "Ball",
    signature: "new Ball()",
    description:
      "Creates a new Ball instance with properties: `cx`, `cy` (center position), `radius`, `xVelocity`, and `yVelocity`.",
    examples: ["let ball = new Ball()"],
    category: "Objects"
  },
  {
    name: "moveBall",
    signature: "moveBall(ball)",
    description: "Moves the ball according to its current `xVelocity` and `yVelocity`.",
    examples: ["moveBall(ball)"],
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
  interpreterOptions: {
    maxTotalLoopIterations: 10000
  }
};

export default exerciseDefinition;
