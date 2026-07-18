import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "knightIsAwake",
    signature: "knightIsAwake()",
    description: "functions.knightIsAwake.description",
    examples: ["if (knightIsAwake()) {", "if (!knightIsAwake()) {"],
    category: "functions.knightIsAwake.category"
  },
  {
    name: "archerIsAwake",
    signature: "archerIsAwake()",
    description: "functions.archerIsAwake.description",
    examples: ["if (archerIsAwake()) {", "if (!archerIsAwake()) {"],
    category: "functions.archerIsAwake.category"
  },
  {
    name: "prisonerIsAwake",
    signature: "prisonerIsAwake()",
    description: "functions.prisonerIsAwake.description",
    examples: ["if (prisonerIsAwake()) {"],
    category: "functions.prisonerIsAwake.category"
  },
  {
    name: "dogIsBehaving",
    signature: "dogIsBehaving()",
    description: "functions.dogIsBehaving.description",
    examples: ["if (dogIsBehaving()) {"],
    category: "functions.dogIsBehaving.category"
  },
  {
    name: "fastAttack",
    signature: "fastAttack()",
    description: "functions.fastAttack.description",
    examples: ["fastAttack()"],
    category: "functions.fastAttack.category"
  },
  {
    name: "spy",
    signature: "spy()",
    description: "functions.spy.description",
    examples: ["spy()"],
    category: "functions.spy.category"
  },
  {
    name: "signalPrisoner",
    signature: "signalPrisoner()",
    description: "functions.signalPrisoner.description",
    examples: ["signalPrisoner()"],
    category: "functions.signalPrisoner.category"
  },
  {
    name: "freePrisoner",
    signature: "freePrisoner()",
    description: "functions.freePrisoner.description",
    examples: ["freePrisoner()"],
    category: "functions.freePrisoner.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["if", "logical-and", "logical-or", "logical-not", "using-functions-with-return-values"]
};

export default exerciseDefinition;
