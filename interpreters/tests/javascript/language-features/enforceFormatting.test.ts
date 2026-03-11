import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";
import { SyntaxError, LintError } from "@javascript/error";

describe("JavaScript enforceFormatting feature", () => {
  describe("enforceFormatting: false (default)", () => {
    test("allows closing brace on same line as statement", () => {
      const code = `{ let x = 1; }`;
      const { error, lintErrors } = interpret(code);
      expect(error).toBeNull();
      expect(lintErrors).toHaveLength(0);
    });

    test("allows repeat without braces", () => {
      const code = `let x = 0; repeat(3) x = x + 1;`;
      const { error, lintErrors } = interpret(code);
      expect(error).toBeNull();
      expect(lintErrors).toHaveLength(0);
    });

    test("allows if without braces", () => {
      const code = `let x = 0; if (true) x = 1;`;
      const { error, lintErrors } = interpret(code);
      expect(error).toBeNull();
      expect(lintErrors).toHaveLength(0);
    });

    test("allows any indentation when enforceFormatting is off", () => {
      const code = `let x = 5;
          let y = 10;
  let z = x + y;`;
      const { frames, error, lintErrors } = interpret(code);
      expect(error).toBeNull();
      expect(lintErrors).toHaveLength(0);
      expect(frames).not.toHaveLength(0);
    });
  });

  describe("enforceFormatting: true", () => {
    const features = { enforceFormatting: true, oneStatementPerLine: true };

    describe("requires opening brace after control flow keywords (parse error)", () => {
      test("repeat without braces throws BlockRequired", () => {
        const code = `let x = 0;\nrepeat(3) x = x + 1;`;
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

    describe("lint warning: closing brace on its own line", () => {
      test("closing brace on same line as last statement produces lint warning", () => {
        const code = `let x = 0;\nrepeat(3) {\n  x = x + 1; }`;
        const { error, lintErrors, frames } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
        expect(lintErrors.length).toBeGreaterThanOrEqual(1);
        expect(lintErrors[0]).toBeInstanceOf(LintError);
        expect(lintErrors.some(e => e.type === "ClosingBraceNotOnOwnLine")).toBe(true);
      });

      test("closing brace on its own line is allowed", () => {
        const code = `
          let x = 0;
          repeat(3) {
            x = x + 1;
          }
        `;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors).toHaveLength(0);
      });

      test("if block with closing brace on same line produces lint warning", () => {
        const code = `let x = 0;\nif (true) {\n  x = 1; }`;
        const { error, lintErrors, frames } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
        expect(lintErrors.some(e => e.type === "ClosingBraceNotOnOwnLine")).toBe(true);
      });

      test("if block with closing brace on its own line is allowed", () => {
        const code = `
          let x = 0;
          if (true) {
            x = 1;
          }
        `;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors).toHaveLength(0);
      });

      test("function with closing brace on same line produces lint warning", () => {
        const code = `function foo() {\n  return 1; }`;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors.some(e => e.type === "ClosingBraceNotOnOwnLine")).toBe(true);
      });

      test("function with closing brace on its own line is allowed", () => {
        const code = `
          function foo() {
            return 1;
          }
        `;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors).toHaveLength(0);
      });

      test("empty block is allowed on one line", () => {
        const code = `
          repeat(3) {
          }
        `;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors).toHaveLength(0);
      });

      test("empty block {} is allowed", () => {
        const code = `
          repeat(3) {}
        `;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors).toHaveLength(0);
      });

      test("nested closing braces on same line produces lint warning", () => {
        const code = `
          if (true) {
            if (true) {
              let x = 1;
            } }
        `;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors.some(e => e.type === "ClosingBraceNotOnOwnLine")).toBe(true);
      });

      test("nested closing braces on separate lines is allowed", () => {
        const code = `
          if (true) {
            if (true) {
              let x = 1;
            }
          }
        `;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors).toHaveLength(0);
      });

      test("while with closing brace on same line produces lint warning", () => {
        const code = `let x = 0;\nwhile (x < 3) {\n  x = x + 1; }`;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors.some(e => e.type === "ClosingBraceNotOnOwnLine")).toBe(true);
      });

      test("for with closing brace on same line produces lint warning", () => {
        const code = `for (let i = 0; i < 3; i = i + 1) {\n  let x = i; }`;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors.some(e => e.type === "ClosingBraceNotOnOwnLine")).toBe(true);
      });
    });

    describe("lint warning: opening brace content on its own line", () => {
      test("repeat with body on same line as brace produces lint warning", () => {
        const code = `let x = 0;\nrepeat(3) { x = x + 1;\n}`;
        const { error, lintErrors, frames } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
        expect(lintErrors.length).toBeGreaterThanOrEqual(1);
        expect(lintErrors[0]).toBeInstanceOf(LintError);
        expect(lintErrors.some(e => e.type === "OpeningBraceContentNotOnOwnLine")).toBe(true);
      });

      test("if with body on same line as brace produces lint warning", () => {
        const code = `let x = 0;\nif (true) { x = 1;\n}`;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors.some(e => e.type === "OpeningBraceContentNotOnOwnLine")).toBe(true);
      });

      test("function with body on same line as brace produces lint warning", () => {
        const code = `function foo() { return 1;\n}`;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors.some(e => e.type === "OpeningBraceContentNotOnOwnLine")).toBe(true);
      });

      test("while with body on same line as brace produces lint warning", () => {
        const code = `let x = 0;\nwhile (x < 3) { x = x + 1;\n}`;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors.some(e => e.type === "OpeningBraceContentNotOnOwnLine")).toBe(true);
      });

      test("for with body on same line as brace produces lint warning", () => {
        const code = `for (let i = 0; i < 3; i = i + 1) { let x = i;\n}`;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors.some(e => e.type === "OpeningBraceContentNotOnOwnLine")).toBe(true);
      });

      test("empty block on same line is allowed", () => {
        const code = `
          repeat(3) {}
        `;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors).toHaveLength(0);
      });

      test("body on new line is allowed", () => {
        const code = `
          let x = 0;
          repeat(3) {
            x = x + 1;
          }
        `;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors).toHaveLength(0);
      });
    });

    describe("lint warnings work without semicolons", () => {
      test("closing brace on same line without semicolons produces lint warning", () => {
        const code = `let x = 0\nrepeat(3) {\n  x = x + 1 }`;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors.some(e => e.type === "ClosingBraceNotOnOwnLine")).toBe(true);
      });

      test("closing brace on own line without semicolons is allowed", () => {
        const code = `
          let x = 0
          repeat(3) {
            x = x + 1
          }
        `;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors).toHaveLength(0);
      });

      test("if block without semicolons and closing brace on same line produces lint warning", () => {
        const code = `let x = 0\nif (true) {\n  x = 1 }`;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors.some(e => e.type === "ClosingBraceNotOnOwnLine")).toBe(true);
      });

      test("if block without semicolons and closing brace on own line is allowed", () => {
        const code = `
          let x = 0
          if (true) {
            x = 1
          }
        `;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors).toHaveLength(0);
      });

      test("function without semicolons and closing brace on same line produces lint warning", () => {
        const code = `function foo() {\n  return 1 }`;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors.some(e => e.type === "ClosingBraceNotOnOwnLine")).toBe(true);
      });

      test("function without semicolons and closing brace on own line is allowed", () => {
        const code = `
          function foo() {
            return 1
          }
        `;
        const { error, lintErrors } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect(lintErrors).toHaveLength(0);
      });
    });

    describe("lint warnings work with requireSemicolons", () => {
      const featuresWithSemicolons = { enforceFormatting: true, oneStatementPerLine: true, requireSemicolons: true };

      test("closing brace on same line with semicolons produces lint warning", () => {
        const code = `let x = 0;\nrepeat(3) {\n  x = x + 1; }`;
        const { error, lintErrors } = interpret(code, { languageFeatures: featuresWithSemicolons });
        expect(error).toBeNull();
        expect(lintErrors.some(e => e.type === "ClosingBraceNotOnOwnLine")).toBe(true);
      });

      test("closing brace on own line with semicolons is allowed", () => {
        const code = `
          let x = 0;
          repeat(3) {
            x = x + 1;
          }
        `;
        const { error, lintErrors } = interpret(code, { languageFeatures: featuresWithSemicolons });
        expect(error).toBeNull();
        expect(lintErrors).toHaveLength(0);
      });
    });

    describe("lint warning: enforces 2-space indentation", () => {
      describe("correct indentation (should pass)", () => {
        test("top-level statements at consistent indentation", () => {
          const code = `let x = 5;
let y = 10;
let z = x + y;`;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
          const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
          expect(lastFrame.variables.z.value).toBe(15);
        });

        test("statements in if block at +2 spaces", () => {
          const code = `let x = 5;
if (x > 3) {
  let y = 10;
}`;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
        });

        test("statements in while block at +2 spaces", () => {
          const code = `let i = 0;
while (i < 3) {
  i = i + 1;
}`;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
          const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
          expect(lastFrame.variables.i.value).toBe(3);
        });

        test("statements in for block at +2 spaces", () => {
          const code = `let sum = 0;
for (let i = 0; i < 3; i = i + 1) {
  sum = sum + i;
}`;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
          const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
          expect(lastFrame.variables.sum.value).toBe(3);
        });

        test("statements in for...of block at +2 spaces", () => {
          const code = `let sum = 0;
for (let x of [1, 2, 3]) {
  sum = sum + x;
}`;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
          const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
          expect(lastFrame.variables.sum.value).toBe(6);
        });

        test("statements in repeat block at +2 spaces", () => {
          const code = `let count = 0;
repeat(3) {
  count = count + 1;
}`;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
          const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
          expect(lastFrame.variables.count.value).toBe(3);
        });

        test("function body at +2 spaces", () => {
          const code = `function add(a, b) {
  let result = a + b;
  return result;
}
let x = add(3, 4);`;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
          const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
          expect(lastFrame.variables.x.value).toBe(7);
        });

        test("if-else with proper indentation", () => {
          const code = `let result = 0;
if (true) {
  result = 1;
} else {
  result = 2;
}`;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
          const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
          expect(lastFrame.variables.result.value).toBe(1);
        });

        test("if / else if / else chain with proper indentation", () => {
          const code = `let x = 5;
let result = 0;
if (x > 10) {
  result = 1;
} else if (x > 3) {
  result = 2;
} else {
  result = 3;
}`;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
          const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
          expect(lastFrame.variables.result.value).toBe(2);
        });

        test("empty lines inside blocks are allowed", () => {
          const code = `if (true) {
  let x = 1;

  let y = 2;
}`;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
        });

        test("multiple statements in a block all at same indent", () => {
          const code = `if (true) {
  let a = 1;
  let b = 2;
  let c = 3;
}`;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
        });
      });

      describe("nesting tests", () => {
        test("nested if inside if at +4 spaces", () => {
          const code = `let x = 10;
if (x > 5) {
  if (x > 8) {
    let y = 1;
  }
}`;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
        });

        test("nested for inside for", () => {
          const code = `let total = 0;
for (let i = 0; i < 2; i = i + 1) {
  for (let j = 0; j < 3; j = j + 1) {
    total = total + 1;
  }
}`;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
          const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
          expect(lastFrame.variables.total.value).toBe(6);
        });

        test("nested while inside while", () => {
          const code = `let i = 0;
let total = 0;
while (i < 3) {
  let j = 0;
  while (j < 2) {
    total = total + 1;
    j = j + 1;
  }
  i = i + 1;
}`;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
          const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
          expect(lastFrame.variables.total.value).toBe(6);
        });

        test("triple nesting: for -> if -> while", () => {
          const code = `let count = 0;
for (let i = 0; i < 2; i = i + 1) {
  if (true) {
    let j = 0;
    while (j < 2) {
      count = count + 1;
      j = j + 1;
    }
  }
}`;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
          const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
          expect(lastFrame.variables.count.value).toBe(4);
        });

        test("break and continue at correct indentation inside nested loops", () => {
          const code = `let outer = 0;
let count = 0;
while (outer < 3) {
  let inner = 0;
  while (inner < 5) {
    if (inner === 2) {
      break;
    }
    count = count + 1;
    inner = inner + 1;
  }
  outer = outer + 1;
}`;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
          const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
          expect(lastFrame.variables.count.value).toBe(6);
        });

        test("statement after closing a nested block returns to correct outer level", () => {
          const code = `let x = 0;
if (true) {
  if (true) {
    x = 1;
  }
  x = x + 1;
}`;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
          const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
          expect(lastFrame.variables.x.value).toBe(2);
        });

        test("multiple blocks at same level", () => {
          const code = `let x = 0;
if (true) {
  x = x + 1;
}
if (true) {
  x = x + 1;
}`;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
          const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
          expect(lastFrame.variables.x.value).toBe(2);
        });

        test("function with nested if and loop", () => {
          const code = `function compute(n) {
  let result = 0;
  if (n > 0) {
    for (let i = 0; i < n; i = i + 1) {
      result = result + i;
    }
  }
  return result;
}
let x = compute(4);`;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
          const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
          expect(lastFrame.variables.x.value).toBe(6);
        });
      });

      describe("incorrect indentation (produces lint warnings)", () => {
        test("missing indentation: statement in if block at parent level", () => {
          const code = `if (true) {
let x = 1;
}`;
          const { error, lintErrors, frames } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(frames.length).toBeGreaterThan(0);
          expect(lintErrors).toHaveLength(1);
          expect(lintErrors[0]).toBeInstanceOf(LintError);
          expect(lintErrors[0].type).toBe("IncorrectIndentation");
        });

        test("missing indentation: statement in for block at parent level", () => {
          const code = `for (let i = 0; i < 3; i = i + 1) {
let x = i;
}`;
          const { error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors.length).toBeGreaterThanOrEqual(1);
          expect(lintErrors[0].type).toBe("IncorrectIndentation");
        });

        test("missing indentation: statement in while block at parent level", () => {
          const code = `let i = 0;
while (i < 3) {
i = i + 1;
}`;
          const { error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors.length).toBeGreaterThanOrEqual(1);
          expect(lintErrors[0].type).toBe("IncorrectIndentation");
        });

        test("missing indentation: statement in function body at parent level", () => {
          const code = `function foo() {
let x = 1;
}`;
          const { error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors.length).toBeGreaterThanOrEqual(1);
          expect(lintErrors[0].type).toBe("IncorrectIndentation");
        });

        test("wrong indentation amount: 3 spaces instead of 2", () => {
          const code = `if (true) {
   let x = 1;
}`;
          const { error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors.length).toBeGreaterThanOrEqual(1);
          expect(lintErrors[0].type).toBe("IncorrectIndentation");
        });

        test("over-indentation: 4 spaces when 2 expected", () => {
          const code = `if (true) {
    let x = 1;
}`;
          const { error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors.length).toBeGreaterThanOrEqual(1);
          expect(lintErrors[0].type).toBe("IncorrectIndentation");
        });

        test("inconsistent indentation within same block", () => {
          const code = `if (true) {
  let x = 1;
    let y = 2;
}`;
          const { error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors.length).toBeGreaterThanOrEqual(1);
          expect(lintErrors[0].type).toBe("IncorrectIndentation");
        });

        test("closing brace at wrong column (indented)", () => {
          const code = `if (true) {
  let x = 1;
  }`;
          const { error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors.length).toBeGreaterThanOrEqual(1);
          expect(lintErrors[0].type).toBe("IncorrectIndentation");
        });

        test("nested block contents at wrong level (2 instead of 4 at depth 2)", () => {
          const code = `if (true) {
  if (true) {
  let x = 1;
  }
}`;
          const { error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors.length).toBeGreaterThanOrEqual(1);
          expect(lintErrors[0].type).toBe("IncorrectIndentation");
        });

        test("statement after closing block at wrong level", () => {
          const code = `let x = 0;
if (true) {
  x = 1;
}
  x = 2;`;
          const { error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors.length).toBeGreaterThanOrEqual(1);
          expect(lintErrors[0].type).toBe("IncorrectIndentation");
        });

        test("top-level statements at inconsistent indentation", () => {
          const code = `let x = 1;
  let y = 2;`;
          const { error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors.length).toBeGreaterThanOrEqual(1);
          expect(lintErrors[0].type).toBe("IncorrectIndentation");
        });
      });

      describe("edge cases", () => {
        test("empty block has no indentation error", () => {
          const code = `if (true) {
}`;
          const { error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
        });

        test("indentation works with template literal base offset", () => {
          const code = `
            let x = 5;
            if (x > 3) {
              let y = 10;
            }
          `;
          const { frames, error, lintErrors } = interpret(code, { languageFeatures: features });
          expect(error).toBeNull();
          expect(lintErrors).toHaveLength(0);
        });
      });
    });

    describe("lint error locations", () => {
      test("IncorrectIndentation location covers the whitespace before the token", () => {
        const code = `repeat(60) {\n   roll()\n}`;
        const { error, lintErrors } = interpret(code, {
          languageFeatures: features,
          externalFunctions: [{ name: "roll", func: () => {}, description: "roll" }],
        });
        expect(error).toBeNull();
        const indentError = lintErrors.find(e => e.type === "IncorrectIndentation");
        expect(indentError).toBeDefined();
        // 3 spaces of indentation: relative span should be from col 1 to col 4
        expect(indentError!.location.line).toBe(2);
        expect(indentError!.location.relative.begin).toBe(1);
        expect(indentError!.location.relative.end).toBe(4);
      });

      test("OpeningBraceContentNotOnOwnLine location covers the content after the brace", () => {
        const code = `repeat(60) { roll()\n}`;
        const { error, lintErrors } = interpret(code, {
          languageFeatures: features,
          externalFunctions: [{ name: "roll", func: () => {}, description: "roll" }],
        });
        expect(error).toBeNull();
        // Should only produce one lint error, not a spurious indentation error
        expect(lintErrors).toHaveLength(1);
        expect(lintErrors[0].type).toBe("OpeningBraceContentNotOnOwnLine");
        // Location should point at "roll", not at "{"
        expect(lintErrors[0].location.line).toBe(1);
        expect(lintErrors[0].location.relative.begin).toBe(14);
      });
    });
  });
});
