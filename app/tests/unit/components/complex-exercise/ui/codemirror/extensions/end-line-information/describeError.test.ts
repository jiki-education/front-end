import { describeError } from "@/components/complex-exercise/ui/codemirror/extensions/end-line-information/describeError";
import type { StaticError } from "@/components/complex-exercise/lib/stubs";
import { marked } from "marked";

// Mock marked module
jest.mock("marked", () => ({
  marked: {
    parse: jest.fn((text: string) => `<p>${text}</p>`),
    setOptions: jest.fn(),
    use: jest.fn(),
    Renderer: jest.fn().mockImplementation(() => ({
      code: null
    }))
  }
}));

describe("describeError", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("StaticError types", () => {
    describe("SyntaxError", () => {
      it("should display 'couldn't understand your code' for jikiscript", () => {
        const error: StaticError = {
          type: "SyntaxError",
          message: "Unexpected token"
        };

        const result = describeError(error, "jikiscript");

        expect(result).toContain("<h2>Jiki couldn't understand your code</h2>");
      });

      it("should display 'couldn't understand your code' for javascript", () => {
        const error: StaticError = {
          type: "SyntaxError",
          message: "Unexpected token"
        };

        const result = describeError(error, "javascript");

        expect(result).toContain("<h2>We couldn't understand your code</h2>");
      });

      it("should prepend context when provided", () => {
        const error: StaticError = {
          type: "SyntaxError",
          message: "Unexpected token"
        };

        const result = describeError(error, "jikiscript", "Test 1");

        expect(result).toContain("<h2>Test 1: Jiki couldn't understand your code</h2>");
      });
    });

    describe("LogicError", () => {
      it("should display 'Something didn't go as expected!' for jikiscript", () => {
        const error: StaticError = {
          type: "LogicError",
          message: "Division by zero"
        };

        const result = describeError(error, "jikiscript");

        expect(result).toContain("<h2>Something didn't go as expected!</h2>");
      });

      it("should display 'Something didn't go as expected!' for javascript", () => {
        const error: StaticError = {
          type: "LogicError",
          message: "Division by zero"
        };

        const result = describeError(error, "javascript");

        expect(result).toContain("<h2>Something didn't go as expected!</h2>");
      });

      it("should prepend context when provided", () => {
        const error: StaticError = {
          type: "LogicError",
          message: "Division by zero"
        };

        const result = describeError(error, "jikiscript", "Test 2");

        expect(result).toContain("<h2>Test 2: Something didn't go as expected!</h2>");
      });
    });

    describe("Other error types (fallback)", () => {
      const testCases = [
        { type: "RuntimeError", message: "Variable not defined" },
        { type: "TypeError", message: "Type mismatch" },
        { type: "ReferenceError", message: "Reference not found" },
        { type: "UnknownError", message: "Something went wrong" },
        { type: "CustomError", message: "Custom error message" }
      ];

      testCases.forEach(({ type, message }) => {
        it(`should display generic error heading for ${type} with jikiscript`, () => {
          const error: StaticError = { type, message };

          const result = describeError(error, "jikiscript");

          expect(result).toContain("<h2>Jiki hit a problem running your code.</h2>");
        });

        it(`should display generic error heading for ${type} with javascript`, () => {
          const error: StaticError = { type, message };

          const result = describeError(error, "javascript");

          expect(result).toContain("<h2>We hit a problem running your code.</h2>");
        });
      });

      it("should prepend context to generic error heading when provided", () => {
        const error: StaticError = {
          type: "RuntimeError",
          message: "Variable not defined"
        };

        const result = describeError(error, "jikiscript", "Test 3");

        expect(result).toContain("<h2>Test 3: Jiki hit a problem running your code.</h2>");
      });
    });
  });

  describe("marked integration", () => {
    it("should parse error message with marked", () => {
      const error: StaticError = {
        type: "SyntaxError",
        message: "This is **bold** text"
      };

      describeError(error, "jikiscript");

      expect(marked.parse).toHaveBeenCalledWith("This is **bold** text");
    });

    it("should configure marked with custom renderer for code blocks", () => {
      const error: StaticError = {
        type: "SyntaxError",
        message: "Some error"
      };

      describeError(error, "jikiscript");

      expect(marked.setOptions).toHaveBeenCalledWith(
        expect.objectContaining({
          renderer: expect.any(Object)
        })
      );
    });
  });

  describe("HTML structure", () => {
    it("should wrap parsed message in content div", () => {
      const error: StaticError = {
        type: "SyntaxError",
        message: "Error message"
      };
      // TypeScript fix: Use 'as unknown as jest.Mock' for marked.parse
      // The marked library doesn't have mock methods, so we need to cast through 'unknown'
      // to treat it as a Jest mock in our test environment
      (marked.parse as unknown as jest.Mock).mockReturnValue("<p>Parsed message</p>");

      const result = describeError(error, "jikiscript");

      expect(result).toContain('<div class="content"><p>Parsed message</p>');
      expect(result).toContain("</div>");
    });

    it("should return complete HTML structure", () => {
      const error: StaticError = {
        type: "RuntimeError",
        message: "Test error"
      };
      // TypeScript fix: Cast marked.parse to jest.Mock through 'unknown'
      (marked.parse as unknown as jest.Mock).mockReturnValue("<p>Test error</p>");

      const result = describeError(error, "jikiscript");

      expect(result).toMatch(/<h2>.*<\/h2>/);
      expect(result).toMatch(/<div class="content">.*<\/div>/);
    });
  });

  describe("edge cases", () => {
    it("should handle empty error message", () => {
      const error: StaticError = {
        type: "SyntaxError",
        message: ""
      };

      const result = describeError(error, "jikiscript");

      expect(result).toBeDefined();
      expect(marked.parse).toHaveBeenCalledWith("");
    });

    it("should handle error with all optional fields populated", () => {
      const error: StaticError = {
        type: "SyntaxError",
        message: "Error at specific location",
        line: 5,
        column: 10,
        endLine: 5,
        endColumn: 15
      };

      const result = describeError(error, "jikiscript");

      expect(result).toBeDefined();
      expect(result).toContain("<h2>Jiki couldn't understand your code</h2>");
    });
  });
});
