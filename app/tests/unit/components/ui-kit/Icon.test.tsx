import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Icon } from "@/components/ui-kit/Icon";

describe("Icon", () => {
  it("renders with correct size", async () => {
    render(<Icon name="email" size={24} />);

    await waitFor(() => {
      const svg = screen.getByRole("img");
      expect(svg).toHaveAttribute("width", "24");
      expect(svg).toHaveAttribute("height", "24");
    });
  });

  it("applies color className correctly", async () => {
    render(<Icon name="email" size={16} color="blue-500" />);

    await waitFor(() => {
      const svg = screen.getByRole("img");
      expect(svg).toHaveClass("text-blue-500");
    });
  });

  it("merges custom className", async () => {
    render(<Icon name="email" size={16} className="custom-class" />);

    await waitFor(() => {
      const svg = screen.getByRole("img");
      expect(svg).toHaveClass("custom-class");
    });
  });

  it("sets aria-label from alt prop", async () => {
    render(<Icon name="email" size={16} alt="Email icon" />);

    await waitFor(() => {
      const svg = screen.getByRole("img");
      expect(svg).toHaveAttribute("aria-label", "Email icon");
    });
  });

  it("uses icon name as default aria-label", async () => {
    render(<Icon name="bug" size={16} />);

    await waitFor(() => {
      const svg = screen.getByRole("img");
      expect(svg).toHaveAttribute("aria-label", "bug icon");
    });
  });

  it("renders suspense fallback with correct dimensions", () => {
    render(<Icon name="email" size={20} />);

    const fallback = screen.getByRole("img");
    expect(fallback).toHaveAttribute("width", "20");
    expect(fallback).toHaveAttribute("height", "20");
  });
});
