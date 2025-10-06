import type { Extension } from "@codemirror/state";
import { EditorState } from "@codemirror/state";
import type { DecorationSet, ViewUpdate } from "@codemirror/view";
import { Decoration, EditorView, ViewPlugin } from "@codemirror/view";

const readonlyDeco = Decoration.mark({ class: "readonly" });

function createReadonlyPlugin(readonlyLength: number) {
  return ViewPlugin.fromClass(
    class {
      public decorations: DecorationSet;

      constructor(_view: EditorView) {
        this.decorations = Decoration.set([readonlyDeco.range(0, readonlyLength)]);
      }

      update(_update: ViewUpdate) {
        this.decorations = Decoration.set([readonlyDeco.range(0, readonlyLength)]);
      }
    },
    { decorations: (v) => v.decorations }
  );
}

function createReadonlyTransactionFilter(readonlyLength: number) {
  return EditorState.transactionFilter.of((tr) => {
    if (tr.newDoc.sliceString(0, readonlyLength) !== tr.startState.doc.sliceString(0, readonlyLength)) {
      return [];
    }
    return [tr];
  });
}

export const ReadonlyFunctionMyExtension = (readonlyLength: number): Extension => [
  createReadonlyPlugin(readonlyLength),
  createReadonlyTransactionFilter(readonlyLength),
  EditorView.theme({
    ".readonly": {
      background: "#cccccc88",
      filter: "grayscale(60%)",
      borderRadius: "4px",
      "pointer-events": "none"
    }
  })
];
