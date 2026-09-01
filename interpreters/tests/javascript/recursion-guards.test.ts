import { test, expect, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import { interpret as interpretPython } from "@python/interpreter";

const selfRecursive = (n: number) => `function f(n) {\n  if (n <= 0) { return 0 }\n  return f(n - 1)\n}\nf(${n})`;
const mutualRecursive = `function a(n) { return b(n) }\nfunction b(n) { return a(n) }\na(1)`;

function lastFrame(res: any) {
  return res.frames[res.frames.length - 1];
}

describe("javascript recursion guards", () => {
  test("legitimate recursion within the limit succeeds", () => {
    const res = interpret(selfRecursive(5));
    expect(res.error).toBeNull();
    expect(lastFrame(res).status).toBe("SUCCESS");
  });

  test("self-recursion past the limit raises an error frame, not a native RangeError", () => {
    const res = interpret(selfRecursive(1000), { languageFeatures: { maxTotalCallDepth: 1000 } });
    expect(res.error).toBeNull();
    const frame = lastFrame(res);
    expect(frame.status).toBe("ERROR");
    expect(frame.error!.type).toBe("InfiniteRecursionDetected");
    expect(frame.error!.message).toBe("InfiniteRecursionDetected: name: f: max: 10");
  });

  test("mutual recursion is caught by the total depth bound", () => {
    const res = interpret(mutualRecursive, {
      languageFeatures: { maxRecursiveCallsPerFunction: 1000 },
    });
    expect(res.error).toBeNull();
    const frame = lastFrame(res);
    expect(frame.status).toBe("ERROR");
    expect(frame.error!.type).toBe("MaxTotalCallDepthReached");
    expect(frame.error!.message).toBe("MaxTotalCallDepthReached: max: 10");
  });

  test("both limits are configurable per exercise", () => {
    expect(
      lastFrame(
        interpret(selfRecursive(20), {
          languageFeatures: { maxRecursiveCallsPerFunction: 50, maxTotalCallDepth: 50 },
        })
      ).status
    ).toBe("SUCCESS");

    const tightened = lastFrame(
      interpret(selfRecursive(5), {
        languageFeatures: { maxRecursiveCallsPerFunction: 2, maxTotalCallDepth: 50 },
      })
    );
    expect(tightened.status).toBe("ERROR");
    expect(tightened.error!.message).toBe("InfiniteRecursionDetected: name: f: max: 2");
  });

  test("sequential calls do not accumulate depth", () => {
    const code = `function f() { return 1 }\nlet total = 0\nfor (let i = 0; i < 50; i++) { total = total + f() }`;
    expect(lastFrame(interpret(code)).status).toBe("SUCCESS");
  });

  test("the reported wordle code produces an error frame", () => {
    const res = interpret(
      `function processGame(word, guesses) {\n  for (const guess of guesses) {\n    processGame(word, guess)\n  }\n}\nprocessGame("hello", ["aaaaa"])`
    );
    expect(res.error).toBeNull();
    expect(lastFrame(res).status).toBe("ERROR");
    expect(lastFrame(res).error!.type).toBe("InfiniteRecursionDetected");
  });
});

describe("python recursion guards", () => {
  const pySelf = (n: number) => `def f(n):\n    if n <= 0:\n        return 0\n    return f(n - 1)\n\nf(${n})`;

  test("legitimate recursion within the limit succeeds", () => {
    expect(lastFrame(interpretPython(pySelf(5))).status).toBe("SUCCESS");
  });

  test("self-recursion past the limit raises an error frame", () => {
    const res = interpretPython(pySelf(1000), { languageFeatures: { maxTotalCallDepth: 1000 } });
    expect(res.error).toBeNull();
    const frame = lastFrame(res);
    expect(frame.status).toBe("ERROR");
    expect(frame.error!.message).toBe("InfiniteRecursionDetected: name: f: max: 10");
  });

  test("mutual recursion is caught by the total depth bound", () => {
    const res = interpretPython(`def a(n):\n    return b(n)\n\ndef b(n):\n    return a(n)\n\na(1)`, {
      languageFeatures: { maxRecursiveCallsPerFunction: 1000 },
    });
    expect(lastFrame(res).error!.message).toBe("MaxTotalCallDepthReached: max: 10");
  });
});
