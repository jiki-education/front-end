import { render, screen, fireEvent } from "@testing-library/react";
import ChatInput from "@/components/coding-exercise/ui/ChatInput";

describe("ChatInput", () => {
  const mockOnSendMessage = jest.fn();

  beforeEach(() => {
    mockOnSendMessage.mockClear();
  });

  it("renders and sends message", () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} />);

    const input = screen.getByPlaceholderText("Ask a question about your code...");
    const sendButton = screen.getByText("Send");

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(sendButton);

    expect(mockOnSendMessage).toHaveBeenCalledWith("Hello");
  });

  it("handles disabled state", () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} disabled />);

    const input = screen.getByPlaceholderText("Ask a question about your code...");
    expect(input).toBeDisabled();
  });
});
