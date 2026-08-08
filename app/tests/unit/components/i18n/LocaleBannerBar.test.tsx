import { LocaleBannerBar, LocaleBannerDismiss } from "@/components/i18n/LocaleBannerBar";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Link from "next/link";

// Stands in for the rich-text output the server component builds from the
// single `layout.localeBanner.message` key.
function message() {
  return (
    <>
      You are viewing the Hungarian version of this page. <Link href="/blog/x">Change to English</Link> or{" "}
      <LocaleBannerDismiss>close this notice</LocaleBannerDismiss>.
    </>
  );
}

function renderBar(offered = "en") {
  return render(<LocaleBannerBar offered={offered}>{message()}</LocaleBannerBar>);
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
    renderBar("en");

    expect(screen.getByText(/You are viewing the Hungarian version/)).toBeInTheDocument();
  });
});
