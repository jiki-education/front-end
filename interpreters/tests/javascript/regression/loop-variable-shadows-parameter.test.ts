import { describe, it, expect } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { ExternalFunction } from "@shared/interfaces";
import type { ExecutionContext } from "@javascript/executor";
import type { JikiObject } from "@javascript/jsObjects";

// A `for (let idx = ...)` loop inside a function whose *parameter* is also
// called `idx` is legal JavaScript (the loop head opens a new block scope), but
// it trips the ShadowingDisabled check when shadowing is turned off.
describe("loop variable shadowing a parameter", () => {
  const code = `
function useIdx(idx, items) {
  let seen = []
  for (let idx = 0; idx < items.length; idx++) {
    seen.push(items[idx])
  }
  record(idx, seen)
}

function run(items) {
  for (let idx = 0; idx < items.length; idx++) {
    useIdx(idx, items[idx])
  }
}
run([["a"], ["b"]])
`;

  function recorder() {
    const calls: number[] = [];
    const record: ExternalFunction = {
      name: "record",
      func: (_ctx: ExecutionContext, row: JikiObject, _seen: JikiObject) => {
        calls.push((row as any).value);
        return undefined;
      },
      description: "records a row index",
      arity: 2,
    };
    return { calls, record };
  }

  it("errors with ShadowingDisabled when shadowing is off", () => {
    const { calls, record } = recorder();
    const result = interpret(code, { externalFunctions: [record] });

    expect(result.error).toBeNull();
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect((errorFrame as any).error.type).toBe("ShadowingDisabled");
    expect((errorFrame as any).error.context).toEqual({ name: "idx" });
    // The error points at the `for (let idx ...)` head, not the parameter.
    expect((errorFrame as any).error.location.line).toBe(4);
    expect(calls).toEqual([]);
  });

  it("runs correctly when shadowing is allowed", () => {
    const { calls, record } = recorder();
    const result = interpret(code, {
      externalFunctions: [record],
      languageFeatures: { allowShadowing: true },
    });

    expect(result.error).toBeNull();
    expect(result.frames.find(f => f.status === "ERROR")).toBeUndefined();
    expect(calls).toEqual([0, 1]);
  });
});
