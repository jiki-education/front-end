import { interpret } from "@javascript/interpreter";
import { SyntaxError } from "@javascript/error";

describe("Footgun #16: Assignment in conditional (if (x = 5))", () => {
  // In real JS: if (x = 5) assigns 5 to x, then checks truthiness (always true)
  // A beginner writing if (x = 5) almost certainly meant if (x === 5)
  // Jiki blocks assignment anywhere other than a complete statement (or a
  // for-loop init/update), so these are reported as syntax errors.

  test("assignment in if condition is blocked", () => {
    const { error, frames } = interpret("let x = 0; if (x = 5) { let y = 1 }");
    expect(error).toBeInstanceOf(SyntaxError);
    expect(error?.type).toBe("AssignmentInExpression");
    expect(frames).toHaveLength(0);
  });

  test("assignment in while condition is blocked", () => {
    const { error } = interpret("let x = 0; while (x = 1) { break }");
    expect(error).toBeInstanceOf(SyntaxError);
    expect(error?.type).toBe("AssignmentInExpression");
  });

  test("comparison in if condition is still allowed", () => {
    const { error } = interpret("let x = 5; if (x === 5) { let y = 1 }");
    expect(error).toBeNull();
  });

  test("assignment as a complete statement is still allowed", () => {
    const { error } = interpret("let x = 0; x = 5;");
    expect(error).toBeNull();
  });

  test("assignment in a function argument is blocked", () => {
    const { error } = interpret("let x = 0; console.log(x = 5);");
    expect(error).toBeInstanceOf(SyntaxError);
    expect(error?.type).toBe("AssignmentInExpression");
  });

  test("assignment in a variable initializer is blocked", () => {
    const { error } = interpret("let x = 0; let y = (x = 5);");
    expect(error).toBeInstanceOf(SyntaxError);
    expect(error?.type).toBe("AssignmentInExpression");
  });

  test("chained assignment is blocked", () => {
    const { error } = interpret("let x = 0; let y = 0; x = y = 5;");
    expect(error).toBeInstanceOf(SyntaxError);
    expect(error?.type).toBe("AssignmentInExpression");
  });

  test("assignment in for-loop update is still allowed", () => {
    const { error } = interpret("for (let i = 0; i < 3; i = i + 1) { let y = i }");
    expect(error).toBeNull();
  });

  test("assignment in for-loop init requires let", () => {
    const { error } = interpret("let i = 0; for (i = 0; i < 3; i = i + 1) { let y = i }");
    expect(error).toBeInstanceOf(SyntaxError);
    expect(error?.type).toBe("MissingLetInForLoopInit");
  });
});
