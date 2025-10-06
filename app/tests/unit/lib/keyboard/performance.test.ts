import { keyboard } from "@/lib/keyboard";
import { debounce, PerformanceMonitor, throttle } from "@/lib/keyboard/PerformanceOptimizer";

describe("Keyboard Performance Optimizations", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe("Throttle", () => {
    it("should limit function execution to once per interval", () => {
      const handler = jest.fn();
      const throttled = throttle(handler, 100);

      // Call multiple times rapidly
      throttled();
      throttled();
      throttled();

      // Should only execute once immediately
      expect(handler).toHaveBeenCalledTimes(1);

      // Advance time but not enough
      jest.advanceTimersByTime(50);
      throttled();
      expect(handler).toHaveBeenCalledTimes(1);

      // Advance past the throttle interval
      jest.advanceTimersByTime(50);
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it("should cancel pending throttled calls", () => {
      const handler = jest.fn();
      const throttled = throttle(handler, 100);

      throttled();
      expect(handler).toHaveBeenCalledTimes(1);

      throttled(); // This should be scheduled
      throttled.cancel();

      jest.advanceTimersByTime(150);
      expect(handler).toHaveBeenCalledTimes(1); // No additional calls
    });

    it("should flush pending throttled calls", () => {
      const handler = jest.fn();
      const throttled = throttle(handler, 100);

      throttled();
      expect(handler).toHaveBeenCalledTimes(1);

      throttled(); // This should be scheduled
      throttled.flush();

      expect(handler).toHaveBeenCalledTimes(2); // Flushed immediately
    });
  });

  describe("Debounce", () => {
    it("should delay execution until after wait period", () => {
      const handler = jest.fn();
      const debounced = debounce(handler, 100);

      // Call multiple times rapidly
      debounced();
      debounced();
      debounced();

      // Should not execute immediately
      expect(handler).not.toHaveBeenCalled();

      // Advance time but not enough
      jest.advanceTimersByTime(50);
      expect(handler).not.toHaveBeenCalled();

      // Advance past the debounce interval
      jest.advanceTimersByTime(50);
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should reset timer on each call", () => {
      const handler = jest.fn();
      const debounced = debounce(handler, 100);

      debounced();
      jest.advanceTimersByTime(90);
      expect(handler).not.toHaveBeenCalled();

      debounced(); // Reset timer
      jest.advanceTimersByTime(90);
      expect(handler).not.toHaveBeenCalled();

      jest.advanceTimersByTime(10);
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should support leading edge execution", () => {
      const handler = jest.fn();
      const debounced = debounce(handler, 100, { leading: true, trailing: false });

      debounced();
      expect(handler).toHaveBeenCalledTimes(1); // Called immediately

      debounced();
      debounced();
      expect(handler).toHaveBeenCalledTimes(1); // No additional calls

      jest.advanceTimersByTime(100);
      expect(handler).toHaveBeenCalledTimes(1); // Still no additional calls (trailing: false)
    });

    it("should support maxWait option", () => {
      const handler = jest.fn();
      const debounced = debounce(handler, 100, { maxWait: 200 });

      // Keep calling to reset the timer
      const interval = setInterval(() => debounced(), 50);

      // After 200ms, should force execution despite continued calls
      jest.advanceTimersByTime(250);
      clearInterval(interval);

      expect(handler).toHaveBeenCalled();
    });

    it("should cancel pending debounced calls", () => {
      const handler = jest.fn();
      const debounced = debounce(handler, 100);

      debounced();
      debounced.cancel();

      jest.advanceTimersByTime(150);
      expect(handler).not.toHaveBeenCalled();
    });

    it("should flush pending debounced calls", () => {
      const handler = jest.fn();
      const debounced = debounce(handler, 100);

      debounced();
      debounced.flush();

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe("PerformanceMonitor", () => {
    it("should track event rate", () => {
      const monitor = new PerformanceMonitor();

      // Simulate normal usage
      for (let i = 0; i < 50; i++) {
        const isHighLoad = monitor.trackEvent();
        expect(isHighLoad).toBe(false);
      }
    });

    it("should detect high event rate", () => {
      const monitor = new PerformanceMonitor();

      // Simulate rapid events
      let highLoadDetected = false;
      for (let i = 0; i < 150; i++) {
        const isHighLoad = monitor.trackEvent();
        if (isHighLoad) {
          highLoadDetected = true;
          break;
        }
      }

      expect(highLoadDetected).toBe(true);
    });

    it("should reset counter after interval", () => {
      jest.useRealTimers(); // Need real timers for Date.now()
      const monitor = new PerformanceMonitor();

      // Track some events
      for (let i = 0; i < 50; i++) {
        monitor.trackEvent();
      }

      // Reset manually
      monitor.reset();

      // Should start fresh
      const isHighLoad = monitor.trackEvent();
      expect(isHighLoad).toBe(false);
    });
  });

  describe("Keyboard Integration", () => {
    let unsubscribers: (() => void)[] = [];

    afterEach(() => {
      unsubscribers.forEach((unsub) => unsub());
      unsubscribers = [];
    });

    it("should throttle handler when option is provided", () => {
      const handler = jest.fn();

      unsubscribers.push(keyboard.on("ctrl+t", handler, { throttle: 100 }));

      // Trigger multiple times rapidly
      const event = new KeyboardEvent("keydown", { key: "t", ctrlKey: true, bubbles: true });
      window.dispatchEvent(event);
      window.dispatchEvent(event);
      window.dispatchEvent(event);

      // Should only execute once immediately
      expect(handler).toHaveBeenCalledTimes(1);

      // Advance time and trigger again
      jest.advanceTimersByTime(100);
      window.dispatchEvent(event);

      // Now should have executed twice
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it("should debounce handler when option is provided", () => {
      const handler = jest.fn();

      unsubscribers.push(keyboard.on("ctrl+d", handler, { debounce: 100 }));

      // Trigger multiple times rapidly
      const event = new KeyboardEvent("keydown", { key: "d", ctrlKey: true, bubbles: true });
      window.dispatchEvent(event);
      window.dispatchEvent(event);
      window.dispatchEvent(event);

      // Should not execute immediately
      expect(handler).not.toHaveBeenCalled();

      // Advance time past debounce period
      jest.advanceTimersByTime(100);

      // Now should have executed once
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should clean up optimized handlers on unsubscribe", () => {
      const handler = jest.fn();

      const unsubscribe = keyboard.on("ctrl+x", handler, { throttle: 100 });

      // Trigger once
      const event = new KeyboardEvent("keydown", { key: "x", ctrlKey: true, bubbles: true });
      window.dispatchEvent(event);
      expect(handler).toHaveBeenCalledTimes(1);

      // Unsubscribe
      unsubscribe();

      // Should not trigger after unsubscribe
      window.dispatchEvent(event);
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should prefer throttle over debounce when both are specified", () => {
      const handler = jest.fn();

      unsubscribers.push(keyboard.on("ctrl+b", handler, { throttle: 50, debounce: 100 }));

      // Trigger multiple times
      const event = new KeyboardEvent("keydown", { key: "b", ctrlKey: true, bubbles: true });
      window.dispatchEvent(event);
      window.dispatchEvent(event);

      // Should execute immediately (throttle behavior, not debounce)
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe("Rapid typing simulation", () => {
    it("should handle rapid typing without performance degradation", () => {
      const handlers = {
        save: jest.fn(),
        search: jest.fn(),
        navigate: jest.fn()
      };

      // Register shortcuts with appropriate optimization
      const unsubscribers = [
        keyboard.on("ctrl+s", handlers.save, { throttle: 500 }), // Save - throttled
        keyboard.on("ctrl+f", handlers.search, { debounce: 300 }), // Search - debounced
        keyboard.on("ctrl+n", handlers.navigate) // Navigate - immediate
      ];

      // Simulate rapid typing of shortcuts
      const saveEvent = new KeyboardEvent("keydown", { key: "s", ctrlKey: true, bubbles: true });
      const searchEvent = new KeyboardEvent("keydown", { key: "f", ctrlKey: true, bubbles: true });
      const navEvent = new KeyboardEvent("keydown", { key: "n", ctrlKey: true, bubbles: true });

      // Rapid save attempts (should be throttled)
      for (let i = 0; i < 10; i++) {
        window.dispatchEvent(saveEvent);
        jest.advanceTimersByTime(10);
      }
      expect(handlers.save).toHaveBeenCalledTimes(1); // Throttled to once

      // Rapid search typing (should be debounced)
      for (let i = 0; i < 5; i++) {
        window.dispatchEvent(searchEvent);
        jest.advanceTimersByTime(50);
      }
      expect(handlers.search).not.toHaveBeenCalled(); // Still debouncing

      jest.advanceTimersByTime(300);
      expect(handlers.search).toHaveBeenCalledTimes(1); // Debounced execution

      // Navigate should work immediately each time
      window.dispatchEvent(navEvent);
      window.dispatchEvent(navEvent);
      expect(handlers.navigate).toHaveBeenCalledTimes(2);

      // Cleanup
      unsubscribers.forEach((unsub) => unsub());
    });
  });
});
