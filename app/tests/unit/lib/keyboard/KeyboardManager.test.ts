import { keyboard } from "@/lib/keyboard";

describe("KeyboardManager", () => {
  let mockHandler: jest.Mock;
  let keydownEvent: KeyboardEvent;
  let unsubscribers: (() => void)[] = [];

  beforeEach(() => {
    mockHandler = jest.fn();
    unsubscribers = [];
  });

  afterEach(() => {
    unsubscribers.forEach((unsub) => unsub());
    unsubscribers = [];
    jest.clearAllMocks();
  });

  describe("Basic Registration", () => {
    it("should register and trigger a simple shortcut", () => {
      unsubscribers.push(keyboard.on("k", mockHandler));

      keydownEvent = new KeyboardEvent("keydown", { key: "k", bubbles: true });
      window.dispatchEvent(keydownEvent);

      expect(mockHandler).toHaveBeenCalledTimes(1);
      expect(mockHandler).toHaveBeenCalledWith(keydownEvent);
    });

    it("should register and trigger cmd+k", () => {
      unsubscribers.push(keyboard.on("cmd+k", mockHandler));

      keydownEvent = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
      window.dispatchEvent(keydownEvent);

      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("should register and trigger ctrl+s", () => {
      unsubscribers.push(keyboard.on("ctrl+s", mockHandler));

      keydownEvent = new KeyboardEvent("keydown", { key: "s", ctrlKey: true, bubbles: true });
      window.dispatchEvent(keydownEvent);

      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("should register and trigger shift+alt+d", () => {
      unsubscribers.push(keyboard.on("shift+alt+d", mockHandler));

      keydownEvent = new KeyboardEvent("keydown", {
        key: "d",
        shiftKey: true,
        altKey: true,
        bubbles: true
      });
      window.dispatchEvent(keydownEvent);

      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("should return an unsubscribe function", () => {
      const unsubscribe = keyboard.on("k", mockHandler);

      keydownEvent = new KeyboardEvent("keydown", { key: "k", bubbles: true });
      window.dispatchEvent(keydownEvent);
      expect(mockHandler).toHaveBeenCalledTimes(1);

      unsubscribe();

      window.dispatchEvent(keydownEvent);
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("Special Keys", () => {
    it("should handle escape key", () => {
      unsubscribers.push(keyboard.on("escape", mockHandler));

      keydownEvent = new KeyboardEvent("keydown", { key: "Escape", bubbles: true });
      window.dispatchEvent(keydownEvent);

      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("should handle enter key", () => {
      unsubscribers.push(keyboard.on("enter", mockHandler));

      keydownEvent = new KeyboardEvent("keydown", { key: "Enter", bubbles: true });
      window.dispatchEvent(keydownEvent);

      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("should handle arrow keys", () => {
      const upHandler = jest.fn();
      const downHandler = jest.fn();
      const leftHandler = jest.fn();
      const rightHandler = jest.fn();

      unsubscribers.push(keyboard.on("up", upHandler));
      unsubscribers.push(keyboard.on("down", downHandler));
      unsubscribers.push(keyboard.on("left", leftHandler));
      unsubscribers.push(keyboard.on("right", rightHandler));

      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

      expect(upHandler).toHaveBeenCalledTimes(1);
      expect(downHandler).toHaveBeenCalledTimes(1);
      expect(leftHandler).toHaveBeenCalledTimes(1);
      expect(rightHandler).toHaveBeenCalledTimes(1);
    });

    it("should handle space key", () => {
      unsubscribers.push(keyboard.on(" ", mockHandler));

      keydownEvent = new KeyboardEvent("keydown", { key: " ", bubbles: true });
      window.dispatchEvent(keydownEvent);

      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("Event Options", () => {
    it("should preventDefault by default", () => {
      unsubscribers.push(keyboard.on("cmd+s", mockHandler));

      keydownEvent = new KeyboardEvent("keydown", { key: "s", metaKey: true, bubbles: true });
      const preventDefaultSpy = jest.spyOn(keydownEvent, "preventDefault");

      window.dispatchEvent(keydownEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it("should not preventDefault when option is false", () => {
      unsubscribers.push(keyboard.on("cmd+s", mockHandler, { preventDefault: false }));

      keydownEvent = new KeyboardEvent("keydown", { key: "s", metaKey: true, bubbles: true });
      const preventDefaultSpy = jest.spyOn(keydownEvent, "preventDefault");

      window.dispatchEvent(keydownEvent);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it("should stopPropagation when option is true", () => {
      unsubscribers.push(keyboard.on("cmd+s", mockHandler, { stopPropagation: true }));

      keydownEvent = new KeyboardEvent("keydown", { key: "s", metaKey: true, bubbles: true });
      const stopPropagationSpy = jest.spyOn(keydownEvent, "stopPropagation");

      window.dispatchEvent(keydownEvent);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });

  describe("Enabled State", () => {
    it("should not trigger when disabled", () => {
      unsubscribers.push(keyboard.on("k", mockHandler));
      keyboard.setEnabled(false);

      keydownEvent = new KeyboardEvent("keydown", { key: "k", bubbles: true });
      window.dispatchEvent(keydownEvent);

      expect(mockHandler).not.toHaveBeenCalled();

      keyboard.setEnabled(true);
    });

    it("should trigger when re-enabled", () => {
      unsubscribers.push(keyboard.on("k", mockHandler));
      keyboard.setEnabled(false);
      keyboard.setEnabled(true);

      keydownEvent = new KeyboardEvent("keydown", { key: "k", bubbles: true });
      window.dispatchEvent(keydownEvent);

      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("should not trigger shortcut when enabled option is false", () => {
      unsubscribers.push(keyboard.on("k", mockHandler, { enabled: false }));

      keydownEvent = new KeyboardEvent("keydown", { key: "k", bubbles: true });
      window.dispatchEvent(keydownEvent);

      expect(mockHandler).not.toHaveBeenCalled();
    });
  });

  describe("Scopes", () => {
    it("should only trigger shortcuts in active scope", () => {
      const globalHandler = jest.fn();
      const modalHandler = jest.fn();

      unsubscribers.push(keyboard.on("k", globalHandler));
      unsubscribers.push(keyboard.on("k", modalHandler, { scope: "modal" }));

      keydownEvent = new KeyboardEvent("keydown", { key: "k", bubbles: true });
      window.dispatchEvent(keydownEvent);

      expect(globalHandler).toHaveBeenCalledTimes(1);
      expect(modalHandler).not.toHaveBeenCalled();
    });

    it("should trigger scoped shortcuts when scope is pushed", () => {
      const modalHandler = jest.fn();
      unsubscribers.push(keyboard.on("k", modalHandler, { scope: "modal" }));

      const removeScope = keyboard.pushScope("modal");
      unsubscribers.push(removeScope);

      keydownEvent = new KeyboardEvent("keydown", { key: "k", bubbles: true });
      window.dispatchEvent(keydownEvent);

      expect(modalHandler).toHaveBeenCalledTimes(1);
    });

    it("should not trigger scoped shortcuts after scope is removed", () => {
      const modalHandler = jest.fn();
      unsubscribers.push(keyboard.on("k", modalHandler, { scope: "modal" }));

      const removeScope = keyboard.pushScope("modal");
      removeScope();

      keydownEvent = new KeyboardEvent("keydown", { key: "k", bubbles: true });
      window.dispatchEvent(keydownEvent);

      expect(modalHandler).not.toHaveBeenCalled();
    });

    it("should check if scope is active", () => {
      expect(keyboard.isScopeActive("modal")).toBe(false);

      const removeScope = keyboard.pushScope("modal");
      unsubscribers.push(removeScope);
      expect(keyboard.isScopeActive("modal")).toBe(true);

      removeScope();
      expect(keyboard.isScopeActive("modal")).toBe(false);
    });
  });

  describe("Input Elements", () => {
    it("should not trigger shortcuts when typing in input", () => {
      unsubscribers.push(keyboard.on("k", mockHandler));

      const input = document.createElement("input");
      document.body.appendChild(input);

      keydownEvent = new KeyboardEvent("keydown", { key: "k", bubbles: true });
      Object.defineProperty(keydownEvent, "target", { value: input, configurable: true });

      input.dispatchEvent(keydownEvent);

      expect(mockHandler).not.toHaveBeenCalled();

      document.body.removeChild(input);
    });

    it("should not trigger shortcuts when typing in textarea", () => {
      unsubscribers.push(keyboard.on("k", mockHandler));

      const textarea = document.createElement("textarea");
      document.body.appendChild(textarea);

      keydownEvent = new KeyboardEvent("keydown", { key: "k", bubbles: true });
      Object.defineProperty(keydownEvent, "target", { value: textarea, configurable: true });

      textarea.dispatchEvent(keydownEvent);

      expect(mockHandler).not.toHaveBeenCalled();

      document.body.removeChild(textarea);
    });
  });
});
