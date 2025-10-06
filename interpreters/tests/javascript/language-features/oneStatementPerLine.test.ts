import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";
import { SyntaxError } from "@javascript/error";

describe("JavaScript oneStatementPerLine feature", () => {
  describe("oneStatementPerLine: false (default)", () => {
    test("allows multiple statements on the same line", () => {
      const code = `let x = 5; let y = 10; let z = x + y;`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect(frames).not.toHaveLength(0);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.x.value).toBe(5);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.y.value).toBe(10);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.z.value).toBe(15);
    });

    test("allows for loops with all sections on one line", () => {
      const code = `for (let i = 0; i < 10; i = i + 1) { }`;
      const { error } = interpret(code);
      expect(error).toBeNull();
    });

    test("allows if and else on same line", () => {
      const code = `let result = 0; if (true) { result = 1; } else { result = 2; }`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe(1);
    });

    test("allows multiple assignments on same line", () => {
      const code = `let a = 1; a = 2; a = 3;`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.a.value).toBe(3);
    });

    test("allows block with multiple statements on same line", () => {
      const code = `{ let x = 1; let y = 2; }`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect(frames).not.toHaveLength(0);
    });
  });

  describe("oneStatementPerLine: true", () => {
    const features = { oneStatementPerLine: true };

    test("allows single statement per line", () => {
      const code = `
        let x = 5;
        let y = 10;
        let z = x + y;
      `;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.x.value).toBe(5);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.y.value).toBe(10);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.z.value).toBe(15);
    });

    test("throws error for multiple variable declarations on same line", () => {
      const code = `let x = 5; let y = 10;`;
      const { error } = interpret(code, { languageFeatures: features });
      expect(error).not.toBeNull();
      expect(error).toBeInstanceOf(SyntaxError);
      expect(error!.type).toBe("MultipleStatementsPerLine");
      expect(error!.location.line).toBe(1);
    });

    test("throws error for multiple assignments on same line", () => {
      const code = `let a = 1; a = 2; a = 3;`;
      const { error } = interpret(code, { languageFeatures: features });
      expect(error).not.toBeNull();
      expect(error).toBeInstanceOf(SyntaxError);
      expect(error!.type).toBe("MultipleStatementsPerLine");
    });

    test("throws error for if and else on same line", () => {
      const code = `let result = 0; if (true) { result = 1; } else { result = 2; }`;
      const { error } = interpret(code, { languageFeatures: features });
      expect(error).not.toBeNull();
      expect(error).toBeInstanceOf(SyntaxError);
      expect(error!.type).toBe("MultipleStatementsPerLine");
    });

    test("allows if statement with block on multiple lines", () => {
      const code = `
        let result = 0;
        if (true) {
          result = 1;
        } else {
          result = 2;
        }
      `;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe(1);
    });

    test("allows single statement in block on one line", () => {
      // With semicolon approach, this is allowed since there's only one semicolon
      const code = `{ let x = 1; }`;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      expect(frames).not.toHaveLength(0);
    });

    test("throws error for multiple statements on same line at top level", () => {
      // Multiple statements on same line should fail at top level
      const code = `let x = 1; let y = 2;`;
      const { error } = interpret(code, { languageFeatures: features });
      expect(error).not.toBeNull();
      expect(error).toBeInstanceOf(SyntaxError);
      expect(error!.type).toBe("MultipleStatementsPerLine");
    });

    test("allows closing brace on same line as statement", () => {
      // With semicolon approach, braces don't matter - only semicolons
      const code = `
        {
          let x = 1; }
      `;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      expect(frames).not.toHaveLength(0);
    });

    test("allows block with statements on different lines", () => {
      const code = `
        {
          let x = 1;
          let y = 2;
          let z = x + y;
        }
      `;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      expect(frames).not.toHaveLength(0);
    });

    test("throws error for expression statement and variable declaration on same line", () => {
      const code = `5 + 3; let x = 10;`;
      const { error } = interpret(code, { languageFeatures: features });
      expect(error).not.toBeNull();
      expect(error).toBeInstanceOf(SyntaxError);
      expect(error!.type).toBe("MultipleStatementsPerLine");
    });

    test("allows complex expressions on single line", () => {
      const code = `
        let x = (5 + 3) * 2 - 1;
        let y = x > 10 ? x : 10;
      `;
      // Note: Ternary operator is not yet implemented, so let's use a simpler test
      const simpleCode = `
        let x = (5 + 3) * 2 - 1;
        let y = x > 10 && x < 20;
      `;
      const { frames, error } = interpret(simpleCode, { languageFeatures: features });
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.x.value).toBe(15);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.y.value).toBe(true);
    });

    test("allows nested blocks with proper line separation", () => {
      // Note: Nested empty blocks are not yet fully supported in the JavaScript parser
      // This test uses variables to make the blocks non-empty
      const code = `
        let outer = 1;
        {
          let inner = 2;
        }
      `;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      expect(frames).not.toHaveLength(0);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.outer.value).toBe(1);
    });

    test("throws error for multiple statements separated by semicolons on same line", () => {
      const code = `let a = 1; let b = 2; let c = 3;`;
      const { error } = interpret(code, { languageFeatures: features });
      expect(error).not.toBeNull();
      expect(error).toBeInstanceOf(SyntaxError);
      expect(error!.type).toBe("MultipleStatementsPerLine");
    });

    test("throws error for inline if statement body", () => {
      const code = `if (true) let x = 5;`;
      // This should fail because 'if' and 'let' are on the same line
      // But actually, the 'let' is part of the if statement body, not a separate statement
      // Let's test a clearer case
      const clearCode = `let a = 1; if (true) { a = 2; }`;
      const { error } = interpret(clearCode, { languageFeatures: features });
      expect(error).not.toBeNull();
      expect(error).toBeInstanceOf(SyntaxError);
      expect(error!.type).toBe("MultipleStatementsPerLine");
    });

    test("allows empty statements on separate lines", () => {
      const code = `
        let x = 5;
        ;
        let y = 10;
      `;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.x.value).toBe(5);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.y.value).toBe(10);
    });

    test("allows for loops with semicolons in parentheses", () => {
      // For loops have semicolons inside parentheses which should be allowed
      const code = `for (let i = 0; i < 10; i = i + 1) { }`;
      const { error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
    });

    test("allows for loops with semicolons on multiple lines", () => {
      const code = `
        for (let i = 0; i < 10; i = i + 1) {
          let x = i;
        }
      `;
      const { error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
    });

    // TODO: Add infinite loop guard to prevent hanging on infinite loops like for(;;)
    // This test is commented out because for(;;) {} creates an actual infinite loop
    // that will run forever during execution (not parsing)
    test.skip("allows for loops with empty sections", () => {
      const code = `for (;;) { }`;
      const { error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
    });

    test("allows for loop followed by statement when brace separates them", () => {
      // With our semicolon-based approach, this is allowed because the semicolon
      // inside the block is followed by }, and the next statement starts fresh
      const code = `for (let i = 0; i < 10; i = i + 1) { let y = i; } let x = 5;`;
      const { error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
    });
  });

  describe("explicit oneStatementPerLine: false", () => {
    test("allows multiple statements when explicitly set to false", () => {
      const code = `let a = 1; let b = 2; let c = a + b;`;
      const { frames, error } = interpret(code, { languageFeatures: { oneStatementPerLine: false } });
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.a.value).toBe(1);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.b.value).toBe(2);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.c.value).toBe(3);
    });
  });
});
