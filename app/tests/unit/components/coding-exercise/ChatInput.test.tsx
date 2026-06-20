import { render, screen, fireEvent } from "@testing-library/react";
import ChatInput from "@/components/coding-exercise/ui/ChatInput";

describe("ChatInput", () => {
  const mockOnSendMessage = jest.fn();

  beforeEach(() => {
    mockOnSendMessage.mockClear();
  });

  it("renders and sends message on Enter", () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} />);

    const input = screen.getByPlaceholderText("Type your question here...");

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnSendMessage).toHaveBeenCalledWith("Hello");
  });

  it("does not send message on Shift+Enter", () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} />);

    const input = screen.getByPlaceholderText("Type your question here...");

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.keyDown(input, { key: "Enter", shiftKey: true });

    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it("handles disabled state", () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} disabled />);

    const input = screen.getByPlaceholderText("Type your question here...");
    expect(input).toBeDisabled();
  });

  it("caps the question length and only shows the counter near the limit", () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} />);

    const input = screen.getByPlaceholderText("Type your question here...");
    expect(input).toHaveAttribute("maxLength", "1000");

    // Short message: no counter.
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(screen.queryByText(/\/1000/)).not.toBeInTheDocument();

    // Near the limit: counter appears.
    fireEvent.change(input, { target: { value: "a".repeat(850) } });
    expect(screen.getByText("850/1000")).toBeInTheDocument();
  });
});
