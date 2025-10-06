import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";
import { RuntimeErrorType } from "@javascript/executor";
import { Frame } from "@shared/frames";

function expectFrameToBeError(frame: Frame, code: string, type: RuntimeErrorType) {
  expect(frame.code.trim()).toBe(code.trim());
  expect(frame.status).toBe("ERROR");
  expect(frame.error).not.toBeNull();
  expect(frame.error!.category).toBe("RuntimeError");
  expect(frame.error!.type).toBe(type);
}

describe("Runtime Errors", () => {
  describe("VariableNotDeclared", () => {
    test("simple undefined variable", () => {
      const code = "x;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "x", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("undefined variable in expression", () => {
      const code = "5 + a;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "a", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: a");
    });

    test("undefined variable on right side of binary expression", () => {
      const code = "10 * b;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "b", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: b");
    });

    test("undefined variable on left side of binary expression", () => {
      const code = "c - 5;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "c", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: c");
    });

    test("multiple undefined variables - should error on first", () => {
      const code = "x + y;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "x", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("undefined variable after defined variable", () => {
      const code = "let x = 5; y;";
      const { frames } = interpret(code);
      expect(frames).toBeArrayOfSize(2);
      expect(frames[0].status).toBe("SUCCESS");
      expectFrameToBeError(frames[1], "y", "VariableNotDeclared");
      expect(frames[1].error!.message).toBe("VariableNotDeclared: name: y");
    });

    test("undefined variable in complex expression", () => {
      const code = "let a = 10; let b = 20; a + b + c;";
      const { frames } = interpret(code);
      expect(frames).toBeArrayOfSize(3);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[1].status).toBe("SUCCESS");
      expectFrameToBeError(frames[2], "c", "VariableNotDeclared");
      expect(frames[2].error!.message).toBe("VariableNotDeclared: name: c");
    });

    test("undefined variable in block scope", () => {
      const code = "{ x; }";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "x", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("variable out of scope", () => {
      const code = "{ let x = 5; } x;";
      const { frames } = interpret(code);
      expect(frames).toBeArrayOfSize(2);
      expect(frames[0].status).toBe("SUCCESS"); // Variable declaration inside block
      expectFrameToBeError(frames[1], "x", "VariableNotDeclared");
      expect(frames[1].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("nested block undefined variable", () => {
      const code = "{ { y; } }";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "y", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: y");
    });

    test("undefined variable in string concatenation", () => {
      const code = '"Hello " + name;';
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "name", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: name");
    });

    test("undefined variable in boolean expression", () => {
      const code = "true && flag;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "flag", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: flag");
    });

    test.skip("undefined variable in comparison", () => {
      // Skip: Comparison operators not yet implemented in parser
      const code = "x > 5;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], code, "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("undefined variable in negation", () => {
      const code = "-x;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "x", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("undefined variable in grouping", () => {
      const code = "(x + 5);";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "x", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: x");
    });
  });

  describe("VariableNotDeclared for Updates", () => {
    test("simple undefined variable assignment", () => {
      const code = "x = 5;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "x", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("undefined variable assignment with expression", () => {
      const code = "y = 10 + 5;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "y", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: y");
    });

    test("undefined variable assignment after defined variable", () => {
      const code = "let x = 5; y = 10;";
      const { frames } = interpret(code);
      expect(frames).toBeArrayOfSize(2);
      expect(frames[0].status).toBe("SUCCESS");
      expectFrameToBeError(frames[1], "y", "VariableNotDeclared");
      expect(frames[1].error!.message).toBe("VariableNotDeclared: name: y");
    });

    test("undefined variable assignment in block scope", () => {
      const code = "{ x = 5; }";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "x", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("undefined variable assignment with string value", () => {
      const code = 'name = "John";';
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "name", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: name");
    });

    test("undefined variable assignment with boolean value", () => {
      const code = "flag = true;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "flag", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: flag");
    });

    test("variable out of scope assignment", () => {
      const code = "{ let x = 5; } x = 10;";
      const { frames } = interpret(code);
      expect(frames).toBeArrayOfSize(2);
      expect(frames[0].status).toBe("SUCCESS"); // Variable declaration inside block
      expectFrameToBeError(frames[1], "x", "VariableNotDeclared");
      expect(frames[1].error!.message).toBe("VariableNotDeclared: name: x");
    });
  });

  describe("ShadowingDisabled", () => {
    describe("allowShadowing: false (default)", () => {
      test("simple variable shadowing in block", () => {
        const code = "let x = 5; { let x = 10; }";
        const { frames } = interpret(code);
        expect(frames).toBeArrayOfSize(2); // Execution stops after error
        expect(frames[0].status).toBe("SUCCESS"); // Outer variable declaration
        expectFrameToBeError(frames[1], "x", "ShadowingDisabled"); // Inner variable declaration should fail
        expect(frames[1].error!.message).toBe("ShadowingDisabled: name: x");
      });

      test("nested block shadowing", () => {
        const code = "let x = 1; { { let x = 2; } }";
        const { frames } = interpret(code);
        expect(frames).toBeArrayOfSize(2); // Execution stops after error
        expect(frames[0].status).toBe("SUCCESS"); // let x = 1
        expectFrameToBeError(frames[1], "x", "ShadowingDisabled"); // Inner variable should fail
        expect(frames[1].error!.message).toBe("ShadowingDisabled: name: x");
      });

      test("multiple level shadowing", () => {
        const code = "let x = 1; { let y = 2; { let x = 3; } }";
        const { frames } = interpret(code);
        expect(frames).toBeArrayOfSize(3); // Execution stops after error
        expect(frames[0].status).toBe("SUCCESS"); // let x = 1
        expect(frames[1].status).toBe("SUCCESS"); // let y = 2
        expectFrameToBeError(frames[2], "x", "ShadowingDisabled"); // let x = 3 should fail
        expect(frames[2].error!.message).toBe("ShadowingDisabled: name: x");
      });

      test("different variable names should work", () => {
        const code = "let x = 5; { let y = 10; }";
        const { frames } = interpret(code);
        expect(frames).toBeArrayOfSize(2);
        expect(frames[0].status).toBe("SUCCESS"); // let x = 5
        expect(frames[1].status).toBe("SUCCESS"); // let y = 10
      });

      test("variable state after block with shadowing error", () => {
        const code = "let x = 5; { let x = 10; } x;";
        const { frames } = interpret(code);
        expect(frames).toBeArrayOfSize(2); // Should stop after shadowing error
        expect(frames[0].status).toBe("SUCCESS"); // let x = 5
        expectFrameToBeError(frames[1], "x", "ShadowingDisabled"); // Shadowing error
        expect(frames[1].error!.message).toBe("ShadowingDisabled: name: x");

        // Verify original variable is unchanged
        expect((frames[0] as TestAugmentedFrame).variables.x.value).toBe(5);
        expect((frames[1] as TestAugmentedFrame).variables.x.value).toBe(5); // Still 5 after error
      });
    });

    describe("allowShadowing: true", () => {
      test("simple variable shadowing allowed in block", () => {
        const code = "let x = 5; { let x = 10; x; }";
        const { frames } = interpret(code, { languageFeatures: { allowShadowing: true } });
        expect(frames).toBeArrayOfSize(3);
        expect(frames[0].status).toBe("SUCCESS"); // let x = 5
        expect(frames[1].status).toBe("SUCCESS"); // let x = 10 (shadowing allowed)
        expect(frames[2].status).toBe("SUCCESS"); // x; (should be 10)

        // Verify inner x has value 10
        expect((frames[2] as TestAugmentedFrame).variables.x.value).toBe(10);
      });

      test("nested shadowing allowed", () => {
        const code = "let x = 1; { let x = 2; { let x = 3; x; } x; } x;";
        const { frames } = interpret(code, { languageFeatures: { allowShadowing: true } });
        expect(frames).toBeArrayOfSize(6);
        expect(frames[0].status).toBe("SUCCESS"); // let x = 1
        expect(frames[1].status).toBe("SUCCESS"); // let x = 2
        expect(frames[2].status).toBe("SUCCESS"); // let x = 3
        expect(frames[3].status).toBe("SUCCESS"); // x; (should be 3)
        expect(frames[4].status).toBe("SUCCESS"); // x; (should be 2)
        expect(frames[5].status).toBe("SUCCESS"); // x; (should be 1)

        // Verify variables at different levels
        expect((frames[3] as TestAugmentedFrame).variables.x.value).toBe(3); // innermost
        expect((frames[4] as TestAugmentedFrame).variables.x.value).toBe(2); // middle
        expect((frames[5] as TestAugmentedFrame).variables.x.value).toBe(1); // outer
      });

      test("variable state restoration after shadowed block", () => {
        const code = "let x = 5; { let x = 10; } x;";
        const { frames } = interpret(code, { languageFeatures: { allowShadowing: true } });
        expect(frames).toBeArrayOfSize(3);
        expect(frames[0].status).toBe("SUCCESS"); // let x = 5
        expect(frames[1].status).toBe("SUCCESS"); // let x = 10 (shadowing)
        expect(frames[2].status).toBe("SUCCESS"); // x; after block

        // Verify original variable is restored after block
        expect((frames[0] as TestAugmentedFrame).variables.x.value).toBe(5);
        expect((frames[1] as TestAugmentedFrame).variables.x.value).toBe(10); // Inside block
        expect((frames[2] as TestAugmentedFrame).variables.x.value).toBe(5); // After block, back to original
      });

      test("assignment to shadowed variable doesn't affect outer", () => {
        const code = "let x = 5; { let x = 10; x = 20; } x;";
        const { frames } = interpret(code, { languageFeatures: { allowShadowing: true } });
        expect(frames).toBeArrayOfSize(4);
        expect(frames[0].status).toBe("SUCCESS"); // let x = 5
        expect(frames[1].status).toBe("SUCCESS"); // let x = 10
        expect(frames[2].status).toBe("SUCCESS"); // x = 20
        expect(frames[3].status).toBe("SUCCESS"); // x; after block

        // Verify original variable is unchanged
        expect((frames[0] as TestAugmentedFrame).variables.x.value).toBe(5);
        expect((frames[1] as TestAugmentedFrame).variables.x.value).toBe(10); // Initial shadow value
        expect((frames[2] as TestAugmentedFrame).variables.x.value).toBe(20); // Modified shadow value
        expect((frames[3] as TestAugmentedFrame).variables.x.value).toBe(5); // Original restored
      });
    });

    describe("feature flag default behavior", () => {
      test("shadowing disabled by default", () => {
        const code = "let x = 5; { let x = 10; }";
        const { frames } = interpret(code); // No language features specified
        expect(frames).toBeArrayOfSize(2); // Execution stops after error
        expect(frames[0].status).toBe("SUCCESS"); // let x = 5
        expectFrameToBeError(frames[1], "x", "ShadowingDisabled"); // Should error
        expect(frames[1].error!.message).toBe("ShadowingDisabled: name: x");
      });

      test("explicit allowShadowing false", () => {
        const code = "let x = 5; { let x = 10; }";
        const { frames } = interpret(code, { languageFeatures: { allowShadowing: false } });
        expect(frames).toBeArrayOfSize(2); // Execution stops after error
        expect(frames[0].status).toBe("SUCCESS"); // let x = 5
        expectFrameToBeError(frames[1], "x", "ShadowingDisabled"); // Should error
        expect(frames[1].error!.message).toBe("ShadowingDisabled: name: x");
      });
    });
  });

  describe("If Statement Runtime Errors", () => {
    test("undefined variable in if condition", () => {
      const code = "if (x) { let y = 5; }";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "x", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("undefined variable in complex if condition", () => {
      const code = "if (x && true) { let y = 10; }";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "x", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("undefined variable in logical condition", () => {
      const code = "if (true && unknown) { let y = 1; }";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "unknown", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: unknown");
    });

    test("undefined variable in if body should not execute", () => {
      const code = "if (true) { x = 5; }";
      const { frames } = interpret(code);
      expect(frames).toBeArrayOfSize(2); // If condition frame + assignment error frame
      expect(frames[0].status).toBe("SUCCESS"); // If condition evaluated
      expectFrameToBeError(frames[1], "x", "VariableNotDeclared");
      expect(frames[1].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("undefined variable in else body", () => {
      const code = "if (false) { let y = 1; } else { x = 5; }";
      const { frames } = interpret(code);
      expect(frames).toBeArrayOfSize(2); // If condition frame + else assignment error
      expect(frames[0].status).toBe("SUCCESS"); // If condition evaluated
      expectFrameToBeError(frames[1], "x", "VariableNotDeclared");
      expect(frames[1].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("shadowing error in if body", () => {
      const code = "let x = 5; if (true) { let x = 10; }";
      const { frames } = interpret(code); // Default allowShadowing: false
      expect(frames).toBeArrayOfSize(3);
      expect(frames[0].status).toBe("SUCCESS"); // let x = 5
      expect(frames[1].status).toBe("SUCCESS"); // if condition
      expectFrameToBeError(frames[2], "x", "ShadowingDisabled");
      expect(frames[2].error!.message).toBe("ShadowingDisabled: name: x");
    });

    test("shadowing allowed in if body", () => {
      const code = "let x = 5; if (true) { let x = 10; x; }";
      const { frames } = interpret(code, { languageFeatures: { allowShadowing: true } });
      expect(frames).toBeArrayOfSize(4);
      expect(frames[0].status).toBe("SUCCESS"); // let x = 5
      expect(frames[1].status).toBe("SUCCESS"); // if condition
      expect(frames[2].status).toBe("SUCCESS"); // let x = 10 (allowed)
      expect(frames[3].status).toBe("SUCCESS"); // x; (should be 10)
      expect((frames[3] as TestAugmentedFrame).variables.x.value).toBe(10);
    });
  });
});
