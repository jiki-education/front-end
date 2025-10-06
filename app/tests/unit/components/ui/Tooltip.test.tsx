import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tooltip from "@/components/ui/Tooltip";

describe("Tooltip", () => {
  it("renders children without tooltip initially", () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByRole("button", { name: "Hover me" });
    expect(button).toBeInTheDocument();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows tooltip on hover after delay", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip text" delay={100}>
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByRole("button", { name: "Hover me" });

    // Hover over the button
    await user.hover(button);

    // Wait for tooltip to appear after delay
    await waitFor(
      () => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
        expect(screen.getByText("Tooltip text")).toBeInTheDocument();
      },
      { timeout: 300 }
    );
  });

  it("hides tooltip when mouse leaves", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip text" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByRole("button", { name: "Hover me" });

    // Hover to show tooltip
    await user.hover(button);
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    // Move mouse away to hide tooltip
    await user.unhover(button);
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  it("does not show tooltip when disabled", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip text" delay={0} disabled={true}>
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByRole("button", { name: "Hover me" });

    // Hover over the button
    await user.hover(button);

    // Wait and verify tooltip does not appear
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
