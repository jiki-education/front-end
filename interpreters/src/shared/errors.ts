import type { Location } from "./location";
import type { InterpreterError } from "./interfaces";

/**
 * Shared SyntaxError interface that all interpreter-specific SyntaxError classes conform to.
 * Each interpreter can have additional fields, but all must include these core properties.
 *
 * All interpreters require non-null locations. Use Location.unknown as a fallback for cases
 * where the precise location cannot be determined.
 */
export interface SyntaxError {
  message: string;
  location: Location;
  type: string;
  context?: any;
}

/**
 * Result type returned by compile() functions in all interpreters.
 * Uses a discriminated union for type-safe success/error handling.
 */
export type CompilationResult = { success: true } | { success: false; error: InterpreterError };
