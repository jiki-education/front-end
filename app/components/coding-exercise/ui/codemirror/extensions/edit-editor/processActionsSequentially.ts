import type { EditorView } from "@codemirror/view";
import { showTutorTooltip } from "./customCursor";
import type { EditEditorActions } from "./processActionsSequentially.types";
import {
  addCodeToEndOfLine,
  backspaceLines,
  deleteEditorContent,
  highlightCodeSelection,
  highlightEditorContent,
  markLinesAsReadonly,
  placeCursor,
  removeAllHighlights,
  removeLine,
  removeLineContent,
  revertLinesToEditable,
  typeOutCode
} from "./utils";

const processedUuids: string[] = [];

export async function processActionsSequentially(
  editorView: EditorView | null,
  editEditorActions: EditEditorActions | undefined,
  uuid: string
): Promise<void> {
  if (!editorView || !editEditorActions || editEditorActions.actions.length === 0 || processedUuids.includes(uuid)) {
    return;
  }

  processedUuids.push(uuid);

  for (const action of editEditorActions.actions) {
    try {
      switch (action.type) {
        case "type-out-code":
          await typeOutCode(editorView, action);
          break;
        case "remove-line":
          await removeLine(editorView, action);
          break;
        case "push-code":
          await addCodeToEndOfLine(editorView, action);
          break;
        case "remove-line-content":
          await removeLineContent(editorView, action);
          break;
        case "highlight-code":
          await highlightCodeSelection(editorView, action);
          break;
        case "remove-highlighting":
          await removeAllHighlights(editorView);
          break;
        case "mark-lines-as-readonly":
          await markLinesAsReadonly(editorView, action.ranges);
          break;
        case "revert-lines-to-editable":
          await revertLinesToEditable(editorView);
          break;
        case "backspace-lines":
          await backspaceLines(editorView, action);
          break;
        case "delete-editor-content":
          await deleteEditorContent(editorView);
          break;
        case "highlight-editor-content":
          await highlightEditorContent(editorView);
          break;
        case "place-cursor":
          await placeCursor(editorView, {
            line: action.line,
            char: action.char
          });
          break;
      }

      // fixed delay between actions?
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (e) {
      console.error("Couldn't process things:", e);
    }
  }

  editorView.dispatch({ effects: showTutorTooltip.of(false) });
}

// actions examples

// const [id] = useState(uuid());
// const obj: EditEditorActions = {
//   uuid: id,
//   actions: [
// {
//   type: "type-out-code",
//   line: 4,
//   code: "// You can leave a comment like this",
// },
// { type: "remove-line-content", line: 4 },
// {
//   type: "type-out-code",
//   line: 4,
//   code: "// Now it's your turn.",
// },
// { type: "remove-line-content", line: 4 },
// { type: "highlight-code", from: 0, to: 10 },
// { type: "remove-highlighting" },
// {
//   type: "mark-lines-as-readonly",
//   ranges: [
//     { from: 1, to: 3 },
//     { from: 6, to: 6 },
//     { from: 11, to: 11 },
//   ],
// },
// {
//   type: "revert-lines-to-editable",
// },
//   ],
// };
