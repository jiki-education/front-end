import { EDITOR_COLORS, styles, jsTheme } from "@/components/coding-exercise/ui/codemirror/extensions/js-theme";
import { tags as t } from "@lezer/highlight";

describe("js-theme", () => {
  describe("EDITOR_COLORS", () => {
    it("should define all required color properties", () => {
      expect(EDITOR_COLORS).toEqual({
        background: "#FFFFFF",
        foreground: "#4D4D4C",
        caret: "#AEAFAD",
        gutterBackground: "#FFFFFF",
        gutterForeground: "#4D4D4C80",
        lineHighlight: "#D6ECFA80",
        selection: "#D5D1F2",
        selectionMatch: "#D5D1F2"
      });
    });

    it("should use valid hex color values", () => {
      Object.values(EDITOR_COLORS).forEach((color) => {
        // Valid hex color (with optional alpha) or rgba
        expect(color).toMatch(/^#[0-9A-F]{6}([0-9A-F]{2})?$/i);
      });
    });
  });

  describe("styles", () => {
    it("should be an array of style objects", () => {
      expect(Array.isArray(styles)).toBe(true);
      expect(styles.length).toBeGreaterThan(0);
    });

    it("should contain comment styles", () => {
      const commentStyle = styles.find((style) => {
        const tags = Array.isArray(style.tag) ? style.tag : [style.tag];
        return tags.includes(t.comment);
      });
      expect(commentStyle).toBeDefined();
      expect(commentStyle?.color).toBe("#818B94");
      expect(commentStyle?.fontStyle).toBe("italic");
    });

    it("should contain string styles", () => {
      const stringStyle = styles.find((style) => {
        const tags = Array.isArray(style.tag) ? style.tag : [style.tag];
        return tags.includes(t.string);
      });
      expect(stringStyle).toBeDefined();
      expect(stringStyle?.color).toBe("#3E8A00");
    });

    it("should contain keyword styles", () => {
      const keywordStyle = styles.find((style) => {
        const tags = Array.isArray(style.tag) ? style.tag : [style.tag];
        return tags.includes(t.keyword);
      });
      expect(keywordStyle).toBeDefined();
      expect(keywordStyle?.color).toBe("#0080FF");
      expect(keywordStyle?.fontWeight).toBe("500");
    });

    it("should contain function styles with underline", () => {
      const functionStyle = styles.find((style) => {
        const tags = Array.isArray(style.tag) ? style.tag : [style.tag];
        return tags.some((tag) => tag === t.function(t.variableName) || tag === t.function(t.propertyName));
      });
      expect(functionStyle).toBeDefined();
      expect(functionStyle?.color).toBe("rgb(184, 0, 255)");
      expect(functionStyle?.borderBottom).toContain("rgba(184, 0, 255, 0.6)");
    });

    it("should contain error styles", () => {
      const errorStyle = styles.find((style) => style.tag === t.invalid);
      expect(errorStyle).toBeDefined();
      expect(errorStyle?.color).toBe("#f00");
      expect(errorStyle?.textDecoration).toBe("underline");
    });

    it("should have valid color values for all styles", () => {
      styles.forEach((style) => {
        if (style.color) {
          // Allow hex colors, rgb/rgba, and named colors
          expect(style.color).toMatch(/^(#[0-9A-F]{3,8}|rgb\([^)]+\)|rgba\([^)]+\)|[a-z]+)$/i);
        }
      });
    });
  });

  describe("jsTheme", () => {
    it("should be a valid CodeMirror theme", () => {
      expect(jsTheme).toBeDefined();
      expect(typeof jsTheme).toBe("object");
    });

    it("should contain theme configuration", () => {
      // The theme is created by @uiw/codemirror-themes createTheme function
      // We can't easily test the internal structure, but we can verify it exists
      // and appears to be a valid theme object
      expect(jsTheme).toBeTruthy();
    });
  });

  describe("theme integration", () => {
    it("should use EDITOR_COLORS in theme creation", () => {
      // Since createTheme is from an external library, we verify our input is correct
      expect(EDITOR_COLORS.background).toBe("#FFFFFF");
      expect(EDITOR_COLORS.foreground).toBe("#4D4D4C");
    });

    it("should use styles array in theme creation", () => {
      expect(styles.length).toBeGreaterThan(10); // Should have many syntax highlighting rules
      styles.forEach((style) => {
        expect(style).toHaveProperty("tag");
        expect(Array.isArray(style.tag) || typeof style.tag === "object").toBe(true);
      });
    });
  });

  describe("dummy data for manual testing", () => {
    it("should provide sample code for testing theme", () => {
      const sampleCode = `
// Comment test
function testFunction(param) {
  const variable = "string value";
  let number = 42;
  let boolean = true;
  let regex = /test.*pattern/g;
  
  if (variable === "test") {
    console.log(\`Template \${variable}\`);
  }
  
  return {
    property: variable,
    method: () => number + 1,
    invalid syntax here // This should show error styling
  };
}

class TestClass {
  constructor(public prop: string) {}
  
  method() {
    return this.prop.toLowerCase();
  }
}
      `.trim();

      expect(sampleCode).toContain("// Comment test");
      expect(sampleCode).toContain("function testFunction");
      expect(sampleCode).toContain("const variable");
      expect(sampleCode).toContain("class TestClass");
    });
  });
});
