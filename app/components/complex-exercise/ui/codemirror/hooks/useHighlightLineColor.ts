import type { EditorView } from "codemirror";
import { useEffect } from "react";
import { changeColorEffect } from "../extensions/lineHighlighter";

export function useHighlightLineColor(editorView: EditorView | null, highlightedLineColor: string) {
  useEffect(() => {
    if (!editorView) {
      return;
    }

    // dispatch a transaction which syncs cm's inner state with React's state
    if (highlightedLineColor) {
      editorView.dispatch({
        effects: changeColorEffect.of(highlightedLineColor)
      });
    }
  }, [editorView, highlightedLineColor]);
}
