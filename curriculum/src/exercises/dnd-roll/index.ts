import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "roll",
    signature: "roll(sides)",
    description: "functions.roll.description",
    examples: ["let attack = roll(20)", "let damage = roll(12)"],
    category: "functions.roll.category"
  },
  {
    name: "announce",
    signature: "announce(value)",
    description: "functions.announce.description",
    examples: ["announce(attack)", "announce(damage)"],
    category: "functions.announce.category"
  },
  {
    name: "strike",
    signature: "strike(attack, damage)",
    description: "functions.strike.description",
    examples: ["strike(attack, totalDamage)"],
    category: "functions.strike.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["using-functions-with-return-values", "variables", "using-functions"]
};

export default exerciseDefinition;
