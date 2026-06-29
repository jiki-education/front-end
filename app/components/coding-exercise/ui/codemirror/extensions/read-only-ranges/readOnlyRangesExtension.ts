import { EditorState, Transaction, type Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { getAvailableRanges } from "range-analyzer";

export const smartDelete = (
  getReadOnlyRanges: (targetState: EditorState) => Array<{ from: number | undefined; to: number | undefined }>
) =>
  EditorState.transactionFilter.of((tr: Transaction) => {
    if (tr.isUserEvent("delete.selection") && !tr.isUserEvent("delete.selection.smart")) {
      const initialSelections = tr.startState.selection.ranges.map((range) => ({
        from: range.from,
        to: range.to
      }));

      if (initialSelections.length > 0) {
        const readOnlyRanges = getReadOnlyRanges(tr.startState);
        const result = getAvailableRanges(readOnlyRanges, initialSelections[0], {
          from: 0,
          to: tr.startState.doc.line(tr.startState.doc.lines).to
        }) as Array<{ from: number; to: number }>;

        return result.map((range) =>
          tr.startState.update({
            changes: {
              from: range.from,
              to: range.to
            },
            annotations: Transaction.userEvent.of(`${tr.annotation(Transaction.userEvent)}.smart`)
          })
        );
      }
    }

    return tr;
  });

export const preventModifyTargetRanges = (
  getReadOnlyRanges: (targetState: EditorState) => Array<{ from: number | undefined; to: number | undefined }>
) =>
  EditorState.changeFilter.of((tr: Transaction) => {
    try {
      const readOnlyRangesBeforeTransaction = getReadOnlyRanges(tr.startState);
      const readOnlyRangesAfterTransaction = getReadOnlyRanges(tr.state);

      for (let i = 0; i < readOnlyRangesBeforeTransaction.length; i++) {
        const targetFromBeforeTransaction = readOnlyRangesBeforeTransaction[i].from ?? 0;
        const targetToBeforeTransaction =
          readOnlyRangesBeforeTransaction[i].to ?? tr.startState.doc.line(tr.startState.doc.lines).to;

        // Check if the corresponding range exists in the after transaction
        if (i >= readOnlyRangesAfterTransaction.length) {
          return false; // Range was removed, prevent the change
        }

        const targetFromAfterTransaction = readOnlyRangesAfterTransaction[i].from ?? 0;
        const targetToAfterTransaction =
          readOnlyRangesAfterTransaction[i].to ?? tr.state.doc.line(tr.state.doc.lines).to;

        if (
          tr.startState.sliceDoc(targetFromBeforeTransaction, targetToBeforeTransaction) !==
          tr.state.sliceDoc(targetFromAfterTransaction, targetToAfterTransaction)
        ) {
          return false;
        }
      }
    } catch (e) {
      console.error("Error in preventModifyTargetRanges", e);
      return false;
    }
    return true;
  });

export const smartPasteHandler =
  (getReadOnlyRanges: (targetState: EditorState) => Array<{ from: number | undefined; to: number | undefined }>) =>
  (event: ClipboardEvent, view: EditorView) => {
    const clipboardData = event.clipboardData ?? (window as any).clipboardData;
    const pastedData = clipboardData.getData("Text");
    const initialSelections = view.state.selection.ranges.map((range) => ({
      from: range.from,
      to: range.to
    }));

    if (initialSelections.length === 0) {
      return false;
    }

    const docLength = view.state.doc.length;
    const readOnlyRanges = getReadOnlyRanges(view.state);
    // getAvailableRanges can return `undefined` for an unbounded edge (it strips
    // its internal sentinels back to undefined), despite the cast — so we treat
    // a missing `from`/`to` as the document boundary below.
    const result = getAvailableRanges(readOnlyRanges, initialSelections[0], {
      from: 0,
      to: docLength
    }) as Array<{ from: number | undefined; to: number | undefined }>;

    if (result.length === 0) {
      // Paste target is entirely inside a readonly range — swallow the event
      // so the native paste doesn't fall through and modify the doc.
      event.preventDefault();
      return true;
    }

    // Normalize and clamp the target range to the current document so a missing
    // or out-of-range edge can never produce an invalid change/selection.
    const clamp = (pos: number) => Math.max(0, Math.min(pos, docLength));
    const from = clamp(result[0].from ?? 0);
    const to = clamp(result[0].to ?? docLength);
    const insertAt = { from: Math.min(from, to), to: Math.max(from, to) };

    // preventDefault + explicit selection keeps the cursor at the end of the
    // inserted text without relying on the native paste also firing. The anchor
    // is computed against the *resulting* doc length to avoid "Selection points
    // outside of document".
    event.preventDefault();
    const resultingLength = docLength - (insertAt.to - insertAt.from) + pastedData.length;
    view.dispatch({
      changes: {
        from: insertAt.from,
        to: insertAt.to,
        insert: pastedData
      },
      selection: { anchor: Math.min(insertAt.from + pastedData.length, resultingLength) },
      annotations: Transaction.userEvent.of(`input.paste.smart`)
    });
    return true;
  };

export const smartPaste = (
  getReadOnlyRanges: (targetState: EditorState) => Array<{ from: number | undefined; to: number | undefined }>
) =>
  EditorView.domEventHandlers({
    paste: smartPasteHandler(getReadOnlyRanges)
  });

function readOnlyRangesExtension(
  getReadOnlyRanges: (targetState: EditorState) => Array<{ from: number | undefined; to: number | undefined }>
): Extension {
  return [smartPaste(getReadOnlyRanges), smartDelete(getReadOnlyRanges), preventModifyTargetRanges(getReadOnlyRanges)];
}
export default readOnlyRangesExtension;
