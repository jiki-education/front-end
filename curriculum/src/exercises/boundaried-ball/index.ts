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
  },
  interpreterOptions: {
    maxTotalLoopIterations: 10000
  }
};

export default exerciseDefinition;
