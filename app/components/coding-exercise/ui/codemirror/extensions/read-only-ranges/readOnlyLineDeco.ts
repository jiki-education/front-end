import { RangeSet, RangeSetBuilder, type Extension } from "@codemirror/state";
import type { ViewUpdate } from "@codemirror/view";
import { Decoration, GutterMarker, ViewPlugin, gutter, gutterLineClass, type DecorationSet } from "@codemirror/view";
import { EditorView } from "codemirror";
import { readOnlyRangesStateField } from "./readOnlyRanges";

const baseTheme = EditorView.baseTheme({
  ".cm-lockedLine, .cm-lockedGutter": { backgroundColor: "#5C558944" }
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
const gutterDeco = Decoration.line({
  attributes: { class: "cm-lockedLine" },
  gutterMarker: new LockMarker()
});

function lockedLineDeco(view: EditorView) {
  const builder = new RangeSetBuilder<Decoration>();
  const readOnlyRanges = view.state.field(readOnlyRangesStateField);
  for (const range of readOnlyRanges) {
    for (let i = range.from; i <= range.to; i++) {
      const linePos = view.state.doc.line(i).from;

      builder.add(linePos, linePos, gutterDeco);
    }
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

const lockedLineGutterHighlighter = gutterLineClass.compute(
  // dependency array
  [readOnlyRangesStateField, "doc"],
  (state) => {
    const marks = [];
    for (const range of state.field(readOnlyRangesStateField)) {
      for (let line = range.from; line <= range.to; line++) {
        const linePos = state.doc.line(line).from;
        marks.push(lockedLineGutterMarker.range(linePos));
      }
    }
    return RangeSet.of(marks);
  }
);

const iconContainerGutter = gutter({
  class: "cm-icon-container-gutter",
  lineMarker: (view, line) => {
    const readOnlyRanges = view.state.field(readOnlyRangesStateField);
    const lineNumber = view.state.doc.lineAt(line.from).number;
    for (const range of readOnlyRanges) {
      if (lineNumber >= range.from && lineNumber <= range.to) {
        return new LockMarker();
      }
    }
    return null;
  }
});

export function readOnlyRangeDecoration(): Extension {
  return [baseTheme, showStripes, iconContainerGutter, lockedLineGutterHighlighter];
}
