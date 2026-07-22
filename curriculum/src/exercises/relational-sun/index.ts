import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius, color)",
    description: "functions.circle.description",
    examples: ['circle(75, 25, 15, "yellow")'],
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
      { fromLine: 1, toLine: 6 },
      { fromLine: 7, toLine: 7, toChar: 10 },
      { fromLine: 8, toLine: 8, toChar: 13 },
      { fromLine: 9, toLine: 10 },
      { fromLine: 12, toLine: 12 }
    ],
    python: [
      { fromLine: 1, toLine: 6 },
      { fromLine: 7, toLine: 7, toChar: 6 },
      { fromLine: 8, toLine: 8, toChar: 9 },
      { fromLine: 9, toLine: 10 },
      { fromLine: 12, toLine: 12 }
    ],
    jikiscript: [
      { fromLine: 1, toLine: 6 },
      { fromLine: 7, toLine: 7, toChar: 11 },
      { fromLine: 8, toLine: 8, toChar: 14 },
      { fromLine: 9, toLine: 10 },
      { fromLine: 12, toLine: 12 }
    ]
  }
};

export default exerciseDefinition;
