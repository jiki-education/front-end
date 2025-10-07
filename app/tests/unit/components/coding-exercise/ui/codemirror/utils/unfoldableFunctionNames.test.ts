import { StateEffect, StateField } from "@codemirror/state";
import type { Transaction } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import {
  setUnfoldableFunctionsEffect,
  unfoldableFunctionsField,
  updateUnfoldableFunctions
} from "@/components/coding-exercise/ui/codemirror/utils/unfoldableFunctionNames";

// Mock StateEffect and StateField
jest.mock("@codemirror/state", () => ({
  StateEffect: {
    define: jest.fn(() => ({
      of: jest.fn((value) => ({ value, is: jest.fn(() => true) }))
    }))
  },
  StateField: {
    define: jest.fn((config) => ({
      ...config,
      _isStateField: true
    }))
  }
}));

describe("unfoldableFunctionNames", () => {
  describe("setUnfoldableFunctionsEffect", () => {
    it("should be defined as a StateEffect", () => {
      expect(StateEffect.define).toHaveBeenCalled();
      expect(setUnfoldableFunctionsEffect).toBeDefined();
    });
  });

  describe("unfoldableFunctionsField", () => {
    let fieldConfig: any;

    beforeEach(() => {
      // Get the config that was passed to StateField.define
      fieldConfig = (StateField.define as jest.Mock).mock.calls.find((call) => call[0]?.create)?.[0];
    });

    it("should be defined as a StateField", () => {
      expect(StateField.define).toHaveBeenCalled();
      expect(unfoldableFunctionsField).toBeDefined();
      expect(unfoldableFunctionsField).toHaveProperty("_isStateField", true);
    });

    it("should have an initial empty array value", () => {
      expect(fieldConfig).toBeDefined();
      expect(fieldConfig.create()).toEqual([]);
    });

    describe("update function", () => {
      it("should keep the current value if no effect is present", () => {
        const currentValue = ["func1", "func2"];
        const mockTransaction = {
          effects: []
        } as unknown as Transaction;

        const result = fieldConfig.update(currentValue, mockTransaction);
        expect(result).toBe(currentValue);
      });

      it("should update to new value when effect is present", () => {
        const currentValue = ["func1", "func2"];
        const newValue = ["func3", "func4", "func5"];

        const mockEffect = {
          is: (effectType: any) => effectType === setUnfoldableFunctionsEffect,
          value: newValue
        };

        const mockTransaction = {
          effects: [mockEffect]
        } as unknown as Transaction;

        const result = fieldConfig.update(currentValue, mockTransaction);
        expect(result).toBe(newValue);
      });

      it("should handle empty new value", () => {
        const currentValue = ["func1", "func2"];
        const newValue: string[] = [];

        const mockEffect = {
          is: (effectType: any) => effectType === setUnfoldableFunctionsEffect,
          value: newValue
        };

        const mockTransaction = {
          effects: [mockEffect]
        } as unknown as Transaction;

        const result = fieldConfig.update(currentValue, mockTransaction);
        expect(result).toBe(newValue);
      });

      it("should use the first matching effect if multiple are present", () => {
        const currentValue = ["func1"];
        const firstValue = ["first"];
        const secondValue = ["second"];

        const mockEffect1 = {
          is: (effectType: any) => effectType === setUnfoldableFunctionsEffect,
          value: firstValue
        };

        const mockEffect2 = {
          is: (effectType: any) => effectType === setUnfoldableFunctionsEffect,
          value: secondValue
        };

        const mockTransaction = {
          effects: [mockEffect1, mockEffect2]
        } as unknown as Transaction;

        const result = fieldConfig.update(currentValue, mockTransaction);
        expect(result).toBe(firstValue);
      });
    });
  });

  describe("updateUnfoldableFunctions", () => {
    let mockEditorView: Partial<EditorView>;
    let mockDispatch: jest.Mock;
    let mockUpdate: jest.Mock;

    beforeEach(() => {
      mockDispatch = jest.fn();
      mockUpdate = jest.fn((config) => ({
        effects: config.effects
      }));

      mockEditorView = {
        state: {
          update: mockUpdate
        } as any,
        dispatch: mockDispatch
      };

      // Reset the mock for setUnfoldableFunctionsEffect.of
      (setUnfoldableFunctionsEffect.of as jest.Mock) = jest.fn((value) => ({
        value,
        type: "setUnfoldableFunctions"
      }));
    });

    it("should dispatch an update with the new function names", () => {
      const newNames = ["functionA", "functionB", "functionC"];

      updateUnfoldableFunctions(mockEditorView as EditorView, newNames);

      expect(setUnfoldableFunctionsEffect.of).toHaveBeenCalledWith(newNames);
      expect(mockUpdate).toHaveBeenCalledWith({
        effects: [{ value: newNames, type: "setUnfoldableFunctions" }]
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        effects: [{ value: newNames, type: "setUnfoldableFunctions" }]
      });
    });

    it("should handle empty array", () => {
      updateUnfoldableFunctions(mockEditorView as EditorView, []);

      expect(setUnfoldableFunctionsEffect.of).toHaveBeenCalledWith([]);
      expect(mockDispatch).toHaveBeenCalled();
    });

    it("should handle single function name", () => {
      const names = ["singleFunction"];

      updateUnfoldableFunctions(mockEditorView as EditorView, names);

      expect(setUnfoldableFunctionsEffect.of).toHaveBeenCalledWith(names);
      expect(mockDispatch).toHaveBeenCalled();
    });

    it("should handle large arrays of function names", () => {
      const names = Array.from({ length: 100 }, (_, i) => `function${i}`);

      updateUnfoldableFunctions(mockEditorView as EditorView, names);

      expect(setUnfoldableFunctionsEffect.of).toHaveBeenCalledWith(names);
      expect(mockDispatch).toHaveBeenCalled();
    });

    it("should not dispatch if update returns null/undefined", () => {
      mockUpdate.mockReturnValue(null);

      updateUnfoldableFunctions(mockEditorView as EditorView, ["test"]);

      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });
});
