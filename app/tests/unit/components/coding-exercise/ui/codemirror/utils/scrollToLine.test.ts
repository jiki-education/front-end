import { scrollToLine } from "@/components/coding-exercise/ui/codemirror/utils/scrollToLine";
import type { EditorView } from "@codemirror/view";

describe("scrollToLine", () => {
  let mockView: Partial<EditorView>;
  let scrollToSpy: jest.Mock;

  beforeEach(() => {
    scrollToSpy = jest.fn();

    mockView = {
      state: {
        doc: {
          lines: 25, // Mock: document has 25 lines
          line: jest.fn((lineNum: number) => ({
            from: (lineNum - 1) * 50, // Mock: each line starts at lineNum * 50
            to: lineNum * 50
          }))
        }
      },
      lineBlockAt: jest.fn((pos: number) => ({
        from: pos,
        to: pos + 50,
        top: pos * 2, // Mock: vertical position is double the character position
        bottom: pos * 2 + 20, // Mock: each line is 20px high
        height: 20
      })),
      scrollDOM: {
        clientHeight: 600, // Mock: viewport height is 600px
        scrollTo: scrollToSpy
      }
    } as unknown as EditorView;
  });

  it("should scroll to center the specified line in the viewport", () => {
    scrollToLine(mockView as EditorView, 5);

    // Line 5 starts at position 200 (4 * 50)
    expect(mockView.state!.doc.line).toHaveBeenCalledWith(5);
    expect(mockView.lineBlockAt).toHaveBeenCalledWith(200);

    // Line block: top=400, bottom=420, height=20
    // Centered position: 400 - 600/2 + 20/2 = 400 - 300 + 10 = 110
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 110 });
  });

  it("should handle line 1", () => {
    scrollToLine(mockView as EditorView, 1);

    expect(mockView.state!.doc.line).toHaveBeenCalledWith(1);
    expect(mockView.lineBlockAt).toHaveBeenCalledWith(0);

    // Line block: top=0, bottom=20, height=20
    // Centered position: 0 - 300 + 10 = -290
    expect(scrollToSpy).toHaveBeenCalledWith({ top: -290 });
  });

  it("should handle large line numbers within document bounds", () => {
    scrollToLine(mockView as EditorView, 20); // Use valid line number within document bounds

    expect(mockView.state!.doc.line).toHaveBeenCalledWith(20);
    expect(mockView.lineBlockAt).toHaveBeenCalledWith(950); // (20-1) * 50

    // Line block: top=1900, bottom=1920, height=20
    // Centered position: 1900 - 300 + 10 = 1610
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 1610 });
  });

  it("should not scroll if view is null", () => {
    scrollToLine(null, 5);

    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("should not scroll if lineBlock is undefined", () => {
    mockView.lineBlockAt = jest.fn(() => undefined as any);

    scrollToLine(mockView as EditorView, 5);

    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("should handle viewport with different heights", () => {
    // TypeScript fix: Use Object.defineProperty to modify readonly 'clientHeight' property
    // The clientHeight property is readonly in DOM types,
    // but we need to modify it for testing different viewport sizes
    Object.defineProperty(mockView.scrollDOM!, "clientHeight", {
      value: 800,
      writable: true,
      configurable: true
    });

    scrollToLine(mockView as EditorView, 5);

    // Line block: top=400, bottom=420, height=20
    // Centered position: 400 - 800/2 + 20/2 = 400 - 400 + 10 = 10
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 10 });
  });

  it("should handle line blocks with different sizes", () => {
    // TypeScript fix: Provide complete BlockInfo type object with correct 'type' value
    // CodeMirror's BlockInfo.type expects BlockType | readonly BlockInfo[]
    // We cast to 'any' here because the mock doesn't need the full BlockType complexity
    mockView.lineBlockAt = jest.fn((pos: number) => ({
      from: pos,
      to: pos + 100,
      top: pos * 2,
      bottom: pos * 2 + 40, // Bigger line: 40px high
      height: 40,
      length: 100,
      type: "text" as any, // Cast to any to bypass BlockType constraints in mock
      widget: null,
      widgetLineBreaks: 0
    }));

    scrollToLine(mockView as EditorView, 5);

    // Line block: top=400, bottom=440, height=40
    // Centered position: 400 - 300 + 20 = 120
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 120 });
  });

  it("should calculate correct scroll position for multiple scenarios", () => {
    const testCases = [
      { line: 10, expectedTop: 610 }, // (450*2) - 300 + 10
      { line: 20, expectedTop: 1610 }, // (950*2) - 300 + 10
      { line: 2, expectedTop: -190 } // (50*2) - 300 + 10
    ];

    testCases.forEach(({ line, expectedTop }) => {
      scrollToSpy.mockClear();
      scrollToLine(mockView as EditorView, line);
      expect(scrollToSpy).toHaveBeenCalledWith({ top: expectedTop });
    });
  });

  it("should not scroll for invalid line numbers", () => {
    const invalidLines = [0, -1, 26, 100]; // 0, negative, and beyond doc.lines (25)

    invalidLines.forEach((line) => {
      scrollToSpy.mockClear();
      scrollToLine(mockView as EditorView, line);
      expect(scrollToSpy).not.toHaveBeenCalled();
      expect(mockView.state!.doc.line).not.toHaveBeenCalledWith(line);
    });
  });

  it("should handle line number exactly equal to document length", () => {
    scrollToLine(mockView as EditorView, 25); // Exactly at doc.lines

    expect(mockView.state!.doc.line).toHaveBeenCalledWith(25);
    expect(scrollToSpy).toHaveBeenCalled();
  });
});
