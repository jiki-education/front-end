import { type Extension, RangeSetBuilder, StateEffect, StateField } from "@codemirror/state";
import type { ViewUpdate } from "@codemirror/view";
import { Decoration, type DecorationSet, EditorView, ViewPlugin } from "@codemirror/view";
import { changeColorEffect } from "./lineHighlighter";

export const changeMultiLineHighlightEffect = StateEffect.define<number[]>();

export const multiHighlightedLineField = StateField.define<number[]>({
  create() {
    return [];
  },
  update(value, tr) {
    for (const effect of tr.effects) {
      if (effect.is(changeMultiLineHighlightEffect)) {
        return effect.value;
      }
    }
    return value;
  }
});

export const multiHighlightColorField = StateField.define<string>({
  create() {
    return MULTI_HIGHLIGHT_COLOR;
  },
  update(value, tr) {
    for (const effect of tr.effects) {
      if (effect.is(changeColorEffect)) {
        return effect.value;
      }
    }
    return value;
  }
});

const MULTI_HIGHLIGHT_COLOR = "#ffeb3b44"; // Yellow with transparency

const baseTheme = EditorView.baseTheme({
  "&light .cm-multiHighlightedLine": { backgroundColor: MULTI_HIGHLIGHT_COLOR },
  "&dark .cm-multiHighlightedLine": { backgroundColor: "#ffeb3b22" }
});

function stripe(color: string) {
  return Decoration.line({
    attributes: {
      class: "cm-multiHighlightedLine",
      style: `background-color: ${color}`
    }
  });
}

function stripeDeco(view: EditorView) {
  const builder = new RangeSetBuilder<Decoration>();
  const highlightedLines = view.state.field(multiHighlightedLineField);
  const color = view.state.field(multiHighlightColorField);

  // Don't highlight if array is empty
  if (highlightedLines.length === 0) {
    return builder.finish();
  }

  // Sort lines to ensure decorations are added in order
  const validLines = highlightedLines
    .filter((lineNumber) => lineNumber > 0 && lineNumber <= view.state.doc.lines)
    .sort((a, b) => a - b);

  // Highlight each specified line
  for (const lineNumber of validLines) {
    try {
      const line = view.state.doc.line(lineNumber);
      builder.add(line.from, line.from, stripe(color));
    } catch {
      // Skip invalid lines
      continue;
    }
  }

  return builder.finish();
}

const showStripes = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = stripeDeco(view);
    }

    update(update: ViewUpdate) {
      this.decorations = stripeDeco(update.view);
    }
  },
  {
    decorations: (v) => v.decorations
  }
);

export function multiHighlightLine(initialLines: number[] = []): Extension {
  return [
    baseTheme,
    multiHighlightedLineField.init(() => initialLines),
    multiHighlightColorField.init(() => MULTI_HIGHLIGHT_COLOR),
    showStripes
  ];
}
