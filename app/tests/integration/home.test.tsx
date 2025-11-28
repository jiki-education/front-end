import { render, screen } from "@testing-library/react";
import Home from "@/app/(external)/page";

// Mock Next.js Server Component dependencies
const mockRedirect = jest.fn();
jest.mock("next/navigation", () => ({
  redirect: (path: string) => {
    mockRedirect(path);
    // Throw error to stop execution (Next.js redirect behavior)
    throw new Error(`NEXT_REDIRECT: ${path}`);
  }
}));

// Mock next/headers cookies
const mockCookies = jest.fn();
jest.mock("next/headers", () => ({
  cookies: () => mockCookies()
}));

// Mock the storage parseJwtPayload function
jest.mock("@/lib/auth/storage", () => ({
  parseJwtPayload: jest.fn((token: string) => {
    if (token === "valid.jwt.token") {
      return {
        sub: "123",
        exp: Math.floor(Date.now() / 1000) + 3600 // Valid for 1 hour
      };
    }
    if (token === "expired.jwt.token") {
      return {
        sub: "123",
        exp: Math.floor(Date.now() / 1000) - 3600 // Expired 1 hour ago
      };
    }
    return null;
  })
}));

describe("Home Page (Server Component)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRedirect.mockClear();
  });

  it("shows landing page when no access token cookie", async () => {
    // Mock no cookie
    mockCookies.mockReturnValue({
      get: jest.fn().mockReturnValue(undefined)
    });

    const HomePage = await Home();
    render(HomePage);

    expect(screen.getByText("Welcome to Jiki")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("shows landing page when access token cookie is invalid", async () => {
    // Mock invalid cookie
    mockCookies.mockReturnValue({
      get: jest.fn().mockReturnValue({ value: "invalid.token" })
    });

    const HomePage = await Home();
    render(HomePage);

    expect(screen.getByText("Welcome to Jiki")).toBeInTheDocument();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("redirects to dashboard when valid access token exists", async () => {
    // Mock valid token cookie
    mockCookies.mockReturnValue({
      get: jest.fn().mockReturnValue({ value: "valid.jwt.token" })
    });

    // Server Component redirect throws an error
    await expect(Home()).rejects.toThrow("NEXT_REDIRECT: /dashboard");
    expect(mockRedirect).toHaveBeenCalledWith("/dashboard");
  });

  it("shows landing page when access token is expired", async () => {
    // Mock expired token cookie - server treats as unauthenticated
    mockCookies.mockReturnValue({
      get: jest.fn().mockReturnValue({ value: "expired.jwt.token" })
    });

    const HomePage = await Home();
    render(HomePage);

    // Expired tokens are treated as unauthenticated on server
    // Client-side will attempt refresh via ClientAuthGuard if needed
    expect(screen.getByText("Welcome to Jiki")).toBeInTheDocument();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("displays feature cards on landing page", async () => {
    mockCookies.mockReturnValue({
      get: jest.fn().mockReturnValue(undefined)
    });

    const HomePage = await Home();
    render(HomePage);

    expect(screen.getByText("Interactive Learning")).toBeInTheDocument();
    expect(screen.getByText("Track Progress")).toBeInTheDocument();
    expect(screen.getByText("Real Projects")).toBeInTheDocument();
  });
});
