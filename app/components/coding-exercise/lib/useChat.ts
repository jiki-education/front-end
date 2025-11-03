import { useCallback } from "react";
import { useChatState } from "./useChatState";
import { useChatContext } from "./useChatContext";
import { sendChatMessage, ChatApiError } from "./chatApi";
import { saveConversation } from "./conversationApi";
import type Orchestrator from "./Orchestrator";

export function useChat(orchestrator: Orchestrator) {
  const chatState = useChatState();
  const context = useChatContext(orchestrator);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || chatState.status === "streaming") {
        return;
      }

      chatState.resetForNewMessage();

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
                chatState.addMessageToHistory(message, fullResponse);

                // If we have a signature, save the conversation
                if (signature) {
                  void saveConversation(context.exerciseSlug, message, fullResponse, signature);
                }
              }
              chatState.setStatus("idle");
            }
          }
        );
      } catch (error) {
        const errorMessage = error instanceof ChatApiError ? error.message : "Failed to send message";
        chatState.setError(errorMessage);
        chatState.setStatus("error");
      }
    },
    [chatState, context]
  );

  const clearConversation = useCallback(() => {
    chatState.clearChat();
  }, [chatState]);

  return {
    ...chatState,
    context,
    sendMessage,
    clearConversation,
    isDisabled: chatState.status === "streaming"
  };
}
