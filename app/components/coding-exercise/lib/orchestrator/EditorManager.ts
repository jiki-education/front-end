/* eslint-disable no-console */
import { foldEffect, unfoldEffect } from "@codemirror/language";
import type { Extension, StateEffectType } from "@codemirror/state";
import { EditorState } from "@codemirror/state";
import type { ViewUpdate } from "@codemirror/view";
import { EditorView } from "@codemirror/view";
import { debounce } from "lodash";
import type { StoreApi } from "zustand/vanilla";
import { readonlyCompartment, languageCompartment } from "../../ui/codemirror/setup/editorCompartments";
import { getLanguageExtension } from "../../ui/codemirror/setup/editorExtensions";
import {
  changeMultiLineHighlightEffect,
  informationWidgetDataEffect,
  showInfoWidgetEffect
} from "../../ui/codemirror/extensions";
import { cleanupAllInformationTooltips } from "../../ui/codemirror/extensions/end-line-information/cleanup";
import { breakpointEffect } from "../../ui/codemirror/extensions/breakpoint";
import {
  INFO_HIGHLIGHT_COLOR,
  changeColorEffect,
  changeLineEffect
} from "../../ui/codemirror/extensions/lineHighlighter";
import {
  readOnlyRangesStateField,
  updateReadOnlyRangesEffect
} from "../../ui/codemirror/extensions/read-only-ranges/readOnlyRanges";
import { addUnderlineEffect } from "../../ui/codemirror/extensions/underlineRange";
import { setLintDecorationsEffect } from "../../ui/codemirror/extensions/lintDecorations";
import { createEditorExtensions } from "../../ui/codemirror/setup/editorExtensions";
import { getBreakpointLines } from "../../ui/codemirror/utils/getBreakpointLines";
import { getCodeMirrorFieldValue } from "../../ui/codemirror/utils/getCodeMirrorFieldValue";
import { getFoldedLines as getCodeMirrorFoldedLines } from "../../ui/codemirror/utils/getFoldedLines";
import { scrollToLine } from "../../ui/codemirror/utils/scrollToLine";
import { updateUnfoldableFunctions } from "../../ui/codemirror/utils/unfoldableFunctionNames";
import type { ReadonlyRange } from "@jiki/curriculum";
import { saveCodeMirrorContent } from "../localStorage";
import type { InformationWidgetData, OrchestratorStore, UnderlineRange } from "../types";

export class EditorManager {
  readonly editorView: EditorView;
  private isSaving = false;
  private saveDebounced: ReturnType<typeof debounce> | null = null;

