import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "circle",
    signature: "circle(cx, cy, radius, color)",
    description: "Draw a circle centered at (cx, cy) with the given radius and color",
    examples: ['circle(50, 16, 8, "red")'],
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
  conceptSlugs: ["variables", "using-functions"],
  readonlyRanges: {
    javascript: [{ fromLine: 1, toLine: 8 }],
    python: [{ fromLine: 1, toLine: 8 }],
    jikiscript: [{ fromLine: 1, toLine: 8 }]
  }
};

export default exerciseDefinition;
