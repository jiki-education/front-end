import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import type { TagStyle } from "@codemirror/language";

// Light theme colors (existing)
export const LIGHT_EDITOR_COLORS = {
  background: "#FFFFFF",
  foreground: "#4D4D4C",
  caret: "#AEAFAD",
  gutterBackground: "#FFFFFF",
  gutterForeground: "#4D4D4C80",
  lineHighlight: "#D6ECFA80",
  selection: "#3B82F6",
  selectionMatch: "#3B82F6"
};

// Dark theme colors
export const DARK_EDITOR_COLORS = {
  background: "#1a1a1a",
  foreground: "#e4e4e7",
  caret: "#a1a1aa",
  gutterBackground: "#1a1a1a",
  gutterForeground: "#71717a",
  lineHighlight: "#374151",
  selection: "#2563EB",
  selectionMatch: "#2563EB"
};

// Light theme syntax highlighting
export const lightStyles: TagStyle[] = [
  {
    tag: [t.comment, t.lineComment, t.blockComment],
    color: "#818B94",
    fontStyle: "italic"
  },
  {
    tag: [t.string, t.special(t.string)],
    color: "#3E8A00"
  },
  {
    tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.moduleKeyword],
    color: "#0080FF",
    fontWeight: "500"
  },
  {
    tag: t.variableName,
    color: "#7A009F"
  },
  {
    tag: t.definition(t.variableName),
    color: "#7A009F"
  },
  {
    tag: t.constant(t.variableName),
    color: "#AA00FF"
  },
  {
    tag: [t.function(t.variableName), t.function(t.propertyName)],
    color: "rgb(184, 0, 255)",
    borderBottom: "0.5px solid rgba(184, 0, 255, 0.6)"
  },
  {
    tag: [t.propertyName],
    color: "#0D47A1"
  },
  {
    tag: t.definition(t.propertyName),
    color: "#0D47A1"
  },
  {
    tag: t.className,
    color: "#00008B"
  },
  {
    tag: t.typeName,
    color: "#005CC5"
  },
  {
    tag: [t.bool, t.null, t.number, t.float],
    color: "#F33636"
  },
  {
    tag: [t.logicOperator, t.arithmeticOperator, t.compareOperator, t.updateOperator, t.operator],
    color: "#0080FF"
  },
  {
    tag: t.regexp,
    color: "#E91E63"
  },
  {
    tag: [t.paren, t.squareBracket, t.brace, t.angleBracket, t.separator],
    color: "#888"
  },
  {
    tag: [t.tagName],
    color: "#0288D1"
  },
  {
    tag: [t.attributeName],
    color: "#0D47A1"
  },
  {
    tag: [t.attributeValue],
    color: "#3E8A00"
  },
  {
    tag: t.namespace,
    color: "#795548"
  },
  {
    tag: [t.meta, t.self],
    color: "#607D8B",
    fontStyle: "italic"
  },
  {
    tag: t.invalid,
    color: "#f00",
    textDecoration: "underline"
  }
];

// Dark theme syntax highlighting (adjusted for dark backgrounds)
export const darkStyles: TagStyle[] = [
  {
    tag: [t.comment, t.lineComment, t.blockComment],
    color: "#9ca3af",
    fontStyle: "italic"
  },
  {
    tag: [t.string, t.special(t.string)],
    color: "#10b981"
  },
  {
    tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.moduleKeyword],
    color: "#60a5fa",
    fontWeight: "500"
  },
  {
    tag: t.variableName,
    color: "#c084fc"
  },
  {
    tag: t.definition(t.variableName),
    color: "#c084fc"
  },
  {
    tag: t.constant(t.variableName),
    color: "#a855f7"
  },
  {
    tag: [t.function(t.variableName), t.function(t.propertyName)],
    color: "#f472b6",
    borderBottom: "0.5px solid rgba(244, 114, 182, 0.6)"
  },
  {
    tag: [t.propertyName],
    color: "#38bdf8"
  },
  {
    tag: t.definition(t.propertyName),
    color: "#38bdf8"
  },
  {
    tag: t.className,
    color: "#7dd3fc"
  },
  {
    tag: t.typeName,
    color: "#60a5fa"
  },
  {
    tag: [t.bool, t.null, t.number, t.float],
    color: "#fb7185"
  },
  {
    tag: [t.logicOperator, t.arithmeticOperator, t.compareOperator, t.updateOperator, t.operator],
    color: "#60a5fa"
  },
  {
    tag: t.regexp,
    color: "#f472b6"
  },
  {
    tag: [t.paren, t.squareBracket, t.brace, t.angleBracket, t.separator],
    color: "#9ca3af"
  },
  {
    tag: [t.tagName],
    color: "#38bdf8"
  },
  {
    tag: [t.attributeName],
    color: "#38bdf8"
  },
  {
    tag: [t.attributeValue],
    color: "#10b981"
  },
  {
    tag: t.namespace,
    color: "#a78bfa"
  },
  {
    tag: [t.meta, t.self],
    color: "#9ca3af",
    fontStyle: "italic"
  },
  {
    tag: t.invalid,
    color: "#ef4444",
    textDecoration: "underline"
  }
];

// Create adaptive theme based on variant
export const createAdaptiveTheme = (variant: "light" | "dark") => {
  const settings = variant === "dark" ? DARK_EDITOR_COLORS : LIGHT_EDITOR_COLORS;
  const styles = variant === "dark" ? darkStyles : lightStyles;

  return createTheme({
    theme: variant,
    settings,
    styles
  });
};

// Export individual themes for direct use
export const lightTheme = createAdaptiveTheme("light");
export const darkTheme = createAdaptiveTheme("dark");
