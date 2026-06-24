/**
 * Unit tests for useChat code-diff wiring: snapshotting the editor on send and
 * attaching per-message diffs to the outgoing payload.
 */

import { renderHook, act } from "@testing-library/react";
import { useChat } from "@/components/coding-exercise/lib/useChat";
import { fetchChatToken } from "@/components/coding-exercise/lib/chatTokenApi";
import { sendChatMessage } from "@/components/coding-exercise/lib/chatApi";
import { useChatContext } from "@/components/coding-exercise/lib/useChatContext";
import { getSnapshots, makeSnapshotKey } from "@/components/coding-exercise/lib/codeSnapshotStore";

jest.mock("@/components/coding-exercise/lib/chatTokenApi");
jest.mock("@/components/coding-exercise/lib/chatApi");
jest.mock("@/components/coding-exercise/lib/conversationApi");
jest.mock("@/components/coding-exercise/lib/useChatContext");

const mockFetchChatToken = fetchChatToken as jest.MockedFunction<typeof fetchChatToken>;
const mockSendChatMessage = sendChatMessage as jest.MockedFunction<typeof sendChatMessage>;
const mockUseChatContext = useChatContext as jest.MockedFunction<typeof useChatContext>;

function createMockOrchestrator(getEditorValue: () => string) {
  const store = {
    getState: () => ({ code: "fallback code" }),
    subscribe: jest.fn(() => jest.fn())
  };
  return {
    store,
    getStore: () => store,
    getCurrentEditorValue: getEditorValue,
    exercise: { slug: "test-exercise", tasks: [] }
  } as any;
}

const CONVERSATION_KEY = "lesson:test-lesson";

describe("useChat code diffs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    mockUseChatContext.mockReturnValue({
      exerciseSlug: "test-exercise",
      context: { type: "lesson", slug: "test-lesson" },
      currentTaskId: "task-1",
      language: "javascript",
      exerciseTitle: "Test Exercise",
      exerciseInstructions: "Test instructions",
      contentHash: "test-hash",
      exercise: { slug: "test-exercise", tasks: [] }
    });

    mockFetchChatToken.mockResolvedValue("mock-token");
    // Complete with an empty response so the hook returns to "idle" (rather than
    // "typing", which only resolves via the UI typing animation) - otherwise a
    // follow-up sendMessage would be blocked.
    mockSendChatMessage.mockImplementation((_payload, callbacks) => {
      callbacks.onComplete("", null);
      return Promise.resolve();
    });
  });

  it("saves a snapshot of the current editor code keyed to the sent message", async () => {
    const orchestrator = createMockOrchestrator(() => "move()\n");
    const { result } = renderHook(() => useChat(orchestrator));

    await act(async () => {
      await result.current.sendMessage("how do I start?");
    });

    const snaps = getSnapshots(CONVERSATION_KEY);
    expect(snaps[makeSnapshotKey(0, "how do I start?")]).toBe("move()\n");
  });

  it("attaches the diff of code changes as currentCodeDiff on the next send", async () => {
    let editorValue = "move()\n";
    const orchestrator = createMockOrchestrator(() => editorValue);
    const { result } = renderHook(() => useChat(orchestrator));

    await act(async () => {
      await result.current.sendMessage("first");
    });

    editorValue = "move()\nmove()\n";
    await act(async () => {
      await result.current.sendMessage("second");
    });

    const secondPayload = mockSendChatMessage.mock.calls[1][0];
    expect(secondPayload.currentCodeDiff).toBeDefined();
    expect(secondPayload.currentCodeDiff).toContain("+move()");
  });

  it("sends no diff on the very first message (nothing to diff against)", async () => {
    const orchestrator = createMockOrchestrator(() => "move()\n");
    const { result } = renderHook(() => useChat(orchestrator));

    await act(async () => {
      await result.current.sendMessage("first");
    });

    const firstPayload = mockSendChatMessage.mock.calls[0][0];
    expect(firstPayload.currentCodeDiff).toBeUndefined();
    expect(firstPayload.history).toEqual([]);
  });

  it("does not persist codeDiff onto in-memory chat messages", async () => {
    const orchestrator = createMockOrchestrator(() => "move()\n");
    const { result } = renderHook(() => useChat(orchestrator));

    await act(async () => {
      await result.current.sendMessage("hello");
    });

    expect(result.current.messages[0].codeDiff).toBeUndefined();
  });
});
