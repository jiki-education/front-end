import type { EditorView } from "@codemirror/view";

export function scrollToLine(view: EditorView | null, line: number): void {
  if (!view) {
    return;
  }
  const doc = view.state.doc;

  // Safety check to prevent RangeError for invalid line numbers
  if (line <= 0 || line > doc.lines) {
    return;
  }

  const linePos = doc.line(line);
  const lineBlock = view.lineBlockAt(linePos.from);
  // TODO: Check why if it's really always truthy or not
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (lineBlock) {
    const viewportHeight = view.scrollDOM.clientHeight;
    const blockHeight = lineBlock.bottom - lineBlock.top;

    const centeredTop = lineBlock.top - viewportHeight / 2 + blockHeight / 2;

    view.scrollDOM.scrollTo({ top: centeredTop });
  }
}
