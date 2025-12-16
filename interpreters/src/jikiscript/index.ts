export { interpret, compile, evaluateFunction } from "./interpreter";
export type { InterpretResult } from "../shared/interfaces";
export type { EvaluationContext, EvaluateFunctionResult } from "./interpreter";

// Export type classes for Shared namespace
export {
  Number,
  JikiString,
  Boolean,
  List,
  Dictionary,
  Instance,
  JikiObject,
} from "./jikiObjects";
