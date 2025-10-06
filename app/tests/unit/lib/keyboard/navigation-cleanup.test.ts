import { keyboard } from "@/lib/keyboard";

describe("KeyboardManager Navigation Cleanup", () => {
  let unsubscribers: (() => void)[] = [];

  beforeEach(() => {
    unsubscribers = [];
  });

  afterEach(() => {
    unsubscribers.forEach((unsub) => unsub());
    unsubscribers = [];
    jest.clearAllMocks();
  });

  describe("Singleton Behavior", () => {
    it("should use the same instance across imports", async () => {
      // Import the keyboard from the module again using dynamic import
      const { keyboard: keyboard2 } = await import("@/lib/keyboard");

      expect(keyboard).toBe(keyboard2);
    });

    it("should not duplicate event listeners on multiple init calls", () => {
      const addEventListenerSpy = jest.spyOn(window, "addEventListener");

      // The keyboard is already initialized from the module import
      // Try to reinit it (simulating navigation scenario)
      keyboard.reinit();

      // Should have added listeners once during reinit
      // (init is called in constructor and reinit does cleanup + init)
      const keydownCalls = addEventListenerSpy.mock.calls.filter(([event]) => event === "keydown");

      expect(keydownCalls.length).toBe(1);

      addEventListenerSpy.mockRestore();
    });
  });

  describe("Page Navigation Simulation", () => {
    it("should clean up component-specific shortcuts but keep global listeners", () => {
      const globalHandler = jest.fn();
      const componentHandler = jest.fn();

      // Simulate a global shortcut (registered at module level)
      unsubscribers.push(keyboard.on("ctrl+g", globalHandler));

      // Simulate component mounting (like navigating to a page)
      const unsubscribeComponent = keyboard.on("ctrl+c", componentHandler);

      // Verify both work
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "g", ctrlKey: true, bubbles: true }));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "c", ctrlKey: true, bubbles: true }));

      expect(globalHandler).toHaveBeenCalledTimes(1);
      expect(componentHandler).toHaveBeenCalledTimes(1);

      // Simulate component unmounting (like navigating away)
      unsubscribeComponent();

      // Reset mock counts
      globalHandler.mockClear();
      componentHandler.mockClear();

      // Test again after "navigation"
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "g", ctrlKey: true, bubbles: true }));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "c", ctrlKey: true, bubbles: true }));

      // Global should still work, component should not
      expect(globalHandler).toHaveBeenCalledTimes(1);
      expect(componentHandler).not.toHaveBeenCalled();
    });

    it("should handle multiple navigation cycles without memory leaks", () => {
      const handlers: jest.Mock[] = [];
      const unsubscribes: (() => void)[] = [];

      // Simulate multiple navigation cycles
      for (let cycle = 0; cycle < 3; cycle++) {
        const handler = jest.fn();
        handlers.push(handler);

        // Mount: register shortcut
        const unsub = keyboard.on(`ctrl+${cycle}`, handler);
        unsubscribes.push(unsub);

        // Trigger the shortcut
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: String(cycle),
            ctrlKey: true,
            bubbles: true
          })
        );

        expect(handler).toHaveBeenCalledTimes(1);

        // Unmount: clean up
        unsub();
      }

      // Verify no handlers are still active
      handlers.forEach((handler, i) => {
        handler.mockClear();
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: String(i),
            ctrlKey: true,
            bubbles: true
          })
        );
        expect(handler).not.toHaveBeenCalled();
      });
    });

    it("should maintain window event listener across navigation", () => {
      const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

      // Simulate component mounting and unmounting
      const unsub1 = keyboard.on("ctrl+1", jest.fn());
      const unsub2 = keyboard.on("ctrl+2", jest.fn());

      unsub1();
      unsub2();

      // The window keydown listener should NOT be removed during navigation
      const keydownRemovals = removeEventListenerSpy.mock.calls.filter(([event]) => event === "keydown");

      expect(keydownRemovals.length).toBe(0);

      removeEventListenerSpy.mockRestore();
    });
  });

  describe("Memory Management", () => {
    it("should not accumulate shortcuts after multiple registrations and cleanups", () => {
      const handler = jest.fn();
      const unsubscribes: (() => void)[] = [];

      // Register and unregister the same shortcut multiple times
      for (let i = 0; i < 5; i++) {
        const unsub = keyboard.on("ctrl+m", handler);
        unsubscribes.push(unsub);
      }

      // Trigger once - all 5 handlers should fire
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "m", ctrlKey: true, bubbles: true }));
      expect(handler).toHaveBeenCalledTimes(5);

      // Clean up all
      unsubscribes.forEach((unsub) => unsub());
      handler.mockClear();

      // Trigger again - no handlers should fire
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "m", ctrlKey: true, bubbles: true }));
      expect(handler).not.toHaveBeenCalled();
    });

    it("should properly clean up on destroy", () => {
      const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

      // Destroy the keyboard manager
      keyboard.destroy();

      // Should have removed both keydown and beforeunload listeners
      expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function), true);
      expect(removeEventListenerSpy).toHaveBeenCalledWith("beforeunload", expect.any(Function));

      // Reinitialize for other tests
      keyboard.reinit();

      removeEventListenerSpy.mockRestore();
    });
  });
});
