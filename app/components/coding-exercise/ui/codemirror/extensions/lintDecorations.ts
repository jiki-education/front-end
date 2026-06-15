import { StateEffect, StateField } from "@codemirror/state";
import { Decoration, EditorView, type DecorationSet, hoverTooltip } from "@codemirror/view";
import { cleanUpEditorEffect } from "./clean-up-editor";

interface LintDecoration {
  line: number;
  message: string;
}

export const setLintDecorationsEffect = StateEffect.define<LintDecoration[]>();

const lintLineDecoration = Decoration.line({ class: "cm-lint-warning-line" });

export const lintDecorationsField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    if (tr.docChanged) {
      return Decoration.none;
    }

    for (const e of tr.effects) {
      if (e.is(cleanUpEditorEffect)) {
        return Decoration.none;
      }
      if (e.is(setLintDecorationsEffect)) {
        const lintErrors = e.value;
        if (lintErrors.length === 0) {
          return Decoration.none;
        }

        const doc = tr.newDoc;
        const seenLines = new Set<number>();
        const decos: ReturnType<typeof lintLineDecoration.range>[] = [];
        const sorted = [...lintErrors].sort((a, b) => a.line - b.line);
        for (const err of sorted) {
          if (err.line < 1 || err.line > doc.lines || seenLines.has(err.line)) {
            continue;
          }
          seenLines.add(err.line);
          decos.push(lintLineDecoration.range(doc.line(err.line).from));
        }

        return Decoration.set(decos, true);
      }
    }

    return decorations;
  },
  provide: (f) => EditorView.decorations.from(f)
});

// Store lint errors for tooltip lookup
const lintErrorsField = StateField.define<LintDecoration[]>({
  create() {
    return [];
  },
  update(errors, tr) {
    if (tr.docChanged) {
      return [];
    }
    for (const e of tr.effects) {
      if (e.is(cleanUpEditorEffect)) {
        return [];
      }
      if (e.is(setLintDecorationsEffect)) {
        return e.value;
      }
    }
    return errors;
  }
});

const lintTooltip = hoverTooltip((view, pos) => {
  const line = view.state.doc.lineAt(pos);
  const lineNumber = line.number;
  const errors = view.state.field(lintErrorsField);
  const messages = errors.filter((e) => e.line === lineNumber).map((e) => e.message);

  if (messages.length === 0) {
    return null;
  }

  return {
    pos: line.from,
    end: line.to,
    above: true,
    create() {
      const dom = document.createElement("div");
      dom.className = "cm-lint-tooltip";
      for (const message of messages) {
        const row = document.createElement("div");
        row.textContent = message;
        dom.appendChild(row);
      }
      return { dom };
    }
  };
});

const lintTheme = EditorView.baseTheme({
  ".cm-lint-warning-line": {
    textDecoration: "wavy underline var(--color-orange-500)",
    textDecorationSkipInk: "none",
    textUnderlineOffset: "3px"
  },
  ".cm-lint-tooltip": {
    backgroundColor: "var(--color-orange-100)",
    color: "var(--color-orange-900)",
    border: "1px solid var(--color-orange-300)",
    borderRadius: "4px",
    padding: "4px 8px",
    fontSize: "13px",
    maxWidth: "400px"
  }
});

export function lintDecorationsExtension() {
  return [lintDecorationsField, lintErrorsField, lintTooltip, lintTheme];
}
