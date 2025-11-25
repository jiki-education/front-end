/**
 * Unit tests for UnsubscribeContent component
 */

import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { UnsubscribeContent } from "@/components/auth/UnsubscribeContent";
import { api, ApiError } from "@/lib/api/client";
import { useParams } from "next/navigation";

// Mock the API client
jest.mock("@/lib/api/client", () => ({
  api: {
    post: jest.fn()
  },
  ApiError: class ApiError extends Error {
    constructor(
      public status: number,
      public statusText: string,
      public data?: unknown
    ) {
      super(`API Error: ${status} ${statusText}`);
      this.name = "ApiError";
    }
  }
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: jest.fn()
}));

const mockedApiPost = api.post as jest.MockedFunction<typeof api.post>;
const mockedUseParams = useParams as jest.MockedFunction<typeof useParams>;

describe("UnsubscribeContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when token is present", () => {
    beforeEach(() => {
      mockedUseParams.mockReturnValue({ token: "valid-token-123" });
    });

    it("should render processing state initially", () => {
      // Mock API call to not resolve immediately
      mockedApiPost.mockImplementation(() => new Promise(() => {}));

      render(<UnsubscribeContent />);

      expect(screen.getByText("Unsubscribing...")).toBeInTheDocument();
      expect(screen.getByText("Please wait while we process your request.")).toBeInTheDocument();

      // Check for loading spinner
      const spinner = document.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("should call API with correct token", () => {
      mockedApiPost.mockResolvedValue({ data: {}, status: 200, headers: {} } as any);

      act(() => {
        render(<UnsubscribeContent />);
      });

      expect(mockedApiPost).toHaveBeenCalledWith("/auth/unsubscribe/valid-token-123");
      expect(mockedApiPost).toHaveBeenCalledTimes(1);
    });

    it("should render success state when API call succeeds", async () => {
      mockedApiPost.mockResolvedValue({ data: {}, status: 200, headers: {} } as any);

      let container: HTMLElement;
      act(() => {
        const rendered = render(<UnsubscribeContent />);
        container = rendered.container;
      });

      await waitFor(() => {
        expect(screen.getByText("Successfully Unsubscribed")).toBeInTheDocument();
      });

      expect(screen.getByText("You have been unsubscribed from our mailing list.")).toBeInTheDocument();

      // Check for success icon (svg element)
      const successIcon = container!.querySelector('svg[stroke="var(--color-success-text)"]');
      expect(successIcon).toBeInTheDocument();
    });

    it("should render error state when API call fails", async () => {
      mockedApiPost.mockRejectedValue(new Error("API Error"));

      let container: HTMLElement;
      act(() => {
        const rendered = render(<UnsubscribeContent />);
        container = rendered.container;
      });

      await waitFor(() => {
        expect(screen.getByText("Unsubscribe Failed")).toBeInTheDocument();
      });

      expect(screen.getByText("Network error. Please check your connection and try again.")).toBeInTheDocument();

      // Check for error icon (svg element)
      const errorIcon = container!.querySelector('svg[stroke="var(--color-error-text)"]');
      expect(errorIcon).toBeInTheDocument();
    });

    it("should only make one API call per mount", () => {
      mockedApiPost.mockResolvedValue({ data: {}, status: 200, headers: {} } as any);

      let rerender: any;
      act(() => {
        const rendered = render(<UnsubscribeContent />);
        rerender = rendered.rerender;
      });

      // Re-render should not trigger another API call
      act(() => {
        rerender(<UnsubscribeContent />);
      });

      expect(mockedApiPost).toHaveBeenCalledTimes(1);
    });
  });

  describe("when token is missing", () => {
    beforeEach(() => {
      mockedUseParams.mockReturnValue({ token: undefined });
    });

    it("should render error state immediately when token is missing", () => {
      render(<UnsubscribeContent />);

      expect(screen.getByText("Unsubscribe Failed")).toBeInTheDocument();
      expect(screen.getByText("No unsubscribe token provided.")).toBeInTheDocument();
    });

    it("should not make API call when token is missing", () => {
      render(<UnsubscribeContent />);

      expect(mockedApiPost).not.toHaveBeenCalled();
    });
  });

  describe("when token is empty string", () => {
    beforeEach(() => {
      mockedUseParams.mockReturnValue({ token: "" });
    });

    it("should render error state immediately when token is empty", () => {
      render(<UnsubscribeContent />);

      expect(screen.getByText("Unsubscribe Failed")).toBeInTheDocument();
      expect(screen.getByText("No unsubscribe token provided.")).toBeInTheDocument();
    });

    it("should not make API call when token is empty", () => {
      render(<UnsubscribeContent />);

      expect(mockedApiPost).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    beforeEach(() => {
      mockedUseParams.mockReturnValue({ token: "valid-token-123" });
    });

    it("should have proper heading hierarchy", () => {
      mockedApiPost.mockImplementation(() => new Promise(() => {}));

      render(<UnsubscribeContent />);

      const heading = screen.getByText("Unsubscribing...");
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H1");
    });

    it("should have proper heading in success state", async () => {
      mockedApiPost.mockResolvedValue({ data: {}, status: 200, headers: {} } as any);

      act(() => {
        render(<UnsubscribeContent />);
      });

      await waitFor(() => {
        const heading = screen.getByText("Successfully Unsubscribed");
        expect(heading).toBeInTheDocument();
        expect(heading.tagName).toBe("H1");
      });
    });

    it("should have proper heading in error state", async () => {
      mockedApiPost.mockRejectedValue(new Error("API Error"));

      act(() => {
        render(<UnsubscribeContent />);
      });

      await waitFor(() => {
        const heading = screen.getByText("Unsubscribe Failed");
        expect(heading).toBeInTheDocument();
        expect(heading.tagName).toBe("H1");
      });
    });
  });

  describe("error handling", () => {
    beforeEach(() => {
      mockedUseParams.mockReturnValue({ token: "valid-token-123" });
    });

    it("should handle network errors gracefully", async () => {
      mockedApiPost.mockRejectedValue(new Error("Network connection failed"));

      act(() => {
        render(<UnsubscribeContent />);
      });

      await waitFor(() => {
        expect(screen.getByText("Unsubscribe Failed")).toBeInTheDocument();
      });

      expect(screen.getByText("Network error. Please check your connection and try again.")).toBeInTheDocument();
    });

    it("should handle 422 API errors with specific message", async () => {
      mockedApiPost.mockRejectedValue(new ApiError(422, "Unprocessable Entity"));

      act(() => {
        render(<UnsubscribeContent />);
      });

      await waitFor(() => {
        expect(screen.getByText("Unsubscribe Failed")).toBeInTheDocument();
      });

      expect(screen.getByText("This unsubscribe link is invalid or has expired.")).toBeInTheDocument();
    });

    it("should handle 404 API errors with specific message", async () => {
      mockedApiPost.mockRejectedValue(new ApiError(404, "Not Found"));

      act(() => {
        render(<UnsubscribeContent />);
      });

      await waitFor(() => {
        expect(screen.getByText("Unsubscribe Failed")).toBeInTheDocument();
      });

      expect(screen.getByText("This unsubscribe link is invalid or has expired.")).toBeInTheDocument();
    });

    it("should handle 429 rate limit errors with specific message", async () => {
      mockedApiPost.mockRejectedValue(new ApiError(429, "Too Many Requests"));

      act(() => {
        render(<UnsubscribeContent />);
      });

      await waitFor(() => {
        expect(screen.getByText("Unsubscribe Failed")).toBeInTheDocument();
      });

      expect(screen.getByText("Too many requests. Please wait a moment and try again.")).toBeInTheDocument();
    });

    it("should handle 500 server errors with specific message", async () => {
      mockedApiPost.mockRejectedValue(new ApiError(500, "Internal Server Error"));

      act(() => {
        render(<UnsubscribeContent />);
      });

      await waitFor(() => {
        expect(screen.getByText("Unsubscribe Failed")).toBeInTheDocument();
      });

      expect(screen.getByText("Service temporarily unavailable. Please try again later.")).toBeInTheDocument();
    });

    it("should handle other API errors with generic message", async () => {
      mockedApiPost.mockRejectedValue(new ApiError(401, "Unauthorized"));

      act(() => {
        render(<UnsubscribeContent />);
      });

      await waitFor(() => {
        expect(screen.getByText("Unsubscribe Failed")).toBeInTheDocument();
      });

      expect(
        screen.getByText("Unable to process your request. Please contact support if this continues.")
      ).toBeInTheDocument();
    });

    it("should handle unknown errors gracefully", async () => {
      mockedApiPost.mockRejectedValue("Unknown error");

      act(() => {
        render(<UnsubscribeContent />);
      });

      await waitFor(() => {
        expect(screen.getByText("Unsubscribe Failed")).toBeInTheDocument();
      });

      expect(screen.getByText("Network error. Please check your connection and try again.")).toBeInTheDocument();
    });

    it("should log errors for debugging purposes", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      const testError = new ApiError(500, "Internal Server Error");
      mockedApiPost.mockRejectedValue(testError);

      act(() => {
        render(<UnsubscribeContent />);
      });

      await waitFor(() => {
        expect(screen.getByText("Unsubscribe Failed")).toBeInTheDocument();
      });

      expect(consoleSpy).toHaveBeenCalledWith("Unsubscribe failed:", {
        token: "valid-to...",
        error: testError
      });

      consoleSpy.mockRestore();
    });
  });

  describe("component structure", () => {
    beforeEach(() => {
      mockedUseParams.mockReturnValue({ token: "valid-token-123" });
    });

    it("should render within AuthLayout", () => {
      mockedApiPost.mockImplementation(() => new Promise(() => {}));

      const { container } = render(<UnsubscribeContent />);

      // Check for AuthLayout structure - should contain the main layout
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render content in left side container", () => {
      mockedApiPost.mockImplementation(() => new Promise(() => {}));

      render(<UnsubscribeContent />);

      const leftSideElement = document.querySelector('[class*="leftSide"]');
      expect(leftSideElement).toBeInTheDocument();

      const formContainer = document.querySelector('[class*="formContainer"]');
      expect(formContainer).toBeInTheDocument();
    });
  });
});
