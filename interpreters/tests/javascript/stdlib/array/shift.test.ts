import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("shift() method", () => {
  test("removes and returns first element", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        let first = arr.shift();
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(1);
    expect(lastFrame.variables?.arr.value.length).toBe(2);
    expect(lastFrame.variables?.arr.value[0].value).toBe(2);
  });

  test("shift on empty array returns undefined, which cannot be stored", () => {
    // Called as a statement it's fine (real JS returns undefined here)...
    const call = interpret(`
        let arr = [];
        arr.shift();
      `);
    expect(call.success).toBe(true);
    const callFrame = call.frames[call.frames.length - 1] as TestAugmentedFrame;
    expect(callFrame.status).toBe("SUCCESS");
    expect(callFrame.result?.jikiObject?.value).toBeUndefined();
    expect(callFrame.variables?.arr.value.length).toBe(0);

    // ...but storing that undefined result is an error, unlike real JS. This is an
    // intentional divergence (see cross-validation LIMITATIONS.md).
    const store = interpret(`
        let arr = [];
        let first = arr.shift();
      `);
    expect(store.success).toBe(false);
    const storeFrame = store.frames[store.frames.length - 1] as TestAugmentedFrame;
    expect(storeFrame.status).toBe("ERROR");
    expect(storeFrame.error?.type).toBe("AssignmentToUndefined");
  });

  test("requires no arguments", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        arr.shift(1);
      `);
    expect(result.error).toBeNull();
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame?.error?.type).toBe("InvalidNumberOfArguments");
  });
});
