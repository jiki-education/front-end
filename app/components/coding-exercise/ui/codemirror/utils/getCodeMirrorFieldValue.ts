import type { StateField } from "@codemirror/state";
import type { EditorView } from "codemirror";

export function getCodeMirrorFieldValue<T>(view: EditorView | null, field: StateField<T>): T | undefined {
  if (!view) {
    return;
  }
  return view.state.field(field);
}
