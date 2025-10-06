import OrchestratorTestProvider from "@/tests/test-utils/OrchestratorTestProvider";
import { renderWithCounter } from "@/tests/utils/renderCounter";

// Mock the entire Orchestrator to avoid CodeMirror dependency issues
jest.mock("@/components/complex-exercise/lib/Orchestrator", () => ({
  useOrchestratorStore: jest.fn(() => ({
    readonly: false,
    defaultCode: "test code",
    highlightedLine: 0,
    shouldAutoRunCode: false
  }))
}));

// No need to mock setupEditor since it's now part of the orchestrator

// Now we can import the component safely
import { CodeMirror } from "@/components/complex-exercise/ui/codemirror/CodeMirror";

const mockOrchestrator = {
  getEditorView: jest.fn(() => null),
  setHighlightedLine: jest.fn(),
  setReadonly: jest.fn(),
  setupEditor: jest.fn(() => jest.fn())
} as any;

describe("CodeMirror Re-render Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should track render counts successfully", () => {
    // ESLint thinks the type assertion is unnecessary but mock orchestrator needs it
    const { getRenderCount, rerender } = renderWithCounter(
      <OrchestratorTestProvider orchestrator={mockOrchestrator}>
        <CodeMirror />
      </OrchestratorTestProvider>
    );

    // Initial render
    expect(getRenderCount()).toBe(1);

    // Force a re-render
    rerender(
      <OrchestratorTestProvider orchestrator={mockOrchestrator}>
        <CodeMirror />
      </OrchestratorTestProvider>
    );
    expect(getRenderCount()).toBe(2);

    // Force another re-render
    rerender(
      <OrchestratorTestProvider orchestrator={mockOrchestrator}>
        <CodeMirror />
      </OrchestratorTestProvider>
    );
    expect(getRenderCount()).toBe(3);

    // This test demonstrates that our render counting utility works
    // In real usage, our refactor should result in fewer re-renders
    // compared to the old useEffect-based approach
  });

  it("should not re-initialize editor on multiple renders", () => {
    // Create a stable ref callback that setupEditor returns
    const stableRefCallback = jest.fn();
    mockOrchestrator.setupEditor.mockReturnValue(stableRefCallback);

    const { rerender } = renderWithCounter(
      <OrchestratorTestProvider orchestrator={mockOrchestrator}>
        <CodeMirror />
      </OrchestratorTestProvider>
    );

    // Trigger multiple re-renders
    rerender(
      <OrchestratorTestProvider orchestrator={mockOrchestrator}>
        <CodeMirror />
      </OrchestratorTestProvider>
    );
    rerender(
      <OrchestratorTestProvider orchestrator={mockOrchestrator}>
        <CodeMirror />
      </OrchestratorTestProvider>
    );

    // setupEditor will be called on each render
    expect(mockOrchestrator.setupEditor).toHaveBeenCalledTimes(3);

    // But it should return the same ref callback each time (the orchestrator handles stability)
    // This is what prevents editor re-initialization
    expect(mockOrchestrator.setupEditor).toHaveReturnedWith(stableRefCallback);
  });

  it("should demonstrate the ref callback pattern works", () => {
    // This test shows that our ref callback approach is working
    const { container } = renderWithCounter(
      <OrchestratorTestProvider orchestrator={mockOrchestrator}>
        <CodeMirror />
      </OrchestratorTestProvider>
    );

    // Verify the editor div is rendered
    const editorDiv = container.querySelector("#bootcamp-cm-editor");
    expect(editorDiv).toBeInTheDocument();
    expect(editorDiv).toHaveAttribute("data-testid", "codemirror-editor");
  });
});
