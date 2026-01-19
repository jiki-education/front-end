import { useState, useEffect, useCallback, useRef } from "react";
import { fetchUserLesson } from "@/lib/api/lessons";
import type { ChatMessage } from "./chat-types";

export interface ConversationLoaderState {
  conversation: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export function useConversationLoader(exerciseSlug: string) {
  const [state, setState] = useState<ConversationLoaderState>({
    conversation: [],
    isLoading: true,
    error: null
  });

  // Cache to prevent redundant API calls for the same exercise
  const cacheRef = useRef<Record<string, ChatMessage[]>>({});
  const loadedRef = useRef<string | null>(null);

  const loadConversation = useCallback(
    async (forceReload = false) => {
      if (!exerciseSlug) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      // Check cache first unless forcing reload
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!forceReload && cacheRef.current[exerciseSlug] && loadedRef.current === exerciseSlug) {
        setState({
          conversation: cacheRef.current[exerciseSlug],
          isLoading: false,
          error: null
        });
        return;
      }

      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const userLessonData = await fetchUserLesson(exerciseSlug);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const conversation = userLessonData.conversation || [];

        // Cache the result
        cacheRef.current[exerciseSlug] = conversation;
        loadedRef.current = exerciseSlug;

        setState({
          conversation,
          isLoading: false,
          error: null
        });
      } catch (error) {
        // Handle specific error cases gracefully
        if (error instanceof Error) {
          // If user lesson doesn't exist yet, that's okay - start with empty conversation
          if (error.message.includes("User lesson not found")) {
            const emptyConversation: ChatMessage[] = [];
            cacheRef.current[exerciseSlug] = emptyConversation;
            loadedRef.current = exerciseSlug;

            setState({
              conversation: emptyConversation,
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
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to load conversation"
        });
      }
    },
    [exerciseSlug]
  );

  /* eslint-disable react-hooks/set-state-in-effect */
  // Load conversation data on mount - async data fetching pattern
  useEffect(() => {
    void loadConversation();
  }, [loadConversation]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const retry = useCallback(() => {
    void loadConversation(true); // Force reload on retry
  }, [loadConversation]);

  return {
    ...state,
    retry
  };
}
