import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import type { StoreApi } from "zustand/vanilla";
import { createEditorExtensions } from "../../ui/codemirror/setup/editorExtensions";
import {
  readOnlyRangesStateField,
  updateReadOnlyRangesEffect
} from "../../ui/codemirror/extensions/read-only-ranges/readOnlyRanges";
import { getCodeMirrorFieldValue } from "../../ui/codemirror/utils/getCodeMirrorFieldValue";
import { updateUnfoldableFunctions } from "../../ui/codemirror/utils/unfoldableFunctionNames";
import type { InformationWidgetData, OrchestratorStore, UnderlineRange } from "../types";
import { EditorEventHandlers } from "./editor/EditorEventHandlers";
import { EditorPersistence } from "./editor/EditorPersistence";
import { EditorStateManager } from "./editor/EditorStateManager";

export class EditorManager {
  readonly editorView: EditorView;
  private readonly eventHandlers: EditorEventHandlers;
  private readonly persistence: EditorPersistence;
  private readonly stateManager: EditorStateManager;

  constructor(
    element: HTMLDivElement,
    private readonly store: StoreApi<OrchestratorStore>,
    private readonly exerciseUuid: string,
    private readonly runCode: (code: string) => void
  ) {
    // Initialize editor first
    this.editorView = this.createEditorView(element);

    // Initialize managers with the created editor
    this.persistence = new EditorPersistence(this.editorView, this.store, this.exerciseUuid);
    this.stateManager = new EditorStateManager(this.editorView, this.store);
    this.eventHandlers = new EditorEventHandlers(
      this.editorView,
      this.store,
      this.runCode,
      this.persistence.autoSaveContent.bind(this.persistence)
    );

    // Initialize subscriptions
    this.stateManager.initializeSubscriptions();

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

    // Note: We deliberately ignore the promise here since this is cleanup
    this.persistence.saveImmediately(code, readonlyRanges);

    // Cleanup managers
    this.persistence.cleanup();
    this.eventHandlers.cleanup();

    // Destroy the editor view to remove it from DOM
    this.editorView.destroy();
  }

  private createEditorView(element: HTMLDivElement): EditorView {
    const state = this.store.getState();
    const value = state.defaultCode;
    const readonly = state.readonly;
    const highlightedLine = state.highlightedLine;
    const shouldAutoRunCode = state.shouldAutoRunCode;
    const language = state.language;

    // Create temporary event handlers for initialization
    const tempHandlers = new EditorEventHandlers(
      {} as EditorView, // Will be set after creation
      this.store,
      this.runCode,
      () => {} // Temporary save function
    );

    const extensions = createEditorExtensions({
      highlightedLine,
      readonly,
      language,
      onBreakpointChange: tempHandlers.createBreakpointChangeHandler(),
      onFoldChange: tempHandlers.createFoldChangeHandler(),
      onEditorChange: tempHandlers.createEditorChangeHandlers(shouldAutoRunCode),
      onCloseInfoWidget: tempHandlers.createCloseInfoWidgetHandler()
    });

    return new EditorView({
      state: EditorState.create({
        doc: value,
        extensions
      }),
      parent: element
    });
  }

  // Core editor operations
  setValue(text: string): void {
    this.editorView.dispatch({
      changes: {
        from: 0,
        to: this.editorView.state.doc.length,
        insert: text
      }
    });

    this.store.getState().setLatestValueSnapshot(text);
  }

  getValue(): string {
    return this.editorView.state.doc.toString();
  }

  focus(): void {
    this.editorView.focus();
  }

  getCurrentEditorValue(): string {
    return this.getValue();
  }

  // For backward compatibility
  callOnEditorChangeCallback(_view: EditorView) {
    // This method is kept for backward compatibility but does nothing
  }

  // Persistence methods
  autoSaveContent(code: string, readonlyRanges?: { from: number; to: number }[]) {
    this.persistence.autoSaveContent(code, readonlyRanges);
  }

  saveImmediately(code: string, readonlyRanges?: { from: number; to: number }[]) {
    this.persistence.saveImmediately(code, readonlyRanges);
  }

  // State management delegation methods
  setMultiLineHighlight(fromLine: number, toLine: number) {
    this.stateManager.setMultiLineHighlight(fromLine, toLine);
  }

  setMultipleLineHighlights(lines: number[]) {
    this.stateManager.setMultipleLineHighlights(lines);
  }

  showInformationWidget() {
    this.stateManager.showInformationWidget();
  }

  hideInformationWidget() {
    this.stateManager.hideInformationWidget();
  }

  applyBreakpoints(breakpoints: number[]) {
    this.stateManager.applyBreakpoints(breakpoints);
  }

  applyInformationWidgetData(data: InformationWidgetData) {
    this.stateManager.applyInformationWidgetData(data);
  }

  applyShouldShowInformationWidget(show: boolean) {
    this.stateManager.applyShouldShowInformationWidget(show);
  }

  applyReadonlyCompartment(readonly: boolean) {
    this.stateManager.applyReadonlyCompartment(readonly);
  }

  applyLanguage(language: "javascript" | "python" | "jikiscript") {
    this.stateManager.applyLanguage(language);
  }

  applyHighlightLine(highlightedLine: number) {
    this.stateManager.applyHighlightLine(highlightedLine);
  }

  applyHighlightLineColor(highlightedLineColor: string) {
    this.stateManager.applyHighlightLineColor(highlightedLineColor);
  }

  applyUnderlineRange(range: UnderlineRange | undefined) {
    this.stateManager.applyUnderlineRange(range);
  }

  // Legacy methods for initialization - these can be refactored further
  initializeEditor(
    code: { storedAt?: string; code: string; readonlyRanges?: { from: number; to: number }[] },
    exercise: unknown,
    unfoldableFunctionNames: string[]
  ) {
    const loadedContent = this.persistence.loadContent();

    if (loadedContent.code && code.storedAt) {
      // Compare timestamps and use newer content
      this.store.getState().setDefaultCode(loadedContent.code);
      this.setupEditor(unfoldableFunctionNames, {
        code: loadedContent.code,
        readonlyRanges: loadedContent.readonlyRanges || []
      });
    } else {
      this.store.getState().setDefaultCode(code.code || "");
      this.setupEditor(unfoldableFunctionNames, {
        code: code.code || "",
        readonlyRanges: code.readonlyRanges || []
      });
    }
  }

  resetEditorToStub(
    stubCode: string,
    defaultReadonlyRanges: { from: number; to: number }[],
    unfoldableFunctionNames: string[]
  ) {
    this.persistence.saveImmediately(stubCode, defaultReadonlyRanges);

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
    { readonlyRanges, code }: { readonlyRanges?: { from: number; to: number }[]; code: string }
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
}
