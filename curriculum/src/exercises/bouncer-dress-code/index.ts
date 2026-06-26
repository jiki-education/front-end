import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "getOutfit",
    signature: "getOutfit()",
    description: 'Returns the **outfit** the person is wearing (e.g. `"ballgown"`, `"suit"`, `"denim"`).',
    examples: ["let outfit = getOutfit()"],
    category: "Information"
  },
  {
    name: "getAge",
    signature: "getAge()",
    description: "Returns the **age** of the person waiting at the door.",
    examples: ["let age = getAge()"],
    category: "Information"
  },
  {
    name: "onGuestList",
    signature: "onGuestList()",
    description: "Returns `true` if the person is on tonight's guest list, otherwise `false`.",
    examples: ["let listed = onGuestList()"],
    category: "Information"
  },
  {
    name: "offerChampagne",
    signature: "offerChampagne()",
    description: "Offers the person a glass of champagne.",
    examples: ["offerChampagne()"],
    category: "Action"
  },
  {
    name: "offerCanapes",
    signature: "offerCanapes()",
    description: "Offers the person some canapés (salmon tartare).",
    examples: ["offerCanapes()"],
    category: "Action"
  },
  {
    name: "letIn",
    signature: "letIn()",
    description: "Lets the person into the venue.",
    examples: ["letIn()"],
    category: "Action"
  },
  {
    name: "turnAway",
    signature: "turnAway()",
    description: "Turns the person away from the venue.",
    examples: ["turnAway()"],
    category: "Action"
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
