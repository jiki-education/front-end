import { LocaleBannerBar } from "@/components/i18n/LocaleBannerBar";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const props = {
  href: "/blog/x",
  offered: "en",
  prefix: "You are viewing the Hungarian version of this page.",
  cta: "Change to English",
  or: "or",
  close: "close this notice"
};

function renderBar(overrides: Partial<typeof props> = {}) {
  return render(<LocaleBannerBar {...props} {...overrides} />);
}

describe("LocaleBannerBar", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the offer with a link to the target page", () => {
    renderBar();

    expect(screen.getByText(/You are viewing the Hungarian version/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Change to English" })).toHaveAttribute("href", "/blog/x");
  });

  it("hides itself and persists dismissal per offered locale when closed", async () => {
    const user = userEvent.setup();
    renderBar();

    await user.click(screen.getByRole("button", { name: "close this notice" }));

    expect(screen.queryByText(/You are viewing the Hungarian version/)).not.toBeInTheDocument();
    expect(window.localStorage.getItem("locale-banner-dismissed:en")).toBe("1");
  });

  it("does not render when the offered locale was dismissed before", () => {
    window.localStorage.setItem("locale-banner-dismissed:en", "1");
    renderBar();

    expect(screen.queryByText(/You are viewing the Hungarian version/)).not.toBeInTheDocument();
  });

  it("still renders when a different locale was the one dismissed", () => {
    window.localStorage.setItem("locale-banner-dismissed:hu", "1");
    renderBar({ offered: "en" });

    expect(screen.getByText(/You are viewing the Hungarian version/)).toBeInTheDocument();
  });
});
