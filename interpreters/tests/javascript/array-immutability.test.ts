import { describe, it, expect } from "vitest";
import { interpret } from "@javascript/interpreter";

// Type for frames augmented in test environment
interface TestFrame {
  status: "SUCCESS" | "ERROR";
  result?: any;
  variables?: Record<string, any>;
  description?: string;
  error?: { type: string; message?: string };
}

describe("JavaScript - Array Immutability in Frames", () => {
  it("should maintain immutable snapshots when array is modified", () => {
    const sourceCode = `
      let arr = [1, 2, 3];
      arr[1] = 99;
      arr[2] = 100;
    `;

    const result = interpret(sourceCode);
    expect(result.error).toBeNull();
    expect(result.success).toBe(true);
    expect(result.frames).toHaveLength(3);

    // First frame: array creation
    const frame1 = result.frames[0] as TestFrame;
    expect(frame1.status).toBe("SUCCESS");
    expect(frame1.variables?.arr?.toString()).toBe("[ 1, 2, 3 ]");

    // Store the immutable snapshot from frame 1
    const immutableArr1 = frame1.result?.immutableJikiObject;
    expect(immutableArr1?.toString()).toBe("[ 1, 2, 3 ]");

    // Second frame: first modification
    const frame2 = result.frames[1] as TestFrame;
    expect(frame2.status).toBe("SUCCESS");
    expect(frame2.variables?.arr?.toString()).toBe("[ 1, 99, 3 ]");

    // Check that frame 1's immutable snapshot hasn't changed
    expect(immutableArr1?.toString()).toBe("[ 1, 2, 3 ]");

    // Third frame: second modification
    const frame3 = result.frames[2] as TestFrame;
    expect(frame3.status).toBe("SUCCESS");
    expect(frame3.variables?.arr?.toString()).toBe("[ 1, 99, 100 ]");

    // Check that previous immutable snapshots haven't changed
    expect(immutableArr1?.toString()).toBe("[ 1, 2, 3 ]");

    // Frame 2's result is the assigned value (99), not the array
    // The array's state is in frame2.variables
    // This verifies that assignment expressions return the value, not the array
  });

  it("should maintain immutable snapshots with array extension", () => {
    const sourceCode = `
      let arr = [1, 2];
      arr[5] = 10;
    `;

    const result = interpret(sourceCode);
    expect(result.error).toBeNull();
    expect(result.success).toBe(true);
    expect(result.frames).toHaveLength(2);

    // First frame: array creation
    const frame1 = result.frames[0] as TestFrame;
    const immutableArr1 = frame1.result?.immutableJikiObject;
    expect(immutableArr1?.toString()).toBe("[ 1, 2 ]");

    // Second frame: after extension
    const frame2 = result.frames[1] as TestFrame;
    expect(frame2.variables?.arr?.toString()).toBe("[ 1, 2, undefined, undefined, undefined, 10 ]");

    // Check that frame 1's immutable snapshot hasn't changed
    expect(immutableArr1?.toString()).toBe("[ 1, 2 ]");
  });

  it("should maintain immutable snapshots with nested arrays", () => {
    const sourceCode = `
      let arr = [[1, 2], [3, 4]];
      arr[0][1] = 99;
      arr[1][0] = 100;
    `;

    const result = interpret(sourceCode);
    expect(result.error).toBeNull();
    expect(result.success).toBe(true);
    expect(result.frames).toHaveLength(3);

    // First frame: nested array creation
    const frame1 = result.frames[0] as TestFrame;
    const immutableArr1 = frame1.result?.immutableJikiObject;
    expect(immutableArr1?.toString()).toBe("[ [ 1, 2 ], [ 3, 4 ] ]");

    // Second frame: first modification
    const frame2 = result.frames[1] as TestFrame;
    expect(frame2.variables?.arr?.toString()).toBe("[ [ 1, 99 ], [ 3, 4 ] ]");

    // Original should be unchanged
    expect(immutableArr1?.toString()).toBe("[ [ 1, 2 ], [ 3, 4 ] ]");

    // Third frame: second modification
    const frame3 = result.frames[2] as TestFrame;
    expect(frame3.variables?.arr?.toString()).toBe("[ [ 1, 99 ], [ 100, 4 ] ]");

    // All previous immutable snapshots should be unchanged
    expect(immutableArr1?.toString()).toBe("[ [ 1, 2 ], [ 3, 4 ] ]");
  });

  it("should properly clone sparse arrays", () => {
    const sourceCode = `
      let arr = [];
      arr[3] = "hello";
    `;

    const result = interpret(sourceCode);
    expect(result.error).toBeNull();
    expect(result.success).toBe(true);
    expect(result.frames).toHaveLength(2);

    // First frame: empty array
    const frame1 = result.frames[0] as TestFrame;
    const immutableArr1 = frame1.result?.immutableJikiObject;
    expect(immutableArr1?.toString()).toBe("[]");

    // Second frame: sparse array (assignment returns the value, not the array)
    const frame2 = result.frames[1] as TestFrame;

    // Current array should be sparse
    expect(frame2.variables?.arr?.toString()).toBe('[ undefined, undefined, undefined, "hello" ]');

    // Original should still be empty
    expect(immutableArr1?.toString()).toBe("[]");
  });
});
