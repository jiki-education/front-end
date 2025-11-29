/**
 * Integration tests for GlobalErrorHandler
 * Tests that GlobalErrorHandler renders appropriate modals for different error types
 */

import React from "react";
import { render, act, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GlobalErrorHandler } from "@/components/GlobalErrorHandler";
import { AuthenticationError, NetworkError, RateLimitError } from "@/lib/api/client";
import { useErrorHandlerStore } from "@/lib/api/errorHandlerStore";

describe("GlobalErrorHandler Integration", () => {
  beforeEach(() => {
    // Reset error handler store
    useErrorHandlerStore.setState({ criticalError: null });
  });

  describe("NetworkError Handling", () => {
    it("should render network error modal when NetworkError is set", async () => {
      render(<GlobalErrorHandler />);

      const networkError = new NetworkError("Connection lost");

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(networkError);
      });

      await waitFor(() => {
        expect(screen.getByText("Connection Error")).toBeInTheDocument();
        expect(screen.getByText(/having trouble connecting/i)).toBeInTheDocument();
      });
    });

    it("should hide modal when error is cleared", async () => {
      render(<GlobalErrorHandler />);

      // Set error first
      act(() => {
        const networkError = new NetworkError("Connection lost");
        useErrorHandlerStore.getState().setCriticalError(networkError);
      });

      await waitFor(() => {
        expect(screen.getByText("Connection Error")).toBeInTheDocument();
      });

      // Clear error
      act(() => {
        useErrorHandlerStore.getState().clearCriticalError();
      });

      await waitFor(() => {
        expect(screen.queryByText("Connection Error")).not.toBeInTheDocument();
      });
    });
  });

  describe("AuthenticationError Handling", () => {
    it("should render session expired modal when AuthenticationError is set", async () => {
      render(<GlobalErrorHandler />);

      const authError = new AuthenticationError("Unauthorized", { error: "Invalid token" });

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(authError);
      });

      await waitFor(() => {
        expect(screen.getByText("Session Expired")).toBeInTheDocument();
        expect(screen.getByText(/session has expired/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /reload page/i })).toBeInTheDocument();
      });
    });

    it("should render reload button for session expired modal", async () => {
      render(<GlobalErrorHandler />);

      const authError = new AuthenticationError("Unauthorized");

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(authError);
      });

      await waitFor(() => {
        const reloadButton = screen.getByRole("button", { name: /reload page/i });
        expect(reloadButton).toBeInTheDocument();
      });
    });
  });

  describe("RateLimitError Handling", () => {
    it("should render rate limit modal when RateLimitError is set", async () => {
      render(<GlobalErrorHandler />);

      const rateLimitError = new RateLimitError("Too Many Requests", 60);

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(rateLimitError);
      });

      await waitFor(() => {
        expect(screen.getByText("Too Many Requests")).toBeInTheDocument();
        expect(screen.getByText(/wait before trying again/i)).toBeInTheDocument();
      });
    });

    it("should display countdown timer with retryAfterSeconds", async () => {
      render(<GlobalErrorHandler />);

      const rateLimitError = new RateLimitError("Too Many Requests", 120);

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(rateLimitError);
      });

      await waitFor(() => {
        // Should show initial countdown value
        expect(screen.getByText(/120s/)).toBeInTheDocument();
      });
    });
  });

  describe("Multiple Errors", () => {
    it("should switch modal content when error type changes", async () => {
      render(<GlobalErrorHandler />);

      // First show network error
      const networkError = new NetworkError("Connection lost");
      act(() => {
        useErrorHandlerStore.getState().setCriticalError(networkError);
      });

      await waitFor(() => {
        expect(screen.getByText("Connection Error")).toBeInTheDocument();
      });

      // Then show auth error
      const authError = new AuthenticationError("Unauthorized");
      act(() => {
        useErrorHandlerStore.getState().setCriticalError(authError);
      });

      await waitFor(() => {
        expect(screen.getByText("Session Expired")).toBeInTheDocument();
        expect(screen.queryByText("Connection Error")).not.toBeInTheDocument();
      });
    });

    it("should show last error when multiple errors occur", async () => {
      render(<GlobalErrorHandler />);

      // Set network error
      act(() => {
        useErrorHandlerStore.getState().setCriticalError(new NetworkError("Connection lost"));
      });

      // Immediately set auth error (overwrites network error)
      act(() => {
        useErrorHandlerStore.getState().setCriticalError(new AuthenticationError("Unauthorized"));
      });

      // Should show auth error modal (last error wins)
      await waitFor(() => {
        expect(screen.getByText("Session Expired")).toBeInTheDocument();
        expect(screen.queryByText("Connection Error")).not.toBeInTheDocument();
      });
    });
  });

  describe("Modal Visibility", () => {
    it("should keep modal visible while error persists", async () => {
      render(<GlobalErrorHandler />);

      const networkError = new NetworkError("Connection lost");

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(networkError);
      });

      await waitFor(() => {
        expect(screen.getByText("Connection Error")).toBeInTheDocument();
      });

      // Verify error is still set
      expect(useErrorHandlerStore.getState().criticalError).toBe(networkError);

      // Modal should still be visible
      expect(screen.getByText("Connection Error")).toBeInTheDocument();
    });

    it("should hide modal when error is cleared", async () => {
      render(<GlobalErrorHandler />);

      // Set error
      act(() => {
        useErrorHandlerStore.getState().setCriticalError(new NetworkError("Connection lost"));
      });

      await waitFor(() => {
        expect(screen.getByText("Connection Error")).toBeInTheDocument();
      });

      // Clear error
      act(() => {
        useErrorHandlerStore.getState().clearCriticalError();
      });

      await waitFor(() => {
        expect(screen.queryByText("Connection Error")).not.toBeInTheDocument();
      });
    });
  });

  describe("No Error State", () => {
    it("should not render modal when no error is set", () => {
      const { container } = render(<GlobalErrorHandler />);

      // No error set, no modal should be rendered
      expect(container).toBeEmptyDOMElement();
    });

    it("should not render modal when starting with no error", () => {
      const { container } = render(<GlobalErrorHandler />);

      // Component starts with no error, should render nothing
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("Modal Non-Dismissibility", () => {
    it("should render network error modal without close button", async () => {
      render(<GlobalErrorHandler />);

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(new NetworkError("Connection lost"));
      });

      await waitFor(() => {
        expect(screen.getByText("Connection Error")).toBeInTheDocument();
      });

      // Modal should not have a close button (aria-label="Close modal" from BaseModal)
      expect(screen.queryByLabelText(/close/i)).not.toBeInTheDocument();
    });

    it("should render auth error modal without close button", async () => {
      render(<GlobalErrorHandler />);

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(new AuthenticationError("Unauthorized"));
      });

      await waitFor(() => {
        expect(screen.getByText("Session Expired")).toBeInTheDocument();
      });

      // Should have Reload Page button but no close button
      expect(screen.getByRole("button", { name: /reload page/i })).toBeInTheDocument();
      expect(screen.queryByLabelText(/close/i)).not.toBeInTheDocument();
    });

    it("should render rate limit modal without close button", async () => {
      render(<GlobalErrorHandler />);

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(new RateLimitError("Too Many Requests", 60));
      });

      await waitFor(() => {
        expect(screen.getByText("Too Many Requests")).toBeInTheDocument();
      });

      // Modal should not have a close button
      expect(screen.queryByLabelText(/close/i)).not.toBeInTheDocument();
    });
  });
});
