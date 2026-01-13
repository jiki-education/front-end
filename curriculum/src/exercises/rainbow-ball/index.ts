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
    name: "circle",
    signature: "circle(center_x, center_y, radius)",
    description: "Draw a circle with its center at (center_x, center_y) and the given radius",
    examples: ["circle(50, 50, 10)", "circle(5, 5, 10)"],
    category: "Drawing Shapes"
  },
  {
    name: "fill_color_hsl",
    signature: "fill_color_hsl(hue, saturation, luminosity)",
    description: "Set the fill color using HSL values (hue 0-360, saturation 0-100, luminosity 0-100)",
    examples: ["fill_color_hsl(100, 80, 50)", "fill_color_hsl(200, 80, 50)"],
    category: "Colors"
  },
  {
    name: "random_number",
    signature: "random_number(min, max)",
    description: "Returns a random integer between min and max (inclusive)",
    examples: ["random_number(1, 5)", "random_number(-5, -1)"],
    category: "Utilities"
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
  }
};

export default exerciseDefinition;
