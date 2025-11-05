import { render, screen, waitFor } from "@testing-library/react";
import ChatPanel from "@/components/coding-exercise/ui/ChatPanel";
import OrchestratorContext from "@/components/coding-exercise/lib/OrchestratorContext";
import { fetchUserLesson } from "@/lib/api/lessons";
import type { ChatMessage } from "@/components/coding-exercise/lib/chat-types";

// Mock the API
jest.mock("@/lib/api/lessons");
const mockFetchUserLesson = fetchUserLesson as jest.MockedFunction<typeof fetchUserLesson>;

// Mock DOM APIs not available in test environment
Object.defineProperty(Element.prototype, "scrollIntoView", {
  value: jest.fn(),
  writable: true
});

// Mock orchestrator
const mockOrchestrator = {
  getExercise: () => ({ slug: "test-exercise" }),
  getExerciseTitle: () => "Test Exercise",
  getExerciseInstructions: () => "Test instructions",
  getCurrentEditorValue: () => "console.log('test');",
  getStore: () => ({
    getState: () => ({
      currentTaskId: null,
      code: "console.log('test');"
    })
  })
} as any;

// Mock context provider
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <OrchestratorContext.Provider value={mockOrchestrator}>{children}</OrchestratorContext.Provider>;
}

describe("ChatPanel Integration", () => {
  beforeEach(() => {
    mockFetchUserLesson.mockClear();
    // Clear console.warn to avoid cluttering test output
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should show loading state while fetching conversation", async () => {
    // Mock a delayed response
    mockFetchUserLesson.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                lesson_slug: "test-exercise",
                status: "started",
                conversation: [],
                data: {}
              }),
            100
          );
        })
    );

    render(
      <TestWrapper>
        <ChatPanel />
      </TestWrapper>
    );

    // Should show loading initially
    expect(screen.getByText("Loading conversation...")).toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(
      () => {
        expect(screen.queryByText("Loading conversation...")).not.toBeInTheDocument();
      },
      { timeout: 200 }
    );
  });

  it("should load existing conversation messages on mount", async () => {
    const mockConversation: ChatMessage[] = [
      { role: "user", content: "Hello, I need help with this exercise", timestamp: "2023-01-01T00:00:00Z" },
      {
        role: "assistant",
        content: "I'd be happy to help! What specific part are you struggling with?",
        timestamp: "2023-01-01T00:00:01Z"
      }
    ];

    mockFetchUserLesson.mockResolvedValue({
      lesson_slug: "test-exercise",
      status: "started",
      conversation: mockConversation,
      data: {}
    });

    render(
      <TestWrapper>
        <ChatPanel />
      </TestWrapper>
    );

    // Wait for conversation to load
    await waitFor(() => {
      expect(screen.queryByText("Loading conversation...")).not.toBeInTheDocument();
    });

    // Verify API was called
    expect(mockFetchUserLesson).toHaveBeenCalledWith("test-exercise");

    // Should not show the empty conversation message
    expect(screen.queryByText("Start a conversation!")).not.toBeInTheDocument();
  });

  it("should handle empty conversation gracefully", async () => {
    mockFetchUserLesson.mockResolvedValue({
      lesson_slug: "test-exercise",
      status: "started",
      conversation: [],
      data: {}
    });

    render(
      <TestWrapper>
        <ChatPanel />
      </TestWrapper>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText("Loading conversation...")).not.toBeInTheDocument();
    });

    // Should show normal chat interface with no messages
    expect(screen.getByText("Chat")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ask a question about your code...")).toBeInTheDocument();

    // Should not show clear button when no messages
    expect(screen.queryByText("Clear")).not.toBeInTheDocument();
  });

  it("should handle user lesson not found gracefully", async () => {
    mockFetchUserLesson.mockRejectedValue(new Error("User lesson not found"));

    render(
      <TestWrapper>
        <ChatPanel />
      </TestWrapper>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText("Loading conversation...")).not.toBeInTheDocument();
    });

    // Should show normal chat interface (no error for missing user lesson)
    expect(screen.getByText("Chat")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ask a question about your code...")).toBeInTheDocument();

    // Should not show any error messages for missing user lessons
    expect(screen.queryByText(/Failed to load conversation history/)).not.toBeInTheDocument();
  });

  it("should show error message for API failures and allow retry", async () => {
    mockFetchUserLesson.mockRejectedValueOnce(new Error("Network error")).mockResolvedValueOnce({
      lesson_slug: "test-exercise",
      status: "started",
      conversation: [],
      data: {}
    });

    render(
      <TestWrapper>
        <ChatPanel />
      </TestWrapper>
    );

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to load conversation history: Network error/)).toBeInTheDocument();
    });

    // Should show retry button
    const retryButton = screen.getByText("Retry");
    expect(retryButton).toBeInTheDocument();

    // Click retry
    retryButton.click();

    // Wait for retry to complete
    await waitFor(() => {
      expect(screen.queryByText(/Failed to load conversation history/)).not.toBeInTheDocument();
    });

    // Verify retry API call was made
    expect(mockFetchUserLesson).toHaveBeenCalledTimes(2);
  });

  it("should handle chat unavailable when no orchestrator", () => {
    render(<ChatPanel />);

    expect(screen.getByText("Chat unavailable")).toBeInTheDocument();
  });
});
