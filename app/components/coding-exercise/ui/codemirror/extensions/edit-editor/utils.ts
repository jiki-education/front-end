import { RegExpCursor } from "@codemirror/search";
import type { EditorView } from "@codemirror/view";
import { changeMultiLineHighlightEffect } from "../multiLineHighlighter";
import { updateReadOnlyRangesEffect } from "../read-only-ranges/readOnlyRanges";
import { showTutorTooltip } from "./customCursor";
import { addHighlight, removeAllHighlightEffect } from "./highlightRange";

// Helper function to safely get a line, creating it if it doesn't exist
function safeGetLine(view: EditorView, lineNumber: number) {
  const doc = view.state.doc;
  const totalLines = doc.lines;

  if (lineNumber <= totalLines) {
    return doc.line(lineNumber);
  }

  // Line doesn't exist, create empty lines up to the requested line
  const newLines = Array(lineNumber - totalLines)
    .fill("")
    .join("\n");
  const insertPos = doc.length;

  view.dispatch({
    changes: { from: insertPos, insert: "\n" + newLines }
  });

  // Return the newly created line
  return view.state.doc.line(lineNumber);
}

export function addCodeToEndOfLine(view: EditorView, { line, code }: { line: number; code: string }): Promise<void> {
  return new Promise((resolve) => {
    const lineObj = safeGetLine(view, line);
    const pos = lineObj.to;
    view.dispatch({
      changes: { from: pos, insert: code }
    });
    resolve();
  });
}

function randomNumberBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
export function typeOutCode(view: EditorView, { line, code }: { line: number; code: string }): Promise<void> {
  return new Promise((resolve) => {
    const lineObj = safeGetLine(view, line);
    let pos = lineObj.to;
    let index = 0;

    view.focus();
    // move to the desired line first, and then show the tooltip
    view.dispatch({
      selection: { anchor: pos, head: pos },
      effects: showTutorTooltip.of(true)
    });

    const typeChar = () => {
      if (index < code.length) {
        const char = code.charAt(index);

        view.dispatch({
          changes: { from: pos, insert: char },
          selection: { anchor: pos + 1, head: pos + 1 }
        });

        pos += 1;
        index += 1;

        const interval = randomNumberBetween(30, 200);

        setTimeout(typeChar, interval);
      } else {
        resolve();
      }
    };

    setTimeout(typeChar, 100);
  });
}

export function backspaceLines(view: EditorView, { from, to }: { from: number; to: number }): Promise<void> {
  return new Promise((resolve) => {
    const startPosObj = safeGetLine(view, from);
    const endPosObj = safeGetLine(view, to);
    const posStart = startPosObj.from;
    let posEnd = endPosObj.to;

    view.focus();
    // move to the desired line first, and then show the tooltip
    view.dispatch({
      selection: { anchor: posEnd, head: posEnd },
      effects: showTutorTooltip.of(true)
    });

    const deleteChar = () => {
      if (posStart < posEnd) {
        view.dispatch({
          changes: { from: posEnd - 1, to: posEnd }
        });

        posEnd -= 1;

        const interval = randomNumberBetween(30, 100);

        setTimeout(deleteChar, interval);
      } else {
        resolve();
      }
    };

    setTimeout(deleteChar, 100);
  });
}

export function markLinesAsReadonly(
  view: EditorView,
  ranges: Array<{ fromLine: number; toLine: number; fromChar?: number; toChar?: number }>
): Promise<void> {
  return new Promise((resolve) => {
    view.dispatch({
      effects: updateReadOnlyRangesEffect.of(ranges)
    });
    resolve();
  });
}
export function revertLinesToEditable(view: EditorView): Promise<void> {
  return new Promise((resolve) => {
    view.dispatch({
      effects: updateReadOnlyRangesEffect.of([])
    });
    resolve();
  });
}

