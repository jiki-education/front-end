import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "move",
    signature: "move()",
    description: "functions.move.description",
    examples: ["let found = move()"],
    category: "functions.move.category"
  },
  {
    name: "isEmoji",
    signature: "isEmoji(thing)",
    description: "functions.isEmoji.description",
    examples: ["isEmoji(found)"],
    category: "functions.isEmoji.category"
  },
  {
    name: "recite",
    signature: "recite(poem)",
    description: "functions.recite.description",
    examples: ["recite(poem)"],
    category: "functions.recite.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["continue", "break", "while-loops", "string-concatenation", "variables"],
  interpreterOptions: { maxTotalLoopIterations: 100 }
};

export default exerciseDefinition;
