// Main entry point for the interpreters package
// Export each language as a namespace to avoid naming conflicts
export * as jikiscript from "./jikiscript/index.js";
export * as javascript from "./javascript/index.js";
export * as python from "./python/index.js";

// Export shared types and constants
export { TIME_SCALE_FACTOR, type Frame } from "./shared/frames.js";
export { type ExecutionContext } from "./shared/interfaces.js";
export { type CompilationResult, type SyntaxError } from "./shared/errors.js";
