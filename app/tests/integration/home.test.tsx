import RootPage from "@/app/(hybrid)/page";
import { render, screen } from "@testing-library/react";

// Mock the server-side auth check
jest.mock("@/lib/auth/server-storage", () => ({
  hasAuthenticationCookie: jest.fn().mockResolvedValue(false)
}));

// LocaleBanner is an async server component that reads request headers; it can't
// render in the client test renderer, and it's irrelevant to these assertions.
jest.mock("@/components/i18n/LocaleBanner", () => ({
  LocaleBanner: () => null
}));

describe("Home Page (Landing Page)", () => {
  it("renders the marketing landing page", async () => {
    render(await RootPage());

    expect(screen.getByText("What makes Exercism special?")).toBeInTheDocument();
  });

  it("has Log In and Sign Up links in the header", async () => {
    render(await RootPage());

    const loginLink = screen.getByRole("link", { name: /Log ?in/i });
    expect(loginLink).toHaveAttribute("href", "/auth/login");

    const signupLinks = screen.getAllByRole("link", { name: /Sign Up/ });
    expect(signupLinks.length).toBeGreaterThan(0);
    signupLinks.forEach((link) => expect(link).toHaveAttribute("href", "/auth/signup"));
  });
});
