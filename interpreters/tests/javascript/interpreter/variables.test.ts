import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";
import { JSNumber, JSString, JSBoolean } from "@javascript/jikiObjects";

describe("variables interpreter", () => {
  describe("execute", () => {
    describe("variable declaration", () => {
      test("declaring number variable", () => {
        const { frames, error } = interpret("let x = 42;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect((frames[0] as TestAugmentedFrame).variables).toHaveProperty("x");
        expect((frames[0] as TestAugmentedFrame).variables.x).toBeInstanceOf(JSNumber);
        expect((frames[0] as TestAugmentedFrame).variables.x.value).toBe(42);
      });

      test("declaring string variable", () => {
        const { frames, error } = interpret('let message = "hello";');
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect((frames[0] as TestAugmentedFrame).variables).toHaveProperty("message");
        expect((frames[0] as TestAugmentedFrame).variables.message).toBeInstanceOf(JSString);
        expect((frames[0] as TestAugmentedFrame).variables.message.value).toBe("hello");
      });

      test("declaring boolean variable", () => {
        const { frames, error } = interpret("let flag = true;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect((frames[0] as TestAugmentedFrame).variables).toHaveProperty("flag");
        expect((frames[0] as TestAugmentedFrame).variables.flag).toBeInstanceOf(JSBoolean);
        expect((frames[0] as TestAugmentedFrame).variables.flag.value).toBe(true);
      });

      test("declaring variable with expression", () => {
        const { frames, error } = interpret("let result = 5 + 3;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect((frames[0] as TestAugmentedFrame).variables).toHaveProperty("result");
        expect((frames[0] as TestAugmentedFrame).variables.result.value).toBe(8);
      });
    });

    describe("variable access", () => {
      test("accessing declared variable", () => {
        const { frames, error } = interpret("let x = 10; x;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(2);

        // First frame: declaration
        expect(frames[0].status).toBe("SUCCESS");
        expect((frames[0] as TestAugmentedFrame).variables).toHaveProperty("x");
        expect((frames[0] as TestAugmentedFrame).variables.x.value).toBe(10);

        // Second frame: access
        expect(frames[1].status).toBe("SUCCESS");
        expect(frames[1].result?.jikiObject.value).toBe(10);
      });

      test("accessing variable in expression", () => {
        const { frames, error } = interpret("let a = 5; let b = a + 3;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(2);

        // First frame: declare a
        expect((frames[0] as TestAugmentedFrame).variables.a.value).toBe(5);

        // Second frame: declare b using a
        expect((frames[1] as TestAugmentedFrame).variables).toHaveProperty("a");
        expect((frames[1] as TestAugmentedFrame).variables).toHaveProperty("b");
        expect((frames[1] as TestAugmentedFrame).variables.b.value).toBe(8);
      });

      test("complex variable operations", () => {
        const { frames, error } = interpret("let x = 2; let y = 3; let z = x * y + 1;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(3);

        // Final frame should have all variables
        expect((frames[2] as TestAugmentedFrame).variables.x.value).toBe(2);
        expect((frames[2] as TestAugmentedFrame).variables.y.value).toBe(3);
        expect((frames[2] as TestAugmentedFrame).variables.z.value).toBe(7);
      });
    });

    describe("error cases", () => {
      test("accessing undefined variable", () => {
        const { frames, error } = interpret("x;");
        expect(error).toBeNull(); // Runtime errors are in frames, not returned
        const errorFrame = frames.find(f => f.status === "ERROR");
        expect(errorFrame).toBeTruthy();
        expect(errorFrame?.error?.message).toBe("VariableNotDeclared: name: x");
      });

      test("using variable in same declaration", () => {
        const { frames, error } = interpret("let x = x + 1;");
        expect(error).toBeNull(); // Runtime errors are in frames, not returned
        const errorFrame = frames.find(f => f.status === "ERROR");
        expect(errorFrame).toBeTruthy();
        expect(errorFrame?.error?.message).toBe("VariableNotDeclared: name: x");
      });
    });
  });
});
