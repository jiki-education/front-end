import { renderHook, act } from "@testing-library/react";
import { useChatState } from "@/components/coding-exercise/lib/useChatState";

describe("useChatState", () => {
  it("initializes with default state", () => {
    const { result } = renderHook(() => useChatState());

    expect(result.current.messages).toEqual([]);
    expect(result.current.status).toBe("idle");
    expect(result.current.error).toBeNull();
    expect(result.current.currentResponse).toBe("");
  });

  it("adds messages to history", () => {
    const { result } = renderHook(() => useChatState());

    act(() => {
      result.current.addMessageToHistory("Hello", "Hi there!");
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0]).toEqual({
      role: "user",
      content: "Hello"
    });
    expect(result.current.messages[1]).toEqual({
      role: "assistant",
      content: "Hi there!"
    });
  });

  it("clears chat state", () => {
    const { result } = renderHook(() => useChatState());

    act(() => {
      result.current.addMessageToHistory("Hello", "Hi there!");
      result.current.setError("Test error");
    });

    act(() => {
      result.current.clearChat();
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.status).toBe("idle");
  });
});
