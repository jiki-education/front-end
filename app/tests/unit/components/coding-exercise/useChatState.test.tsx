import { renderHook, act } from "@testing-library/react";
import { useChatState } from "@/components/coding-exercise/lib/useChatState";
import type { ChatMessage } from "@/components/coding-exercise/lib/chat-types";

describe("useChatState", () => {
  describe("loadConversation", () => {
    it("should load conversation messages and reset state", () => {
      const { result } = renderHook(() => useChatState());

      const mockConversation: ChatMessage[] = [
        { role: "user", content: "Hello", timestamp: "2023-01-01T00:00:00Z" },
        { role: "assistant", content: "Hi there!", timestamp: "2023-01-01T00:00:01Z" },
        { role: "user", content: "How are you?", timestamp: "2023-01-01T00:00:02Z" }
      ];

      act(() => {
        result.current.loadConversation(mockConversation);
      });

      expect(result.current.messages).toEqual(mockConversation);
      expect(result.current.currentResponse).toBe("");
      expect(result.current.status).toBe("idle");
      expect(result.current.error).toBeNull();
      expect(result.current.signature).toBeNull();
    });

    it("should replace existing messages when loading conversation", () => {
      const { result } = renderHook(() => useChatState());

      // First add some messages
      act(() => {
        result.current.addMessage({ role: "user", content: "Existing message" });
      });

      expect(result.current.messages).toHaveLength(1);

      const newConversation: ChatMessage[] = [
        { role: "user", content: "New message 1" },
        { role: "assistant", content: "New message 2" }
      ];

      act(() => {
        result.current.loadConversation(newConversation);
      });

      expect(result.current.messages).toEqual(newConversation);
      expect(result.current.messages).toHaveLength(2);
    });

    it("should handle empty conversation array", () => {
      const { result } = renderHook(() => useChatState());

      // First add some messages
      act(() => {
        result.current.addMessage({ role: "user", content: "Test message" });
      });

      act(() => {
        result.current.loadConversation([]);
      });

      expect(result.current.messages).toEqual([]);
      expect(result.current.status).toBe("idle");
    });
  });
});
