import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";
describe("if statement concept", () => {
  describe("parser", () => {
    test("parses if statement correctly", () => {
      const { frames, error } = interpret("if (true) { let x = 5; }");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2); // if condition frame + var decl frame
      expect(frames[0].context?.type).toBe("IfStatement");
    });

    test("parses if-else statement correctly", () => {
      const { frames, error } = interpret("if (false) { let x = 5; } else { let y = 10; }");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2); // if condition frame + var decl frame
      expect(frames[0].context?.type).toBe("IfStatement");
    });

    test("parses if with single statement correctly", () => {
      const { frames, error } = interpret("let x = 1; if (true) x = 2;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3); // variable declaration + if condition + assignment
      expect(frames[1].context?.type).toBe("IfStatement");
    });
  });

  describe("execution", () => {
    test("executes then branch when condition is true", () => {
      const { frames, error } = interpret("let x = 1; if (true) { x = 5; }");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3); // var decl + if condition + assignment

      // Check final variable value
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.x.value).toBe(5);
    });

    test("skips then branch when condition is false", () => {
      const { frames, error } = interpret("let x = 1; if (false) { x = 5; }");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2); // var decl + if condition only

      // Check variable unchanged
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.x.value).toBe(1);
    });

    test("executes else branch when condition is false", () => {
      const { frames, error } = interpret("let x = 1; if (false) { x = 5; } else { x = 10; }");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3); // var decl + if condition + assignment

      // Check variable value from else branch
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.x.value).toBe(10);
    });

    test("works with boolean conditions", () => {
      const { frames, error } = interpret("let x = 5; if (true) { x = 100; }");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3); // var decl + if condition + assignment

      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.x.value).toBe(100);
    });

    test("works with logical operators", () => {
      const { frames, error } = interpret("let a = true; let b = false; if (a && !b) { let result = 1; }");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(4); // 2 var decls + if condition + inner var decl

      // result variable should exist in the last frame (inside the block)
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.result).toBeTruthy();
    });

    test("simple nested if statements work correctly", () => {
      const { frames, error } = interpret("let x = 1; if (true) x = 5;");
      expect(error).toBeNull();

      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.x.value).toBe(5);
    });
  });

  describe("scoping", () => {
    test("variables declared in if block are scoped correctly", () => {
      const { frames, error } = interpret(`
        if (true) {
          let blockVar = 42;
        }
      `);
      expect(error).toBeNull();

      // blockVar should exist in the declaration frame (inside the block)
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.blockVar).toBeTruthy();
      expect((finalFrame as TestAugmentedFrame).variables.blockVar.value).toBe(42);
    });

    test("variables from outer scope accessible in if block", () => {
      const { frames, error } = interpret(`
        let outerVar = 10;
        if (true) {
          outerVar = 20;
        }
      `);
      expect(error).toBeNull();

      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.outerVar.value).toBe(20);
    });
  });

  describe("educational descriptions", () => {
    test("if statement has meaningful description", () => {
      const { frames, error } = interpret("if (true) { let x = 5; }");
      expect(error).toBeNull();
      const desc = frames[0].generateDescription();
      expect(desc).toBeTruthy();
      expect(desc).toContain("condition");
      expect(desc).toContain("true");
    });

    test("if-else statement describes both branches", () => {
      const { frames, error } = interpret("if (false) { let x = 5; } else { let y = 10; }");
      expect(error).toBeNull();
      const desc = frames[0].generateDescription();
      expect(desc).toBeTruthy();
      expect(desc).toContain("false");
      expect(desc).toContain("else");
    });
  });

  describe("else if statements", () => {
    test("executes else if branch when first condition is false and else if is true", () => {
      const { frames, error } = interpret(`
        let result = 0;
        if (false) {
          result = 1;
        } else if (true) {
          result = 2;
        } else {
          result = 3;
        }
      `);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe(2);
    });

    test("executes else branch when if and else if conditions are false", () => {
      const { frames, error } = interpret(`
        let result = 0;
        if (false) {
          result = 1;
        } else if (false) {
          result = 2;
        } else {
          result = 3;
        }
      `);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe(3);
    });

    test("supports multiple else if branches", () => {
      const { frames, error } = interpret(`
        let result = 0;
        if (false) {
          result = 1;
        } else if (false) {
          result = 2;
        } else if (true) {
          result = 3;
        } else if (true) {
          result = 4;
        } else {
          result = 5;
        }
      `);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe(3);
    });

    test("else if without final else works correctly", () => {
      const { frames, error } = interpret(`
        let result = 0;
        if (false) {
          result = 1;
        } else if (true) {
          result = 2;
        }
      `);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe(2);
    });

    test("skips all branches when no condition is true and no else", () => {
      const { frames, error } = interpret(`
        let result = 0;
        if (false) {
          result = 1;
        } else if (false) {
          result = 2;
        }
      `);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe(0);
    });

    test("else if with complex conditions", () => {
      const { frames, error } = interpret(`
        let a = true;
        let b = true;
        let result = 0;
        if (!a) {
          result = 1;
        } else if (a && b) {
          result = 2;
        } else {
          result = 3;
        }
      `);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe(2);
    });

    test("variables declared in else if blocks are scoped correctly", () => {
      const { frames, error } = interpret(`
        if (false) {
          let blockVar1 = 1;
        } else if (true) {
          let blockVar2 = 2;
        } else {
          let blockVar3 = 3;
        }
      `);
      expect(error).toBeNull();

      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.blockVar1).toBeUndefined();
      expect((finalFrame as TestAugmentedFrame).variables.blockVar2).toBeTruthy();
      expect((finalFrame as TestAugmentedFrame).variables.blockVar2.value).toBe(2);
      expect((finalFrame as TestAugmentedFrame).variables.blockVar3).toBeUndefined();
    });

    test("else if with single statements (no blocks)", () => {
      const { frames, error } = interpret(`
        let result = 0;
        if (false) result = 1;
        else if (true) result = 2;
        else result = 3;
      `);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe(2);
    });

    test("else if chain evaluates conditions in order", () => {
      const { frames, error } = interpret(`
        let value1 = false;
        let value2 = false;
        let value3 = true;
        let result = 0;
        if (value1) {
          result = 1;
        } else if (value2) {
          result = 2;
        } else if (value3) {
          result = 3;
        }
      `);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe(3);
    });
  });
});
