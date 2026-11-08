import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Icon } from "@/components/ui-kit/Icon";

jest.mock("@/icons/premium-star.svg", () => ({
  __esModule: true,
  default: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="loaded-icon" {...props} />
}));

describe("Icon", () => {
  it("renders with correct size", async () => {
    render(<Icon name="email" size={24} />);

    await waitFor(() => {
      const svg = screen.getByRole("img");
      expect(svg).toHaveAttribute("width", "24");
      expect(svg).toHaveAttribute("height", "24");
    });
  });

  it("applies color via currentColor style", async () => {
    render(<Icon name="email" size={16} color="blue-500" />);

    await waitFor(() => {
      const svg = screen.getByRole("img");
      expect(svg).toHaveStyle({ color: "var(--color-blue-500)" });
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

  // A lazy component created per mount suspends again on every fresh mount. If
  // that mount is retried in a sync render, each retry creates another pending
  // import and the page freezes, so a loaded icon must render without suspending.
  it("renders an already-loaded icon on a fresh mount without suspending", async () => {
    const first = render(<Icon name="premium-star" size={17} />);
    await waitFor(() => expect(screen.getByTestId("loaded-icon")).toBeInTheDocument());
    first.unmount();

    render(<Icon name="premium-star" size={17} />);
    expect(screen.getByTestId("loaded-icon")).toBeInTheDocument();
  });
});
