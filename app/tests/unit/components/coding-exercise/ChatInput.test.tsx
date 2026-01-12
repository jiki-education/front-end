import { render, screen, fireEvent } from "@testing-library/react";
import ChatInput from "@/components/coding-exercise/ui/ChatInput";

describe("ChatInput", () => {
  const mockOnSendMessage = jest.fn();

  beforeEach(() => {
    mockOnSendMessage.mockClear();
  });

  it("renders and sends message with Cmd+Enter", () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} />);

    const input = screen.getByPlaceholderText("Type your question here...");

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.keyDown(input, { key: "Enter", metaKey: true });

    expect(mockOnSendMessage).toHaveBeenCalledWith("Hello");
  });

  it("handles disabled state", () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} disabled />);

    const input = screen.getByPlaceholderText("Type your question here...");
    expect(input).toBeDisabled();
  });
});
