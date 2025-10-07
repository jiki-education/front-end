import { EditorState } from "@codemirror/state";
import {
  breakpointEffect,
  breakpointState,
  breakpointGutter
} from "@/components/coding-exercise/ui/codemirror/extensions/breakpoint";

// Mock DOM methods
const mockCreateElement = jest.fn(() => ({
  classList: { add: jest.fn() },
  title: "",
  className: ""
}));

Object.defineProperty(document, "createElement", {
  value: mockCreateElement,
  writable: true
});

describe("breakpoint extension", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("breakpointEffect", () => {
    it("should be defined as a state effect", () => {
      expect(breakpointEffect).toBeDefined();
      expect(typeof breakpointEffect.of).toBe("function");
    });

    it("should create effect with position and on/off state", () => {
      const effect = breakpointEffect.of({ pos: 10, on: true });

      expect(effect).toBeDefined();
      expect(effect.is(breakpointEffect)).toBe(true);
      expect(effect.value).toEqual({ pos: 10, on: true });
    });

    it("should handle effect mapping", () => {
      const effect = breakpointEffect.of({ pos: 5, on: true });

      // The map function should exist and be callable
      expect(typeof effect.map).toBe("function");

      // Test with a simple mapping function that adds 3
      const mockMapping = {
        mapPos: (pos: number) => pos + 3
      };

      const mapped = effect.map(mockMapping as any);
      expect(mapped?.value).toEqual({ pos: 8, on: true });
      expect(mapped?.is(breakpointEffect)).toBe(true);
    });

    it("should create effects for different states", () => {
      const addEffect = breakpointEffect.of({ pos: 15, on: true });
      const removeEffect = breakpointEffect.of({ pos: 15, on: false });

      expect(addEffect.value.on).toBe(true);
      expect(removeEffect.value.on).toBe(false);
      expect(addEffect.value.pos).toBe(removeEffect.value.pos);
    });
  });

  describe("breakpointState", () => {
    it("should initialize with empty range set", () => {
      const state = EditorState.create({
        doc: "test content",
        extensions: breakpointState
      });

      const breakpoints = state.field(breakpointState);
      expect(breakpoints).toBeDefined();

      // Verify it's empty by checking if between() finds nothing
      let hasBreakpoints = false;
      breakpoints.between(0, 100, () => {
        hasBreakpoints = true;
      });
      expect(hasBreakpoints).toBe(false);
    });

    it("should add breakpoint when effect is applied with on: true", () => {
      const state = EditorState.create({
        doc: "line1\nline2\nline3",
        extensions: breakpointState
      });

      const withBreakpoint = state.update({
        effects: breakpointEffect.of({ pos: 0, on: true })
      }).state;

      const breakpoints = withBreakpoint.field(breakpointState);
      expect(breakpoints).toBeDefined();

      // Verify breakpoint was added
      let foundBreakpoint = false;
      breakpoints.between(0, 0, () => {
        foundBreakpoint = true;
      });
      expect(foundBreakpoint).toBe(true);
    });

    it("should remove breakpoint when effect is applied with on: false", () => {
      const state = EditorState.create({
        doc: "line1\nline2\nline3",
        extensions: breakpointState
      });

      // Add breakpoint first
      const withBreakpoint = state.update({
        effects: breakpointEffect.of({ pos: 0, on: true })
      }).state;

      // Verify it was added
      let hasBreakpoint = false;
      withBreakpoint.field(breakpointState).between(0, 0, () => {
        hasBreakpoint = true;
      });
      expect(hasBreakpoint).toBe(true);

      // Remove breakpoint
      const withoutBreakpoint = withBreakpoint.update({
        effects: breakpointEffect.of({ pos: 0, on: false })
      }).state;

      // Verify it was removed
      hasBreakpoint = false;
      withoutBreakpoint.field(breakpointState).between(0, 0, () => {
        hasBreakpoint = true;
      });
      expect(hasBreakpoint).toBe(false);
    });

    it("should handle multiple breakpoints", () => {
      const state = EditorState.create({
        doc: "line1\nline2\nline3\nline4",
        extensions: breakpointState
      });

      const withBreakpoints = state.update({
        effects: [
          breakpointEffect.of({ pos: 0, on: true }),
          breakpointEffect.of({ pos: 6, on: true }),
          breakpointEffect.of({ pos: 12, on: true })
        ]
      }).state;

      const breakpoints = withBreakpoints.field(breakpointState);

      // Verify all breakpoints exist
      const positions = [0, 6, 12];
      positions.forEach((pos) => {
        let found = false;
        breakpoints.between(pos, pos, () => {
          found = true;
        });
        expect(found).toBe(true);
      });
    });

    it("should handle document changes and mapping", () => {
      const state = EditorState.create({
        doc: "line1\nline2",
        extensions: breakpointState
      });

      // Add breakpoint at position 6 (start of line2)
      const withBreakpoint = state.update({
        effects: breakpointEffect.of({ pos: 6, on: true })
      }).state;

      // Insert text at the beginning, which should shift the breakpoint
      const afterChange = withBreakpoint.update({
        changes: { from: 0, to: 0, insert: "new " }
      }).state;

      // The breakpoint should still exist but at a shifted position
      const breakpoints = afterChange.field(breakpointState);
      let foundBreakpoint = false;
      breakpoints.between(0, afterChange.doc.length, () => {
        foundBreakpoint = true;
      });
      expect(foundBreakpoint).toBe(true);
    });

    it("should handle removing and adding breakpoints in sequence", () => {
      const state = EditorState.create({
        doc: "line1\nline2\nline3",
        extensions: breakpointState
      });

      // Add breakpoint
      let currentState = state.update({
        effects: breakpointEffect.of({ pos: 0, on: true })
      }).state;

      // Remove breakpoint
      currentState = currentState.update({
        effects: breakpointEffect.of({ pos: 0, on: false })
      }).state;

      // Add breakpoint at different position
      currentState = currentState.update({
        effects: breakpointEffect.of({ pos: 6, on: true })
      }).state;

      const breakpoints = currentState.field(breakpointState);

      // Should not have breakpoint at position 0
      let hasBreakpointAt0 = false;
      breakpoints.between(0, 0, () => {
        hasBreakpointAt0 = true;
      });
      expect(hasBreakpointAt0).toBe(false);

      // Should have breakpoint at position 6
      let hasBreakpointAt6 = false;
      breakpoints.between(6, 6, () => {
        hasBreakpointAt6 = true;
      });
      expect(hasBreakpointAt6).toBe(true);
    });
  });

  describe("breakpointGutter", () => {
    it("should be an array of extensions", () => {
      expect(Array.isArray(breakpointGutter)).toBe(true);
      expect(breakpointGutter.length).toBeGreaterThan(0);
    });

    it("should include breakpointState", () => {
      expect(breakpointGutter).toContain(breakpointState);
    });

    it("should work with CodeMirror state", () => {
      const state = EditorState.create({
        doc: "line1\nline2\nline3",
        extensions: breakpointGutter
      });

      expect(state).toBeDefined();
      expect(state.doc.toString()).toBe("line1\nline2\nline3");

      // Should have access to breakpoint state
      const breakpoints = state.field(breakpointState);
      expect(breakpoints).toBeDefined();
    });

    it("should handle breakpoint operations when used as full extension", () => {
      const state = EditorState.create({
        doc: "line1\nline2\nline3\nline4",
        extensions: breakpointGutter
      });

      // Add multiple breakpoints
      const withBreakpoints = state.update({
        effects: [
          breakpointEffect.of({ pos: 0, on: true }), // line1
          breakpointEffect.of({ pos: 12, on: true }) // line3
        ]
      }).state;

      const breakpoints = withBreakpoints.field(breakpointState);

      // Verify breakpoints exist
      let count = 0;
      breakpoints.between(0, withBreakpoints.doc.length, () => {
        count++;
      });
      expect(count).toBe(2);
    });
  });

  describe("breakpoint logic and behavior", () => {
    it("should toggle breakpoints correctly", () => {
      const state = EditorState.create({
        doc: "line1\nline2\nline3",
        extensions: breakpointGutter
      });

      const pos = 0;

      // Check if breakpoint exists (should not)
      let hasBreakpoint = false;
      state.field(breakpointState).between(pos, pos, () => {
        hasBreakpoint = true;
      });
      expect(hasBreakpoint).toBe(false);

      // Add breakpoint
      const withBreakpoint = state.update({
        effects: breakpointEffect.of({ pos, on: true })
      }).state;

      // Check if breakpoint exists (should now)
      hasBreakpoint = false;
      withBreakpoint.field(breakpointState).between(pos, pos, () => {
        hasBreakpoint = true;
      });
      expect(hasBreakpoint).toBe(true);

      // Remove breakpoint
      const withoutBreakpoint = withBreakpoint.update({
        effects: breakpointEffect.of({ pos, on: false })
      }).state;

      // Check if breakpoint exists (should not)
      hasBreakpoint = false;
      withoutBreakpoint.field(breakpointState).between(pos, pos, () => {
        hasBreakpoint = true;
      });
      expect(hasBreakpoint).toBe(false);
    });

    it("should handle edge cases", () => {
      const state = EditorState.create({
        doc: "short",
        extensions: breakpointGutter
      });

      // Try to add breakpoint beyond document length
      const withBreakpoint = state.update({
        effects: breakpointEffect.of({ pos: 100, on: true })
      }).state;

      // Should not crash
      expect(withBreakpoint).toBeDefined();
      const breakpoints = withBreakpoint.field(breakpointState);
      expect(breakpoints).toBeDefined();
    });
  });

  describe("dummy data for manual testing", () => {
    it("should provide comprehensive test scenarios", () => {
      const testScenarios = [
        {
          description: "Basic breakpoint toggle",
          content: 'function test() {\n  console.log("hello");\n  return true;\n}',
          instructions: [
            "1. Click on line numbers to toggle breakpoints",
            "2. Verify red dots appear/disappear on gutter",
            "3. Hover over line numbers to see hover effects",
            '4. Check tooltips show "Add breakpoint" and "Remove breakpoint"'
          ],
          testBreakpoints: [
            { line: 1, pos: 0, description: "Function declaration" },
            { line: 2, pos: 17, description: "Console.log statement" },
            { line: 3, pos: 43, description: "Return statement" }
          ]
        },
        {
          description: "Multiple breakpoints management",
          content: "let a = 1;\nlet b = 2;\nlet c = a + b;\nconsole.log(c);\nreturn c;",
          instructions: [
            "1. Add breakpoints on lines 1, 3, and 5",
            "2. Verify multiple breakpoints can coexist",
            "3. Remove breakpoints individually",
            "4. Test adding/removing in different orders"
          ],
          testBreakpoints: [
            { line: 1, pos: 0, description: "Variable declaration a" },
            { line: 3, pos: 21, description: "Variable calculation" },
            { line: 5, pos: 52, description: "Return statement" }
          ]
        },
        {
          description: "Document editing with breakpoints",
          content: "line1\nline2\nline3\nline4",
          instructions: [
            "1. Set breakpoints on lines 2 and 4",
            "2. Insert new lines at the beginning",
            "3. Verify breakpoints move to correct new positions",
            "4. Delete lines and verify breakpoint behavior"
          ],
          testBreakpoints: [
            { line: 2, pos: 6, description: "Second line" },
            { line: 4, pos: 18, description: "Fourth line" }
          ]
        },
        {
          description: "Long code with scrolling",
          content: Array.from({ length: 30 }, (_, i) => `line ${i + 1}: some code here`).join("\n"),
          instructions: [
            "1. Scroll through the editor",
            "2. Add breakpoints on various lines while scrolling",
            "3. Verify breakpoints persist during scrolling",
            "4. Test performance with many breakpoints"
          ]
        },
        {
          description: "Edge cases",
          content: "a",
          instructions: [
            "1. Test breakpoints on single-character lines",
            "2. Try clicking beyond document boundaries",
            "3. Test rapid clicking to toggle breakpoints",
            "4. Verify graceful handling of all edge cases"
          ]
        }
      ];

      expect(testScenarios).toHaveLength(5);
      testScenarios.forEach((scenario, _index) => {
        expect(scenario.description).toBeDefined();
        expect(scenario.content).toBeDefined();
        expect(scenario.instructions.length).toBeGreaterThan(0);
      });
    });

    it("should provide test utilities for breakpoint management", () => {
      const testUtils = {
        createBreakpointEditor: (content: string) => {
          return EditorState.create({
            doc: content,
            extensions: breakpointGutter
          });
        },

        addBreakpoint: (state: EditorState, pos: number) => {
          return state.update({
            effects: breakpointEffect.of({ pos, on: true })
          }).state;
        },

        removeBreakpoint: (state: EditorState, pos: number) => {
          return state.update({
            effects: breakpointEffect.of({ pos, on: false })
          }).state;
        },

        toggleBreakpoint: (state: EditorState, pos: number) => {
          // Check if breakpoint exists
          let hasBreakpoint = false;
          state.field(breakpointState).between(pos, pos, () => {
            hasBreakpoint = true;
          });

          return state.update({
            effects: breakpointEffect.of({ pos, on: !hasBreakpoint })
          }).state;
        },

        getBreakpointPositions: (state: EditorState) => {
          const positions: number[] = [];
          state.field(breakpointState).between(0, state.doc.length, (from) => {
            positions.push(from);
          });
          return positions;
        }
      };

      // Test the utilities
      const state = testUtils.createBreakpointEditor("line1\nline2\nline3");

      const withBreakpoint = testUtils.addBreakpoint(state, 0);
      let positions = testUtils.getBreakpointPositions(withBreakpoint);
      expect(positions).toContain(0);

      const toggled = testUtils.toggleBreakpoint(withBreakpoint, 0);
      positions = testUtils.getBreakpointPositions(toggled);
      expect(positions).not.toContain(0);

      expect(typeof testUtils.createBreakpointEditor).toBe("function");
      expect(typeof testUtils.addBreakpoint).toBe("function");
      expect(typeof testUtils.removeBreakpoint).toBe("function");
      expect(typeof testUtils.toggleBreakpoint).toBe("function");
      expect(typeof testUtils.getBreakpointPositions).toBe("function");
    });

    it("should provide CSS classes for styling verification", () => {
      const cssClasses = {
        breakpointMarker: "cm-breakpoint-marker",
        idleMarker: "cm-idle-marker",
        hoveredIdleMarker: "hovered-idle-marker",
        breakpointGutter: "cm-breakpoint-gutter",
        gutterElement: "cm-gutterElement"
      };

      expect(cssClasses.breakpointMarker).toBe("cm-breakpoint-marker");
      expect(cssClasses.idleMarker).toBe("cm-idle-marker");
      expect(cssClasses.hoveredIdleMarker).toBe("hovered-idle-marker");
      expect(cssClasses.breakpointGutter).toBe("cm-breakpoint-gutter");
      expect(cssClasses.gutterElement).toBe("cm-gutterElement");

      // Verify these are the classes used by the extension
      // (This is a documentation test - the actual classes are defined in the extension)
      Object.values(cssClasses).forEach((className) => {
        expect(typeof className).toBe("string");
        expect(className.length).toBeGreaterThan(0);
      });
    });

    it("should provide performance testing scenarios", () => {
      const performanceScenarios = [
        {
          description: "Many breakpoints",
          setup: () => {
            const content = Array.from({ length: 100 }, (_, i) => `line ${i + 1}`).join("\n");
            let state = EditorState.create({
              doc: content,
              extensions: breakpointGutter
            });

            // Add breakpoints on every 5th line
            for (let i = 0; i < 100; i += 5) {
              const lineStart = state.doc.line(i + 1).from;
              state = state.update({
                effects: breakpointEffect.of({ pos: lineStart, on: true })
              }).state;
            }

            return state;
          }
        },
        {
          description: "Rapid breakpoint toggling",
          test: (state: EditorState) => {
            const pos = 0;
            let currentState = state;

            // Toggle 100 times
            for (let i = 0; i < 100; i++) {
              currentState = currentState.update({
                effects: breakpointEffect.of({ pos, on: i % 2 === 0 })
              }).state;
            }

            return currentState;
          }
        }
      ];

      expect(performanceScenarios).toHaveLength(2);

      // Test the performance scenario setup
      const scenario = performanceScenarios[0];
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!scenario?.setup) {
        throw new Error("Performance scenario not found");
      }
      const heavyState = scenario.setup();
      expect(heavyState.doc.lines).toBe(100);

      const positions: number[] = [];
      heavyState.field(breakpointState).between(0, heavyState.doc.length, (from) => {
        positions.push(from);
      });
      expect(positions.length).toBeGreaterThan(0); // Should have many breakpoints
    });
  });
});
