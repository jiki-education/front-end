import Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorContext from "@/components/coding-exercise/lib/OrchestratorContext";
import InformationWidgetToggleButton from "@/components/coding-exercise/ui/scrubber/InformationWidgetToggleButton";
import { createMockExercise } from "@/tests/mocks/exercise";
import { fireEvent, render, screen } from "@testing-library/react";

// Mock localStorage
jest.mock("@/components/coding-exercise/lib/localStorage", () => ({
  loadCodeMirrorContent: jest.fn().mockReturnValue({ success: false }),
  saveCodeMirrorContent: jest.fn()
}));

describe("InformationWidgetToggleButton", () => {
  let orchestrator: Orchestrator;

  beforeEach(() => {
    const exercise = createMockExercise({
      slug: "test-uuid",
      stubs: { javascript: "initial code", python: "initial code", jikiscript: "initial code" }
    });
    orchestrator = new Orchestrator(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" });
    // Mock the editorManager methods
    orchestrator.showInformationWidget = jest.fn();
    orchestrator.hideInformationWidget = jest.fn();
  });

  const renderComponent = (disabled = false) => {
    return render(
      <OrchestratorContext.Provider value={orchestrator}>
        <InformationWidgetToggleButton disabled={disabled} />
      </OrchestratorContext.Provider>
    );
  };

  it("renders a button", () => {
    renderComponent();
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("has aria-pressed false when widget is hidden", () => {
    orchestrator.getStore().getState().setShouldShowInformationWidget(false);
    renderComponent();
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("has aria-pressed true when widget is shown", () => {
    orchestrator.getStore().getState().setShouldShowInformationWidget(true);
    renderComponent();
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("calls showInformationWidget when toggled on", () => {
    orchestrator.getStore().getState().setShouldShowInformationWidget(false);
    renderComponent();

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(orchestrator.showInformationWidget).toHaveBeenCalled();
    expect(orchestrator.hideInformationWidget).not.toHaveBeenCalled();
  });

  it("calls hideInformationWidget when toggled off", () => {
    orchestrator.getStore().getState().setShouldShowInformationWidget(true);
    renderComponent();

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(orchestrator.hideInformationWidget).toHaveBeenCalled();
    expect(orchestrator.showInformationWidget).not.toHaveBeenCalled();
  });

  it("is disabled when disabled prop is true", () => {
    renderComponent(true);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("is enabled when disabled prop is false", () => {
    renderComponent(false);
    const button = screen.getByRole("button");
    expect(button).toBeEnabled();
  });

  it("has the correct data-testid attribute", () => {
    renderComponent();
    const button = screen.getByTestId("information-widget-toggle");
    expect(button).toBeInTheDocument();
  });

  it("does not call orchestrator methods when disabled", () => {
    orchestrator.getStore().getState().setShouldShowInformationWidget(false);
    renderComponent(true);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Disabled buttons shouldn't trigger click handlers
    expect(orchestrator.showInformationWidget).not.toHaveBeenCalled();
    expect(orchestrator.hideInformationWidget).not.toHaveBeenCalled();
  });
});
