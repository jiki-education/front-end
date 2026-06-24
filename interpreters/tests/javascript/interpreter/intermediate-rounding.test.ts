import { interpret } from "@javascript/interpreter";

// Replicates the "Division and maths expressions in Structured House" forum bug.
//
// Numbers are stored as exact rationals, so mathematically-equivalent
// expressions agree regardless of operation order. Previously every binary
// result was rounded to 5 decimal places after *each* operation, so `1/7 * x`
// (which rounds 1/7 first) diverged from `x / 7` (a single round).

function evalValue(code: string): number {
  const { frames, error } = interpret(code);
  expect(error).toBeNull();
  expect(frames[0].status).toBe("SUCCESS");
  return frames[0].result?.jikiObject.value as number;
}

// For multi-statement programs, read the value produced by the final frame.
function evalLastValue(code: string): number {
  const { frames, error } = interpret(code);
  expect(error).toBeNull();
  const last = frames[frames.length - 1];
  expect(last.status).toBe("SUCCESS");
  return last.result?.jikiObject.value as number;
}

describe("equivalent expressions agree regardless of operation order", () => {
  test("1/7 * 70 equals 70 / 7", () => {
    expect(evalValue("1 / 7 * 70;")).toBe(evalValue("70 / 7;"));
  });

  test("1/7 * 700 equals 700 / 7", () => {
    expect(evalValue("1 / 7 * 700;")).toBe(evalValue("700 / 7;"));
  });

  test("1/7 * 70 is exactly 10", () => {
    expect(evalValue("1 / 7 * 70;")).toBe(10);
  });

  test("1/7 * 700 is exactly 100", () => {
    expect(evalValue("1 / 7 * 700;")).toBe(100);
  });

  test("error does not grow with magnitude", () => {
    expect(evalValue("1 / 7 * 700;")).toBe(100);
  });

  test("0.1 + 0.2 stays neat", () => {
    expect(evalValue("0.1 + 0.2;")).toBe(0.3);
  });

  test("chained thirds: 1/3 + 1/3 + 1/3 is exactly 1", () => {
    expect(evalValue("1 / 3 + 1 / 3 + 1 / 3;")).toBe(1);
  });

  test("non-terminating value still exposed rounded to 5dp", () => {
    expect(evalValue("1 / 3;")).toBe(0.33333);
  });

  // The ++/-- update expression must preserve exactness too, otherwise loop
  // counters lose their exact fraction and division diverges again. These use
  // multi-statement programs, so we read the final frame's value. A buggy
  // (inexact) counter makes `i / 7 * 700` evaluate to 100.002 instead of 100.
  test("postfix i++ keeps the counter exact", () => {
    expect(evalLastValue("let i = 0; i++; i / 7 * 700;")).toBe(100);
  });

  test("prefix ++i keeps the counter exact", () => {
    expect(evalLastValue("let i = 0; ++i; i / 7 * 700;")).toBe(100);
  });

  test("i-- keeps the counter exact", () => {
    expect(evalLastValue("let i = 2; i--; i / 7 * 700;")).toBe(100);
  });

  test("for-loop with i++ accumulates exactly", () => {
    expect(evalLastValue("let t = 0; for (let i = 1; i < 8; i++) { t = t + (i / 7) * 700; } t;")).toBe(2800);
  });
});
