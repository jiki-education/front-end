import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tooltip from "@/components/ui/Tooltip";
import styles from "@/components/ui/Tooltip.module.css";

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

    await user.hover(button);

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

    await user.hover(button);
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

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

    await user.hover(button);

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("applies default variant styles", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Default tooltip" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole("button"));

    await waitFor(() => {
      const tooltip = screen.getByRole("tooltip");
      const styledContent = tooltip.firstElementChild!;
      expect(styledContent.className).toContain(styles.default);
    });
  });

  it("applies dark variant styles", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Dark tooltip" variant="dark" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole("button"));

    await waitFor(() => {
      const tooltip = screen.getByRole("tooltip");
      const styledContent = tooltip.firstElementChild!;
      expect(styledContent.className).toContain(styles.dark);
    });
  });

  it("renders arrow when arrow prop is true", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="With arrow" arrow delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole("button"));

    await waitFor(() => {
      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toBeInTheDocument();
      const arrow = tooltip.querySelector("svg");
      expect(arrow).toBeInTheDocument();
    });
  });

  it("does not render arrow when arrow prop is false", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="No arrow" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole("button"));

    await waitFor(() => {
      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toBeInTheDocument();
      const arrow = tooltip.querySelector("svg");
      expect(arrow).not.toBeInTheDocument();
    });
  });

  it("uses className override instead of variant styles", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Custom" className="custom-class" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole("button"));

    await waitFor(() => {
      const tooltip = screen.getByRole("tooltip");
      const styledContent = tooltip.firstElementChild!;
      expect(styledContent.className).toContain("custom-class");
      expect(styledContent.className).not.toContain(styles.default);
      expect(styledContent.className).not.toContain(styles.dark);
    });
  });
});
