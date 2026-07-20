import React from "react";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/landing-page/Hero";

// Hero is a client component with animation/video side-effects that are
// irrelevant to the marquee copy under test — stub them so the render is stable.
jest.mock("rough-notation", () => ({ annotate: () => ({ show: jest.fn(), hide: jest.fn() }) }));
jest.mock("animejs", () => ({ animate: () => ({ pause: jest.fn() }) }));
jest.mock("@/components/landing-page/hooks/useHamster", () => ({
  useHamster: () => ({ hamsterRef: { current: null }, smokeRef: { current: null }, containerRef: { current: null } })
}));
jest.mock("@/components/ui/JikiMuxPlayer", () => ({ __esModule: true, default: () => null }));
// The marquee hook clones the list items at runtime to create a seamless scroll;
// stub it so the test asserts the source markup rather than the duplicated DOM.
jest.mock("@/components/landing-page/hooks/useScrollingTestimonials", () => ({
  useScrollingTestimonials: () => ({ containerRef: { current: null }, ulRef: { current: null } })
}));

describe("Hero marquee", () => {
  const marquee = ['"Perfect mixture of challenge and fun"', '"Amazing value"', '"Fantastic community"'];

  it("renders each marquee blurb passed in as a prop", () => {
    render(<Hero marquee={marquee} />);
    for (const blurb of marquee) {
      expect(screen.getByText(blurb)).toBeInTheDocument();
    }
  });

  it("renders one list item per blurb", () => {
    const { container } = render(<Hero marquee={marquee} />);
    const items = container.querySelectorAll("ul li");
    expect(items).toHaveLength(marquee.length);
  });
});
