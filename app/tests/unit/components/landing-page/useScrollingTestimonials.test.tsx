import React from "react";
import { render } from "@testing-library/react";
import { act } from "react";
import { useScrollingTestimonials } from "@/components/landing-page/hooks/useScrollingTestimonials";

jest.mock("animejs", () => ({ animate: () => ({ pause: jest.fn() }) }));

let currentLocale = "en";
jest.mock("next-intl", () => ({ useLocale: () => currentLocale }));

// The belt is driven by rAF against real timestamps; step it by hand so a frame is a value,
// not a wait.
let frameCallbacks: FrameRequestCallback[] = [];

function Marquee() {
  const { containerRef, ulRef } = useScrollingTestimonials();
  return (
    <div ref={containerRef}>
      <ul ref={ulRef} data-testid="marquee">
        <li>one</li>
        <li>two</li>
      </ul>
    </div>
  );
}

function translateX(el: HTMLElement): number {
  const match = /translateX\((-?[\d.]+)px\)/.exec(el.style.transform);
  return match ? parseFloat(match[1]) : NaN;
}

function advance(ms: number) {
  const due = frameCallbacks;
  frameCallbacks = [];
  act(() => {
    for (const cb of due) {
      cb(ms);
    }
  });
}

describe("useScrollingTestimonials travel direction", () => {
  const COPY_WIDTH = 500;

  beforeEach(() => {
    currentLocale = "en";
    frameCallbacks = [];

    jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      frameCallbacks.push(cb);
      return frameCallbacks.length;
    });
    jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
    // jsdom lays nothing out, so the hook would measure a zero-width belt and never move.
    jest.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(COPY_WIDTH);
    window.matchMedia = jest
      .fn()
      .mockReturnValue({ matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() }) as never;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("travels left from flush under an LTR locale", () => {
    const { getByTestId } = render(<Marquee />);
    const ul = getByTestId("marquee");

    // The first frame only seeds `lastTimestamp`, so it reports the start position.
    advance(1000);
    expect(translateX(ul)).toBe(0);

    advance(1100);
    expect(translateX(ul)).toBeLessThan(0);
  });

  it("travels right under an RTL locale, so blurbs enter from the left", () => {
    currentLocale = "fa";
    const { getByTestId } = render(<Marquee />);
    const ul = getByTestId("marquee");

    advance(1000);
    const start = translateX(ul);
    // Parked one copy-width out, so the strip is covered rather than sliding in from blank space.
    expect(start).toBe(-COPY_WIDTH);

    advance(1100);
    expect(translateX(ul)).toBeGreaterThan(start);
  });

  it("duplicates the items in both directions, so either travel wraps seamlessly", () => {
    for (const locale of ["en", "fa"]) {
      currentLocale = locale;
      const { getByTestId, unmount } = render(<Marquee />);
      expect(getByTestId("marquee").children).toHaveLength(4);
      unmount();
    }
  });
});
