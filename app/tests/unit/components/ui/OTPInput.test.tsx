import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OTPInput } from "@/components/ui/OTPInput";

// Mock CSS module
jest.mock("@/components/ui/OTPInput.module.css", () => ({
  container: "container",
  input: "input",
  inputError: "inputError"
}));

describe("OTPInput", () => {
  it("renders 6 input fields", () => {
    render(<OTPInput value="" onChange={() => {}} />);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);
  });

  it("displays value across inputs", () => {
    render(<OTPInput value="123456" onChange={() => {}} />);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toHaveValue("1");
    expect(inputs[1]).toHaveValue("2");
    expect(inputs[2]).toHaveValue("3");
    expect(inputs[3]).toHaveValue("4");
    expect(inputs[4]).toHaveValue("5");
    expect(inputs[5]).toHaveValue("6");
  });

  it("calls onChange with new value when digit is entered", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<OTPInput value="" onChange={handleChange} />);

    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "5");

    expect(handleChange).toHaveBeenCalledWith("5");
  });

  it("advances focus to next input after entering a digit", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<OTPInput value="" onChange={handleChange} />);

    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "1");

    expect(inputs[1]).toHaveFocus();
  });

  it("moves focus to previous input on backspace when current input is empty", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<OTPInput value="12" onChange={handleChange} />);

    const inputs = screen.getAllByRole("textbox");
    // Focus on third input (empty)
    inputs[2].focus();
    await user.keyboard("{Backspace}");

    expect(inputs[1]).toHaveFocus();
  });

  it("handles paste of full code", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<OTPInput value="" onChange={handleChange} />);

    const inputs = screen.getAllByRole("textbox");
    inputs[0].focus();

    await user.paste("123456");

    expect(handleChange).toHaveBeenCalledWith("123456");
  });

  it("handles paste of partial code", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<OTPInput value="" onChange={handleChange} />);

    const inputs = screen.getAllByRole("textbox");
    inputs[0].focus();

    await user.paste("123");

    expect(handleChange).toHaveBeenCalledWith("123");
  });

  it("strips non-digit characters from pasted content", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<OTPInput value="" onChange={handleChange} />);

    const inputs = screen.getAllByRole("textbox");
    inputs[0].focus();

    await user.paste("12-34-56");

    expect(handleChange).toHaveBeenCalledWith("123456");
  });

  it("ignores non-digit input", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<OTPInput value="" onChange={handleChange} />);

    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "a");

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("applies error styling when hasError is true", () => {
    render(<OTPInput value="" onChange={() => {}} hasError={true} />);

    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).toHaveClass("inputError");
    });
  });

  it("does not apply error styling when hasError is false", () => {
    render(<OTPInput value="" onChange={() => {}} hasError={false} />);

    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).not.toHaveClass("inputError");
    });
  });

  it("disables all inputs when disabled is true", () => {
    render(<OTPInput value="" onChange={() => {}} disabled={true} />);

    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it("enables all inputs when disabled is false", () => {
    render(<OTPInput value="" onChange={() => {}} disabled={false} />);

    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).not.toBeDisabled();
    });
  });

  it("focuses first input when autoFocus is true", () => {
    render(<OTPInput value="" onChange={() => {}} autoFocus={true} />);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toHaveFocus();
  });

  it("has accessible labels for each input", () => {
    render(<OTPInput value="" onChange={() => {}} />);

    for (let i = 1; i <= 6; i++) {
      expect(screen.getByLabelText(`Digit ${i} of 6`)).toBeInTheDocument();
    }
  });

  it("has group role with accessible name", () => {
    render(<OTPInput value="" onChange={() => {}} />);

    expect(screen.getByRole("group", { name: "One-time password" })).toBeInTheDocument();
  });
});
