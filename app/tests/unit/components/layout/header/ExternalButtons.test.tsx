import { render, screen, fireEvent, within } from "@testing-library/react";
import ExternalButtons from "@/components/layout/header/ExternalButtons";

// The toggle's open/closed state is asserted via aria-expanded + the presence of
// role="menu", not the hamburger/cross icon swap: all `.svg` imports resolve to a
// single shared mock (see jest.config moduleNameMapper), so the two icons aren't
// individually distinguishable in the DOM.

// en.json layout.externalHeader strings (resolved by the global next-intl mock).
const OPEN_LABEL = "Open menu";
const CLOSE_LABEL = "Close menu";

function getToggle() {
  return screen.getByRole("button", { name: OPEN_LABEL });
}

describe("ExternalButtons - MobileMenu", () => {
  it("renders the toggle closed, with no dropdown", () => {
    render(<ExternalButtons />);

    const toggle = getToggle();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens the dropdown on click, updating aria-expanded and the aria-label", () => {
    render(<ExternalButtons />);

    fireEvent.click(getToggle());

    const toggle = screen.getByRole("button", { name: CLOSE_LABEL });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("toggles closed again on a second click", () => {
    render(<ExternalButtons />);

    fireEvent.click(getToggle());
    fireEvent.click(screen.getByRole("button", { name: CLOSE_LABEL }));

    expect(getToggle()).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes when Escape is pressed", () => {
    render(<ExternalButtons />);

    fireEvent.click(getToggle());
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(getToggle()).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on a mousedown outside the menu", () => {
    render(<ExternalButtons />);

    fireEvent.click(getToggle());
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("stays open on a mousedown inside the menu", () => {
    render(<ExternalButtons />);

    fireEvent.click(getToggle());
    const menu = screen.getByRole("menu");

    fireEvent.mouseDown(menu);

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("closes the menu when a dropdown link is clicked", () => {
    render(<ExternalButtons />);

    fireEvent.click(getToggle());
    // The dropdown's Premium link (role menu scopes it to the open dropdown).
    const menu = screen.getByRole("menu");
    const premiumLink = within(menu).getByRole("link", { name: "Premium" });

    fireEvent.click(premiumLink);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("points the dropdown auth links at the locale-aware routes", () => {
    render(<ExternalButtons />);

    fireEvent.click(getToggle());
    const menu = screen.getByRole("menu");

    expect(within(menu).getByRole("link", { name: "Login" })).toHaveAttribute("href", "/auth/login");
    expect(within(menu).getByRole("link", { name: "Sign Up For Free" })).toHaveAttribute("href", "/auth/signup");
    expect(within(menu).getByRole("link", { name: "Testimonials" })).toHaveAttribute("href", "/testimonials");
  });
});
