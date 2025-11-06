/**
 * Tests for useCheckoutSession hook
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { useCheckoutSession } from "@/hooks/useCheckoutSession";
import { createCheckoutSession } from "@/lib/api/subscriptions";
import { createCheckoutReturnUrl } from "@/lib/subscriptions/checkout";

// Mock the dependencies
jest.mock("@/lib/api/subscriptions");
jest.mock("@/lib/subscriptions/checkout");

const mockedCreateCheckoutSession = createCheckoutSession as jest.MockedFunction<typeof createCheckoutSession>;
const mockedCreateCheckoutReturnUrl = createCheckoutReturnUrl as jest.MockedFunction<typeof createCheckoutReturnUrl>;

describe("useCheckoutSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedCreateCheckoutReturnUrl.mockReturnValue("http://localhost:3071/test?session_id={CHECKOUT_SESSION_ID}");
  });

  it("initializes with null values", () => {
    const { result } = renderHook(() => useCheckoutSession());

    expect(result.current.clientSecret).toBeNull();
    expect(result.current.selectedTier).toBeNull();
    expect(result.current.isCreating).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("successfully starts checkout for premium tier", async () => {
    mockedCreateCheckoutSession.mockResolvedValue({ client_secret: "cs_test_secret_123" });

    const { result } = renderHook(() => useCheckoutSession());

    await act(async () => {
      await result.current.startCheckout("premium", "/subscribe");
    });

    await waitFor(() => {
      expect(result.current.clientSecret).toBe("cs_test_secret_123");
    });
    expect(result.current.selectedTier).toBe("premium");
    expect(result.current.isCreating).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockedCreateCheckoutReturnUrl).toHaveBeenCalledWith("/subscribe");
    expect(mockedCreateCheckoutSession).toHaveBeenCalledWith(
      "premium",
      "http://localhost:3071/test?session_id={CHECKOUT_SESSION_ID}"
    );
  });

  it("successfully starts checkout for max tier", async () => {
    mockedCreateCheckoutSession.mockResolvedValue({ client_secret: "cs_test_secret_456" });

    const { result } = renderHook(() => useCheckoutSession());

    await act(async () => {
      await result.current.startCheckout("max", "/subscribe");
    });

    await waitFor(() => {
      expect(result.current.clientSecret).toBe("cs_test_secret_456");
    });
    expect(result.current.selectedTier).toBe("max");
  });

  it("prevents checkout for standard (free) tier", async () => {
    const { result } = renderHook(() => useCheckoutSession());

    await act(async () => {
      await result.current.startCheckout("standard", "/subscribe");
    });

    expect(result.current.clientSecret).toBeNull();
    expect(result.current.selectedTier).toBeNull();
    expect(result.current.error).toBe("Cannot create checkout for free tier");
    expect(mockedCreateCheckoutSession).not.toHaveBeenCalled();
  });

  it("sets isCreating to true during checkout creation", async () => {
    mockedCreateCheckoutSession.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ client_secret: "cs_test_123" }), 100);
        })
    );

    const { result } = renderHook(() => useCheckoutSession());

    act(() => {
      void result.current.startCheckout("premium", "/subscribe");
    });

    // Check immediately that isCreating is true
    expect(result.current.isCreating).toBe(true);

    // Wait for completion
    await waitFor(() => {
      expect(result.current.isCreating).toBe(false);
    });
  });

  it("handles checkout creation error", async () => {
    const error = new Error("Network error");
    mockedCreateCheckoutSession.mockRejectedValue(error);

    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    const { result } = renderHook(() => useCheckoutSession());

    await act(async () => {
      await result.current.startCheckout("premium", "/subscribe");
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Network error");
    });
    expect(result.current.clientSecret).toBeNull();
    expect(result.current.selectedTier).toBeNull();
    expect(result.current.isCreating).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Checkout session creation failed:", error);

    consoleErrorSpy.mockRestore();
  });

  it("handles non-Error rejection", async () => {
    mockedCreateCheckoutSession.mockRejectedValue("Something went wrong");

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    const { result } = renderHook(() => useCheckoutSession());

    await act(async () => {
      await result.current.startCheckout("premium", "/subscribe");
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Failed to create checkout session");
    });

    consoleErrorSpy.mockRestore();
  });

  it("clears error when starting new checkout", async () => {
    mockedCreateCheckoutSession.mockResolvedValue({ client_secret: "cs_test_123" });

    const { result } = renderHook(() => useCheckoutSession());

    // First, create an error state
    await act(async () => {
      await result.current.startCheckout("standard", "/subscribe");
    });
    expect(result.current.error).toBe("Cannot create checkout for free tier");

    // Then start a valid checkout
    await act(async () => {
      await result.current.startCheckout("premium", "/subscribe");
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });

  it("cancels checkout and clears state", async () => {
    mockedCreateCheckoutSession.mockResolvedValue({ client_secret: "cs_test_123" });

    const { result } = renderHook(() => useCheckoutSession());

    // First create a checkout
    await act(async () => {
      await result.current.startCheckout("premium", "/subscribe");
    });

    await waitFor(() => {
      expect(result.current.clientSecret).toBe("cs_test_123");
    });

    // Then cancel it
    act(() => {
      result.current.cancelCheckout();
    });

    expect(result.current.clientSecret).toBeNull();
    expect(result.current.selectedTier).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("clears error on cancel", async () => {
    const { result } = renderHook(() => useCheckoutSession());

    // Create an error state
    await act(async () => {
      await result.current.startCheckout("standard", "/subscribe");
    });
    expect(result.current.error).toBe("Cannot create checkout for free tier");

    // Cancel should clear the error
    act(() => {
      result.current.cancelCheckout();
    });

    expect(result.current.error).toBeNull();
  });
});
