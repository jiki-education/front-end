import { getBreakpointLines } from "@/components/coding-exercise/ui/codemirror/utils/getBreakpointLines";
import type { EditorView } from "@codemirror/view";
import { breakpointState } from "@/components/coding-exercise/ui/codemirror/extensions/breakpoint";

// Mock the breakpoint extension
jest.mock("@/components/coding-exercise/ui/codemirror/extensions/breakpoint", () => ({
  breakpointState: Symbol("breakpointState")
}));

describe("getBreakpointLines", () => {
  let mockView: Partial<EditorView>;
  let mockBreakpoints: any;

  beforeEach(() => {
    mockBreakpoints = {
      between: jest.fn()
    };

    mockView = {
      state: {
        doc: {
          length: 1000,
          lineAt: jest.fn((pos: number) => ({
            number: Math.floor(pos / 50) + 1 // Mock: line number based on position
          }))
        },
        field: jest.fn((field) => {
          if (field === breakpointState) {
            return mockBreakpoints;
          }
          return undefined;
        })
      }
    } as unknown as EditorView;
  });

  it("should return empty array when view is null", () => {
    const result = getBreakpointLines(null);
    expect(result).toEqual([]);
  });

  it("should return empty array when no breakpoints are set", () => {
    // Mock between to not call the callback (no breakpoints)
    mockBreakpoints.between = jest.fn((_start, _end, _callback) => {
      // Don't call callback - simulates no breakpoints
    });

    const result = getBreakpointLines(mockView as EditorView);

    expect(mockView.state!.field).toHaveBeenCalledWith(breakpointState);
    expect(mockBreakpoints.between).toHaveBeenCalledWith(0, 1000, expect.any(Function));
    expect(result).toEqual([]);
  });

  it("should return line numbers for single breakpoint", () => {
    // Mock a breakpoint at position 100 (line 3)
    mockBreakpoints.between = jest.fn((start, end, callback) => {
      callback(100);
    });

    const result = getBreakpointLines(mockView as EditorView);

    expect(mockView.state!.doc.lineAt).toHaveBeenCalledWith(100);
    expect(result).toEqual([3]);
  });

  it("should return line numbers for multiple breakpoints", () => {
    // Mock breakpoints at positions 50, 150, 250
    mockBreakpoints.between = jest.fn((start, end, callback) => {
      callback(50); // Line 2
      callback(150); // Line 4
      callback(250); // Line 6
    });

    const result = getBreakpointLines(mockView as EditorView);

    expect(mockView.state!.doc.lineAt).toHaveBeenCalledWith(50);
    expect(mockView.state!.doc.lineAt).toHaveBeenCalledWith(150);
    expect(mockView.state!.doc.lineAt).toHaveBeenCalledWith(250);
    expect(result).toEqual([2, 4, 6]);
  });

  it("should handle breakpoints at document boundaries", () => {
    mockBreakpoints.between = jest.fn((start, end, callback) => {
      callback(0); // First position - Line 1
      callback(999); // Last position - Line 20
    });

    const result = getBreakpointLines(mockView as EditorView);

    expect(result).toEqual([1, 20]);
  });

  it("should preserve order of breakpoints", () => {
    // Mock breakpoints in non-sequential order
    mockBreakpoints.between = jest.fn((start, end, callback) => {
      callback(200); // Line 5
      callback(50); // Line 2
      callback(350); // Line 8
      callback(100); // Line 3
    });

    const result = getBreakpointLines(mockView as EditorView);

    // Should preserve the order they were added
    expect(result).toEqual([5, 2, 8, 3]);
  });

  it("should handle multiple breakpoints on same line", () => {
    // Mock multiple breakpoints that resolve to same line
    mockBreakpoints.between = jest.fn((start, end, callback) => {
      callback(100); // Line 3
      callback(101); // Also Line 3
      callback(102); // Also Line 3
    });

    const result = getBreakpointLines(mockView as EditorView);

    // Should include duplicate line numbers
    expect(result).toEqual([3, 3, 3]);
  });

  it("should use the correct document range", () => {
    // TypeScript fix: Use Object.defineProperty to modify readonly 'length' property
    // The doc.length property is readonly in the actual CodeMirror types,
    // but we need to modify it for testing different document sizes
    Object.defineProperty(mockView.state!.doc, "length", {
      value: 2000,
      writable: true,
      configurable: true
    });
    mockBreakpoints.between = jest.fn();

    getBreakpointLines(mockView as EditorView);

    expect(mockBreakpoints.between).toHaveBeenCalledWith(0, 2000, expect.any(Function));
  });

  it("should handle empty document", () => {
    // TypeScript fix: Use Object.defineProperty to modify readonly 'length' property
    // The doc.length property is readonly in the actual CodeMirror types,
    // but we need to modify it for testing empty document scenarios
    Object.defineProperty(mockView.state!.doc, "length", {
      value: 0,
      writable: true,
      configurable: true
    });
    mockBreakpoints.between = jest.fn();

    const result = getBreakpointLines(mockView as EditorView);

    expect(mockBreakpoints.between).toHaveBeenCalledWith(0, 0, expect.any(Function));
    expect(result).toEqual([]);
  });

  it("should calculate line numbers correctly for various positions", () => {
    const testPositions = [
      { pos: 0, expectedLine: 1 },
      { pos: 49, expectedLine: 1 },
      { pos: 50, expectedLine: 2 },
      { pos: 99, expectedLine: 2 },
      { pos: 500, expectedLine: 11 }
    ];

    testPositions.forEach(({ pos, expectedLine }) => {
      mockBreakpoints.between = jest.fn((start, end, callback) => {
        callback(pos);
      });

      const result = getBreakpointLines(mockView as EditorView);
      expect(result).toEqual([expectedLine]);
    });
  });
});
