import Home from "@/app/external/page";
import { render, screen } from "@testing-library/react";

describe("Home Page (Landing Page)", () => {
  it("shows landing page content", () => {
    render(<Home />);

    expect(screen.getByText("Welcome to Jiki")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("displays feature cards", () => {
    render(<Home />);

    expect(screen.getByText("Interactive Learning")).toBeInTheDocument();
    expect(screen.getByText("Track Progress")).toBeInTheDocument();
    expect(screen.getByText("Real Projects")).toBeInTheDocument();
  });

  it("has working login and signup links", () => {
    render(<Home />);

    const loginLink = screen.getByRole("link", { name: "Login" });
    const signupLink = screen.getByRole("link", { name: "Sign Up" });

    expect(loginLink).toHaveAttribute("href", "/auth/login");
    expect(signupLink).toHaveAttribute("href", "/auth/signup");
  });
});
