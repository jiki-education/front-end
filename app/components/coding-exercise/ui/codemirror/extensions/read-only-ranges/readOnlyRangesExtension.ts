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
        const docLength = tr.startState.doc.length;
        const readOnlyRanges = getReadOnlyRanges(tr.startState);
        // getAvailableRanges can return `undefined` for an unbounded edge despite
        // the cast, so treat a missing `from`/`to` as the document boundary and
        // clamp into the document. Otherwise a malformed range could produce an
        // invalid change ("Invalid change range ...").
        const result = getAvailableRanges(readOnlyRanges, initialSelections[0], {
          from: 0,
          to: docLength
        }) as Array<{ from: number | undefined; to: number | undefined }>;

        const clamp = (pos: number) => Math.max(0, Math.min(pos, docLength));
        return result.map((range) => {
          const from = clamp(range.from ?? 0);
          const to = clamp(range.to ?? docLength);
          return tr.startState.update({
            changes: {
              from: Math.min(from, to),
              to: Math.max(from, to)
            },
            annotations: Transaction.userEvent.of(`${tr.annotation(Transaction.userEvent)}.smart`)
          });
        });
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
    // or out-of-range edge can never produce an invalid change.
    const clamp = (pos: number) => Math.max(0, Math.min(pos, docLength));
    const from = clamp(result[0].from ?? 0);
    const to = clamp(result[0].to ?? docLength);
    const insertAt = { from: Math.min(from, to), to: Math.max(from, to) };

    // Build the ChangeSet from the editor's own state and derive the cursor from
    // it, rather than computing an absolute position by hand. `mapPos(from, -1)`
    // is the change's start in the *resulting* document (it stays before any
    // inserted text), so the end of the inserted text is that + the inserted
    // length. Lengths and positions are both UTF-16 code-unit counts, so this is
    // correct for multi-unit input (emoji, astral, combining sequences) too.
    // Clamping to `changes.newLength` (the authoritative post-change length)
    // guarantees the selection can never point outside the document — even if
    // anything upstream is stale. This is what previously threw the Sentry
    // "RangeError: Selection points outside of document".
    event.preventDefault();
    const changes = view.state.changes({
      from: insertAt.from,
      to: insertAt.to,
      insert: pastedData
    });
    const anchor = Math.min(changes.mapPos(insertAt.from, -1) + pastedData.length, changes.newLength);
    view.dispatch({
      changes,
      selection: { anchor },
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
