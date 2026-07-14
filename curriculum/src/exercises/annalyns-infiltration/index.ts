import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import { progressionMetrics } from "./progressionMetrics";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "knightIsAwake",
    signature: "knightIsAwake()",
    description: "Returns `true` if the knight is awake, `false` if he is asleep.",
    examples: ["if (knightIsAwake()) {", "if (!knightIsAwake()) {"],
    category: "Information"
  },
  {
    name: "archerIsAwake",
    signature: "archerIsAwake()",
    description: "Returns `true` if the archer is awake, `false` if she is asleep.",
    examples: ["if (archerIsAwake()) {", "if (!archerIsAwake()) {"],
    category: "Information"
  },
  {
    name: "prisonerIsAwake",
    signature: "prisonerIsAwake()",
    description: "Returns `true` if the prisoner is awake, `false` if they are asleep.",
    examples: ["if (prisonerIsAwake()) {"],
    category: "Information"
  },
  {
    name: "dogIsBehaving",
    signature: "dogIsBehaving()",
    description: "Returns `true` if Annalyn's (somewhat naughty) dog is behaving itself.",
    examples: ["if (dogIsBehaving()) {"],
    category: "Information"
  },
  {
    name: "fastAttack",
    signature: "fastAttack()",
    description: "Makes a fast attack on the knight.",
    examples: ["fastAttack()"],
    category: "Action"
  },
  {
    name: "spy",
    signature: "spy()",
    description: "Spies on the group.",
    examples: ["spy()"],
    category: "Action"
  },
  {
    name: "signalPrisoner",
    signature: "signalPrisoner()",
    description: "Signals the prisoner using bird sounds.",
    examples: ["signalPrisoner()"],
    category: "Action"
  },
  {
    name: "freePrisoner",
    signature: "freePrisoner()",
    description: "Sneaks into the camp to free the prisoner.",
    examples: ["freePrisoner()"],
    category: "Action"
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
  conceptSlugs: ["if", "logical-and", "logical-or", "logical-not", "using-functions-with-return-values"]
};

export default exerciseDefinition;
