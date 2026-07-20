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
    name: "Block",
    signature: "new Block(left, top)",
    description: "functions.block.description",
    examples: ["let block = new Block(8, 31)"],
    category: "functions.block.category"
  },
  {
    name: "moveBall",
    signature: "moveBall(ball)",
    description: "functions.moveBall.description",
    examples: ["moveBall(ball)"],
    category: "functions.moveBall.category"
  },
  {
    name: "push",
    signature: "push(list, element)",
    description: "functions.push.description",
    examples: ['let list = push(list, "item")'],
    category: "functions.push.category"
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
    maxTotalLoopIterations: 5000
  }
};

export default exerciseDefinition;
