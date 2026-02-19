export { interpret, compile, evaluateFunction } from "./interpreter";
export function formatIdentifier(name: string): string {
  return name;
}
export type { InterpretResult } from "../shared/interfaces";
export type { EvaluationContext, EvaluateFunctionResult } from "./interpreter";
export type { NodeType, LanguageFeatures } from "./interfaces";

// Export type classes for Shared namespace
export { PyNumber, PyString, PyBoolean, PyNone, PyList, JikiObject } from "./jikiObjects";
