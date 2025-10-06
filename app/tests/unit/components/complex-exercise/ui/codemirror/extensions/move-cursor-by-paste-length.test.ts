import { moveCursorByPasteLength } from "@/components/complex-exercise/ui/codemirror/extensions/move-cursor-by-paste-length";
import { EditorSelection, EditorState } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";

// Mock timers for setTimeout testing
jest.useFakeTimers();

// Test the paste handler logic directly by extracting it
function pasteHandler(event: ClipboardEvent, view: EditorView) {
  const pastedText = event.clipboardData?.getData("text");
  if (!pastedText) {
    return false;
  }

  // make sure things happen after the paste
  setTimeout(() => {
    const { from } = view.state.selection.main;
    const pastedLength = pastedText.length;

    view.dispatch({
      selection: { anchor: from + pastedLength },
      scrollIntoView: true
    });
  }, 0);

  return false;
}

// Mock helper functions
function createMockEditor(initialContent = "initial content", cursorPos = 0) {
  const dispatchSpy = jest.fn();
  const state = EditorState.create({
    doc: initialContent,
    selection: EditorSelection.single(cursorPos)
  });

  return {
    state,
    dispatch: dispatchSpy,
    dom: document.createElement("div")
  } as unknown as EditorView & { dispatch: jest.Mock };
}

function createMockClipboardEvent(pastedText: string | null) {
  const clipboardData = pastedText
    ? {
        getData: jest.fn().mockReturnValue(pastedText)
      }
    : null;

  return {
    clipboardData,
    preventDefault: jest.fn(),
    stopPropagation: jest.fn()
  } as unknown as ClipboardEvent;
}

