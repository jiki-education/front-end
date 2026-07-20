import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "Ball",
    signature: "new Ball()",
    description: "functions.ball.description",
    examples: ["let ball = new Ball()"],
    category: "functions.ball.category"
  },
  {
    name: "moveBall",
    signature: "moveBall(ball)",
    description: "functions.moveBall.description",
    examples: ["moveBall(ball)"],
    category: "functions.moveBall.category"
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
