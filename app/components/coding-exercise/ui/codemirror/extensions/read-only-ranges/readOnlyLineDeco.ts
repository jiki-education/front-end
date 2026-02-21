import { RangeSet, RangeSetBuilder, type Extension } from "@codemirror/state";
import type { ReadonlyRange } from "@jiki/curriculum";
import type { ViewUpdate } from "@codemirror/view";
import { Decoration, GutterMarker, ViewPlugin, gutter, gutterLineClass, type DecorationSet } from "@codemirror/view";
import { EditorView } from "codemirror";
import { readOnlyRangesStateField } from "./readOnlyRanges";

const baseTheme = EditorView.baseTheme({
  ".cm-lockedLine, .cm-lockedGutter": { backgroundColor: "#5C558944" },
  ".cm-partialLockedLine": { backgroundColor: "#5C558944" }
});

class LockMarker extends GutterMarker {
  toDOM() {
    const lockContainer = document.createElement("div");
    lockContainer.classList.add("cm-lock-marker");
    Object.assign(lockContainer.style, {
      height: "16px",
      width: "16px"
    });
    return lockContainer;
  }
}

class PartialLockMarker extends GutterMarker {
  toDOM() {
    const lockContainer = document.createElement("div");
    lockContainer.classList.add("cm-partial-lock-marker");
    Object.assign(lockContainer.style, {
      height: "16px",
      width: "16px"
    });
    return lockContainer;
  }
}

const fullLineDeco = Decoration.line({
  attributes: { class: "cm-lockedLine" }
});

const partialLineMark = Decoration.mark({ class: "cm-partialLockedLine" });

function isPartialRange(range: ReadonlyRange, doc: { line: (n: number) => { from: number; to: number } }): boolean {
  if (range.fromChar !== undefined && range.fromChar > 0) {
    return true;
  }
  if (range.toChar !== undefined) {
    const lastLine = doc.line(range.toLine);
    const lineLength = lastLine.to - lastLine.from;
    if (range.toChar < lineLength) {
      return true;
    }
  }
  return false;
}

function lockedLineDeco(view: EditorView) {
  const builder = new RangeSetBuilder<Decoration>();
  const readOnlyRanges = view.state.field(readOnlyRangesStateField);

  // Collect all decorations with their positions, then sort by from position
  const decos: Array<{ from: number; to: number; deco: Decoration }> = [];

  for (const range of readOnlyRanges) {
    if (isPartialRange(range, view.state.doc)) {
      // Partial range: use mark decoration for the specific char range
      const from = view.state.doc.line(range.fromLine).from + (range.fromChar ?? 0);
      const to =
        range.toChar !== undefined
          ? view.state.doc.line(range.toLine).from + range.toChar
          : view.state.doc.line(range.toLine).to;
      decos.push({ from, to, deco: partialLineMark });
    } else {
      // Whole-line range: use line decoration for each line
      for (let i = range.fromLine; i <= range.toLine; i++) {
        const linePos = view.state.doc.line(i).from;
        decos.push({ from: linePos, to: linePos, deco: fullLineDeco });
      }
    }
  }

  // Sort by from position (required by RangeSetBuilder)
  decos.sort((a, b) => a.from - b.from || a.to - b.to);
  for (const d of decos) {
    builder.add(d.from, d.to, d.deco);
  }

  return builder.finish();
}

const showStripes = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = lockedLineDeco(view);
    }

    update(update: ViewUpdate) {
      this.decorations = lockedLineDeco(update.view);
    }
  },
  {
    decorations: (v) => v.decorations
  }
);

const lockedLineGutterMarker = new (class extends GutterMarker {
  elementClass = "cm-lockedGutter";
})();

const lockedLineGutterHighlighter = gutterLineClass.compute([readOnlyRangesStateField, "doc"], (state) => {
  const marks = [];
  for (const range of state.field(readOnlyRangesStateField)) {
    for (let line = range.fromLine; line <= range.toLine; line++) {
      const linePos = state.doc.line(line).from;
      marks.push(lockedLineGutterMarker.range(linePos));
    }
  }
  return RangeSet.of(marks);
});

const iconContainerGutter = gutter({
  class: "cm-icon-container-gutter",
  lineMarker: (view, line) => {
    const readOnlyRanges = view.state.field(readOnlyRangesStateField);
    const lineNumber = view.state.doc.lineAt(line.from).number;
    for (const range of readOnlyRanges) {
      if (lineNumber >= range.fromLine && lineNumber <= range.toLine) {
        if (isPartialRange(range, view.state.doc)) {
          return new PartialLockMarker();
        }
        return new LockMarker();
      }
    }
    return null;
  }
});

export function readOnlyRangeDecoration(): Extension {
  return [baseTheme, showStripes, iconContainerGutter, lockedLineGutterHighlighter];
}
