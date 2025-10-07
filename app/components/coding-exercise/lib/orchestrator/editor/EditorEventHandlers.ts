import type { Extension, StateEffectType } from "@codemirror/state";
import type { ViewUpdate } from "@codemirror/view";
import { EditorView } from "@codemirror/view";
import { debounce } from "lodash";
import type { StoreApi } from "zustand/vanilla";
import { changeMultiLineHighlightEffect } from "../../../ui/codemirror/extensions";
import { breakpointEffect } from "../../../ui/codemirror/extensions/breakpoint";
import { readOnlyRangesStateField } from "../../../ui/codemirror/extensions/read-only-ranges/readOnlyRanges";
import { getCodeMirrorFieldValue } from "../../../ui/codemirror/utils/getCodeMirrorFieldValue";
import { updateUnfoldableFunctions } from "../../../ui/codemirror/utils/unfoldableFunctionNames";
import type { OrchestratorStore } from "../../types";

export class EditorEventHandlers {
  private readonly autoRunCodeDebounced: ReturnType<typeof debounce>;

  constructor(
    private readonly editorView: EditorView,
    private readonly store: StoreApi<OrchestratorStore>,
    private readonly runCode: (code: string) => void,
    private readonly saveContent: (code: string, readonlyRanges?: { from: number; to: number }[]) => void
  ) {
    this.autoRunCodeDebounced = debounce(this.handleAutoRunCode.bind(this), 1000);
  }

  createEditorChangeHandlers(shouldAutoRunCode: boolean): Extension {
    return this.onEditorChange(
      this.createContentChangeHandler(),
      this.createReadOnlyRangesChangeHandler(),
      shouldAutoRunCode ? this.createAutoRunHandler() : this.createNoOpHandler()
    );
  }

  createBreakpointChangeHandler(): Extension {
    return this.onBreakpointChange((_update: ViewUpdate) => {
      // Handle breakpoint changes by updating store state
      // This is simplified for now - the actual breakpoint logic
      // should be handled by the state manager
    });
  }

  createFoldChangeHandler(): Extension {
    return this.onFoldChange((_update: ViewUpdate) => {
      updateUnfoldableFunctions(this.editorView, []);
    });
  }

  createCloseInfoWidgetHandler(): () => void {
    return () => {
      this.store.getState().setShouldShowInformationWidget(false);
    };
  }

  private createContentChangeHandler() {
    return (_update: ViewUpdate) => {
      const code = this.editorView.state.doc.toString();
      this.store.getState().setLatestValueSnapshot(code);
    };
  }

  private createReadOnlyRangesChangeHandler() {
    return (_update: ViewUpdate) => {
      const readonlyRanges = getCodeMirrorFieldValue(this.editorView, readOnlyRangesStateField);
      const code = this.editorView.state.doc.toString();
      this.saveContent(code, readonlyRanges);
    };
  }

  private createAutoRunHandler() {
    return (_update: ViewUpdate) => {
      this.autoRunCodeDebounced();
    };
  }

  private createNoOpHandler() {
    return (_update: ViewUpdate) => {
      // No-op when auto-run is disabled
    };
  }

  private handleAutoRunCode() {
    const code = this.editorView.state.doc.toString();
    this.runCode(code);
  }

  private onEditorChange(...cb: Array<(update: ViewUpdate) => void>): Extension {
    return this.onViewChange([changeMultiLineHighlightEffect], ...cb);
  }

  private onBreakpointChange(...cb: Array<(update: ViewUpdate) => void>): Extension {
    return this.onViewChange([breakpointEffect], ...cb);
  }

  private onFoldChange(...cb: Array<(update: ViewUpdate) => void>): Extension {
    return this.onViewChange([], ...cb);
  }

  private onViewChange(effectTypes: StateEffectType<any>[], ...cb: Array<(update: ViewUpdate) => void>): Extension {
    return EditorView.updateListener.of((update: ViewUpdate) => {
      if (
        effectTypes.length === 0 ||
        update.transactions.some((tr) => tr.effects.some((e) => effectTypes.some((et) => e.is(et))))
      ) {
        cb.forEach((callback) => callback(update));
      }
    });
  }

  cleanup() {
    this.autoRunCodeDebounced.cancel();
  }
}
