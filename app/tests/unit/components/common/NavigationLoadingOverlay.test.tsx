import React from "react";
import { render, screen } from "@testing-library/react";
import NavigationLoadingOverlay from "@/components/common/NavigationLoadingOverlay";

describe("NavigationLoadingOverlay", () => {
  describe("Visibility", () => {
    it("renders nothing when isVisible is false", () => {
      const { container } = render(<NavigationLoadingOverlay isVisible={false} />);
      expect(container.firstChild).toBeNull();
    });

    it("renders loading overlay when isVisible is true", () => {
      const { container } = render(<NavigationLoadingOverlay isVisible={true} />);

      // Check for the overlay container
      const overlay = container.querySelector(".fixed.inset-0.z-50");
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass("fixed", "inset-0", "z-50");
    });
  });

  describe("Message Display", () => {
    it("displays default loading message", () => {
      render(<NavigationLoadingOverlay isVisible={true} />);

      expect(screen.getByText("Loading exercise...")).toBeInTheDocument();
    });

    it("displays custom message when provided", () => {
      render(<NavigationLoadingOverlay isVisible={true} message="Processing your request..." />);

      expect(screen.getByText("Processing your request...")).toBeInTheDocument();
      expect(screen.queryByText("Loading exercise...")).not.toBeInTheDocument();
    });
  });

  describe("Loading Animation Elements", () => {
    it("renders spinner with correct animation classes", () => {
      const { container } = render(<NavigationLoadingOverlay isVisible={true} />);

      // Check for spinner elements
      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass("w-16", "h-16", "border-4", "border-blue-200");

      // Check for the rotating border element
      const rotatingBorder = container.querySelector(".border-t-blue-500");
      expect(rotatingBorder).toBeInTheDocument();
    });

    it("renders loading dots with pulse animation", () => {
      const { container } = render(<NavigationLoadingOverlay isVisible={true} />);

      // Check for loading dots
      const dots = container.querySelectorAll(".animate-pulse");
      expect(dots).toHaveLength(3);

      // Verify each dot has the correct styling
      dots.forEach((dot) => {
        expect(dot).toHaveClass("w-2", "h-2", "bg-blue-500", "rounded-full");
      });

      // Check animation delays are applied
      expect(dots[1]).toHaveClass("[animation-delay:150ms]");
      expect(dots[2]).toHaveClass("[animation-delay:300ms]");
    });
  });

  describe("Styling", () => {
    it("applies backdrop blur and semi-transparent white background", () => {
      const { container } = render(<NavigationLoadingOverlay isVisible={true} />);

      const overlay = container.querySelector(".fixed.inset-0");
      expect(overlay).toHaveClass("bg-white/95", "backdrop-blur-sm");
    });

    it("centers content with flexbox", () => {
      const { container } = render(<NavigationLoadingOverlay isVisible={true} />);

      const overlay = container.querySelector(".fixed.inset-0");
      expect(overlay).toHaveClass("flex", "items-center", "justify-center");
    });

    it("applies transition classes for smooth appearance", () => {
      const { container } = render(<NavigationLoadingOverlay isVisible={true} />);

      const overlay = container.querySelector(".fixed.inset-0");
      expect(overlay).toHaveClass("transition-opacity", "duration-200", "ease-in-out");
    });
  });

  describe("Dynamic Behavior", () => {
    it("handles visibility toggle correctly", () => {
      const { rerender, container } = render(<NavigationLoadingOverlay isVisible={false} />);

      // Initially not visible
      expect(container.firstChild).toBeNull();

      // Change to visible
      rerender(<NavigationLoadingOverlay isVisible={true} />);
      expect(screen.getByText("Loading exercise...")).toBeInTheDocument();

      // Change back to not visible
      rerender(<NavigationLoadingOverlay isVisible={false} />);
      expect(container.firstChild).toBeNull();
    });

    it("updates message dynamically", () => {
      const { rerender } = render(<NavigationLoadingOverlay isVisible={true} message="Initial message" />);

      expect(screen.getByText("Initial message")).toBeInTheDocument();

      rerender(<NavigationLoadingOverlay isVisible={true} message="Updated message" />);

      expect(screen.getByText("Updated message")).toBeInTheDocument();
      expect(screen.queryByText("Initial message")).not.toBeInTheDocument();
    });
  });
});
