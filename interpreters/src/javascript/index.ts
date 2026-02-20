export { interpret, compile, evaluateFunction } from "./interpreter";
export { snakeToCamel as formatIdentifier } from "./assertion-helpers";
export type { InterpretResult } from "../shared/interfaces";
export type { EvaluationContext, EvaluateFunctionResult } from "./interpreter";
export type { NodeType, LanguageFeatures } from "./interfaces";

// Export type classes for Shared namespace
export { JSNumber, JSString, JSBoolean, JSNull, JSUndefined, JSArray, JSDictionary, JikiObject } from "./jsObjects";

// Export class-related types
export { JSClass, JSInstance } from "./jsObjects";
