import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius, color)",
    description: "functions.circle.description",
    examples: ['circle(50, 20, 10, "white")'],
    category: "functions.circle.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["variables", "arithmetic", "using-functions-with-inputs"],
  readonlyRanges: {
    javascript: [
      { fromLine: 1, toLine: 2, toChar: 11 },
      { fromLine: 12, toLine: 19 }
    ],
    python: [
      { fromLine: 1, toLine: 2, toChar: 7 },
      { fromLine: 12, toLine: 19 }
    ],
    jikiscript: [
      { fromLine: 1, toLine: 2, toChar: 12 },
      { fromLine: 12, toLine: 19 }
    ]
  }
};

export default exerciseDefinition;
