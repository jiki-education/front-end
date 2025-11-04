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

  const addMessageToHistory = useCallback((assistantMessage: string) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, { role: "assistant", content: assistantMessage }],
      currentResponse: ""
    }));
  }, []);

  const finishTyping = useCallback(() => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, { role: "assistant", content: prev.currentResponse }],
      currentResponse: "",
      status: "idle"
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
      status: "thinking"
    }));
  }, []);

  const addUserMessageImmediately = useCallback((userMessage: string) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, { role: "user", content: userMessage }],
      currentResponse: "",
      error: null,
      signature: null,
      status: "thinking"
    }));
  }, []);

  const loadConversation = useCallback((messages: ChatMessage[]) => {
    setState((prev) => ({
      ...prev,
      messages: [...messages],
      currentResponse: "",
      status: "idle",
      error: null,
      signature: null
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
    addUserMessageImmediately,
    clearChat,
    resetForNewMessage,
    finishTyping,
    loadConversation
  };
}
