import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "toLowerCase",
    signature: '"...".toLowerCase()',
    description: "functions.toLowerCase.description",
    examples: ['"Hello".toLowerCase() → "hello"', '"PNG".toLowerCase() → "png"'],
    category: "functions.toLowerCase.category"
  },
  {
    name: "includes",
    signature: '"...".includes(substring)',
    description: "functions.includes.description",
    examples: ['"hello".includes("ell") → true', '"hello".includes("z") → false'],
    category: "functions.includes.category"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["methods", "string-iteration", "if"],
  // The stub carries the student's hand-written pangram code forward
  // ({{LESSON:pangram}}), which scans the alphabet per character and runs ~2200
  // loop iterations on the longest scenario — above the global default of 1000.
  // The intended built-in `.toLowerCase()`/`.includes()` solution is ~26
  // iterations, but a student running or mid-converting the carried code would
  // otherwise hit the cap. Match pangram's cap so the starting code executes.
  interpreterOptions: { maxTotalLoopIterations: 32000 }
};

export default exerciseDefinition;