  constructor(
    element: HTMLDivElement,
    private readonly store: StoreApi<OrchestratorStore>,
    private readonly exerciseSlug: string,
    code: string,
    readonlyRanges: ReadonlyRange[],
    private readonly runCode: (code: string) => void,
    private readonly lintCode?: (code: string) => void
  ) {
    this.initializeAutoSave();
    this.initializeSubscriptions();

    // Get values from store
    const state = this.store.getState();
    const readonly = state.readonly;
    const highlightedLine = state.highlightedLine;
    const shouldAutoRunCode = state.shouldAutoRunCode;
    const language = state.language;

    // Create event handlers
    const onBreakpointChange = this.createBreakpointChangeHandler();
    const onFoldChange = this.createFoldChangeHandler();
    const onEditorChange = this.createEditorChangeHandlers(shouldAutoRunCode);
    const onCloseInfoWidget = this.createCloseInfoWidgetHandler();

    // Create extensions
    const extensions = createEditorExtensions({
      highlightedLine,
      readonly,
      language,
      onBreakpointChange,
      onFoldChange,
      onEditorChange,
      onCloseInfoWidget
    });

    // Create editor view directly with the element
    this.editorView = new EditorView({
      state: EditorState.create({
        doc: code,
        extensions
      }),
      parent: element
    });

    // Clamp ranges to the actual document. Stored ranges (from localStorage or
    // an exercise's defaults) can reference lines that no longer exist if the
    // code has fewer lines than when they were saved, which would otherwise
    // crash CodeMirror's doc.line() at mount with "Invalid line number".
    const safeReadonlyRanges = clampRangesToDoc(readonlyRanges, this.editorView.state.doc);
    if (safeReadonlyRanges.length > 0) {
      this.editorView.dispatch({
        effects: updateReadOnlyRangesEffect.of(safeReadonlyRanges)
      });
    }

    // Update snapshot after editor is created
    try {
      const currentCode = this.getValue();
      this.store.getState().setLatestValueSnapshot(currentCode);
    } catch (e: unknown) {
      if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
        throw e;
      }

      this.store.getState().setHasUnhandledError(true);
      this.store.getState().setUnhandledErrorBase64(btoa(JSON.stringify({ error: String(e) })));
    }
  }

  cleanup() {
    // Save content before cleanup
    const code = this.editorView.state.doc.toString();
    const readonlyRanges = getCodeMirrorFieldValue(this.editorView, readOnlyRangesStateField);
    this.saveImmediately(code, readonlyRanges);

    // Cancel any pending saves
    if (this.saveDebounced) {
      this.saveDebounced.cancel();
    }

    // Clean up any remaining tooltips before destroying editor
    cleanupAllInformationTooltips();

    // Destroy the editor view to remove it from DOM
    this.editorView.destroy();
  }

  private initializeSubscriptions() {
    let previousInformationWidgetData = this.store.getState().informationWidgetData;
    let previousShouldShowInformationWidget = this.store.getState().shouldShowInformationWidget;
    let previousReadonly = this.store.getState().readonly;
    let previousHighlightedLine = this.store.getState().highlightedLine;
    let previousHighlightedLineColor = this.store.getState().highlightedLineColor;
    let previousUnderlineRange = this.store.getState().underlineRange;
    let previousLanguage = this.store.getState().language;
    let previousLintErrors = this.store.getState().lintErrors;

    this.store.subscribe((state) => {
      if (state.informationWidgetData !== previousInformationWidgetData) {
        this.applyInformationWidgetData(state.informationWidgetData);
        previousInformationWidgetData = state.informationWidgetData;
      }

      if (state.shouldShowInformationWidget !== previousShouldShowInformationWidget) {
        this.applyShouldShowInformationWidget(state.shouldShowInformationWidget);
        previousShouldShowInformationWidget = state.shouldShowInformationWidget;
      }

      if (state.readonly !== previousReadonly) {
        this.applyReadonlyCompartment(state.readonly);
        previousReadonly = state.readonly;
      }

      if (state.highlightedLine !== previousHighlightedLine) {
        this.applyHighlightLine(state.highlightedLine);
        // Scroll to the highlighted line when it changes (e.g., when frame changes)
        if (state.highlightedLine !== 0 && state.shouldShowInformationWidget) {
          scrollToLine(this.editorView, state.highlightedLine);
        }
        previousHighlightedLine = state.highlightedLine;
      }

      if (state.highlightedLineColor !== previousHighlightedLineColor) {
        this.applyHighlightLineColor(state.highlightedLineColor);
        previousHighlightedLineColor = state.highlightedLineColor;
      }

      if (state.underlineRange !== previousUnderlineRange) {
        this.applyUnderlineRange(state.underlineRange);
        previousUnderlineRange = state.underlineRange;
      }

      if (state.language !== previousLanguage) {
        this.applyLanguage(state.language);
        previousLanguage = state.language;
      }

      if (state.lintErrors !== previousLintErrors) {
        this.applyLintDecorations(state.lintErrors);
        previousLintErrors = state.lintErrors;
      }
    });
  }

  private initializeAutoSave() {
    const saveNow = (code: string, readonlyRanges?: ReadonlyRange[]) => {
      if (this.isSaving) {
        return;
      }

      this.isSaving = true;

      try {
        const result = saveCodeMirrorContent(this.exerciseSlug, code, readonlyRanges);

        if (result.success) {
          console.log("CodeMirror content saved successfully", result);
        } else {
          console.error("Failed to save CodeMirror content:", result.error);
        }
      } catch (error) {
        console.error(`Error saving exercise ${this.exerciseSlug}:`, error);
      } finally {
        this.isSaving = false;
      }
    };

    this.saveDebounced = debounce((code: string, readonlyRanges?: ReadonlyRange[]) => {
      saveNow(code, readonlyRanges);
    }, 500);
  }

  setValue(text: string): void {
    const transaction = this.editorView.state.update({
      changes: {
        from: 0,
        to: this.editorView.state.doc.length,
        insert: text
      }
    });
    this.editorView.dispatch(transaction);
  }

  getValue(): string {
    return this.editorView.state.doc.toString();
  }

  focus(): void {
    this.editorView.focus();
  }

  // UNUSED: This function is currently not called.
  callOnEditorChangeCallback(_view: EditorView) {
    // No-op - callback mechanism removed
  }

  getCurrentEditorValue(): string {
    const value = this.getValue();
    this.store.getState().setLatestValueSnapshot(value);
    return value;
  }

  autoSaveContent(code: string, readonlyRanges?: ReadonlyRange[]) {
    if (this.saveDebounced) {
      this.saveDebounced(code, readonlyRanges);
    }
  }

  saveImmediately(code: string, readonlyRanges?: ReadonlyRange[]) {
    if (this.saveDebounced) {
      this.saveDebounced.cancel();
    }

    if (this.isSaving) {
      return;
    }

    this.isSaving = true;

    try {
      const result = saveCodeMirrorContent(this.exerciseSlug, code, readonlyRanges);

      if (!result.success) {
        console.error("Failed to save CodeMirror content:", result.error);
      }
    } catch (error) {
      console.error(`Error saving exercise ${this.exerciseSlug}:`, error);
    } finally {
      this.isSaving = false;
    }
  }

  setMultiLineHighlight(fromLine: number, toLine: number) {
    if (fromLine === 0 && toLine === 0) {
      this.editorView.dispatch({
        effects: changeMultiLineHighlightEffect.of([])
      });
    } else {
      const lines = [];
      for (let i = fromLine; i <= toLine; i++) {
        lines.push(i);
      }
      this.editorView.dispatch({
        effects: changeMultiLineHighlightEffect.of(lines)
      });
    }
  }

  setMultipleLineHighlights(lines: number[]) {
    this.editorView.dispatch({
      effects: changeMultiLineHighlightEffect.of(lines)
    });
  }

  showInformationWidget() {
    const state = this.store.getState();

    // If already enabled, do nothing
    if (state.shouldShowInformationWidget) {
      return;
    }

    // If we have a highlighted line and it's not 0 (initial state), scroll to it
    if (state.highlightedLine !== 0) {
      scrollToLine(this.editorView, state.highlightedLine);
    }

    // Enable the widget
    state.setShouldShowInformationWidget(true);

    // If current test has only one frame, set the highlighted line
    if (state.currentTest && state.currentTest.frames.length === 1) {
      state.setHighlightedLine(state.currentTest.frames[0].line);
    }
  }

  hideInformationWidget() {
    const state = this.store.getState();

    // If already disabled, do nothing
    if (!state.shouldShowInformationWidget) {
      return;
    }

    // Disable the widget
    state.setShouldShowInformationWidget(false);

    // If current test has only one frame, remove the highlight
    if (state.currentTest && state.currentTest.frames.length === 1) {
      state.setHighlightedLine(0);
    }
  }

  applyBreakpoints(breakpoints: number[]) {
    const currentBreakpoints = getBreakpointLines(this.editorView);
    const effects = [];

    for (const line of currentBreakpoints) {
      if (!breakpoints.includes(line)) {
        try {
          const pos = this.editorView.state.doc.line(line).from;
          effects.push(breakpointEffect.of({ pos, on: false }));
        } catch (error) {
          console.warn(`Failed to remove breakpoint at line ${line}:`, error);
        }
      }
    }

    for (const line of breakpoints) {
      if (!currentBreakpoints.includes(line) && line >= 1 && line <= this.editorView.state.doc.lines) {
        try {
          const pos = this.editorView.state.doc.line(line).from;
          effects.push(breakpointEffect.of({ pos, on: true }));
        } catch (error) {
          console.warn(`Failed to add breakpoint at line ${line}:`, error);
        }
      }
    }

    if (effects.length > 0) {
      this.editorView.dispatch({ effects });
    }
  }

  // UNUSED: This function is currently not called.
  applyInformationWidgetData(data: InformationWidgetData) {
    this.editorView.dispatch({
      effects: informationWidgetDataEffect.of(data)
    });
  }

  applyShouldShowInformationWidget(show: boolean) {
    this.editorView.dispatch({
      effects: showInfoWidgetEffect.of(show)
    });
  }

  // UNUSED: This function is currently not called.
  applyReadonlyCompartment(readonly: boolean) {
    this.editorView.dispatch({
      effects: readonlyCompartment.reconfigure([EditorView.editable.of(!readonly)])
    });
  }

  applyLintDecorations(lintErrors: Array<{ message: string; location: { line: number } }>) {
    this.editorView.dispatch({
      effects: setLintDecorationsEffect.of(
        lintErrors.map((err) => ({
          line: err.location.line,
          message: err.message
        }))
      )
    });
  }

  applyLanguage(language: "javascript" | "python" | "jikiscript") {
    this.editorView.dispatch({
      effects: languageCompartment.reconfigure(getLanguageExtension(language))
    });
  }

  // UNUSED: This function is currently not called.
  applyHighlightLine(highlightedLine: number) {
    this.editorView.dispatch({
      effects: changeLineEffect.of(highlightedLine)
    });
  }

  // UNUSED: This function is currently not called.
  applyHighlightLineColor(highlightedLineColor: string) {
    if (highlightedLineColor) {
      this.editorView.dispatch({
        effects: changeColorEffect.of(highlightedLineColor)
      });
    }
  }

  applyUnderlineRange(range: UnderlineRange | undefined) {
    const effectRange = range || { from: 0, to: 0 };
    this.editorView.dispatch({
      effects: addUnderlineEffect.of(effectRange)
    });

    if (range) {
      const line = document.querySelector(".cm-underline");
      if (line) {
        line.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    }
  }

  resetContent(code: string, readonlyRanges: ReadonlyRange[]) {
    saveCodeMirrorContent(this.exerciseSlug, code, readonlyRanges);

    // First pass clears readonly ranges so the doc-replace below isn't vetoed
    // by preventModifyTargetRanges (whose line-tracking heuristic produces
    // invalid line numbers when the doc shrinks).
    this.setupEditor([], { code: "", readonlyRanges: [] });
    this.setupEditor([], { code, readonlyRanges });
  }

  private setupEditor(
    unfoldableFunctionNames: string[],
    { readonlyRanges, code }: { readonlyRanges?: ReadonlyRange[]; code: string }
  ) {
    updateUnfoldableFunctions(this.editorView, unfoldableFunctionNames);

    if (code) {
      this.editorView.dispatch({
        changes: {
          from: 0,
          to: this.editorView.state.doc.length,
          insert: code
        }
      });
    }
    if (readonlyRanges) {
      // Clamp against the document we just set, so ranges that reference lines
      // beyond the new code don't crash the decoration computation.
      const safeReadonlyRanges = clampRangesToDoc(readonlyRanges, this.editorView.state.doc);
      this.editorView.dispatch({
        effects: updateReadOnlyRangesEffect.of(safeReadonlyRanges)
      });
    }
  }

  // Event handler methods
  private onEditorChange(...cb: Array<(update: ViewUpdate) => void>): Extension {
    return EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        cb.forEach((fn) => fn(update));
      }
    });
  }

  private onBreakpointChange(...cb: Array<(update: ViewUpdate) => void>): Extension {
    return this.onViewChange([breakpointEffect], ...cb);
  }

  private onFoldChange(...cb: Array<(update: ViewUpdate) => void>): Extension {
    return this.onViewChange([foldEffect, unfoldEffect], ...cb);
  }

  private onViewChange(effectTypes: StateEffectType<any>[], ...cb: Array<(update: ViewUpdate) => void>): Extension {
    return EditorView.updateListener.of((update) => {
      const changed = update.transactions.some((transaction) =>
        transaction.effects.some((effect) => effectTypes.some((effectType) => effect.is(effectType)))
      );
      if (changed) {
        cb.forEach((fn) => fn(update));
      }
    });
  }

  createEditorChangeHandlers(shouldAutoRunCode: boolean): Extension {
    return this.onEditorChange(
      () =>
        this.store.getState().setInformationWidgetData({
          html: "",
          line: 0,
          status: "SUCCESS"
        }),

      () => this.store.getState().setHighlightedLine(0),

      (e) => {
        const code = e.state.doc.toString();
        const readonlyRanges = getCodeMirrorFieldValue(e.view, readOnlyRangesStateField);
        this.autoSaveContent(code, readonlyRanges);
      },

      () => this.store.getState().setHighlightedLineColor(INFO_HIGHLIGHT_COLOR),

      () => this.store.getState().setShouldShowInformationWidget(false),

      () => this.store.getState().setHasCodeBeenEdited(true),

      () => this.store.getState().setUnderlineRange(undefined),

      () => {
        this.store.getState().setBreakpoints(getBreakpointLines(this.editorView));
      },

      () => {
        this.store.getState().setFoldedLines(getCodeMirrorFoldedLines(this.editorView));
      },

      () => {
        if (shouldAutoRunCode) {
          const currentCode = this.getValue();
          this.runCode(currentCode);
        }
      },

      () => {
        this.callOnEditorChangeCallback(this.editorView);
      },

      () => {
        if (this.lintCode) {
          const currentCode = this.getValue();
          this.lintCode(currentCode);
        }
      }
    );
  }

  createBreakpointChangeHandler(): Extension {
    return this.onBreakpointChange(() => {
      this.store.getState().setBreakpoints(getBreakpointLines(this.editorView));
    });
  }

  createFoldChangeHandler(): Extension {
    return this.onFoldChange(() => {
      this.store.getState().setFoldedLines(getCodeMirrorFoldedLines(this.editorView));
    });
  }

  createCloseInfoWidgetHandler(): () => void {
    return () => this.store.getState().setShouldShowInformationWidget(false);
  }
}

