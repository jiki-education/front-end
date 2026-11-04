import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import { progressionMetrics } from "./progressionMetrics";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "askAge",
    signature: "askAge()",
    description: "functions.askAge.description",
    examples: ["let age = askAge()"],
    category: "functions.askAge.category"
  },
  {
    name: "letIn",
    signature: "letIn()",
    description: "functions.letIn.description",
    examples: ["letIn()"],
    category: "functions.letIn.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  progressionMetrics,
  functions,
  conceptSlugs: ["if"]
};

export default exerciseDefinition;
