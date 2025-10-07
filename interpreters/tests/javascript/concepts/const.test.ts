import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("const declarations", () => {
  describe("basic const declarations", () => {
    test("const declaration with initializer", () => {
      const { frames, error } = interpret("const x = 42;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].context?.type).toBe("VariableDeclaration");
      expect(frames[0].context?.kind).toBe("const");
      expect((frames[0] as TestAugmentedFrame).variables.x.value).toBe(42);
    });

    test("const with string value", () => {
      const { frames, error } = interpret('const name = "Alice";');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect((frames[0] as TestAugmentedFrame).variables.name.value).toBe("Alice");
    });

    test("const with expression", () => {
      const { frames, error } = interpret("const result = 10 + 5;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect((frames[0] as TestAugmentedFrame).variables.result.value).toBe(15);
    });

    test("const with array", () => {
      const { frames, error } = interpret("const arr = [1, 2, 3];");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      const arrValue = (frames[0] as TestAugmentedFrame).variables.arr.value;
      expect(arrValue.map((item: any) => item.value)).toEqual([1, 2, 3]);
    });

    test("const with object", () => {
      const { frames, error } = interpret('const obj = { name: "Bob" };');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      const objValue = (frames[0] as TestAugmentedFrame).variables.obj.value;
      expect(objValue.get("name").value).toBe("Bob");
    });
  });

  describe("const requires initializer", () => {
    test("const without initializer is syntax error", () => {
      const { error } = interpret("const x;");
      expect(error).not.toBeNull();
      expect(error?.type).toBe("MissingInitializerInConstDeclaration");
    });

    test("const without initializer even with requireVariableInstantiation false", () => {
      const { error } = interpret("const x;", {
        languageFeatures: { requireVariableInstantiation: false },
      });
      expect(error).not.toBeNull();
      expect(error?.type).toBe("MissingInitializerInConstDeclaration");
    });
  });

  describe("const reassignment", () => {
    test("cannot reassign const variable", () => {
      const { frames, success } = interpret("const x = 5; x = 10;");
      expect(success).toBe(false);
      expect(frames).toBeArrayOfSize(2);
      expect(frames[1].status).toBe("ERROR");
      expect(frames[1].error?.type).toBe("AssignmentToConstant");
      expect(frames[1].error?.context?.name).toBe("x");
    });

    test("cannot reassign const with same value", () => {
      const { frames, success } = interpret("const x = 5; x = 5;");
      expect(success).toBe(false);
      expect(frames[1].error?.type).toBe("AssignmentToConstant");
    });

    test("cannot reassign const in different scope", () => {
      const { frames, success } = interpret("const x = 5; { x = 10; }");
      expect(success).toBe(false);
      expect(frames[1].error?.type).toBe("AssignmentToConstant");
    });

    test("cannot reassign const in loop", () => {
      const { frames, success } = interpret("const x = 0; for (let i = 0; i < 3; i = i + 1) { x = x + 1; }");
      expect(success).toBe(false);
      // Find the error frame
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect(errorFrame?.error?.type).toBe("AssignmentToConstant");
    });
  });

  describe("const with mutable objects", () => {
    test("can modify array elements of const array", () => {
      const { frames, error } = interpret("const arr = [1, 2, 3]; arr[0] = 99;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2);
      const arrValue = (frames[1] as TestAugmentedFrame).variables.arr.value;
      expect(arrValue[0].value).toBe(99);
    });

    test("cannot reassign const array", () => {
      const { frames, success } = interpret("const arr = [1, 2, 3]; arr = [4, 5, 6];");
      expect(success).toBe(false);
      expect(frames[1].error?.type).toBe("AssignmentToConstant");
    });

    test("can modify object properties of const object", () => {
      const { frames, error } = interpret('const obj = { x: 1 }; obj["x"] = 2;');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2);
      const objValue = (frames[1] as TestAugmentedFrame).variables.obj.value;
      expect(objValue.get("x").value).toBe(2);
    });

    test("cannot reassign const object", () => {
      const { frames, success } = interpret("const obj = { x: 1 }; obj = { x: 2 };");
      expect(success).toBe(false);
      expect(frames[1].error?.type).toBe("AssignmentToConstant");
    });
  });

  describe("const with let in same scope", () => {
    test("const and let together", () => {
      const { frames, error } = interpret("const x = 5; let y = 10;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2);
      expect((frames[1] as TestAugmentedFrame).variables.x.value).toBe(5);
      expect((frames[1] as TestAugmentedFrame).variables.y.value).toBe(10);
    });

    test("can reassign let but not const", () => {
      const { frames, success } = interpret("const x = 5; let y = 10; y = 20; x = 15;");
      expect(success).toBe(false);
      expect(frames).toBeArrayOfSize(4);
      expect(frames[2].status).toBe("SUCCESS"); // y = 20 succeeds
      expect((frames[2] as TestAugmentedFrame).variables.y.value).toBe(20);
      expect(frames[3].status).toBe("ERROR"); // x = 15 fails
      expect(frames[3].error?.type).toBe("AssignmentToConstant");
    });
  });

  describe("const in different scopes", () => {
    test("const in nested block scope with shadowing allowed", () => {
      const { frames, error } = interpret("const x = 5; { const x = 10; }", {
        languageFeatures: { allowShadowing: true },
      });
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2);
      // Inside the block, x should be 10
      expect((frames[1] as TestAugmentedFrame).variables.x.value).toBe(10);
    });

    test("const shadowing disabled by default", () => {
      const { frames, success } = interpret("const x = 5; { const x = 10; }", {
        languageFeatures: { allowShadowing: false },
      });
      expect(success).toBe(false);
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame?.error?.type).toBe("ShadowingDisabled");
    });

    test("const in loop scope", () => {
      const { frames, error } = interpret("for (let i = 0; i < 3; i = i + 1) { const x = i; }");
      expect(error).toBeNull();
      // Should create const x in each loop iteration (though last one is visible in frame)
    });
  });

  describe("const educational descriptions", () => {
    test("const declaration has appropriate description", () => {
      const { frames } = interpret("const count = 5;");
      expect(frames[0].generateDescription()).toContain("constant");
      expect(frames[0].generateDescription()).toContain("count");
      expect(frames[0].generateDescription()).toContain("5");
    });

    test("const reassignment error has appropriate message", () => {
      const { frames } = interpret("const x = 5; x = 10;");
      expect(frames[1].error?.context?.name).toBe("x");
      expect(frames[1].error?.type).toBe("AssignmentToConstant");
    });
  });

  describe("const in complex expressions", () => {
    test("const used in expressions", () => {
      const { frames, error } = interpret("const x = 5; const y = x + 10;");
      expect(error).toBeNull();
      expect((frames[1] as TestAugmentedFrame).variables.y.value).toBe(15);
    });

    test("multiple const declarations", () => {
      const { frames, error } = interpret("const a = 1; const b = 2; const c = a + b;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3);
      expect((frames[2] as TestAugmentedFrame).variables.c.value).toBe(3);
    });
  });
});
