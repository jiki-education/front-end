import { describe, it, expect } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { ExternalFunction } from "@shared/interfaces";
import type { ExecutionContext } from "@javascript/executor";
import type { TestAugmentedFrame } from "@shared/frames";

const circle: ExternalFunction = {
  name: "circle",
  func: (_ctx: ExecutionContext) => undefined,
  description: "draws a circle",
  arity: 4,
};

describe("UnexpectedUncalledFunction", () => {
  it("errors on bare external function reference as a statement", () => {
    const code = `circle(55, 40, 20, "white");
circle
circle(55, 40, 20, "white");`;
    const result = interpret(code, { externalFunctions: [circle] });

    expect(result.error).toBeNull();
    expect(result.frames[0].status).toBe("SUCCESS");

    const errorFrame = result.frames[1] as TestAugmentedFrame;
    expect(errorFrame.status).toBe("ERROR");
    expect(errorFrame.error?.type).toBe("UnexpectedUncalledFunction");
    expect(errorFrame.error?.context?.name).toBe("circle");
  });

  it("errors on bare user-defined function reference as a statement", () => {
    const code = `function f() {}
f;`;
    const result = interpret(code);

    const errorFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(errorFrame.status).toBe("ERROR");
    expect(errorFrame.error?.type).toBe("UnexpectedUncalledFunction");
    expect(errorFrame.error?.context?.name).toBe("f");
  });

  it("errors on assigning a bare function reference to a variable", () => {
    const code = `function f() {}
let g = f;`;
    const result = interpret(code);

    const errorFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(errorFrame.status).toBe("ERROR");
    expect(errorFrame.error?.type).toBe("UnexpectedUncalledFunction");
    expect(errorFrame.error?.context?.name).toBe("f");
  });

  it("errors on passing a bare function reference as an argument", () => {
    const code = `function f() {}
function h(x) {}
h(f);`;
    const result = interpret(code);

    const errorFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(errorFrame.status).toBe("ERROR");
    expect(errorFrame.error?.type).toBe("UnexpectedUncalledFunction");
    expect(errorFrame.error?.context?.name).toBe("f");
  });

  describe("system language (the default when no locale is injected)", () => {
    it("produces the expected message", () => {
      const code = `function f() {}
f;`;
      const result = interpret(code);

      const errorFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(errorFrame.error?.message).toBe("UnexpectedUncalledFunction: name: f");
    });
  });

  describe("regressions", () => {
    it("parenthesised callee still calls successfully", () => {
      const code = `function f() { return 1; }
(f)();`;
      const result = interpret(code);
      expect(result.frames.every(f => f.status === "SUCCESS")).toBe(true);
    });

    it("double-parenthesised callee still calls successfully", () => {
      const code = `function f() { return 1; }
((f))();`;
      const result = interpret(code);
      expect(result.frames.every(f => f.status === "SUCCESS")).toBe(true);
    });

    it("normal call of external function still works", () => {
      const result = interpret(`circle(1, 2, 3, "red");`, { externalFunctions: [circle] });
      expect(result.frames[0].status).toBe("SUCCESS");
    });
  });
});
