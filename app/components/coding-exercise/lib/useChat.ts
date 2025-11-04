import { useCallback } from "react";
import { useChatState } from "./useChatState";
import { useChatContext } from "./useChatContext";
import { sendChatMessage } from "./chatApi";
import { saveConversation } from "./conversationApi";
import { formatChatError } from "./chatErrorHandler";
import type Orchestrator from "./Orchestrator";

export function useChat(orchestrator: Orchestrator) {
  const chatState = useChatState();
  const context = useChatContext(orchestrator);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || chatState.status === "thinking" || chatState.status === "typing") {
        return;
      }

      // Add user message immediately
      chatState.addUserMessageImmediately(message);

      try {
        await sendChatMessage(
          {
            exerciseSlug: context.exerciseSlug,
            code: context.currentCode,
            question: message,
            history: chatState.messages,
            nextTaskId: context.currentTaskId || undefined
          },
          {
            onTextChunk: (text) => {
              // Just update the response, keep status as thinking until complete
              chatState.setCurrentResponse(text);
            },
            onSignature: (signature) => {
              chatState.setSignature(signature);
            },
            onError: (error) => {
              chatState.setError(error);
              chatState.setStatus("error");
            },
            onComplete: (fullResponse, signature) => {
              if (fullResponse.trim()) {
                // Set the response content and start typing animation
                chatState.setCurrentResponse(fullResponse);

                // Save signature data if present
                if (signature) {
                  chatState.setSignature(signature);
                  void saveConversation(context.exerciseSlug, message, fullResponse, signature);
                }

                // Set status to typing to start the TypeIt animation
                // DON'T add to history yet - wait for typing to complete
                chatState.setStatus("typing");
              } else {
                // No response, go back to idle
                chatState.setStatus("idle");
              }
            }
          }
        );
      } catch (error) {
        const errorMessage = formatChatError(error);
        chatState.setError(errorMessage);
        chatState.setStatus("error");
      }
    },
    [chatState, context]
  );

  const clearConversation = useCallback(() => {
    chatState.clearChat();
  }, [chatState]);

  const retryLastMessage = useCallback(() => {
    if (chatState.status === "error" && chatState.messages.length > 0) {
      const lastUserMessage = [...chatState.messages].reverse().find((msg) => msg.role === "user");

      if (lastUserMessage) {
        // Remove the failed message pair from history
        const newMessages = chatState.messages.slice(0, -2);
        chatState.clearChat();
        newMessages.forEach((msg) => chatState.addMessage(msg));

        // Retry the message
        void sendMessage(lastUserMessage.content);
      }
    }
  }, [chatState, sendMessage]);

  const clearError = useCallback(() => {
    if (chatState.status === "error") {
      chatState.setError(null);
      chatState.setStatus("idle");
    }
  }, [chatState]);

  return {
    ...chatState,
    context,
    sendMessage,
    clearConversation,
    retryLastMessage,
    clearError,
    isDisabled: chatState.status === "thinking" || chatState.status === "typing",
    canRetry: chatState.status === "error" && chatState.messages.length > 0
  };
}
