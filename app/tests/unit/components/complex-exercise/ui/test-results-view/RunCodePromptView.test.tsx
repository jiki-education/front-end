import { render, screen } from "@testing-library/react";
import { RunCodePromptView } from "@/components/complex-exercise/ui/test-results-view/RunCodePromptView";

describe("RunCodePromptView", () => {
  it("should render the prompt message", () => {
    render(<RunCodePromptView />);

    expect(screen.getByText("Run your code to see test results")).toBeInTheDocument();
  });

  it("should have correct styling classes", () => {
    const { container } = render(<RunCodePromptView />);

    const promptDiv = container.firstChild as HTMLElement;
    expect(promptDiv).toHaveClass("bg-gray-50", "border", "border-gray-200", "rounded-lg", "p-4");
  });
});
