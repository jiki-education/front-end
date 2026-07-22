import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "askName",
    signature: "askName()",
    description: "functions.askName.description",
    examples: ["let name = askName()"],
    category: "functions.askName.category"
  },
  {
    name: "getAllowedStart",
    signature: "getAllowedStart()",
    description: "functions.getAllowedStart.description",
    examples: ["let allowedStart = getAllowedStart()"],
    category: "functions.getAllowedStart.category"
  },
  {
    name: "letIn",
    signature: "letIn()",
    description: "functions.letIn.description",
    examples: ["letIn()"],
    category: "functions.letIn.category"
  },
  {
    name: "turnAway",
    signature: "turnAway()",
    description: "functions.turnAway.description",
    examples: ["turnAway()"],
    category: "functions.turnAway.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions
};

export default exerciseDefinition;
