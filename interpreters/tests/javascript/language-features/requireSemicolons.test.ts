import { interpret } from "@javascript/interpreter";
import { JSUndefined } from "@javascript/jsObjects";

describe("requireSemicolons language feature", () => {
  describe("when requireSemicolons is true (default)", () => {
    test("requires semicolons after statements", () => {
      const result = interpret("let x = 1");
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe("MissingSemicolon");
    });

    test("requires semicolons after expression statements", () => {
      const result = interpret("1 + 2");
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe("MissingSemicolon");
    });

    test("requires semicolons between statements on different lines", () => {
      const result = interpret("let x = 1\nlet y = 2");
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe("MissingSemicolon");
    });

    test("allows code with semicolons", () => {
      const result = interpret("let x = 1;");
      expect(result.success).toBe(true);
      expect(result.frames).toBeArrayOfSize(1);
    });
  });

  describe("when requireSemicolons is false", () => {
    const context = { languageFeatures: { requireSemicolons: false } };

    test("allows statements without semicolons at end of file", () => {
      const result = interpret("let x = 1", context);
      expect(result.success).toBe(true);
      expect(result.frames).toBeArrayOfSize(1);
    });

    test("allows expression statements without semicolons at end of file", () => {
      const result = interpret("1 + 2", context);
      expect(result.success).toBe(true);
      expect(result.frames).toBeArrayOfSize(1);
    });

    test("allows multiple statements on separate lines without semicolons", () => {
      const result = interpret(
        `let x = 1
let y = 2
let z = x + y`,
        context
      );
      expect(result.success).toBe(true);
      expect(result.frames).toBeArrayOfSize(3);
    });

    test("allows function calls without semicolons on separate lines", () => {
      const externalFunctions = [
        {
          name: "move",
          arity: 0,
          func: () => new JSUndefined(), // External functions must return a JikiObject
          description: "moves the character",
        },
      ];

      const result = interpret(
        `move()
move()`,
        { ...context, externalFunctions }
      );
      expect(result.success).toBe(true);
      expect(result.frames).toBeArrayOfSize(2);
    });

    test("allows mixed: some statements with semicolons, some without", () => {
      const result = interpret(
        `let x = 1;
let y = 2
let z = 3;`,
        context
      );
      expect(result.success).toBe(true);
      expect(result.frames).toBeArrayOfSize(3);
    });

    test("allows return statements without semicolons", () => {
      const result = interpret(
        `function test() {
  return 42
}
test()`,
        context
      );
      expect(result.success).toBe(true);
    });

    test("allows break statements without semicolons", () => {
      const result = interpret(
        `let i = 0
while (i < 10) {
  i = i + 1
  if (i === 5) {
    break
  }
}`,
        context
      );
      expect(result.success).toBe(true);
    });

    test("allows continue statements without semicolons", () => {
      const result = interpret(
        `let sum = 0
for (let i = 0; i < 5; i = i + 1) {
  if (i === 2) {
    continue
  }
  sum = sum + i
}`,
        context
      );
      expect(result.success).toBe(true);
    });

    test("allows statements before closing brace without semicolons", () => {
      const result = interpret(
        `if (true) {
  let x = 1
}`,
        context
      );
      expect(result.success).toBe(true);
      // The if statement and variable declaration each create a frame
      expect(result.frames.length).toBeGreaterThanOrEqual(1);
    });

    test("allows nested blocks without semicolons", () => {
      const result = interpret(
        `{
  let x = 1
  {
    let y = 2
  }
}`,
        context
      );
      expect(result.success).toBe(true);
      expect(result.frames).toBeArrayOfSize(2);
    });

    test("still requires semicolons when statements are on the same line", () => {
      const result = interpret("let x = 1 let y = 2", context);
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe("MissingSemicolon");
    });

    test("allows semicolons when provided", () => {
      const result = interpret("let x = 1;", context);
      expect(result.success).toBe(true);
      expect(result.frames).toBeArrayOfSize(1);
    });

    test("works with if statements without semicolons", () => {
      const result = interpret(
        `let x = 5
if (x > 3) {
  x = x + 1
}`,
        context
      );
      expect(result.success).toBe(true);
    });

    test("works with while loops without semicolons", () => {
      const result = interpret(
        `let i = 0
while (i < 3) {
  i = i + 1
}`,
        context
      );
      expect(result.success).toBe(true);
    });

    test("works with for loops without semicolons", () => {
      const result = interpret(
        `let sum = 0
for (let i = 0; i < 3; i = i + 1) {
  sum = sum + i
}`,
        context
      );
      expect(result.success).toBe(true);
    });
  });

  describe("when requireSemicolons is explicitly true", () => {
    const context = { languageFeatures: { requireSemicolons: true } };

    test("requires semicolons after statements", () => {
      const result = interpret("let x = 1", context);
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe("MissingSemicolon");
    });

    test("allows code with semicolons", () => {
      const result = interpret("let x = 1;", context);
      expect(result.success).toBe(true);
      expect(result.frames).toBeArrayOfSize(1);
    });
  });
});
