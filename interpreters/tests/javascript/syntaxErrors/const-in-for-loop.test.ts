import { interpret } from "@javascript/interpreter";

describe("const in for loops", () => {
  describe("syntax errors for const in C-style for loops", () => {
    test("const in for loop init is syntax error", () => {
      const { error } = interpret("for (const i = 0; i < 5; i++) {}");
      expect(error).not.toBeNull();
      expect(error?.type).toBe("ConstInForLoopInit");
    });

    test("const with initializer in for loop is syntax error", () => {
      const { error } = interpret("for (const counter = 1; counter <= 10; counter++) { let x = 1; }");
      expect(error).not.toBeNull();
      expect(error?.type).toBe("ConstInForLoopInit");
    });

    test("const in for loop with complex body is syntax error", () => {
      const code = `
        let sum = 0;
        for (const i = 0; i < 3; i++) {
          sum = sum + i;
        }
      `;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
      expect(error?.type).toBe("ConstInForLoopInit");
    });

    test("const in for loop without update expression is syntax error", () => {
      const { error } = interpret("for (const i = 0; i < 5;) {}");
      expect(error).not.toBeNull();
      expect(error?.type).toBe("ConstInForLoopInit");
    });
  });

  describe("let in C-style for loops works correctly", () => {
    test("let in for loop init works", () => {
      const { error, success } = interpret("for (let i = 0; i < 5; i++) {}");
      expect(error).toBeNull();
      expect(success).toBe(true);
    });

    test("let in for loop with body works", () => {
      const code = `
        let sum = 0;
        for (let i = 0; i < 3; i++) {
          sum = sum + i;
        }
      `;
      const { error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
    });
  });

  describe("const in for...of loops works correctly", () => {
    test("const in for...of with array works", () => {
      const { error, success } = interpret("for (const item of [1, 2, 3]) { let x = item; }");
      expect(error).toBeNull();
      expect(success).toBe(true);
    });

    test("const in for...of with string works", () => {
      const { error, success } = interpret('for (const char of "abc") { let x = char; }');
      expect(error).toBeNull();
      expect(success).toBe(true);
    });

    test("const in for...of with variable works", () => {
      const code = `
        let numbers = [1, 2, 3];
        let sum = 0;
        for (const num of numbers) {
          sum = sum + num;
        }
      `;
      const { error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
    });

    // Note: const reassignment in for...of loop body is a separate feature
    // and is tested in the const.test.ts file. Each iteration creates a
    // new const binding, so the current implementation doesn't enforce const
    // semantics within the for...of loop body yet.
  });

  describe("let in for...of loops works correctly", () => {
    test("let in for...of with array works", () => {
      const { error, success } = interpret("for (let item of [1, 2, 3]) { let x = item; }");
      expect(error).toBeNull();
      expect(success).toBe(true);
    });

    test("let in for...of allows reassignment in loop body", () => {
      const code = `
        let sum = 0;
        for (let item of [1, 2, 3]) {
          item = item * 2;
          sum = sum + item;
        }
      `;
      const { error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
    });
  });
});
