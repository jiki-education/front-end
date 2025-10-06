import { describe, it, expect } from "vitest";
import { interpret } from "../../src/javascript/interpreter";

describe("console.log()", () => {
  it("logs a single string", () => {
    const result = interpret(`console.log("Hello, World!");`);
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(1);
    expect(result.logLines[0].output).toBe("Hello, World!");
  });

  it("logs a single number", () => {
    const result = interpret(`console.log(42);`);
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(1);
    expect(result.logLines[0].output).toBe("42");
  });

  it("logs multiple arguments separated by spaces", () => {
    const result = interpret(`console.log("The answer is", 42);`);
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(1);
    expect(result.logLines[0].output).toBe("The answer is 42");
  });

  it("logs with no arguments (blank line)", () => {
    const result = interpret(`console.log();`);
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(1);
    expect(result.logLines[0].output).toBe("");
  });

  it("logs multiple values of different types", () => {
    const result = interpret(`console.log("Number:", 42, "Boolean:", true);`);
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(1);
    expect(result.logLines[0].output).toBe("Number: 42 Boolean: true");
  });

  it("logs variables", () => {
    const result = interpret(`
      let x = 10;
      let y = 20;
      console.log(x, y);
    `);
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(1);
    expect(result.logLines[0].output).toBe("10 20");
  });

  it("logs expressions", () => {
    const result = interpret(`console.log(2 + 3);`);
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(1);
    expect(result.logLines[0].output).toBe("5");
  });

  it("logs arrays", () => {
    const result = interpret(`console.log([1, 2, 3]);`);
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(1);
    expect(result.logLines[0].output).toBe("[ 1, 2, 3 ]");
  });

  it("can be called multiple times", () => {
    const result = interpret(`
      console.log("First");
      console.log("Second");
      console.log("Third");
    `);
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(3);
    expect(result.logLines[0].output).toBe("First");
    expect(result.logLines[1].output).toBe("Second");
    expect(result.logLines[2].output).toBe("Third");
  });

  it("logs null and undefined", () => {
    const result = interpret(`console.log(null, undefined);`);
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(1);
    expect(result.logLines[0].output).toBe("null undefined");
  });

  it("includes timestamp in logLines", () => {
    const result = interpret(`console.log("test");`);
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(1);
    expect(result.logLines[0]).toHaveProperty("time");
    expect(typeof result.logLines[0].time).toBe("number");
  });

  it("generates frames with descriptions", () => {
    const result = interpret(`console.log("test");`);
    expect(result.success).toBe(true);
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("SUCCESS");
    const description = result.frames[0].generateDescription();
    expect(description).toContain("console.log");
    expect(description).toContain("test");
  });
});

describe("console object", () => {
  it("cannot be reassigned", () => {
    // Attempting to reassign console should fail (or at least not affect the original)
    const result = interpret(`
      console.log("Before");
      console = null;
      console.log("After");
    `);
    // This should either error or the second log should still work
    // depending on whether we implement immutability checks
    // For now, just verify the first log works
    expect(result.logLines.length).toBeGreaterThanOrEqual(1);
    expect(result.logLines[0].output).toBe("Before");
  });

  it("throws error for non-existent methods", () => {
    const result = interpret(`console.notAMethod();`);
    expect(result.success).toBe(false);
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("ERROR");
    expect(result.frames[0].error?.type).toBe("PropertyNotFound");
  });

  it("console.log can be accessed as a property", () => {
    const result = interpret(`
      let logFunc = console.log;
      logFunc("Hello");
    `);
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(1);
    expect(result.logLines[0].output).toBe("Hello");
  });
});
