export { interpret, compile, evaluateFunction } from "./interpreter";
export function formatIdentifier(name: string): string {
  return name;
}
export type { InterpretResult } from "../shared/interfaces";
export type { EvaluationContext, EvaluateFunctionResult } from "./interpreter";

// Export type classes for Shared namespace
export { Number, JikiString, Boolean, List, Dictionary, Instance, JikiObject } from "./jikiObjects";
