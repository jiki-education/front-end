import { useKeyboard } from "@/lib/keyboard";
import { act, render, screen, waitFor } from "@testing-library/react";
import React, { useState } from "react";

describe("useKeyboard Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Lifecycle", () => {
    it("should handle shortcuts in mounted components", async () => {
      const handleShortcut = jest.fn();

      function TestComponent() {
        useKeyboard("ctrl+k", handleShortcut);
        return <div data-testid="test-component">Component is mounted</div>;
      }

      const { unmount } = render(<TestComponent />);
      expect(screen.getByTestId("test-component")).toBeInTheDocument();

      // Trigger the shortcut
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
      });

      await waitFor(() => {
        expect(handleShortcut).toHaveBeenCalledTimes(1);
      });

      // Unmount and verify cleanup
      unmount();

      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
      });

      // Should not be called after unmount
      expect(handleShortcut).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple components with different shortcuts", () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      function Component1() {
        useKeyboard("ctrl+a", handler1);
        return <div>Component 1</div>;
      }

      function Component2() {
        useKeyboard("ctrl+b", handler2);
        return <div>Component 2</div>;
      }

      function App() {
        return (
          <>
            <Component1 />
            <Component2 />
          </>
        );
      }

      render(<App />);

      // Trigger first shortcut
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "a", ctrlKey: true, bubbles: true }));
      });

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).not.toHaveBeenCalled();

      // Trigger second shortcut
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "b", ctrlKey: true, bubbles: true }));
      });

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });
  });

  describe("State and Closure Handling", () => {
    it("should always use the latest handler with current state", async () => {
      const log: number[] = [];

      function Counter() {
        const [count, setCount] = useState(0);

        useKeyboard("ctrl+i", () => {
          log.push(count);
          setCount((c) => c + 1);
        });

        return (
          <div>
            <div data-testid="count">{count}</div>
            <button onClick={() => setCount((c) => c + 1)}>Increment</button>
          </div>
        );
      }

      render(<Counter />);
      expect(screen.getByTestId("count")).toHaveTextContent("0");

      // First shortcut trigger
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "i", ctrlKey: true, bubbles: true }));
      });

      await waitFor(() => {
        expect(screen.getByTestId("count")).toHaveTextContent("1");
      });

      // Second shortcut trigger - should see updated state
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "i", ctrlKey: true, bubbles: true }));
      });

      await waitFor(() => {
        expect(screen.getByTestId("count")).toHaveTextContent("2");
      });

      // Verify the handler always had access to current state
      expect(log).toEqual([0, 1]);
    });

    it("should handle dynamic shortcut changes", () => {
      const handler = jest.fn();

      function DynamicShortcut({ shortcut }: { shortcut: string }) {
        useKeyboard(shortcut, handler);
        return <div data-testid="shortcut">{shortcut}</div>;
      }

      const { rerender } = render(<DynamicShortcut shortcut="ctrl+x" />);

      // Trigger original shortcut
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "x", ctrlKey: true, bubbles: true }));
      });

      expect(handler).toHaveBeenCalledTimes(1);

      // Change the shortcut
      rerender(<DynamicShortcut shortcut="ctrl+y" />);
      expect(screen.getByTestId("shortcut")).toHaveTextContent("ctrl+y");

      // Old shortcut should not work
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "x", ctrlKey: true, bubbles: true }));
      });

      expect(handler).toHaveBeenCalledTimes(1);

      // New shortcut should work
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "y", ctrlKey: true, bubbles: true }));
      });

      expect(handler).toHaveBeenCalledTimes(2);
    });
  });

  describe("Conditional Rendering", () => {
    it("should register/unregister shortcuts based on conditional rendering", async () => {
      const modalHandler = jest.fn();
      const globalHandler = jest.fn();

      function App() {
        const [showModal, setShowModal] = useState(false);

        useKeyboard("ctrl+m", () => {
          globalHandler();
          setShowModal(true);
        });

        return (
          <div>
            <button onClick={() => setShowModal(true)}>Open Modal</button>
            {showModal && <Modal onClose={() => setShowModal(false)} />}
          </div>
        );
      }

      function Modal({ onClose }: { onClose: () => void }) {
        useKeyboard("escape", () => {
          modalHandler();
          onClose();
        });

        return <div data-testid="modal">Modal Content</div>;
      }

      render(<App />);

      // Modal shortcut should not work when modal is closed
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      });

      expect(modalHandler).not.toHaveBeenCalled();

      // Open modal with shortcut
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "m", ctrlKey: true, bubbles: true }));
      });

      await waitFor(() => {
        expect(screen.getByTestId("modal")).toBeInTheDocument();
      });

      // Now escape should work
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      });

      await waitFor(() => {
        expect(modalHandler).toHaveBeenCalledTimes(1);
        expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
      });

      // After modal closes, escape should not work again
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      });

      expect(modalHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("Navigation Simulation", () => {
    it("should handle component switching (simulating page navigation)", async () => {
      const page1Handler = jest.fn();
      const page2Handler = jest.fn();
      const globalHandler = jest.fn();

      function Page1() {
        useKeyboard("ctrl+1", page1Handler);
        return <div data-testid="page1">Page 1</div>;
      }

      function Page2() {
        useKeyboard("ctrl+2", page2Handler);
        return <div data-testid="page2">Page 2</div>;
      }

      function App() {
        const [currentPage, setCurrentPage] = useState<"page1" | "page2">("page1");

        // Global shortcut that persists across "navigation"
        useKeyboard("ctrl+g", globalHandler);

        return (
          <div>
            <button onClick={() => setCurrentPage("page1")}>Go to Page 1</button>
            <button onClick={() => setCurrentPage("page2")}>Go to Page 2</button>
            {currentPage === "page1" ? <Page1 /> : <Page2 />}
          </div>
        );
      }

      const { getByText } = render(<App />);
      expect(screen.getByTestId("page1")).toBeInTheDocument();

      // Page 1 shortcut should work
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "1", ctrlKey: true, bubbles: true }));
      });
      expect(page1Handler).toHaveBeenCalledTimes(1);

      // Page 2 shortcut should not work yet
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "2", ctrlKey: true, bubbles: true }));
      });
      expect(page2Handler).not.toHaveBeenCalled();

      // Global shortcut should work
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "g", ctrlKey: true, bubbles: true }));
      });
      expect(globalHandler).toHaveBeenCalledTimes(1);

      // Navigate to page 2
      act(() => {
        getByText("Go to Page 2").click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("page2")).toBeInTheDocument();
        expect(screen.queryByTestId("page1")).not.toBeInTheDocument();
      });

      // Now page 1 shortcut should not work
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "1", ctrlKey: true, bubbles: true }));
      });
      expect(page1Handler).toHaveBeenCalledTimes(1); // Still 1

      // Page 2 shortcut should work now
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "2", ctrlKey: true, bubbles: true }));
      });
      expect(page2Handler).toHaveBeenCalledTimes(1);

      // Global shortcut should still work
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "g", ctrlKey: true, bubbles: true }));
      });
      expect(globalHandler).toHaveBeenCalledTimes(2);
    });

    it("should handle rapid component mounting/unmounting", async () => {
      const handlers: jest.Mock[] = [];
      const CYCLE_COUNT = 5;

      function TestComponent({ id }: { id: number }) {
        if (!handlers[id]) {
          handlers[id] = jest.fn();
        }
        const handler = handlers[id];

        useKeyboard(`ctrl+${id}`, handler);
        return <div data-testid={`component-${id}`}>Component {id}</div>;
      }

      function App() {
        const [activeComponent, setActiveComponent] = useState(0);

        return (
          <div>
            <button onClick={() => setActiveComponent((prev) => (prev + 1) % CYCLE_COUNT)}>Next Component</button>
            <TestComponent id={activeComponent} />
          </div>
        );
      }

      const { getByText } = render(<App />);

      // Rapidly switch through components
      for (let i = 0; i < CYCLE_COUNT * 2; i++) {
        const currentId = i % CYCLE_COUNT;

        // Verify current component is mounted
        expect(screen.getByTestId(`component-${currentId}`)).toBeInTheDocument();

        // Test that only current shortcut works
        for (let j = 0; j < CYCLE_COUNT; j++) {
          act(() => {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: String(j), ctrlKey: true, bubbles: true }));
          });

          if (j === currentId && handlers[j]) {
            expect(handlers[j]).toHaveBeenCalled();
          } else if (handlers[j]) {
            expect(handlers[j]).not.toHaveBeenCalled();
          }
        }

        // Clear mocks (handlers array can be sparse)
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        handlers.forEach((h) => h?.mockClear());

        // Go to next component
        if (i < CYCLE_COUNT * 2 - 1) {
          act(() => {
            getByText("Next Component").click();
          });

          await waitFor(() => {
            expect(screen.getByTestId(`component-${(currentId + 1) % CYCLE_COUNT}`)).toBeInTheDocument();
          });
        }
      }
    });
  });

  describe("Options and Features", () => {
    it("should respect enabled option", async () => {
      const handler = jest.fn();

      function ToggleableShortcut() {
        const [enabled, setEnabled] = useState(true);

        useKeyboard("ctrl+e", handler, { enabled });

        return (
          <div>
            <button onClick={() => setEnabled(!enabled)}>Toggle: {enabled ? "Enabled" : "Disabled"}</button>
          </div>
        );
      }

      const { getByText } = render(<ToggleableShortcut />);

      // Should work when enabled
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "e", ctrlKey: true, bubbles: true }));
      });
      expect(handler).toHaveBeenCalledTimes(1);

      // Disable
      act(() => {
        getByText("Toggle: Enabled").click();
      });

      await waitFor(() => {
        expect(getByText("Toggle: Disabled")).toBeInTheDocument();
      });

      // Should not work when disabled
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "e", ctrlKey: true, bubbles: true }));
      });
      expect(handler).toHaveBeenCalledTimes(1); // Still 1

      // Re-enable
      act(() => {
        getByText("Toggle: Disabled").click();
      });

      await waitFor(() => {
        expect(getByText("Toggle: Enabled")).toBeInTheDocument();
      });

      // Should work again
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "e", ctrlKey: true, bubbles: true }));
      });
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it("should handle preventDefault option", () => {
      const handler = jest.fn();
      function PreventDefaultTest() {
        useKeyboard(
          "ctrl+s",
          () => {
            handler();
          },
          { preventDefault: true }
        );

        return <div>Press Ctrl+S</div>;
      }

      render(<PreventDefaultTest />);

      const event = new KeyboardEvent("keydown", { key: "s", ctrlKey: true, bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(event, "preventDefault");

      act(() => {
        window.dispatchEvent(event);
      });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });
});
