interface AddContent {
  type: "type-out-code" | "push-code";
  line: number;
  code: string;
}

interface MarkLinesAsReadonly {
  type: "mark-lines-as-readonly";
  ranges: { from: number; to: number }[];
}

interface RemoveContent {
  type: "remove-line-content" | "remove-line";
  line: number;
}

interface BackspaceLines {
  type: "backspace-lines";
  from: number;
  to: number;
}

interface HighlightCode {
  type: "highlight-code";
  regex: string;
  ignoreCase?: boolean;
  lines?: {
    from: number;
    to: number;
  };
}

interface RemoveHighlighting {
  type: "remove-highlighting";
}
interface RevertLinesToEditable {
  type: "revert-lines-to-editable";
}

interface DeleteEditorContent {
  type: "delete-editor-content";
}

interface HighlightEditorContent {
  type: "highlight-editor-content";
}

interface PlaceCursor {
  type: "place-cursor";
  line: number;
  char: number;
}

export interface EditEditorActions {
  uuid: string;
  async: boolean;
  actions: (
    | AddContent
    | RemoveContent
    | BackspaceLines
    | HighlightCode
    | RemoveHighlighting
    | MarkLinesAsReadonly
    | RevertLinesToEditable
    | DeleteEditorContent
    | HighlightEditorContent
    | PlaceCursor
  )[];
}
