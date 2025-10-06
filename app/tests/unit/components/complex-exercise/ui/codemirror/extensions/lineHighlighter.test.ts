import {
  ERROR_HIGHLIGHT_COLOR,
  INFO_HIGHLIGHT_COLOR,
  changeColorEffect,
  changeLineEffect,
  highlightColorField,
  highlightLine,
  highlightedLineField
} from "@/components/complex-exercise/ui/codemirror/extensions/lineHighlighter";
import { EditorState } from "@codemirror/state";

describe("lineHighlighter", () => {
  describe("constants", () => {
    it("should define highlight colors", () => {
      expect(INFO_HIGHLIGHT_COLOR).toBe("#f9f9ff");
      expect(ERROR_HIGHLIGHT_COLOR).toBe("#fecaca88");
    });
  });

  describe("changeLineEffect", () => {
    it("should be defined as a state effect", () => {
      expect(changeLineEffect).toBeDefined();
      expect(typeof changeLineEffect.of).toBe("function");
    });

    it("should create effect with line number", () => {
      const effect = changeLineEffect.of(5);

      expect(effect).toBeDefined();
      expect(effect.is(changeLineEffect)).toBe(true);
      expect(effect.value).toBe(5);
    });
  });

  describe("highlightedLineField", () => {
    it("should initialize with default line number 1", () => {
      const state = EditorState.create({
        doc: "test content",
        extensions: highlightedLineField
      });

      const lineNumber = state.field(highlightedLineField);
      expect(lineNumber).toBe(1);
    });

    it("should update line number when effect is applied", () => {
      const state = EditorState.create({
        doc: "line1\nline2\nline3",
        extensions: highlightedLineField
      });

      const withNewLine = state.update({
        effects: changeLineEffect.of(3)
      }).state;

      const lineNumber = withNewLine.field(highlightedLineField);
      expect(lineNumber).toBe(3);
    });

    it("should preserve line number when no effect is applied", () => {
      const state = EditorState.create({
        doc: "line1\nline2\nline3",
        extensions: highlightedLineField.init(() => 2)
      });

      const afterUpdate = state.update({
        changes: { from: 0, to: 0, insert: "new " }
      }).state;

      const lineNumber = afterUpdate.field(highlightedLineField);
      expect(lineNumber).toBe(2);
    });
  });

  describe("changeColorEffect", () => {
    it("should be defined as a state effect", () => {
      expect(changeColorEffect).toBeDefined();
      expect(typeof changeColorEffect.of).toBe("function");
    });

    it("should create effect with color string", () => {
      const color = "#ff0000";
      const effect = changeColorEffect.of(color);

      expect(effect).toBeDefined();
      expect(effect.is(changeColorEffect)).toBe(true);
      expect(effect.value).toBe(color);
    });
  });

  describe("highlightColorField", () => {
    it("should initialize with default info highlight color", () => {
      const state = EditorState.create({
        doc: "test content",
        extensions: highlightColorField
      });

      const color = state.field(highlightColorField);
      expect(color).toBe(INFO_HIGHLIGHT_COLOR);
    });

    it("should update color when effect is applied", () => {
      const state = EditorState.create({
        doc: "test content",
        extensions: highlightColorField
      });

      const newColor = ERROR_HIGHLIGHT_COLOR;
      const withNewColor = state.update({
        effects: changeColorEffect.of(newColor)
      }).state;

      const color = withNewColor.field(highlightColorField);
      expect(color).toBe(newColor);
    });
  });

  describe("highlightLine extension", () => {
    it("should create extension with initial line number", () => {
      const extension = highlightLine(3);

      expect(Array.isArray(extension)).toBe(true);
      // Extension might be a single extension object or array of extensions
      const extensionArray = Array.isArray(extension) ? extension : [extension];
      expect(extensionArray.length).toBeGreaterThan(0);
    });

    it("should work with state containing both fields", () => {
      const state = EditorState.create({
        doc: "line1\nline2\nline3",
        extensions: highlightLine(2)
      });

      // Should have both the line number and color fields
      expect(state.field(highlightedLineField)).toBe(2);
      expect(state.field(highlightColorField)).toBe(INFO_HIGHLIGHT_COLOR);
    });

    it("should handle state updates with both effects", () => {
      const state = EditorState.create({
        doc: "line1\nline2\nline3\nline4",
        extensions: highlightLine(1)
      });

      const updated = state.update({
        effects: [changeLineEffect.of(4), changeColorEffect.of("#custom")]
      }).state;

      expect(updated.field(highlightedLineField)).toBe(4);
      expect(updated.field(highlightColorField)).toBe("#custom");
    });
  });

  describe("edge cases and integration", () => {
    it("should handle line numbers beyond document range", () => {
      const state = EditorState.create({
        doc: "line1\nline2", // only 2 lines
        extensions: highlightLine(1)
      });

      const updated = state.update({
        effects: changeLineEffect.of(5)
      }).state;

      // Field stores the value even if out of range
      expect(updated.field(highlightedLineField)).toBe(5);
    });

    it("should handle special line numbers", () => {
      const state = EditorState.create({
        doc: "line1\nline2",
        extensions: highlightLine(1)
      });

      // Test line 0
      const withZero = state.update({
        effects: changeLineEffect.of(0)
      }).state;
      expect(withZero.field(highlightedLineField)).toBe(0);

      // Test negative line
      const withNegative = withZero.update({
        effects: changeLineEffect.of(-1)
      }).state;
      expect(withNegative.field(highlightedLineField)).toBe(-1);
    });

    it("should work with empty documents", () => {
      const state = EditorState.create({
        doc: "",
        extensions: highlightLine(1)
      });

      expect(state.field(highlightedLineField)).toBe(1);
      expect(state.field(highlightColorField)).toBe(INFO_HIGHLIGHT_COLOR);
    });

    it("should handle various color formats", () => {
      const state = EditorState.create({
        doc: "test",
        extensions: highlightLine(1)
      });

      const colors = [ERROR_HIGHLIGHT_COLOR, "#ff0000", "#rgba(255, 0, 0, 0.5)", "transparent", "red"];

      colors.forEach((color, _index) => {
        const updated = state.update({
          effects: changeColorEffect.of(color)
        }).state;

        expect(updated.field(highlightColorField)).toBe(color);
      });
    });
  });

  describe("dummy data for manual testing", () => {
    it("should provide comprehensive test scenarios", () => {
      const testScenarios = [
        {
          description: "Basic line highlighting",
          content: 'function test() {\n  console.log("hello");\n  return true;\n}',
          tests: [
            { line: 1, color: INFO_HIGHLIGHT_COLOR, description: "Highlight function declaration" },
            { line: 2, color: ERROR_HIGHLIGHT_COLOR, description: "Highlight console.log with error color" },
            { line: 3, color: "#ffff99", description: "Highlight return with custom yellow" }
          ]
        },
        {
          description: "Long code with scrolling",
          content: Array.from({ length: 20 }, (_, i) => `Line ${i + 1}: Code content here`).join("\n"),
          tests: [
            { line: 1, color: INFO_HIGHLIGHT_COLOR, description: "Highlight first line" },
            { line: 10, color: ERROR_HIGHLIGHT_COLOR, description: "Highlight middle line" },
            { line: 20, color: "#e6f3ff", description: "Highlight last line" }
          ]
        },
        {
          description: "Edge cases",
          content: "Single line\nSecond line",
          tests: [
            { line: 0, color: INFO_HIGHLIGHT_COLOR, description: "Test line 0" },
            { line: -1, color: ERROR_HIGHLIGHT_COLOR, description: "Test negative line" },
            { line: 100, color: "#custom", description: "Test line beyond document" }
          ]
        }
      ];

      expect(testScenarios).toHaveLength(3);
      testScenarios.forEach((scenario, _i) => {
        expect(scenario.description).toBeDefined();
        expect(scenario.content).toBeDefined();
        expect(scenario.tests.length).toBeGreaterThan(0);
        expect(scenario.tests[0]).toHaveProperty("line");
        expect(scenario.tests[0]).toHaveProperty("color");
        expect(scenario.tests[0]).toHaveProperty("description");
      });
    });

    it("should provide test helper utilities", () => {
      const testUtils = {
        createTestState: (content: string, initialLine: number = 1) => {
          return EditorState.create({
            doc: content,
            extensions: highlightLine(initialLine)
          });
        },

        highlightLine: (state: EditorState, line: number) => {
          return state.update({
            effects: changeLineEffect.of(line)
          }).state;
        },

        changeColor: (state: EditorState, color: string) => {
          return state.update({
            effects: changeColorEffect.of(color)
          }).state;
        },

        highlightWithColor: (state: EditorState, line: number, color: string) => {
          return state.update({
            effects: [changeLineEffect.of(line), changeColorEffect.of(color)]
          }).state;
        }
      };

      // Test that utilities work
      const state = testUtils.createTestState("test\ncontent", 1);
      expect(state.field(highlightedLineField)).toBe(1);

      const highlighted = testUtils.highlightLine(state, 2);
      expect(highlighted.field(highlightedLineField)).toBe(2);

      const colored = testUtils.changeColor(state, "#red");
      expect(colored.field(highlightColorField)).toBe("#red");

      const both = testUtils.highlightWithColor(state, 3, "#blue");
      expect(both.field(highlightedLineField)).toBe(3);
      expect(both.field(highlightColorField)).toBe("#blue");
    });
  });
});