export function highlightCodeSelection(
  view: EditorView,
  {
    regex,
    ignoreCase,
    lines
  }: {
    regex: string;
    ignoreCase?: boolean;
    lines?: { from: number; to: number };
  }
): Promise<void> {
  return new Promise((resolve) => {
    if (regex.length === 0) {
      resolve();
      return;
    }

    const fromChar = lines ? safeGetLine(view, lines.from).from : 0;
    const toChar = lines ? safeGetLine(view, lines.to).to : view.state.doc.length;

    const cursor = new RegExpCursor(
      view.state.doc,
      regex,
      {
        ignoreCase: ignoreCase || false
      },
      fromChar,
      toChar
    );

    while (!cursor.done) {
      const { from, to } = cursor.value;
      if (from > -1 && to > -1) {
        view.dispatch({ effects: addHighlight.of({ from, to }) });
      }
      cursor.next();
    }
    resolve();
  });
}

export function removeAllHighlights(view: EditorView): Promise<void> {
  return new Promise((resolve) => {
    view.dispatch({ effects: removeAllHighlightEffect.of() });

    resolve();
  });
}

export function removeLine(view: EditorView, { line }: { line: number }): Promise<void> {
  return new Promise((resolve) => {
    const lineObj = safeGetLine(view, line);
    const from = lineObj.from;
    let to = lineObj.to;
    if (line < view.state.doc.lines) {
      to += 1;
    }

    view.dispatch({
      changes: { from, to, insert: "" }
    });
    resolve();
  });
}

export function placeCursor(view: EditorView, options: { line: number; char: number }): Promise<void> {
  return new Promise((resolve) => {
    view.focus();
    const lineObj = safeGetLine(view, options.line);
    view.dispatch({
      selection: {
        anchor: lineObj.from + options.char,
        head: lineObj.from + options.char
      },
      effects: showTutorTooltip.of(true)
    });
    resolve();
  });
}

export function highlightEditorContent(view: EditorView): Promise<void> {
  return new Promise((resolve) => {
    const pos = view.state.doc.length;
    view.focus();
    view.dispatch({
      selection: { anchor: pos, head: pos },
      effects: [
        showTutorTooltip.of(true),
        changeMultiLineHighlightEffect.of(
          Array.from({ length: view.state.doc.lineAt(view.state.doc.length).number }, (_, i) => i + 1)
        )
      ]
    });

    resolve();
  });
}

export function deleteEditorContent(view: EditorView): Promise<void> {
  return new Promise((resolve) => {
    const pos = view.state.doc.length;
    view.focus();
    view.dispatch({
      selection: { anchor: pos, head: pos },
      effects: [
        showTutorTooltip.of(true),
        changeMultiLineHighlightEffect.of(
          Array.from({ length: view.state.doc.lineAt(view.state.doc.length).number }, (_, i) => i + 1)
        )
      ],
      scrollIntoView: true
    });

    setTimeout(() => {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: ""
        },
        effects: changeMultiLineHighlightEffect.of([])
      });
      resolve();
    }, 1000);
  });
}

// TODO: Recalculate character positions after removing lines
export function highlightAndRemoveLines(view: EditorView, range: { from: number; to: number }) {
  // return new Promise((resolve) => {
  for (let currentLine = range.from; currentLine <= range.to; currentLine++) {
    const lineInDocument = safeGetLine(view, currentLine);

    if (lineInDocument.from === lineInDocument.to) {
      continue;
    }
    view.dispatch({
      effects: addHighlight.of({
        from: lineInDocument.from,
        to: lineInDocument.to
      })
    });
  }

  const startingPosition = safeGetLine(view, range.from).from;
  setTimeout(() => {
    for (let currentLine = range.from; currentLine <= range.to; currentLine++) {
      const lineInDocument = safeGetLine(view, currentLine);

      // console.log("LINEFROM TO", lineInDocument.from, lineInDocument.to);
      view.dispatch({
        changes: {
          from: startingPosition,
          to: lineInDocument.to,
          insert: ""
        }
      });
    }
    // resolve();
  }, 500);
  // });
}

export function removeLineContent(view: EditorView, { line }: { line: number }): Promise<void> {
  return new Promise((resolve) => {
    const lineObj = safeGetLine(view, line);
    const from = lineObj.from;
    let to = lineObj.to;

    let insert = "";
    if (line < view.state.doc.lines) {
      to += 1;
      insert = "\n";
    }

    view.dispatch({
      changes: { from, to, insert: insert }
    });
    resolve();
  });
}
