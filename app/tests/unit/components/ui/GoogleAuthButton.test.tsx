/**
 * Unit tests for GoogleAuthButton component
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { GoogleAuthButton } from "@/components/ui/GoogleAuthButton";
import { useGoogleLogin } from "@react-oauth/google";

// Mock react-oauth/google
jest.mock("@react-oauth/google", () => ({
  useGoogleLogin: jest.fn()
}));

const mockUseGoogleLogin = useGoogleLogin as jest.MockedFunction<typeof useGoogleLogin>;

describe("GoogleAuthButton", () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGoogleLogin.mockReturnValue(mockLogin);
  });

  describe("when Google Client ID is configured", () => {
    beforeEach(() => {
      // Mock environment variable
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "test-client-id";
    });

    afterEach(() => {
      delete process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    });

    it("should render button with children text", () => {
      render(
        <GoogleAuthButton onSuccess={mockOnSuccess} onError={mockOnError}>
          Sign in with Google
        </GoogleAuthButton>
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
    });

    it("should call useGoogleLogin with correct configuration", () => {
      render(
        <GoogleAuthButton onSuccess={mockOnSuccess} onError={mockOnError}>
          Sign in with Google
        </GoogleAuthButton>
      );

      expect(mockUseGoogleLogin).toHaveBeenCalledWith({
        onSuccess: expect.any(Function),
        onError: mockOnError,
        flow: "auth-code"
      });
    });

    it("should call useGoogleLogin without onError when not provided", () => {
      render(<GoogleAuthButton onSuccess={mockOnSuccess}>Sign in with Google</GoogleAuthButton>);

      expect(mockUseGoogleLogin).toHaveBeenCalledWith({
        onSuccess: expect.any(Function),
        onError: undefined,
        flow: "auth-code"
      });
    });

    it("should trigger login when button is clicked", () => {
      render(<GoogleAuthButton onSuccess={mockOnSuccess}>Sign in with Google</GoogleAuthButton>);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockLogin).toHaveBeenCalledTimes(1);
    });

    it("should call onSuccess with code when Google login succeeds", () => {
      let capturedOnSuccess: ((response: any) => void) | undefined;

      mockUseGoogleLogin.mockImplementation((config) => {
        capturedOnSuccess = config.onSuccess;
        return mockLogin;
      });

      render(<GoogleAuthButton onSuccess={mockOnSuccess}>Sign in with Google</GoogleAuthButton>);

      // Simulate successful Google OAuth response
      const mockCodeResponse = { code: "auth-code-123" };
      capturedOnSuccess!(mockCodeResponse);

      expect(mockOnSuccess).toHaveBeenCalledWith("auth-code-123");
    });

    it("should have correct CSS classes for styling", () => {
      render(<GoogleAuthButton onSuccess={mockOnSuccess}>Sign in with Google</GoogleAuthButton>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("ui-btn ui-btn-tertiary");
    });

    it("should handle different children content", () => {
      render(
        <GoogleAuthButton onSuccess={mockOnSuccess}>
          <span>Custom Content</span>
        </GoogleAuthButton>
      );

      expect(screen.getByText("Custom Content")).toBeInTheDocument();
    });

    it("should be accessible with proper button role", () => {
      render(<GoogleAuthButton onSuccess={mockOnSuccess}>Sign in with Google</GoogleAuthButton>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });
  });

  describe("when Google Client ID is not configured", () => {
    beforeEach(() => {
      delete process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    });

    it("should not render anything when client ID is not configured", () => {
      const { container } = render(<GoogleAuthButton onSuccess={mockOnSuccess}>Sign in with Google</GoogleAuthButton>);

      expect(container.firstChild).toBeNull();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("should not call useGoogleLogin when not rendered", () => {
      render(<GoogleAuthButton onSuccess={mockOnSuccess}>Sign in with Google</GoogleAuthButton>);

      expect(mockUseGoogleLogin).not.toHaveBeenCalled();
    });
  });
});
