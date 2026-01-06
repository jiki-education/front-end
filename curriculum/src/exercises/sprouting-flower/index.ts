import { SproutingFlowerExercise } from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseDefinition, FunctionDoc } from "../types";

import solutionJavascript from "./solution.javascript";
import solutionPython from "./solution.py";
import solutionJikiscript from "./solution.jiki";
import stubJavascript from "./stub.javascript";
import stubPython from "./stub.py";
import stubJikiscript from "./stub.jiki";

const functions: FunctionDoc[] = [
  {
    name: "rectangle(x, y, width, height)",
    description:
      "Draws a **rectangle** at position (x, y) with the specified width and height. The position represents the top-left corner of the rectangle.",
    usage: "rectangle(10, 20, 50, 30);"
  },
  {
    name: "circle(x, y, radius)",
    description:
      "Draws a **circle** at center position (x, y) with the specified radius.",
    usage: "circle(50, 50, 10);"
  },
  {
    name: "ellipse(x, y, x_radius, y_radius)",
    description:
      "Draws an **ellipse** at center position (x, y) with the specified x_radius and y_radius.",
    usage: "ellipse(50, 50, 20, 10);"
  },
  {
    name: "fill_color_hex(color)",
    description:
      "Sets the **fill color** for subsequent shapes using a hex color code (e.g., '#FF0000' for red) or a color name (e.g., 'blue').",
    usage: 'fill_color_hex("#FF0000");'
  }
];

const exerciseDefinition: VisualExerciseDefinition = {
  type: "visual",
  ...metadata, // Spreads all fields from metadata.json
  ExerciseClass: SproutingFlowerExercise,
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
