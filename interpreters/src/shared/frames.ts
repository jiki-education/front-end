// The interpreter times are in microseconds
// The timeline times are in milliseconds
export const TIME_SCALE_FACTOR = 1000;

/**
 * Convert time from microseconds to milliseconds
 */
export function timeToMs(time: number): number {
  return time / TIME_SCALE_FACTOR;
}

/**
 * Shared frame execution status used by all interpreters
 */
export type FrameExecutionStatus = "SUCCESS" | "ERROR";

/**
 * Base frame interface shared by all interpreters.
 * Represents a single step of code execution for educational visualization.
 */
export interface Frame {
  /** Line number in the source code */
  line: number;

  /** The actual code being executed */
  code: string;

  /** Whether this frame succeeded or errored */
  status: FrameExecutionStatus;

  /** Error information if the frame failed */
  error?: any;

  /** Execution time (in microseconds) */
  time: number;

  /** Execution time converted to milliseconds for animations */
  timeInMs: number;

  /** Human-readable description of what happened (lazy evaluation) */
  generateDescription: () => string;

  /** Result of the evaluation if applicable */
  result?: any;

  /** Additional data for specific interpreters */
  data?: Record<string, any>;

  /** Additional context (AST node, statement, etc.) */
  context?: any;
}

/**
 * Helper function to check if all frames succeeded
 */
export function framesSucceeded(frames: Frame[]): boolean {
  return frames.every(frame => frame.status === "SUCCESS");
}

/**
 * Helper function to check if any frames errored
 */
export function framesErrored(frames: Frame[]): boolean {
  return !framesSucceeded(frames);
}

/**
 * Description type for educational explanations
 */
export interface Description {
  result: String;
  steps: String[];
}

/**
 * Context for generating descriptions
 */
export interface DescriptionContext {
  functionDescriptions: Record<string, string>;
}

/**
 * Frame with result - used by describers
 */
export type FrameWithResult = Frame & { result: any };

/**
 * Frame augmented with test-only fields for debugging and validation
 * These fields are only populated when NODE_ENV=test and not running benchmarks
 */
export type TestAugmentedFrame = Frame & {
  /** Snapshot of variables after this frame executed (test-only) */
  variables: Record<string, any>;

  /** Pre-generated description for immediate access (test-only) */
  description: string;
};
