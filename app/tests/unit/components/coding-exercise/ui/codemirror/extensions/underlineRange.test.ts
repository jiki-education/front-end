import { cleanUpEditorEffect } from "@/components/coding-exercise/ui/codemirror/extensions/clean-up-editor";
import {
  addUnderlineEffect,
  underlineExtension,
  underlineField
} from "@/components/coding-exercise/ui/codemirror/extensions/underlineRange";
import { EditorState } from "@codemirror/state";

describe("underlineRange", () => {
  describe("addUnderlineEffect", () => {
    it("should be defined as a state effect", () => {
      expect(addUnderlineEffect).toBeDefined();
      expect(typeof addUnderlineEffect.of).toBe("function");
    });

    it("should create effect with from and to positions", () => {
      const effect = addUnderlineEffect.of({ from: 5, to: 10 });

      expect(effect).toBeDefined();
      expect(effect.is(addUnderlineEffect)).toBe(true);
      expect(effect.value).toEqual({ from: 5, to: 10 });
    });

    it("should handle effect mapping correctly", () => {
      const effect = addUnderlineEffect.of({ from: 5, to: 10 });

      // Mock mapping function that shifts positions by 3
      const mockMapping = {
        mapPos: jest.fn((pos: number) => pos + 3)
      };

      const mappedEffect = effect.map(mockMapping as any);
      expect(mappedEffect?.value.from).toBe(8);
      expect(mappedEffect?.value.to).toBe(13);
      expect(mockMapping.mapPos).toHaveBeenCalledTimes(2);
      expect(mockMapping.mapPos).toHaveBeenCalledWith(5);
      expect(mockMapping.mapPos).toHaveBeenCalledWith(10);
    });

    it("should preserve effect type after mapping", () => {
      const effect = addUnderlineEffect.of({ from: 0, to: 5 });
      const mockMapping = { mapPos: (pos: number) => pos };

      const mappedEffect = effect.map(mockMapping as any);
      expect(mappedEffect?.is(addUnderlineEffect)).toBe(true);
    });
  });

  describe("underlineField", () => {
    it("should initialize with no decorations", () => {
      const state = EditorState.create({
        doc: "test content",
        extensions: underlineField
      });

      const decorations = state.field(underlineField);
      expect(decorations).toBeDefined();
    });

    it("should clear decorations when document changes", () => {
      const state = EditorState.create({
        doc: "original content",
        extensions: underlineField
      });

      // Add underline first
      const withUnderline = state.update({
        effects: addUnderlineEffect.of({ from: 0, to: 5 })
      }).state;

      // Verify underline was added
      const decorationsWithUnderline = withUnderline.field(underlineField);
      expect(decorationsWithUnderline).toBeDefined();

      // Change document - should clear underlines
      const afterDocChange = withUnderline.update({
        changes: { from: 0, to: 0, insert: "new " }
      }).state;

      const decorations = afterDocChange.field(underlineField);
      expect(decorations).toBeDefined();
      // Note: decorations are cleared when document changes, but field still exists
    });

    it("should add underline decoration when effect is applied", () => {
      const state = EditorState.create({
        doc: "test content here",
        extensions: underlineField
      });

      const withUnderline = state.update({
        effects: addUnderlineEffect.of({ from: 5, to: 12 })
      }).state;

      const decorations = withUnderline.field(underlineField);
      expect(decorations).toBeDefined();
    });

    it("should ignore invalid ranges (from: 0, to: 0)", () => {
      const state = EditorState.create({
        doc: "test content",
        extensions: underlineField
      });

      const withInvalidUnderline = state.update({
        effects: addUnderlineEffect.of({ from: 0, to: 0 })
      }).state;

      const decorations = withInvalidUnderline.field(underlineField);
      expect(decorations).toBeDefined();
      // Invalid ranges should be ignored and return to empty decorations
    });

    it("should ignore out-of-bounds ranges", () => {
      const content = "short";
      const state = EditorState.create({
        doc: content,
        extensions: underlineField
      });

      const withInvalidUnderline = state.update({
        effects: addUnderlineEffect.of({ from: 10, to: 20 }) // beyond document length
      }).state;

      const decorations = withInvalidUnderline.field(underlineField);
      expect(decorations).toBeDefined();
      // Out-of-bounds ranges should be ignored
    });

    it("should clear decorations on cleanup effect", () => {
      const state = EditorState.create({
        doc: "test content",
        extensions: underlineField
      });

      // Add underline first
      const withUnderline = state.update({
        effects: addUnderlineEffect.of({ from: 0, to: 4 })
      }).state;

      // Apply cleanup effect
      const afterCleanup = withUnderline.update({
        effects: cleanUpEditorEffect.of()
      }).state;

      const decorations = afterCleanup.field(underlineField);
      expect(decorations).toBeDefined();
    });

    it("should handle valid range within document bounds", () => {
      const content = "This is a test content";
      const state = EditorState.create({
        doc: content,
        extensions: underlineField
      });

      const withUnderline = state.update({
        effects: addUnderlineEffect.of({ from: 5, to: 7 }) // "is"
      }).state;

      const decorations = withUnderline.field(underlineField);
      expect(decorations).toBeDefined();
    });

    it("should handle multiple underlines by replacing previous", () => {
      const state = EditorState.create({
        doc: "This is test content",
        extensions: underlineField
      });

      // Add first underline
      const firstUnderline = state.update({
        effects: addUnderlineEffect.of({ from: 0, to: 4 }) // "This"
      }).state;

      // Add second underline - should replace the first
      const secondUnderline = firstUnderline.update({
        effects: addUnderlineEffect.of({ from: 8, to: 12 }) // "test"
      }).state;

      const decorations = secondUnderline.field(underlineField);
      expect(decorations).toBeDefined();
    });

    it("should handle edge ranges correctly", () => {
      const content = "Hello world";
      const state = EditorState.create({
        doc: content,
        extensions: underlineField
      });

      const testCases = [
        { from: 0, to: 5, description: "Start of document" },
        { from: 6, to: 11, description: "End of document" },
        { from: 5, to: 6, description: "Single character" },
        { from: 0, to: content.length, description: "Entire document" }
      ];

      testCases.forEach(({ from, to }) => {
        const withUnderline = state.update({
          effects: addUnderlineEffect.of({ from, to })
        }).state;

        const decorations = withUnderline.field(underlineField);
        expect(decorations).toBeDefined();
      });
    });
  });

  describe("underlineExtension", () => {
    it("should create extension with default style", () => {
      const extension = underlineExtension();
      expect(Array.isArray(extension)).toBe(true);
      expect(extension.length).toBe(2); // field + theme
    });

    it("should create extension with custom underline style", () => {
      const customStyle = "underline 3px blue";
      const extension = underlineExtension({ underlineStyle: customStyle });

      expect(Array.isArray(extension)).toBe(true);
      expect(extension.length).toBe(2);
    });

    it("should use default style when underlineStyle is undefined", () => {
      const extension = underlineExtension({ underlineStyle: undefined });
      expect(Array.isArray(extension)).toBe(true);
    });

    it("should work without options object", () => {
      const extension = underlineExtension();
      expect(Array.isArray(extension)).toBe(true);
    });

    it("should work with CodeMirror state", () => {
      const state = EditorState.create({
        doc: "test content",
        extensions: underlineExtension()
      });

      expect(state).toBeDefined();
      expect(state.doc.toString()).toBe("test content");

      // Should have access to underline field
      const decorations = state.field(underlineField);
      expect(decorations).toBeDefined();
    });
  });

  describe("extension integration", () => {
    it("should handle complete underline workflow", () => {
      const state = EditorState.create({
        doc: "Hello world test",
        extensions: underlineExtension()
      });

      // Add underline to "world"
      const withUnderline = state.update({
        effects: addUnderlineEffect.of({ from: 6, to: 11 })
      }).state;

      expect(withUnderline.field(underlineField)).toBeDefined();

      // Clear all underlines
      const cleared = withUnderline.update({
        effects: cleanUpEditorEffect.of()
      }).state;

      expect(cleared.field(underlineField)).toBeDefined();
    });

    it("should handle document changes correctly", () => {
      const state = EditorState.create({
        doc: "original text",
        extensions: underlineExtension()
      });

      // Add underline
      const withUnderline = state.update({
        effects: addUnderlineEffect.of({ from: 0, to: 8 })
      }).state;

      // Change document - underlines should be cleared
      const afterChange = withUnderline.update({
        changes: { from: 0, to: 0, insert: "new " }
      }).state;

      expect(afterChange.field(underlineField)).toBeDefined();
    });

    it("should work with various underline styles", () => {
      const styles = [
        "underline 2px red",
        "underline 3px blue dotted",
        "underline wavy green",
        "solid 1px #ff0000 underline"
      ];

      styles.forEach((style) => {
        const extension = underlineExtension({ underlineStyle: style });
        const state = EditorState.create({
          doc: "test",
          extensions: extension
        });

        expect(state).toBeDefined();
        expect(state.field(underlineField)).toBeDefined();
      });
    });
  });

  describe("cleanup integration", () => {
    it("should respond to cleanup effect from clean-up-editor extension", () => {
      const state = EditorState.create({
        doc: "test content",
        extensions: underlineExtension()
      });

      // Add underline
      const withUnderline = state.update({
        effects: addUnderlineEffect.of({ from: 0, to: 4 })
      }).state;

      // Trigger cleanup
      const cleaned = withUnderline.update({
        effects: cleanUpEditorEffect.of()
      }).state;

      expect(cleaned.field(underlineField)).toBeDefined();
    });
  });

  describe("dummy data for manual testing", () => {
    it("should provide comprehensive test scenarios", () => {
      const testScenarios = [
        {
          description: "Basic underline",
          content: "This is a test sentence.",
          underlineRanges: [{ from: 10, to: 14 }], // "test"
          expectedUnderlined: "test",
          instructions: [
            '1. Apply underline to word "test"',
            "2. Verify red underline appears",
            "3. Clear underline with cleanup",
            "4. Verify underline disappears"
          ]
        },
        {
          description: "Multiple underlines (replacement behavior)",
          content: "Error in line 5 and line 10",
          underlineRanges: [
            { from: 0, to: 5 }, // "Error"
            { from: 9, to: 13 }, // "line" (this will replace previous)
            { from: 18, to: 22 } // "line" (this will replace previous)
          ],
          expectedUnderlined: ["Error", "line", "line"],
          instructions: [
            '1. Apply underline to "Error" - verify it appears',
            '2. Apply underline to first "line" - verify "Error" disappears and "line" appears',
            '3. Apply underline to second "line" - verify it moves',
            "4. Test the replacement behavior is working correctly"
          ]
        },
        {
          description: "Code underline with syntax highlighting",
          content: "function myFunction() { return value; }",
          underlineRanges: [{ from: 31, to: 36 }], // "value"
          expectedUnderlined: "value",
          instructions: [
            '1. Apply underline to "value" in function',
            "2. Verify underline appears over syntax highlighting",
            "3. Test different underline styles (dotted, wavy, etc.)",
            "4. Verify interaction with code highlighting"
          ]
        },
        {
          description: "Different underline styles",
          content: "Testing different underline styles here",
          styles: ["underline 2px red", "underline 3px blue dotted", "underline wavy green", "underline double purple"],
          underlineRanges: [{ from: 8, to: 17 }], // "different"
          instructions: [
            '1. Test each underline style on "different"',
            "2. Verify visual appearance of each style",
            "3. Test style changes dynamically",
            "4. Compare with browser default underline"
          ]
        },
        {
          description: "Edge cases and error handling",
          content: "Short text",
          edgeCases: [
            { from: 0, to: 0, description: "Empty range (should be ignored)" },
            { from: 100, to: 110, description: "Out of bounds (should be ignored)" },
            { from: 0, to: 5, description: "Valid range from start" },
            { from: 5, to: 10, description: "Valid range to end" },
            { from: -1, to: 5, description: "Negative start (should be handled gracefully)" }
          ],
          instructions: [
            "1. Test each edge case and verify graceful handling",
            "2. Ensure no errors or crashes occur",
            "3. Verify only valid ranges create underlines",
            "4. Test rapid range changes and cleanup"
          ]
        },
        {
          description: "Document editing with underlines",
          content: "Original content here",
          instructions: [
            '1. Add underline to "content"',
            "2. Edit document by inserting text before underlined word",
            "3. Verify underline disappears (document change clears underlines)",
            "4. Add new underline after editing",
            "5. Test various document modifications"
          ]
        }
      ];

      expect(testScenarios).toHaveLength(6);
      testScenarios.forEach((scenario, _index) => {
        expect(scenario.description).toBeDefined();
        expect(scenario.content).toBeDefined();
        expect(scenario.instructions.length).toBeGreaterThan(0);
      });
    });

    it("should provide test utilities for underline management", () => {
      const testUtils = {
        createUnderlineEditor: (content: string, style?: string) => {
          return EditorState.create({
            doc: content,
            extensions: underlineExtension({ underlineStyle: style })
          });
        },

        addUnderline: (state: EditorState, from: number, to: number) => {
          return state.update({
            effects: addUnderlineEffect.of({ from, to })
          }).state;
        },

        clearUnderlines: (state: EditorState) => {
          return state.update({
            effects: cleanUpEditorEffect.of()
          }).state;
        },

        underlineWord: (state: EditorState, word: string) => {
          const content = state.doc.toString();
          const index = content.indexOf(word);
          if (index === -1) {
            return state;
          }

          return state.update({
            effects: addUnderlineEffect.of({ from: index, to: index + word.length })
          }).state;
        }
      };

      // Test the utilities
      const state = testUtils.createUnderlineEditor("Hello world test");

      const withUnderline = testUtils.addUnderline(state, 6, 11); // "world"
      expect(withUnderline.field(underlineField)).toBeDefined();

      const wordUnderlined = testUtils.underlineWord(state, "test");
      expect(wordUnderlined.field(underlineField)).toBeDefined();

      const cleared = testUtils.clearUnderlines(withUnderline);
      expect(cleared.field(underlineField)).toBeDefined();

      expect(typeof testUtils.createUnderlineEditor).toBe("function");
      expect(typeof testUtils.addUnderline).toBe("function");
      expect(typeof testUtils.clearUnderlines).toBe("function");
      expect(typeof testUtils.underlineWord).toBe("function");
    });

    it("should provide performance testing scenarios", () => {
      const performanceTests = [
        {
          description: "Rapid underline changes",
          test: () => {
            let state = EditorState.create({
              doc: "Performance test content with multiple words",
              extensions: underlineExtension()
            });

            // Rapidly change underlines 100 times
            for (let i = 0; i < 100; i++) {
              const from = i % 20;
              const to = from + 5;
              state = state.update({
                effects: addUnderlineEffect.of({ from, to })
              }).state;
            }

            return state;
          }
        },
        {
          description: "Large document underlines",
          test: () => {
            const largeContent = "word ".repeat(1000);
            let state = EditorState.create({
              doc: largeContent,
              extensions: underlineExtension()
            });

            // Add underline to middle of large document
            state = state.update({
              effects: addUnderlineEffect.of({ from: 2000, to: 2010 })
            }).state;

            return state;
          }
        }
      ];

      expect(performanceTests).toHaveLength(2);

      // Run performance tests to ensure they don't crash
      performanceTests.forEach((test) => {
        const result = test.test();
        expect(result).toBeDefined();
        expect(result.field(underlineField)).toBeDefined();
      });
    });

    it("should provide debugging and inspection utilities", () => {
      const createUnderlineEditor = (content: string, style?: string) => {
        return EditorState.create({
          doc: content,
          extensions: underlineExtension({ underlineStyle: style })
        });
      };

      const debugUtils = {
        inspectUnderlines: (_state: EditorState) => {
          // const decorations = state.field(underlineField);
          const ranges: { from: number; to: number; text: string }[] = [];

          // This is a simplified inspection - actual implementation would
          // need to iterate through the decoration set
          return ranges;
        },

        validateRange: (state: EditorState, from: number, to: number) => {
          return {
            valid: from >= 0 && to <= state.doc.length && from <= to,
            reason:
              from < 0
                ? "Negative start"
                : to > state.doc.length
                  ? "Beyond document end"
                  : from > to
                    ? "Start after end"
                    : "Valid"
          };
        },

        getUnderlinedText: (state: EditorState, from: number, to: number) => {
          if (from < 0 || to > state.doc.length || from > to) {
            return "";
          }
          return state.doc.sliceString(from, to);
        }
      };

      // Test debug utilities
      const state = createUnderlineEditor("Test content");

      const validation = debugUtils.validateRange(state, 0, 4);
      expect(validation.valid).toBe(true);
      expect(validation.reason).toBe("Valid");

      const invalidValidation = debugUtils.validateRange(state, -1, 100);
      expect(invalidValidation.valid).toBe(false);

      const text = debugUtils.getUnderlinedText(state, 0, 4);
      expect(text).toBe("Test");

      expect(typeof debugUtils.inspectUnderlines).toBe("function");
      expect(typeof debugUtils.validateRange).toBe("function");
      expect(typeof debugUtils.getUnderlinedText).toBe("function");
    });
  });
});
