/**
 * Integration tests for GlobalErrorHandler
 * Tests interaction between error handler store and modal system
 */

import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GlobalErrorHandler } from "@/components/GlobalErrorHandler";
import { AuthenticationError, NetworkError, RateLimitError } from "@/lib/api/client";
import * as modalStore from "@/lib/modal/store";
import { useErrorHandlerStore } from "@/lib/api/errorHandlerStore";

// Mock modal store
jest.mock("@/lib/modal/store", () => ({
  showModal: jest.fn(),
  hideModal: jest.fn(),
  useModalStore: jest.fn(() => ({
    isOpen: false,
    modalName: null,
    modalProps: {}
  }))
}));

describe("GlobalErrorHandler Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset error handler store
    useErrorHandlerStore.setState({ criticalError: null });
  });

  describe("NetworkError Handling", () => {
    it("should show network modal when NetworkError is set", async () => {
      render(<GlobalErrorHandler />);

      const networkError = new NetworkError("Connection lost");

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(networkError);
      });

      await waitFor(() => {
        expect(modalStore.showModal).toHaveBeenCalledWith("network-error-modal", {
          error: networkError,
          dismissible: false
        });
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
        expect(modalStore.showModal).toHaveBeenCalled();
      });

      // Clear error
      act(() => {
        useErrorHandlerStore.getState().clearCriticalError();
      });

      await waitFor(() => {
        expect(modalStore.hideModal).toHaveBeenCalled();
      });
    });
  });

  describe("AuthenticationError Handling", () => {
    it("should show session expired modal when AuthenticationError is set", async () => {
      render(<GlobalErrorHandler />);

      const authError = new AuthenticationError("Unauthorized", { error: "Invalid token" });

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(authError);
      });

      await waitFor(() => {
        expect(modalStore.showModal).toHaveBeenCalledWith("session-expired-modal", {
          error: authError,
          dismissible: false
        });
      });
    });

    it("should not show close button for session expired modal", async () => {
      render(<GlobalErrorHandler />);

      const authError = new AuthenticationError("Unauthorized");

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(authError);
      });

      await waitFor(() => {
        expect(modalStore.showModal).toHaveBeenCalledWith(
          "session-expired-modal",
          expect.objectContaining({
            dismissible: false
          })
        );
      });
    });
  });

  describe("RateLimitError Handling", () => {
    it("should show rate limit modal when RateLimitError is set", async () => {
      render(<GlobalErrorHandler />);

      const rateLimitError = new RateLimitError("Too Many Requests", 60);

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(rateLimitError);
      });

      await waitFor(() => {
        expect(modalStore.showModal).toHaveBeenCalledWith("rate-limit-modal", {
          error: rateLimitError,
          dismissible: false
        });
      });
    });

    it("should pass retryAfterSeconds to modal", async () => {
      render(<GlobalErrorHandler />);

      const rateLimitError = new RateLimitError("Too Many Requests", 120);

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(rateLimitError);
      });

      await waitFor(() => {
        expect(modalStore.showModal).toHaveBeenCalledWith(
          "rate-limit-modal",
          expect.objectContaining({
            error: expect.objectContaining({
              retryAfterSeconds: 120
            })
          })
        );
      });
    });
  });

  describe("Multiple Errors", () => {
    it("should switch modals when error type changes", async () => {
      render(<GlobalErrorHandler />);

      // First show network error
      const networkError = new NetworkError("Connection lost");
      act(() => {
        useErrorHandlerStore.getState().setCriticalError(networkError);
      });

      await waitFor(() => {
        expect(modalStore.showModal).toHaveBeenCalledWith("network-error-modal", {
          error: networkError,
          dismissible: false
        });
      });

      jest.clearAllMocks();

      // Then show auth error
      const authError = new AuthenticationError("Unauthorized");
      act(() => {
        useErrorHandlerStore.getState().setCriticalError(authError);
      });

      await waitFor(() => {
        expect(modalStore.showModal).toHaveBeenCalledWith("session-expired-modal", {
          error: authError,
          dismissible: false
        });
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
        expect(modalStore.showModal).toHaveBeenLastCalledWith(
          "session-expired-modal",
          expect.objectContaining({
            dismissible: false
          })
        );
      });
    });
  });

  describe("Modal Persistence", () => {
    it("should keep modal visible while error persists", async () => {
      render(<GlobalErrorHandler />);

      const networkError = new NetworkError("Connection lost");

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(networkError);
      });

      await waitFor(() => {
        expect(modalStore.showModal).toHaveBeenCalled();
      });

      // Verify error is still set
      expect(useErrorHandlerStore.getState().criticalError).toBe(networkError);

      // Note: hideModal is called initially when component mounts with no error
      // So we can't assert it wasn't called, just that showModal was called
    });

    it("should hide modal when error is cleared", async () => {
      render(<GlobalErrorHandler />);

      // Set error
      act(() => {
        useErrorHandlerStore.getState().setCriticalError(new NetworkError("Connection lost"));
      });

      await waitFor(() => {
        expect(modalStore.showModal).toHaveBeenCalled();
      });

      jest.clearAllMocks();

      // Clear error
      act(() => {
        useErrorHandlerStore.getState().clearCriticalError();
      });

      await waitFor(() => {
        expect(modalStore.hideModal).toHaveBeenCalled();
      });
    });
  });

  describe("Error Object Propagation", () => {
    it("should pass error object to NetworkError modal", async () => {
      render(<GlobalErrorHandler />);

      const networkError = new NetworkError("Connection lost", new Error("Fetch failed"));

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(networkError);
      });

      await waitFor(() => {
        expect(modalStore.showModal).toHaveBeenCalledWith(
          "network-error-modal",
          expect.objectContaining({
            error: networkError
          })
        );
      });
    });

    it("should pass error object to AuthenticationError modal", async () => {
      render(<GlobalErrorHandler />);

      const authError = new AuthenticationError("Unauthorized", { message: "Token expired" });

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(authError);
      });

      await waitFor(() => {
        expect(modalStore.showModal).toHaveBeenCalledWith(
          "session-expired-modal",
          expect.objectContaining({
            error: authError
          })
        );
      });
    });

    it("should pass error object to RateLimitError modal", async () => {
      render(<GlobalErrorHandler />);

      const rateLimitError = new RateLimitError("Too Many Requests", 30, { reason: "API quota exceeded" });

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(rateLimitError);
      });

      await waitFor(() => {
        expect(modalStore.showModal).toHaveBeenCalledWith(
          "rate-limit-modal",
          expect.objectContaining({
            error: rateLimitError
          })
        );
      });
    });
  });

  describe("No Error State", () => {
    it("should not show modal when no error is set", () => {
      render(<GlobalErrorHandler />);

      // No error set, no modal should be shown
      expect(modalStore.showModal).not.toHaveBeenCalled();
    });

    it("should hide modal immediately when starting with no error", () => {
      render(<GlobalErrorHandler />);

      // Component starts with no error, should call hideModal to ensure clean state
      expect(modalStore.hideModal).toHaveBeenCalled();
    });
  });

  describe("Dismissible Property", () => {
    it("should always pass dismissible: false for network errors", async () => {
      render(<GlobalErrorHandler />);

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(new NetworkError("Connection lost"));
      });

      await waitFor(() => {
        expect(modalStore.showModal).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            dismissible: false
          })
        );
      });
    });

    it("should always pass dismissible: false for auth errors", async () => {
      render(<GlobalErrorHandler />);

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(new AuthenticationError("Unauthorized"));
      });

      await waitFor(() => {
        expect(modalStore.showModal).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            dismissible: false
          })
        );
      });
    });

    it("should always pass dismissible: false for rate limit errors", async () => {
      render(<GlobalErrorHandler />);

      act(() => {
        useErrorHandlerStore.getState().setCriticalError(new RateLimitError("Too Many Requests", 60));
      });

      await waitFor(() => {
        expect(modalStore.showModal).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            dismissible: false
          })
        );
      });
    });
  });
});
