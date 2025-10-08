import type { Location } from "./location";
import type { JSLanguageFeatures } from "../javascript/interfaces";
import type { PythonLanguageFeatures } from "../python/interfaces";
import type { JikiScriptLanguageFeatures } from "../jikiscript/interpreter";
import type { Frame } from "./frames";
import type { SyntaxError as JSSyntaxError } from "../javascript/error";
import type { SyntaxError as PySyntaxError } from "../python/error";
import type { StaticError as JikiError } from "../jikiscript/error";
import type { Statement as JSStatement } from "../javascript/statement";
import type { Statement as PyStatement } from "../python/statement";
import type { Statement as JikiStatement } from "../jikiscript/statement";

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
  languageFeatures?: JSLanguageFeatures | PythonLanguageFeatures | JikiScriptLanguageFeatures;
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

// Union type of all interpreter errors
export type InterpreterError = JSSyntaxError | PySyntaxError | JikiError;

// Meta information about execution
export interface Meta {
  functionCallLog: Record<string, Record<string, number>>;
  statements: JSStatement[] | PyStatement[] | JikiStatement[];
}

// Shared InterpretResult interface used by all interpreters
export interface InterpretResult {
  frames: Frame[];
  logLines: Array<{ time: number; output: string }>;
  success: boolean;
  error: InterpreterError | null;
  meta: Meta;
}