// Minimal shape of CodeMirror's `Text` doc needed to clamp ranges. Declared
// locally so this helper stays unit-testable without constructing a real doc.
interface ClampDoc {
  readonly lines: number;
  line: (n: number) => { from: number; to: number };
}

// Brings stored ranges back into bounds for the given document so they can't
// crash CodeMirror's decoration computation. Stored ranges (from localStorage
// or an exercise's defaults) can outlive the code they were saved against:
// after a rework the stub may have fewer lines, or a line may be shorter than
// when a `fromChar`/`toChar` offset was recorded.
//
// For each range we:
//   - drop it entirely if `fromLine` is past the end of the doc;
//   - clamp `toLine` down to the last line (dropping a now-meaningless `toChar`)
//     if it overran the doc;
//   - clamp `fromChar`/`toChar` to the length of their line, since an offset
//     past the line end would push the computed position past the line (or the
//     whole doc) and throw when the decoration range is built.
// `fromLine`/`toLine` are 1-based.
export function clampRangesToDoc(ranges: ReadonlyRange[], doc: ClampDoc): ReadonlyRange[] {
  const lineCount = doc.lines;
  const clamped: ReadonlyRange[] = [];
  for (const range of ranges) {
    if (range.fromLine > lineCount) {
      continue;
    }

    let { toLine, toChar } = range;
    if (toLine > lineCount) {
      // toLine ran past the doc: clamp it and drop a now-meaningless toChar so
      // the range extends to the end of the (new) last line.
      toLine = lineCount;
      toChar = undefined;
    }

    const next: ReadonlyRange = { ...range, toLine };

    if (next.fromChar !== undefined) {
      const fromLineInfo = doc.line(next.fromLine);
      next.fromChar = Math.min(next.fromChar, fromLineInfo.to - fromLineInfo.from);
    }

    if (toChar !== undefined) {
      const toLineInfo = doc.line(toLine);
      next.toChar = Math.min(toChar, toLineInfo.to - toLineInfo.from);
    } else {
      delete next.toChar;
    }

    clamped.push(next);
  }
  return clamped;
}
