import { useState, useEffect, useCallback, useRef } from "react";
import { fetchUserLesson } from "@/lib/api/lessons";
import type { ChatMessage } from "./chat-types";

interface CachedData {
  conversation: ChatMessage[];
  conversationAllowed: boolean;
}

export interface ConversationLoaderState {
  conversation: ChatMessage[];
  conversationAllowed: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useConversationLoader(contextSlug: string) {
  const [state, setState] = useState<ConversationLoaderState>({
    conversation: [],
    conversationAllowed: true,
    isLoading: true,
    error: null
  });

  // Cache to prevent redundant API calls for the same context
  const cacheRef = useRef<Record<string, CachedData>>({});
  const loadedRef = useRef<string | null>(null);

  const loadConversation = useCallback(
    async (forceReload = false) => {
      if (!contextSlug) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      // Check cache first unless forcing reload
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!forceReload && cacheRef.current[contextSlug] && loadedRef.current === contextSlug) {
        const cached = cacheRef.current[contextSlug];
        setState({
          conversation: cached.conversation,
          conversationAllowed: cached.conversationAllowed,
          isLoading: false,
          error: null
        });
        return;
      }

      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const userLessonData = await fetchUserLesson(contextSlug);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- API response may not match TypeScript types
        const conversation = userLessonData.conversation || [];

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- API response may not match TypeScript types
        const conversationAllowed = userLessonData.conversation_allowed ?? true;

        // Cache the result
        cacheRef.current[contextSlug] = { conversation, conversationAllowed };
        loadedRef.current = contextSlug;

        setState({
          conversation,
          conversationAllowed,
          isLoading: false,
          error: null
        });
      } catch (error) {
        // Handle specific error cases gracefully
        if (error instanceof Error) {
          // If user lesson doesn't exist yet, that's okay - start with empty conversation
          if (error.message.includes("User lesson not found")) {
            const emptyData: CachedData = { conversation: [], conversationAllowed: true };
            cacheRef.current[contextSlug] = emptyData;
            loadedRef.current = contextSlug;

            setState({
              conversation: [],
              conversationAllowed: true,
              isLoading: false,
              error: null
            });
            return;
          }
        }

        // Other errors should be logged but not break the UI
        console.warn("Failed to load conversation:", error);
        setState({
          conversation: [],
          conversationAllowed: true,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to load conversation"
        });
      }
    },
    [contextSlug]
  );

  // Load conversation data on mount - async data fetching pattern
  useEffect(() => {
    void loadConversation();
  }, [loadConversation]);

  const retry = useCallback(() => {
    void loadConversation(true); // Force reload on retry
  }, [loadConversation]);

  return {
    ...state,
    retry
  };
}
