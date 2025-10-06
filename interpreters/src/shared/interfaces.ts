import type { Location } from "./location";

export interface SomethingWithLocation {
  location: Location;
}

export type DisabledLanguageFeatureErrorType =
  | "DisabledFeatureExcludeListViolation"
  | "DisabledFeatureIncludeListViolation";

export class DisabledLanguageFeatureError extends Error {
  constructor(
    message: string,
    public location: Location,
    public type: DisabledLanguageFeatureErrorType,
    public context?: any
  ) {
    super(message);
    this.name = "DisabledLanguageFeatureError";
  }
}

export interface ExecutionContext {
  fastForward: (milliseconds: number) => void;
  getCurrentTimeInMs: () => number;
  logicError: (message: string) => never; // For custom functions to throw educational errors
}

// Arity can be a fixed number or a range [min, max]
// For variable arity functions, use [min, Infinity]
export type Arity = number | [number, number];

// Generic external function interface for all interpreters
export interface ExternalFunction {
  name: string;
  func: Function;
  description: string;
  arity?: Arity;
}
