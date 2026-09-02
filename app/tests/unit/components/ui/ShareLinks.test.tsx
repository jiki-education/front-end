import { render, screen, fireEvent, act } from "@testing-library/react";
import { ShareLinks } from "@/components/ui/ShareLinks/ShareLinks";

// The icons aren't asserted on: all `.svg` imports resolve to a single shared
// mock (see jest.config moduleNameMapper), so the link glyph and the tick are
// indistinguishable in the DOM. The accessible name carries the state instead.

const TITLE = "Arrays & things";
const PATH = "/hu/blog/arrays-and-things";
const URL = `https://jiki.io${PATH}`;

function hrefFor(network: string): string {
  return screen.getByRole("link", { name: `Share on ${network}` }).getAttribute("href") ?? "";
}

describe("ShareLinks", () => {
  it("sends the absolute, locale-carrying URL to every network", () => {
    render(<ShareLinks title={TITLE} path={PATH} />);

    const encoded = encodeURIComponent(URL);
    expect(hrefFor("X")).toContain(`url=${encoded}`);
    expect(hrefFor("LinkedIn")).toContain(`url=${encoded}`);
    expect(hrefFor("Reddit")).toContain(`url=${encoded}`);
    expect(hrefFor("Hacker News")).toContain(`u=${encoded}`);
    // Bluesky composes one text field rather than taking a separate url param.
    expect(hrefFor("Bluesky")).toContain(encodeURIComponent(`${TITLE} ${URL}`));
  });

  it("escapes the title rather than letting it break out of the query string", () => {
    render(<ShareLinks title={TITLE} path={PATH} />);

    expect(hrefFor("X")).toContain(`text=${encodeURIComponent(TITLE)}`);
    expect(hrefFor("X")).not.toContain("&things");
  });

  it("opens each network in a new tab without leaking the referrer opener", () => {
    render(<ShareLinks title={TITLE} path={PATH} />);

    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("copies the URL and reverts the button's label after the confirmation", async () => {
    jest.useFakeTimers();
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<ShareLinks title={TITLE} path={PATH} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy link" }));

    expect(writeText).toHaveBeenCalledWith(URL);
    // Let the clipboard promise settle so the state flips.
    await act(async () => {});
    expect(screen.getByRole("button", { name: "Link copied" })).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByRole("button", { name: "Copy link" })).toBeInTheDocument();

    jest.useRealTimers();
  });
});
