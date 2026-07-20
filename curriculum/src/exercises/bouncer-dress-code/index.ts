import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "getOutfit",
    signature: "getOutfit()",
    description: "functions.getOutfit.description",
    examples: ["let outfit = getOutfit()"],
    category: "functions.getOutfit.category"
  },
  {
    name: "getAge",
    signature: "getAge()",
    description: "functions.getAge.description",
    examples: ["let age = getAge()"],
    category: "functions.getAge.category"
  },
  {
    name: "onGuestList",
    signature: "onGuestList()",
    description: "functions.onGuestList.description",
    examples: ["let listed = onGuestList()"],
    category: "functions.onGuestList.category"
  },
  {
    name: "offerChampagne",
    signature: "offerChampagne()",
    description: "functions.offerChampagne.description",
    examples: ["offerChampagne()"],
    category: "functions.offerChampagne.category"
  },
  {
    name: "offerCanapes",
    signature: "offerCanapes()",
    description: "functions.offerCanapes.description",
    examples: ["offerCanapes()"],
    category: "functions.offerCanapes.category"
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
  conceptSlugs: ["logical-and", "logical-or", "if", "else-if", "else"],
  tasks,
  scenarios,
  functions
};

export default exerciseDefinition;
