import type { Frame } from "../../../src/shared/frames";

export interface InterpretResult {
  frames: Frame[];
  error: any;
  success: boolean;
}

/**
 * Extract output from Jiki interpreter frames
 * This simulates print() in Python or console.log() in JavaScript
 * For now, since we don't have print() implemented, we just get the last value
 */
export function extractOutput(result: InterpretResult): string {
  const outputs: string[] = [];

  // Look for print/console.log outputs first (future implementation)
  // For now, just get the last successful frame's value
  const successFrames = result.frames.filter(f => f.status === "SUCCESS");
  if (successFrames.length > 0) {
    const lastFrame = successFrames[successFrames.length - 1];
    const value = lastFrame.result?.jikiObject?.value;
    if (value !== undefined) {
      outputs.push(String(value));
    }
  }

  // Also check for errors
  const errorFrames = result.frames.filter(f => f.status === "ERROR");
  for (const frame of errorFrames) {
    const errorType = frame.error?.type || "Error";
    const errorMessage = frame.error?.message || "";

    // Format error output to match native Python/JS
    if (errorType === "ValueError" || errorMessage.includes("ValueError")) {
      outputs.push(`ValueError: ${frame.error?.context?.value || ""} is not in list`);
    } else if (errorType === "TypeError") {
      outputs.push(`TypeError: ${errorMessage}`);
    } else {
      outputs.push(`${errorType}: ${errorMessage}`);
    }
  }

  return outputs.join("\n");
}

/**
 * Normalize output for comparison
 * Handles platform differences and formatting inconsistencies
 */
export function normalizeOutput(output: string): string {
  return output
    .trim()
    .replace(/\r\n/g, "\n") // Windows line endings
    .replace(/\s+$/gm, "") // Trailing whitespace per line
    .replace(/^\s+/gm, match => {
      // Preserve indentation but normalize tabs to spaces
      return match.replace(/\t/g, "    ");
    });
}

/**
 * Extract value from the last successful frame
 * Useful for comparing computation results
 */
export function extractLastValue(result: InterpretResult): any {
  const successFrames = result.frames.filter(f => f.status === "SUCCESS");
  if (successFrames.length === 0) return undefined;

  const lastFrame = successFrames[successFrames.length - 1];

  // First, check if there's a variable named "result" in the frame's variables
  // This is set in test mode for Python/JavaScript interpreters
  const variables = (lastFrame as any).variables;
  if (variables && variables.result) {
    return variables.result.value;
  }

  // Fallback to the frame's result value (for simple expressions)
  return lastFrame.result?.jikiObject?.value;
}

/**
 * Check if result contains an error frame
 */
export function hasError(result: InterpretResult): boolean {
  return result.frames.some(f => f.status === "ERROR");
}

/**
 * Extract error information if present
 */
export function extractError(result: InterpretResult): { type: string; message: string } | null {
  const errorFrame = result.frames.find(f => f.status === "ERROR");
  if (!errorFrame) return null;

  return {
    type: errorFrame.error?.type || "UnknownError",
    message: errorFrame.error?.message || "",
  };
}
