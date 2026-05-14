import { useState, useEffect, useCallback, useRef } from "react";
import { fetchUserLesson } from "@/lib/api/lessons";
import { fetchUserProject } from "@/lib/api/projects";
import { NotFoundError } from "@/lib/api/client";
import type { ChatMessage } from "./chat-types";
import type { ExerciseContext } from "./types";

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

async function fetchConversationData(type: ExerciseContext["type"], slug: string) {
  return type === "project" ? fetchUserProject(slug) : fetchUserLesson(slug);
}

export function useConversationLoader(context: ExerciseContext) {
  const [state, setState] = useState<ConversationLoaderState>({
    conversation: [],
    conversationAllowed: true,
    isLoading: true,
    error: null
  });

  // Cache to prevent redundant API calls for the same context
  const cacheRef = useRef<Record<string, CachedData>>({});
  const loadedRef = useRef<string | null>(null);

  // Depend on the primitive type/slug rather than the context object, whose
  // identity changes every render and would otherwise re-trigger the effect.
  const { type, slug } = context;
  const cacheKey = `${type}:${slug}`;

  const loadConversation = useCallback(
    async (forceReload = false) => {
      if (!slug) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      // Check cache first unless forcing reload
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!forceReload && cacheRef.current[cacheKey] && loadedRef.current === cacheKey) {
        const cached = cacheRef.current[cacheKey];
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

        const userContextData = await fetchConversationData(type, slug);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- API response may not match TypeScript types
        const conversation = userContextData.conversation || [];

        // Fail-closed: an existing user record with no explicit flag is treated as
        // not allowed, so the gated UI renders rather than silently permitting chat.
        const conversationAllowed = Boolean(userContextData.conversation_allowed);

        // Cache the result
        cacheRef.current[cacheKey] = { conversation, conversationAllowed };
        loadedRef.current = cacheKey;

        setState({
          conversation,
          conversationAllowed,
          isLoading: false,
          error: null
        });
      } catch (error) {
        // No user record yet - that's okay, start with an empty conversation.
        // The user hasn't started this context, so they're allowed to begin.
        if (error instanceof NotFoundError) {
          const emptyData: CachedData = { conversation: [], conversationAllowed: true };
          cacheRef.current[cacheKey] = emptyData;
          loadedRef.current = cacheKey;

          setState({
            conversation: [],
            conversationAllowed: true,
            isLoading: false,
            error: null
          });
          return;
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
    [type, slug, cacheKey]
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
