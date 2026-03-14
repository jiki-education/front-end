import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "roll",
    signature: "roll(sides)",
    description: "Rolls a die with the given number of sides and **returns** the result.",
    examples: ["let attack = roll(20)", "let damage = roll(12)"],
    category: "Dice"
  },
  {
    name: "announce",
    signature: "announce(value)",
    description: "Announces a dice roll value.",
    examples: ["announce(attack)", "announce(damage)"],
    category: "Action"
  },
  {
    name: "strike",
    signature: "strike(attack, damage)",
    description: "Strikes the goblin with the given attack roll and total damage.",
    examples: ["strike(attack, totalDamage)"],
    category: "Action"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["return-values", "variables", "using-functions"]
};

export default exerciseDefinition;