describe("move-cursor-by-paste-length", () => {
  describe("moveCursorByPasteLength extension", () => {
    it("should be defined as a DOM event handler extension", () => {
      expect(moveCursorByPasteLength).toBeDefined();
      expect(typeof moveCursorByPasteLength).toBe("object");
    });

    it("should be a valid CodeMirror extension", () => {
      // Should have the structure of an EditorView extension
      expect(moveCursorByPasteLength).toHaveProperty("extension");
    });
  });

  describe("paste event handler logic", () => {
    let mockView: EditorView & { dispatch: jest.Mock };

    beforeEach(() => {
      mockView = createMockEditor("Hello world", 5); // cursor at position 5
      jest.clearAllTimers();
    });

    afterEach(() => {
      jest.runAllTimers();
    });

    it("should return false when clipboard data is null", () => {
      const mockEvent = createMockClipboardEvent(null);

      const result = pasteHandler(mockEvent, mockView);

      expect(result).toBe(false);
      expect(mockView.dispatch).not.toHaveBeenCalled();
    });

    it("should return false when clipboard data has no text", () => {
      const mockEvent = createMockClipboardEvent("");

      const result = pasteHandler(mockEvent, mockView);

      expect(result).toBe(false);
      expect(mockView.dispatch).not.toHaveBeenCalled();
    });

    it("should schedule cursor movement after paste with text", () => {
      const pastedText = " pasted";
      const mockEvent = createMockClipboardEvent(pastedText);

      const result = pasteHandler(mockEvent, mockView);

      expect(result).toBe(false);
      expect(mockView.dispatch).not.toHaveBeenCalled(); // Not called immediately

      // Fast-forward time to trigger setTimeout
      jest.advanceTimersByTime(1);

      expect(mockView.dispatch).toHaveBeenCalledTimes(1);
      expect(mockView.dispatch).toHaveBeenCalledWith({
        selection: { anchor: 5 + pastedText.length }, // current position + pasted length
        scrollIntoView: true
      });
    });

    it("should calculate cursor position correctly for multi-character paste", () => {
      const pastedText = "This is a longer pasted text";
      const initialCursorPos = 10;
      mockView = createMockEditor("Some initial content here", initialCursorPos);

      const mockEvent = createMockClipboardEvent(pastedText);

      pasteHandler(mockEvent, mockView);
      jest.advanceTimersByTime(1);

      expect(mockView.dispatch).toHaveBeenCalledWith({
        selection: { anchor: initialCursorPos + pastedText.length },
        scrollIntoView: true
      });
    });

    it("should handle unicode characters correctly", () => {
      const pastedText = "🚀 émojì tëxt 中文";
      const initialCursorPos = 0;
      mockView = createMockEditor("", initialCursorPos);

      const mockEvent = createMockClipboardEvent(pastedText);

      pasteHandler(mockEvent, mockView);
      jest.advanceTimersByTime(1);

      expect(mockView.dispatch).toHaveBeenCalledWith({
        selection: { anchor: pastedText.length },
        scrollIntoView: true
      });
    });

    it("should always scroll into view after moving cursor", () => {
      const mockEvent = createMockClipboardEvent("test");

      pasteHandler(mockEvent, mockView);
      jest.advanceTimersByTime(1);

      const dispatchCall = mockView.dispatch.mock.calls[0][0];
      expect(dispatchCall.scrollIntoView).toBe(true);
    });

    it("should handle edge cases correctly", () => {
      const testCases = [
        { text: "a", expected: 6 }, // single character
        { text: "\n", expected: 6 }, // newline
        { text: "\t", expected: 6 }, // tab
        { text: "   ", expected: 8 }, // spaces
        { text: "multi\nline", expected: 15 } // multiline
      ];

      testCases.forEach(({ text, expected }) => {
        const mockEvent = createMockClipboardEvent(text);
        const view = createMockEditor("Hello", 5);

        pasteHandler(mockEvent, view);
        jest.advanceTimersByTime(1);

        expect(view.dispatch).toHaveBeenCalledWith({
          selection: { anchor: expected },
          scrollIntoView: true
        });

        // Clear for next test
        view.dispatch.mockClear();
        jest.clearAllTimers();
      });
    });
  });

  describe("extension integration", () => {
    it("should work with CodeMirror state system", () => {
      // Test that the extension can be used with CodeMirror
      const state = EditorState.create({
        doc: "test content",
        extensions: [moveCursorByPasteLength]
      });

      expect(state).toBeDefined();
      expect(state.doc.toString()).toBe("test content");
    });
  });

  describe("dummy data for manual testing", () => {
    it("should provide comprehensive test scenarios", () => {
      const testScenarios = [
        {
          description: "Basic text paste",
          initialContent: "Hello world",
          cursorPosition: 5,
          textToPaste: " beautiful",
          expectedCursorPosition: 15,
          instructions: 'Place cursor after "Hello", paste " beautiful", verify cursor moves to end'
        },
        {
          description: "Paste at beginning",
          initialContent: "world",
          cursorPosition: 0,
          textToPaste: "Hello ",
          expectedCursorPosition: 6,
          instructions: 'Place cursor at start, paste "Hello ", verify cursor at position 6'
        },
        {
          description: "Paste at end",
          initialContent: "Hello",
          cursorPosition: 5,
          textToPaste: " world!",
          expectedCursorPosition: 12,
          instructions: 'Place cursor at end, paste " world!", verify cursor at end'
        },
        {
          description: "Multiline paste",
          initialContent: "First line",
          cursorPosition: 10,
          textToPaste: "\nSecond line\nThird line",
          expectedCursorPosition: 33,
          instructions: "Place cursor at end of first line, paste multiline text, verify cursor at end"
        },
        {
          description: "Unicode paste",
          initialContent: "Test",
          cursorPosition: 4,
          textToPaste: " 🎉 测试",
          expectedCursorPosition: 10,
          instructions: "Test unicode characters including emojis and non-Latin scripts"
        },
        {
          description: "Large paste",
          initialContent: "Start",
          cursorPosition: 5,
          textToPaste: " " + "x".repeat(1000),
          expectedCursorPosition: 1006,
          instructions: "Test performance with large paste operations"
        }
      ];

      expect(testScenarios).toHaveLength(6);
      testScenarios.forEach((scenario, _index) => {
        expect(scenario.description).toBeDefined();
        expect(scenario.initialContent).toBeDefined();
        expect(typeof scenario.cursorPosition).toBe("number");
        expect(scenario.textToPaste).toBeDefined();
        expect(typeof scenario.expectedCursorPosition).toBe("number");
        expect(scenario.instructions).toBeDefined();

        // Verify math
        expect(scenario.expectedCursorPosition).toBe(scenario.cursorPosition + scenario.textToPaste.length);
      });
    });

    it("should provide test utilities for manual verification", () => {
      const testUtils = {
        simulatePaste: (view: EditorView, text: string) => {
          const event = new ClipboardEvent("paste", {
            clipboardData: new DataTransfer()
          });
          // Add data to clipboard
          event.clipboardData?.setData("text/plain", text);

          // Simulate the paste handler logic
          pasteHandler(event, view);
        },

        createTestEditor: (content: string, cursorPos: number) => {
          return createMockEditor(content, cursorPos);
        },

        verifyCursorPosition: (view: EditorView & { dispatch: jest.Mock }, expectedPos: number) => {
          jest.advanceTimersByTime(1);
          const lastCall = view.dispatch.mock.calls[view.dispatch.mock.calls.length - 1];
          expect(lastCall[0].selection.anchor).toBe(expectedPos);
        }
      };

      expect(typeof testUtils.simulatePaste).toBe("function");
      expect(typeof testUtils.createTestEditor).toBe("function");
      expect(typeof testUtils.verifyCursorPosition).toBe("function");
    });

    it("should provide debugging helpers", () => {
      const debugHelpers = {
        logCursorMovement: (view: EditorView & { dispatch: jest.Mock }) => {
          const calls = view.dispatch.mock.calls;
          return calls.map((call) => ({
            selectionAnchor: call[0].selection?.anchor,
            scrollIntoView: call[0].scrollIntoView
          }));
        },

        measurePasteLength: (text: string) => ({
          length: text.length,
          chars: [...text].length, // Unicode-aware length
          bytes: Buffer.byteLength(text, "utf8") // Use Buffer for Node.js environment
        })
      };

      // Test the helpers work
      const view = createMockEditor("test", 0);
      view.dispatch({ selection: { anchor: 5 }, scrollIntoView: true });

      const movements = debugHelpers.logCursorMovement(view);
      expect(movements).toHaveLength(1);
      expect(movements[0].selectionAnchor).toBe(5);

      const lengths = debugHelpers.measurePasteLength("🚀 test");
      expect(lengths.length).toBe(7); // String length (emoji counts as 2 UTF-16 units + space + 4 chars)
      expect(lengths.chars).toBe(6); // Unicode-aware length (emoji as 1 grapheme + space + 4 chars)
      expect(lengths.bytes).toBeGreaterThan(7); // Bytes > chars due to emoji
    });
  });
});
