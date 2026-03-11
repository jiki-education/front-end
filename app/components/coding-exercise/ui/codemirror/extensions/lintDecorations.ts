import { StateEffect, StateField } from "@codemirror/state";
import { Decoration, EditorView, type DecorationSet, hoverTooltip } from "@codemirror/view";
import { cleanUpEditorEffect } from "./clean-up-editor";

interface LintDecoration {
  line: number;
  from: number;
  to: number;
  message: string;
}

export const setLintDecorationsEffect = StateEffect.define<LintDecoration[]>();

const lintUnderlineMark = Decoration.mark({ class: "cm-lint-warning" });

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

        const decos: ReturnType<typeof lintUnderlineMark.range>[] = [];
        for (const err of lintErrors) {
          // absolute positions are 1-based, CodeMirror is 0-based
          const from = err.from - 1;
          const to = err.to - 1;
          if (from >= 0 && to <= tr.newDoc.length && from < to) {
            decos.push(lintUnderlineMark.range(from, to));
          }
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
  const error = errors.find((e) => e.line === lineNumber);

  if (!error) {
    return null;
  }

  return {
    pos: line.from,
    end: line.to,
    above: true,
    create() {
      const dom = document.createElement("div");
      dom.className = "cm-lint-tooltip";
      dom.textContent = error.message;
      return { dom };
    }
  };
});

const lintTheme = EditorView.baseTheme({
  ".cm-lint-warning": {
    textDecoration: "wavy underline var(--color-orange-500)",
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
