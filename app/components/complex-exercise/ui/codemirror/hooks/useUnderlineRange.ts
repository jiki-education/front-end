import type { EditorView } from "codemirror";
import { useEffect } from "react";
import { addUnderlineEffect } from "../extensions/underlineRange";

export function useUnderlineRange(editorView: EditorView | null, range: { from: number; to: number } | undefined) {
  useEffect(() => {
    if (!editorView) {
      return;
    }

    if (range !== undefined) {
      editorView.dispatch({
        effects: addUnderlineEffect.of(range)
      });
      const line = document.querySelector(".cm-underline");
      if (line) {
        line.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    }
  }, [editorView, range]);
}
