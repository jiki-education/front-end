import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "circle",
    signature: "circle(cx, cy, radius, color)",
    description: "Draw a circle centered at (cx, cy) with the given radius and color",
    examples: ['circle(75, 25, 15, "yellow")'],
    category: "Drawing Shapes"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  readonlyRanges: {
    javascript: [
      { fromLine: 1, toLine: 2 },
      { fromLine: 3, toLine: 3, toChar: 10 },
      { fromLine: 4, toLine: 4, toChar: 13 }
    ],
    python: [
      { fromLine: 1, toLine: 2 },
      { fromLine: 3, toLine: 3, toChar: 6 },
      { fromLine: 4, toLine: 4, toChar: 9 }
    ],
    jikiscript: [
      { fromLine: 1, toLine: 2 },
      { fromLine: 3, toLine: 3, toChar: 11 },
      { fromLine: 4, toLine: 4, toChar: 14 }
    ]
  }
};

export default exerciseDefinition;
