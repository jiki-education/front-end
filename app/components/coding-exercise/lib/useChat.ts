import { useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { toastError } from "@/lib/toast";
import { showPremiumUpgradeModal } from "@/lib/modal/app";
import { useTurnstile } from "@/lib/turnstile/useTurnstile";
import { useChatState } from "./useChatState";
import { useChatContext } from "./useChatContext";
import { sendChatMessage, ChatTokenExpiredError, ChatUsageLimitError } from "./chatApi";
import { ConversationSaveCaptchaError, saveConversation } from "./conversationApi";
import { ChatTokenAccessDeniedError, ChatTokenInvalidCaptchaError, fetchChatToken } from "./chatTokenApi";
import { formatChatError } from "./chatErrorHandler";
import { extractUsage } from "./chatUsage";
import type Orchestrator from "./Orchestrator";

export function useChat(orchestrator: Orchestrator) {
  const t = useTranslations("codingExercise");
  const chatState = useChatState();
  const context = useChatContext(orchestrator);
  const turnstile = useTurnstile();
  const tokenFetchInProgress = useRef<Promise<string> | null>(null);

  // Get existing token or fetch a new one
  const ensureValidToken = useCallback(async (): Promise<string> => {
    // Return existing token if available
    if (chatState.chatToken) {
      return chatState.chatToken;
    }

    // If a fetch is already in progress, wait for it
    if (tokenFetchInProgress.current) {
      return tokenFetchInProgress.current;
    }

    // Run Turnstile, then exchange for a chat JWT. One Turnstile pass per
    // chat session — once we hold a chat token, subsequent messages reuse it.
    tokenFetchInProgress.current = (async () => {
      const cfTurnstileResponse = await turnstile.execute();
      return fetchChatToken({
        context: context.context,
        cfTurnstileResponse
      });
    })();

    try {
      const token = await tokenFetchInProgress.current;
      chatState.setChatToken(token);
      return token;
    } finally {
      tokenFetchInProgress.current = null;
    }
  }, [chatState, context.context, turnstile]);

  // Perform the actual chat request with a given token
  const performChatRequest = useCallback(
    async (message: string, token: string) => {
      // Read the editor contents lazily, when the message is actually sent, so
      // the proxy receives the student's current code rather than a snapshot
      // taken at render time.
      const currentCode = orchestrator.getCurrentEditorValue() || orchestrator.getStore().getState().code || "";

      await sendChatMessage(
        {
          exerciseSlug: context.exerciseSlug,
          code: currentCode,
          question: message,
          language: context.language,
          history: chatState.messages,
          nextTaskId: context.currentTaskId || undefined,
          locale: context.locale,
          contentHash: context.contentHash
        },
        {
          onTextChunk: (text) => {
            chatState.setCurrentResponse(text);
          },
          onSignature: (signature) => {
            chatState.setSignature(signature);
            // The proxy reports the user's current usage on the signature event.
            // Capturing it lets us drive the "getting close" warning and pre-empt
            // the cap (disable the composer once the user is at their limit).
            const usage = extractUsage(signature);
            if (usage) {
              chatState.setUsage(usage);
            }
          },
          onError: (error) => {
            chatState.setError(error);
            chatState.setStatus("error");
          },
          onComplete: (fullResponse, signature) => {
            if (fullResponse.trim()) {
              chatState.setCurrentResponse(fullResponse);

              if (signature) {
                chatState.setSignature(signature);
                saveConversation(context.context, message, fullResponse, signature).catch((error: unknown) => {
                  console.error("Failed to save conversation:", error);
                  toastError(
                    error instanceof ConversationSaveCaptchaError
                      ? "exercise.chatSaveCaptchaFailed"
                      : "exercise.chatSaveFailed",
                    undefined,
                    { duration: 8000 }
                  );
                });
              }

              chatState.setStatus("typing");
            } else {
              chatState.setStatus("idle");
            }
          }
        },
        token
      );
    },
    [chatState, context, orchestrator]
  );

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || chatState.status === "thinking" || chatState.status === "typing") {
        return;
      }

      // Add user message immediately
      chatState.addUserMessageImmediately(message);

      try {
        // Get a valid token
        const token = await ensureValidToken();

        try {
          await performChatRequest(message, token);
        } catch (error) {
          // If token expired, clear it, get new one, and retry once
          if (error instanceof ChatTokenExpiredError) {
            chatState.clearChatToken();
            const newToken = await ensureValidToken();
            await performChatRequest(message, newToken);
          } else {
            throw error;
          }
        }
      } catch (error) {
        // 403 access_denied: user clicked send while not entitled to chat.
        // This is the high-intent moment — fire premium_modal_shown and
        // open the upgrade modal. invalid_captcha is an infra failure and
        // must NOT fire the analytics event (would pollute the funnel).
        if (error instanceof ChatTokenAccessDeniedError) {
          showPremiumUpgradeModal("assistant_send_message", {
            contextType: context.context.type,
            contextSlug: context.context.slug
          });
          chatState.setStatus("idle");
          return;
        }

        if (error instanceof ChatTokenInvalidCaptchaError) {
          chatState.setError(t("chatError.verificationFailed"));
          chatState.setStatus("error");
          return;
        }

        // Quota cap: record the usage so the composer disables and shows the cap
        // notice. We deliberately don't set an error/retry here — the cap won't
        // recover until reset, so a "Try Again" button would be misleading.
        if (error instanceof ChatUsageLimitError) {
          chatState.setUsage(error.usage);
          chatState.setStatus("idle");
          return;
        }

        // Translate keyed messages here (the hook has locale context); proxy/
        // server-provided copy passes through verbatim.
        const formatted = formatChatError(error);
        chatState.setError(formatted.type === "key" ? t(formatted.key, formatted.params) : formatted.text);
        chatState.setStatus("error");
      }
    },
    [chatState, ensureValidToken, performChatRequest, context.context.type, context.context.slug, t]
  );

  const clearConversation = useCallback(() => {
    chatState.clearChat();
  }, [chatState]);

  const retryLastMessage = useCallback(() => {
    if (chatState.status === "error" && chatState.messages.length > 0) {
      const messages = chatState.messages;
      const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user");

      if (lastUserMessage) {
        // Find the index of the last user message
        const lastUserMessageIndex = messages.lastIndexOf(lastUserMessage);

        // Remove from the last user message onwards (handles both cases:
        // 1. Error during streaming: removes only the user message
        // 2. Error after assistant response: removes user + assistant messages)
        const newMessages = messages.slice(0, lastUserMessageIndex);

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
    loadConversation: chatState.loadConversation,
    isDisabled: chatState.status === "thinking" || chatState.status === "typing",
    canRetry: chatState.status === "error" && chatState.messages.length > 0
  };
}
