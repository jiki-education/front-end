import { interpret } from "@javascript/interpreter";
import { SyntaxError } from "@javascript/error";

describe("JavaScript enforceFormatting feature", () => {
  describe("enforceFormatting: false (default)", () => {
    test("allows closing brace on same line as statement", () => {
      const code = `{ let x = 1; }`;
      const { error } = interpret(code);
      expect(error).toBeNull();
    });

    test("allows repeat without braces", () => {
      const code = `let x = 0; repeat(3) x = x + 1;`;
      const { error } = interpret(code);
      expect(error).toBeNull();
    });

    test("allows if without braces", () => {
      const code = `let x = 0; if (true) x = 1;`;
      const { error } = interpret(code);
      expect(error).toBeNull();
    });
  });

  describe("enforceFormatting: true", () => {
    const features = { enforceFormatting: true };

    describe("requires opening brace after control flow keywords", () => {
      test("repeat without braces throws BlockRequired", () => {
        const code = `let x = 0; repeat(3) x = x + 1;`;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error!.type).toBe("BlockRequired");
      });

      test("if without braces throws BlockRequired", () => {
        const code = `let x = 0;\nif (true) x = 1;`;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error!.type).toBe("BlockRequired");
      });

      test("else without braces throws BlockRequired", () => {
        const code = `let x = 0;\nif (true) {\n  x = 1;\n} else x = 2;`;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error!.type).toBe("BlockRequired");
      });

      test("else if is allowed without braces directly after else", () => {
        const code = `
          let x = 0;
          if (false) {
            x = 1;
          } else if (true) {
            x = 2;
          }
        `;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
      });

      test("while without braces throws BlockRequired", () => {
        const code = `let x = 0;\nwhile (false) x = 1;`;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error!.type).toBe("BlockRequired");
      });

      test("for without braces throws BlockRequired", () => {
        const code = `for (let i = 0; i < 3; i = i + 1) let x = i;`;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error!.type).toBe("BlockRequired");
      });

      test("for...of without braces throws BlockRequired", () => {
        const code = `let arr = [1, 2];\nfor (let x of arr) let y = x;`;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error!.type).toBe("BlockRequired");
      });

      test("repeat with braces is allowed", () => {
        const code = `
          let x = 0;
          repeat(3) {
            x = x + 1;
          }
        `;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
      });

      test("if with braces is allowed", () => {
        const code = `
          let x = 0;
          if (true) {
            x = 1;
          }
        `;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
      });
    });

    describe("requires closing brace on its own line", () => {
      test("repeat all on one line throws ClosingBraceNotOnOwnLine", () => {
        const code = `let x = 0; repeat(3) { x = x + 1; }`;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error!.type).toBe("ClosingBraceNotOnOwnLine");
      });

      test("closing brace on same line as last statement throws error", () => {
        const code = `let x = 0;\nrepeat(3) {\n  x = x + 1; }`;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error!.type).toBe("ClosingBraceNotOnOwnLine");
      });

      test("closing brace on its own line is allowed", () => {
        const code = `
          let x = 0;
          repeat(3) {
            x = x + 1;
          }
        `;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
      });

      test("if block with closing brace on same line throws error", () => {
        const code = `let x = 0;\nif (true) {\n  x = 1; }`;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error!.type).toBe("ClosingBraceNotOnOwnLine");
      });

      test("if block with closing brace on its own line is allowed", () => {
        const code = `
          let x = 0;
          if (true) {
            x = 1;
          }
        `;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
      });

      test("function with closing brace on same line throws error", () => {
        const code = `function foo() { return 1; }`;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error!.type).toBe("ClosingBraceNotOnOwnLine");
      });

      test("function with closing brace on its own line is allowed", () => {
        const code = `
          function foo() {
            return 1;
          }
        `;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
      });

      test("empty block is allowed on one line", () => {
        const code = `
          repeat(3) {
          }
        `;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
      });

      test("empty block {} is allowed", () => {
        const code = `
          repeat(3) {}
        `;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
      });

      test("nested closing braces on same line throws error", () => {
        const code = `
          if (true) {
            if (true) {
              let x = 1;
            } }
        `;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error!.type).toBe("ClosingBraceNotOnOwnLine");
      });

      test("nested closing braces on separate lines is allowed", () => {
        const code = `
          if (true) {
            if (true) {
              let x = 1;
            }
          }
        `;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
      });

      test("while with closing brace on same line throws error", () => {
        const code = `let x = 0;\nwhile (x < 3) {\n  x = x + 1; }`;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error!.type).toBe("ClosingBraceNotOnOwnLine");
      });

      test("for with closing brace on same line throws error", () => {
        const code = `for (let i = 0; i < 3; i = i + 1) {\n  let x = i; }`;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error!.type).toBe("ClosingBraceNotOnOwnLine");
      });
    });

    describe("works without semicolons", () => {
      test("closing brace on same line without semicolons throws error", () => {
        const code = `let x = 0\nrepeat(3) {\n  x = x + 1 }`;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error!.type).toBe("ClosingBraceNotOnOwnLine");
      });

      test("closing brace on own line without semicolons is allowed", () => {
        const code = `
          let x = 0
          repeat(3) {
            x = x + 1
          }
        `;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
      });

      test("if block without semicolons and closing brace on same line throws error", () => {
        const code = `let x = 0\nif (true) {\n  x = 1 }`;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error!.type).toBe("ClosingBraceNotOnOwnLine");
      });

      test("if block without semicolons and closing brace on own line is allowed", () => {
        const code = `
          let x = 0
          if (true) {
            x = 1
          }
        `;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
      });

      test("function without semicolons and closing brace on same line throws error", () => {
        const code = `function foo() { return 1 }`;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error!.type).toBe("ClosingBraceNotOnOwnLine");
      });

      test("function without semicolons and closing brace on own line is allowed", () => {
        const code = `
          function foo() {
            return 1
          }
        `;
        const { error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
      });
    });

    describe("works with requireSemicolons", () => {
      const featuresWithSemicolons = { enforceFormatting: true, requireSemicolons: true };

      test("closing brace on same line with semicolons throws error", () => {
        const code = `let x = 0;\nrepeat(3) {\n  x = x + 1; }`;
        const { error } = interpret(code, { languageFeatures: featuresWithSemicolons });
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error!.type).toBe("ClosingBraceNotOnOwnLine");
      });

      test("closing brace on own line with semicolons is allowed", () => {
        const code = `
          let x = 0;
          repeat(3) {
            x = x + 1;
          }
        `;
        const { error } = interpret(code, { languageFeatures: featuresWithSemicolons });
        expect(error).toBeNull();
      });
    });
  });
});
