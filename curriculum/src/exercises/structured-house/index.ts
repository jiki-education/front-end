import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "functions.rectangle.description",
    examples: [
      'rectangle(0, 0, 100, 50, "skyblue")',
      "rectangle(houseLeft, houseTop, houseWidth, houseHeight, houseColor)"
    ],
    category: "functions.rectangle.category"
  },
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius, color)",
    description: "functions.circle.description",
    examples: ['circle(50, 50, 10, "black")', "circle(knobCenterX, knobCenterY, knobRadius, knobColor)"],
    category: "functions.circle.category"
  },
  {
    name: "triangle",
    signature: "triangle(x1, y1, x2, y2, x3, y3, color)",
    description: "functions.triangle.description",
    examples: [
      'triangle(50, 20, 40, 40, 60, 40, "brick")',
      "triangle(roofLeft, roofBaseY, roofPeakX, roofPeakY, roofRight, roofBaseY, roofColor)"
    ],
    category: "functions.triangle.category"
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
      { fromLine: 1, toLine: 14 },
      { fromLine: 15, toLine: 15, toChar: 17 },
      { fromLine: 16, toLine: 16, toChar: 18 }
    ],
    python: [
      { fromLine: 1, toLine: 14 },
      { fromLine: 15, toLine: 15, toChar: 14 },
      { fromLine: 16, toLine: 16, toChar: 15 }
    ],
    jikiscript: [
      { fromLine: 1, toLine: 14 },
      { fromLine: 15, toLine: 15, toChar: 19 },
      { fromLine: 16, toLine: 16, toChar: 20 }
    ]
  }
};

export default exerciseDefinition;
