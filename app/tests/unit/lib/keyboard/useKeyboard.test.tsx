import { keyboard } from "@/lib/keyboard";
import { useKeyboard } from "@/lib/keyboard/useKeyboard";
import { render } from "@testing-library/react";

jest.mock("@/lib/keyboard", () => ({
  keyboard: {
    on: jest.fn(() => jest.fn())
  }
}));

describe("useKeyboard", () => {
  const mockOn = keyboard.on as jest.Mock;

  beforeEach(() => {
    mockOn.mockClear();
    mockOn.mockReturnValue(jest.fn());
  });

  it("should register shortcut on mount", () => {
    const handler = jest.fn();

    function TestComponent() {
      useKeyboard("cmd+k", handler);
      return <div>Test</div>;
    }

    render(<TestComponent />);

    expect(mockOn).toHaveBeenCalledTimes(1);
    expect(mockOn).toHaveBeenCalledWith("cmd+k", expect.any(Function), {});
  });

  it("should pass options to keyboard.on", () => {
    const handler = jest.fn();
    const options = { description: "Test", scope: "modal" };

    function TestComponent() {
      useKeyboard("cmd+k", handler, options);
      return <div>Test</div>;
    }

    render(<TestComponent />);

    expect(mockOn).toHaveBeenCalledWith("cmd+k", expect.any(Function), options);
  });

  it("should unregister shortcut on unmount", () => {
    const handler = jest.fn();
    const unsubscribe = jest.fn();
    mockOn.mockReturnValue(unsubscribe);

    function TestComponent() {
      useKeyboard("cmd+k", handler);
      return <div>Test</div>;
    }

    const { unmount } = render(<TestComponent />);

    expect(unsubscribe).not.toHaveBeenCalled();

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("should capture latest handler without re-registering", () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    function TestComponent({ handler }: { handler: () => void }) {
      useKeyboard("cmd+k", handler);
      return <div>Test</div>;
    }

    const { rerender } = render(<TestComponent handler={handler1} />);

    expect(mockOn).toHaveBeenCalledTimes(1);

    rerender(<TestComponent handler={handler2} />);

    expect(mockOn).toHaveBeenCalledTimes(1);
  });

  it("should re-register when keys change", () => {
    const handler = jest.fn();
    const unsubscribe = jest.fn();
    mockOn.mockReturnValue(unsubscribe);

    function TestComponent({ keys }: { keys: string }) {
      useKeyboard(keys, handler);
      return <div>Test</div>;
    }

    const { rerender } = render(<TestComponent keys="cmd+k" />);

    expect(mockOn).toHaveBeenCalledTimes(1);
    expect(mockOn).toHaveBeenCalledWith("cmd+k", expect.any(Function), {});

    rerender(<TestComponent keys="cmd+s" />);

    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(mockOn).toHaveBeenCalledTimes(2);
    expect(mockOn).toHaveBeenCalledWith("cmd+s", expect.any(Function), {});
  });

  it("should re-register when options change", () => {
    const handler = jest.fn();
    const unsubscribe = jest.fn();
    mockOn.mockReturnValue(unsubscribe);

    function TestComponent({ enabled }: { enabled: boolean }) {
      useKeyboard("cmd+k", handler, { enabled });
      return <div>Test</div>;
    }

    const { rerender } = render(<TestComponent enabled={true} />);

    expect(mockOn).toHaveBeenCalledTimes(1);

    rerender(<TestComponent enabled={false} />);

    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(mockOn).toHaveBeenCalledTimes(2);
  });

  it("should always use latest handler via ref", () => {
    let capturedHandler: ((e: KeyboardEvent) => void) | undefined;

    mockOn.mockImplementation((_keys, handler) => {
      capturedHandler = handler;
      return jest.fn();
    });

    const mockHandler1 = jest.fn();
    const mockHandler2 = jest.fn();

    function TestComponent({ handler }: { handler: () => void }) {
      useKeyboard("cmd+s", handler);
      return <div>Test</div>;
    }

    const { rerender } = render(<TestComponent handler={mockHandler1} />);

    if (capturedHandler) {
      const mockEvent = new KeyboardEvent("keydown", { key: "s", metaKey: true });
      capturedHandler(mockEvent);
    }

    expect(mockHandler1).toHaveBeenCalledTimes(1);
    expect(mockHandler2).not.toHaveBeenCalled();

    rerender(<TestComponent handler={mockHandler2} />);

    if (capturedHandler) {
      const mockEvent = new KeyboardEvent("keydown", { key: "s", metaKey: true });
      capturedHandler(mockEvent);
    }

    expect(mockHandler1).toHaveBeenCalledTimes(1);
    expect(mockHandler2).toHaveBeenCalledTimes(1);
  });
});
