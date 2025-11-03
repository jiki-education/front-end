import { useState, useCallback } from "react";
import type { ChatMessage, ChatState, StreamStatus, SignatureData } from "./chat-types";

export function useChatState() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    currentResponse: "",
    status: "idle",
    error: null,
    signature: null
  });

  const setStatus = useCallback((status: StreamStatus) => {
    setState((prev) => ({ ...prev, status }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const setCurrentResponse = useCallback((currentResponse: string) => {
    setState((prev) => ({ ...prev, currentResponse }));
  }, []);

  const setSignature = useCallback((signature: SignatureData | null) => {
    setState((prev) => ({ ...prev, signature }));
  }, []);

  const addMessage = useCallback((message: ChatMessage) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
  }, []);

  const addMessageToHistory = useCallback((userMessage: string, assistantMessage: string) => {
    setState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        { role: "user", content: userMessage },
        { role: "assistant", content: assistantMessage }
      ],
      currentResponse: ""
    }));
  }, []);

  const clearChat = useCallback(() => {
    setState({
      messages: [],
      currentResponse: "",
      status: "idle",
      error: null,
      signature: null
    });
  }, []);

  const resetForNewMessage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentResponse: "",
      error: null,
      signature: null,
      status: "streaming"
    }));
  }, []);

  return {
    ...state,
    setStatus,
    setError,
    setCurrentResponse,
    setSignature,
    addMessage,
    addMessageToHistory,
    clearChat,
    resetForNewMessage
  };
}
