import { EditorView } from "codemirror";

export const pasteHandler = (event: ClipboardEvent, view: EditorView) => {
  const pastedText = event.clipboardData?.getData("text");
  if (!pastedText) {
    return false;
  }

  // make sure things happen after the paste
  setTimeout(() => {
    const { from } = view.state.selection.main;
    const pastedLength = pastedText.length;
    // Clamp to doc.length — the paste may have been short-circuited (e.g. by
    // smart-paste against a readonly range) so `from + pastedLength` can
    // exceed the document, which makes CodeMirror throw
    // "Selection points outside of document".
    const anchor = Math.min(from + pastedLength, view.state.doc.length);

    view.dispatch({
      selection: { anchor },
      scrollIntoView: true
    });
  }, 0);

  return false;
};

export const moveCursorByPasteLength = EditorView.domEventHandlers({
  paste: pasteHandler
});
