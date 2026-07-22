import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius, color)",
    description: "functions.circle.description",
    examples: ['circle(50, 50, 10, "#ff0000")', "circle(50, sunCenterY, sunRadius, rgb(255, 237, 0))"],
    category: "functions.circle.category"
  },
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "functions.rectangle.description",
    examples: ['rectangle(0, 0, 100, 100, "#0308ce")', "rectangle(0, 0, 100, 100, hsl(210, 70, 60))"],
    category: "functions.rectangle.category"
  },
  {
    name: "rgb",
    signature: "rgb(red, green, blue)",
    description: "functions.rgb.description",
    examples: ["rgb(255, 0, 0)", "rgb(255, 237, 0)"],
    category: "functions.rgb.category"
  },
  {
    name: "hsl",
    signature: "hsl(hue, saturation, lightness)",
    description: "functions.hsl.description",
    examples: ["hsl(210, 70, 60)", "hsl(0, 100, 50)"],
    category: "functions.hsl.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["repeat", "variables", "hsl", "rgb", "using-functions", "using-functions-with-return-values"],
  interpreterOptions: {
    repeatDelay: 20
  }
};

export default exerciseDefinition;
