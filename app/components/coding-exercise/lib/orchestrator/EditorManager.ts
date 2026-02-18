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
import { createEditorExtensions } from "../../ui/codemirror/setup/editorExtensions";
import { getBreakpointLines } from "../../ui/codemirror/utils/getBreakpointLines";
import { getCodeMirrorFieldValue } from "../../ui/codemirror/utils/getCodeMirrorFieldValue";
import { getFoldedLines as getCodeMirrorFoldedLines } from "../../ui/codemirror/utils/getFoldedLines";
import { scrollToLine } from "../../ui/codemirror/utils/scrollToLine";
import { updateUnfoldableFunctions } from "../../ui/codemirror/utils/unfoldableFunctionNames";
import type { ReadonlyRange } from "@jiki/curriculum";
import { loadCodeMirrorContent, saveCodeMirrorContent } from "../localStorage";
import type { InformationWidgetData, OrchestratorStore, UnderlineRange } from "../types";

const ONE_MINUTE = 60 * 1000;

export class EditorManager {
  readonly editorView: EditorView;
  private isSaving = false;
  private saveDebounced: ReturnType<typeof debounce> | null = null;

  constructor(
    element: HTMLDivElement,
    private readonly store: StoreApi<OrchestratorStore>,
    private readonly exerciseSlug: string,
    private readonly runCode: (code: string) => void
  ) {
    this.initializeAutoSave();
    this.initializeSubscriptions();

    // Get values from store
    const state = this.store.getState();
    const value = state.defaultCode;
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
        doc: value,
        extensions
      }),
      parent: element
    });

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

  // UNUSED: This function is currently not called.
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

  initializeEditor(
    code: { storedAt?: string; code: string; readonlyRanges?: ReadonlyRange[] },
    _exercise: unknown,
    unfoldableFunctionNames: string[]
  ) {
    const localStorageResult = loadCodeMirrorContent(this.exerciseSlug);

    if (
      localStorageResult.success &&
      localStorageResult.data &&
      code.storedAt &&
      new Date(localStorageResult.data.storedAt).getTime() < new Date(code.storedAt).getTime() - ONE_MINUTE
    ) {
      this.store.getState().setDefaultCode(code.code);
      this.setupEditor(unfoldableFunctionNames, {
        code: code.code,
        readonlyRanges: code.readonlyRanges
      });

      saveCodeMirrorContent(this.exerciseSlug, code.code, code.readonlyRanges);
    } else if (localStorageResult.success && localStorageResult.data) {
      this.store.getState().setDefaultCode(localStorageResult.data.code);
      this.setupEditor(unfoldableFunctionNames, {
        code: localStorageResult.data.code,
        readonlyRanges: localStorageResult.data.readonlyRanges ?? []
      });
    } else {
      this.store.getState().setDefaultCode(code.code || "");
      this.setupEditor(unfoldableFunctionNames, {
        code: code.code || "",
        readonlyRanges: code.readonlyRanges || []
      });
    }
  }

  resetEditorToStub(stubCode: string, defaultReadonlyRanges: ReadonlyRange[], unfoldableFunctionNames: string[]) {
    saveCodeMirrorContent(this.exerciseSlug, stubCode, defaultReadonlyRanges);

    this.setupEditor(unfoldableFunctionNames, {
      code: "",
      readonlyRanges: []
    });

    this.setupEditor(unfoldableFunctionNames, {
      code: stubCode,
      readonlyRanges: defaultReadonlyRanges
    });
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
      this.editorView.dispatch({
        effects: updateReadOnlyRangesEffect.of(readonlyRanges)
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
