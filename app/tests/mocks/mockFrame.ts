import type { Frame } from "@jiki/interpreters";
import { TIME_SCALE_FACTOR } from "@jiki/interpreters";

/**
 * Creates a mock frame with proper structure matching the interpreter's Frame type.
 * Time is in microseconds, timeInMs is in milliseconds.
 *
 * @param timeInMicroseconds - Time in microseconds
 * @param overrides - Optional overrides for any Frame properties (including line)
 */
export function mockFrame(timeInMicroseconds: number, overrides?: Partial<Frame>): Frame {
  const line = overrides?.line ?? 1;
  const description = overrides?.generateDescription?.() || `Frame at line ${line}`;

  return {
    line,
    time: timeInMicroseconds,
    timeInMs: Math.round(timeInMicroseconds / TIME_SCALE_FACTOR),
    status: "SUCCESS",
    code: `// Line ${line}`,
    generateDescription: () => description,
    result: undefined,
    data: {},
    context: undefined,
    ...overrides
  };
}
