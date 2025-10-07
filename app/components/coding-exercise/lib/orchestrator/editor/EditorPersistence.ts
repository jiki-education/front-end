import { debounce } from "lodash";
import type { StoreApi } from "zustand/vanilla";
import type { EditorView } from "@codemirror/view";
import { readOnlyRangesStateField } from "../../../ui/codemirror/extensions/read-only-ranges/readOnlyRanges";
import { getCodeMirrorFieldValue } from "../../../ui/codemirror/utils/getCodeMirrorFieldValue";
import { loadCodeMirrorContent, saveCodeMirrorContent } from "../../localStorage";
import type { OrchestratorStore } from "../../types";

const ONE_MINUTE = 60 * 1000;

export class EditorPersistence {
  private isSaving = false;
  private saveDebounced: ReturnType<typeof debounce> | null = null;

  constructor(
    private readonly editorView: EditorView,
    private readonly store: StoreApi<OrchestratorStore>,
    private readonly exerciseUuid: string
  ) {
    this.initializeAutoSave();
  }

  private initializeAutoSave() {
    this.saveDebounced = debounce(() => {
      if (this.isSaving) {
        return;
      }

      this.isSaving = true;

      try {
        const code = this.editorView.state.doc.toString();
        const readonlyRanges = getCodeMirrorFieldValue(this.editorView, readOnlyRangesStateField);

        const result = saveCodeMirrorContent(this.exerciseUuid, code, readonlyRanges);

        if (result.success) {
          // Success - could store last saved time if needed
        } else {
          this.store.getState().setHasUnhandledError(true);
          this.store.getState().setUnhandledErrorBase64(btoa(JSON.stringify({ error: result.error })));
        }
      } catch (error) {
        this.store.getState().setHasUnhandledError(true);
        this.store.getState().setUnhandledErrorBase64(btoa(JSON.stringify({ error: String(error) })));
      } finally {
        this.isSaving = false;
      }
    }, ONE_MINUTE);
  }

  autoSaveContent(_code: string, _readonlyRanges?: { from: number; to: number }[]) {
    if (this.saveDebounced) {
      this.saveDebounced();
    }
  }

  saveImmediately(code: string, readonlyRanges?: { from: number; to: number }[]) {
    if (this.saveDebounced) {
      this.saveDebounced.cancel();
    }

    if (this.isSaving) {
      return;
    }

    this.isSaving = true;

    try {
      const result = saveCodeMirrorContent(this.exerciseUuid, code, readonlyRanges);
      if (!result.success) {
        this.store.getState().setHasUnhandledError(true);
        this.store.getState().setUnhandledErrorBase64(btoa(JSON.stringify({ error: result.error })));
      }
    } catch (error) {
      this.store.getState().setHasUnhandledError(true);
      this.store.getState().setUnhandledErrorBase64(btoa(JSON.stringify({ error: String(error) })));
    } finally {
      this.isSaving = false;
    }
  }

  loadContent(): { code?: string; readonlyRanges?: { from: number; to: number }[] } {
    const result = loadCodeMirrorContent(this.exerciseUuid);

    if (result.success && result.data) {
      return {
        code: result.data.code,
        readonlyRanges: result.data.readonlyRanges
      };
    }

    return {};
  }

  cleanup() {
    if (this.saveDebounced) {
      this.saveDebounced.cancel();
    }
  }
}
