import { getFoldedLines } from "@/components/complex-exercise/ui/codemirror/utils/getFoldedLines";
import type { EditorView } from "@codemirror/view";
import { foldState } from "@codemirror/language";

// Mock the language extension
jest.mock("@codemirror/language", () => ({
  foldState: Symbol("foldState")
}));

describe("getFoldedLines", () => {
  let mockView: Partial<EditorView>;
  let mockFoldRanges: any;

  beforeEach(() => {
    mockFoldRanges = {
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
          if (field === foldState) {
            return mockFoldRanges;
          }
          return undefined;
        })
      }
    } as unknown as EditorView;
  });

  it("should return empty array when view is null", () => {
    const result = getFoldedLines(null);
    expect(result).toEqual([]);
  });

  it("should return empty array when foldState field returns null", () => {
    mockView.state!.field = jest.fn(() => null);

    const result = getFoldedLines(mockView as EditorView);

    expect(mockView.state!.field).toHaveBeenCalledWith(foldState);
    expect(result).toEqual([]);
  });

  it("should return empty array when no folded ranges exist", () => {
    // Mock between to not call the callback (no folded ranges)
    mockFoldRanges.between = jest.fn((_start, _end, _callback) => {
      // Don't call callback - simulates no folded ranges
    });

    const result = getFoldedLines(mockView as EditorView);

    expect(mockFoldRanges.between).toHaveBeenCalledWith(0, 1000, expect.any(Function));
    expect(result).toEqual([]);
  });

  it("should return all line numbers for a single folded range", () => {
    // Mock a fold from position 100 to 200 (lines 3-5)
    mockFoldRanges.between = jest.fn((start, end, callback) => {
      callback(100, 200);
    });

    const result = getFoldedLines(mockView as EditorView);

    expect(mockView.state!.doc.lineAt).toHaveBeenCalledWith(100);
    expect(mockView.state!.doc.lineAt).toHaveBeenCalledWith(200);
    expect(result).toEqual([3, 4, 5]);
  });

  it("should return line numbers for multiple folded ranges", () => {
    // Mock multiple folded ranges
    mockFoldRanges.between = jest.fn((start, end, callback) => {
      callback(50, 100); // Lines 2-3
      callback(200, 250); // Lines 5-6
    });

    const result = getFoldedLines(mockView as EditorView);

    expect(result).toEqual([2, 3, 5, 6]);
  });

  it("should handle single-line fold", () => {
    // Mock a fold that spans only one line
    mockFoldRanges.between = jest.fn((start, end, callback) => {
      callback(100, 149); // Both positions are on line 3
    });

    // TypeScript fix: Provide complete Line type object
    // CodeMirror's Line interface requires all properties, not just 'number'
    mockView.state!.doc.lineAt = jest.fn((_pos: number) => ({
      number: 3, // Both positions return line 3
      from: 100,
      to: 149,
      text: "line content",
      length: 49
    }));

    const result = getFoldedLines(mockView as EditorView);

    expect(result).toEqual([3]);
  });

  it("should handle large folded ranges", () => {
    // Mock a large fold from lines 2 to 10
    mockFoldRanges.between = jest.fn((start, end, callback) => {
      callback(50, 450);
    });

    // TypeScript fix: Provide complete Line type objects for all return values
    // CodeMirror's Line interface requires all properties (number, from, to, text, length)
    mockView.state!.doc.lineAt = jest.fn((pos: number) => {
      if (pos === 50) {
        return { number: 2, from: 40, to: 60, text: "line 2", length: 20 };
      }
      if (pos === 450) {
        return { number: 10, from: 440, to: 460, text: "line 10", length: 20 };
      }
      return { number: 1, from: 0, to: 20, text: "line 1", length: 20 };
    });

    const result = getFoldedLines(mockView as EditorView);

    // Should include all lines from 2 to 10
    expect(result).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("should handle overlapping folded ranges", () => {
    // Mock overlapping folds
    mockFoldRanges.between = jest.fn((start, end, callback) => {
      callback(50, 150); // Lines 2-4
      callback(100, 200); // Lines 3-5 (overlaps with previous)
    });

    const result = getFoldedLines(mockView as EditorView);

    // Should include all lines, including duplicates
    expect(result).toEqual([2, 3, 4, 3, 4, 5]);
  });

  it("should handle fold at document boundaries", () => {
    // Mock fold at start and end of document
    mockFoldRanges.between = jest.fn((start, end, callback) => {
      callback(0, 49); // Line 1
      callback(950, 999); // Lines 20-20
    });

    const result = getFoldedLines(mockView as EditorView);

    expect(result).toEqual([1, 20]);
  });

  it("should preserve order of lines in folded ranges", () => {
    // Mock folds added in non-sequential order
    mockFoldRanges.between = jest.fn((start, end, callback) => {
      callback(300, 350); // Lines 7-8
      callback(50, 100); // Lines 2-3
      callback(200, 250); // Lines 5-6
    });

    const result = getFoldedLines(mockView as EditorView);

    // Lines should appear in the order they were processed
    expect(result).toEqual([7, 8, 2, 3, 5, 6]);
  });

  it("should use correct document range when querying folds", () => {
    // TypeScript fix: Use Object.defineProperty to modify readonly 'length' property
    // The doc.length property is readonly in CodeMirror types,
    // but we need to modify it for testing different document sizes
    Object.defineProperty(mockView.state!.doc, "length", {
      value: 2000,
      writable: true,
      configurable: true
    });
    mockFoldRanges.between = jest.fn();

    getFoldedLines(mockView as EditorView);

    expect(mockFoldRanges.between).toHaveBeenCalledWith(0, 2000, expect.any(Function));
  });

  it("should handle empty document", () => {
    // TypeScript fix: Use Object.defineProperty to modify readonly 'length' property
    // The doc.length property is readonly in CodeMirror types,
    // but we need to modify it for testing empty document scenarios
    Object.defineProperty(mockView.state!.doc, "length", {
      value: 0,
      writable: true,
      configurable: true
    });
    mockFoldRanges.between = jest.fn();

    const result = getFoldedLines(mockView as EditorView);

    expect(mockFoldRanges.between).toHaveBeenCalledWith(0, 0, expect.any(Function));
    expect(result).toEqual([]);
  });

  it("should correctly calculate line ranges for various positions", () => {
    const testCases = [
      { from: 0, to: 99, expectedLines: [1, 2] },
      { from: 50, to: 149, expectedLines: [2, 3] },
      { from: 100, to: 299, expectedLines: [3, 4, 5, 6] },
      { from: 0, to: 499, expectedLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    ];

    testCases.forEach(({ from, to, expectedLines }) => {
      mockFoldRanges.between = jest.fn((start, end, callback) => {
        callback(from, to);
      });

      // TypeScript fix: Provide complete Line type object with all required properties
      // CodeMirror's Line interface requires: number, from, to, text, length
      mockView.state!.doc.lineAt = jest.fn((pos: number) => ({
        number: Math.floor(pos / 50) + 1,
        from: Math.floor(pos / 50) * 50,
        to: Math.floor(pos / 50) * 50 + 49,
        text: `line ${Math.floor(pos / 50) + 1}`,
        length: 49
      }));

      const result = getFoldedLines(mockView as EditorView);
      expect(result).toEqual(expectedLines);
    });
  });
});
