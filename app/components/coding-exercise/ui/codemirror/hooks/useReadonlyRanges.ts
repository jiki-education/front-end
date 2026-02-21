import type { ReadonlyRange } from "@jiki/curriculum";
import type { EditorView } from "codemirror";
import { useEffect } from "react";
import { updateReadOnlyRangesEffect } from "../extensions/read-only-ranges/readOnlyRanges";

export function useReadonlyRanges(editorView: EditorView | null, readonlyRanges: ReadonlyRange[]) {
  useEffect(() => {
    if (!editorView) {
      return;
    }

    editorView.dispatch({
      effects: updateReadOnlyRangesEffect.of(readonlyRanges)
    });
  }, [editorView, readonlyRanges]);
}
