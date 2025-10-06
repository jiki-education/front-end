import {
  cleanUpEditor,
  cleanUpEditorEffect
} from "@/components/complex-exercise/ui/codemirror/extensions/clean-up-editor";
import { EditorState } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";

// Mock helper functions
function createMockEditor(dispatchSpy?: jest.Mock) {
  const mockDispatch = dispatchSpy || jest.fn();
  return {
    state: EditorState.create({ doc: "test content" }),
    dispatch: mockDispatch
  } as unknown as EditorView;
}

describe("clean-up-editor", () => {
  describe("cleanUpEditorEffect", () => {
    it("should be defined as a state effect", () => {
      expect(cleanUpEditorEffect).toBeDefined();
      expect(typeof cleanUpEditorEffect.of).toBe("function");
    });

    it("should create effect with no value", () => {
      const effect = cleanUpEditorEffect.of();
      expect(effect).toBeDefined();
      expect(effect.is(cleanUpEditorEffect)).toBe(true);
    });
  });

  describe("cleanUpEditor", () => {
    let dispatchSpy: jest.Mock;

    beforeEach(() => {
      dispatchSpy = jest.fn();
    });

    it("should dispatch cleanUpEditorEffect when view is provided", () => {
      const mockView = createMockEditor(dispatchSpy);

      cleanUpEditor(mockView);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith({
        effects: cleanUpEditorEffect.of()
      });
    });

    it("should not dispatch when view is null", () => {
      cleanUpEditor(null);

      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it("should not dispatch when view is undefined", () => {
      cleanUpEditor(undefined as any);

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe("integration", () => {
    it("should work with actual CodeMirror state system", () => {
      const dispatchSpy = jest.fn();
      const mockView = createMockEditor(dispatchSpy);

      cleanUpEditor(mockView);

      const call = dispatchSpy.mock.calls[0][0];
      expect(call.effects.is(cleanUpEditorEffect)).toBe(true);
    });
  });
});
