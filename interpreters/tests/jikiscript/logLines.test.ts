import { test, expect, describe } from "vitest";
import { interpret } from "@jikiscript/interpreter";
import * as Jiki from "@jikiscript/jikiObjects";

describe("logLines", () => {
  test("log statement adds to logLines with string", () => {
    const result = interpret('log "Hello, World!"');
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(1);
    expect(result.logLines[0].output).toBe('"Hello, World!"');
    expect(result.logLines[0].time).toBe(0);
  });

  test("log statement adds to logLines with number", () => {
    const result = interpret("log 42");
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(1);
    expect(result.logLines[0].output).toBe("42");
  });

  test("log statement adds to logLines with boolean", () => {
    const result = interpret("log true");
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(1);
    expect(result.logLines[0].output).toBe("true");
  });

  test("log statement adds to logLines with variable", () => {
    const result = interpret(`
      set name to "Jeremy"
      log name
    `);
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(1);
    expect(result.logLines[0].output).toBe('"Jeremy"');
    expect(result.logLines[0].time).toBe(1);
  });

  test("multiple log statements add multiple entries to logLines", () => {
    const result = interpret(`
      log "First"
      log "Second"
      log "Third"
    `);
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(3);
    expect(result.logLines[0].output).toBe('"First"');
    expect(result.logLines[0].time).toBe(0);
    expect(result.logLines[1].output).toBe('"Second"');
    expect(result.logLines[1].time).toBe(1);
    expect(result.logLines[2].output).toBe('"Third"');
    expect(result.logLines[2].time).toBe(2);
  });

  test("log statement with expression adds to logLines", () => {
    const result = interpret("log 2 + 3");
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(1);
    expect(result.logLines[0].output).toBe("5");
  });

  test("log statement with list adds to logLines", () => {
    const result = interpret("log [1, 2, 3]");
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(1);
    expect(result.logLines[0].output).toBe("[ 1, 2, 3 ]");
  });

  test("logLines is empty when no log statements", () => {
    const result = interpret("set x to 1");
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(0);
  });

  test("log statement time property has correct type", () => {
    const result = interpret('log "test"');
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(1);
    expect(result.logLines[0]).toHaveProperty("time");
    expect(typeof result.logLines[0].time).toBe("number");
  });
});
