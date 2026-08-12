import React from "react";
import { render, screen } from "@testing-library/react";
import { TestimonialsSection } from "@/components/landing-page/TestimonialsSection";
import { assembleTestimonials } from "@/lib/content/contentMeta";
import structure from "../../../../../content/src/testimonials/structure.json";
import copy from "../../../../../content/src/testimonials/messages.json";

// Testimonials reach the component as a PROP: they are a fetched per-locale
// artifact, so the page that renders this fetches them and passes them down.
//
// The prop is built here the same way the app builds it, by joining the
// locale-invariant structure to a copy catalog, using the real English files.
// That covers the join as well as the rendering, and the join is where this can
// actually go wrong: a key in one half and not the other.
describe("TestimonialsSection", () => {
  const data = assembleTestimonials(structure, copy)!;

  it("assembles the English testimonials", () => {
    expect(data).not.toBeNull();
    expect(data.quotes).toHaveLength(structure.landing.quotes.length);
    expect(data.page).toHaveLength(structure.page.length);
  });

  it("renders the heading from content", () => {
    render(<TestimonialsSection testimonials={data} />);
    expect(screen.getByRole("heading", { name: data.heading })).toBeInTheDocument();
  });

  it("renders the subheading with a link to the testimonials page", () => {
    render(<TestimonialsSection testimonials={data} />);
    const link = screen.getByRole("link", { name: "Read the full versions here!" });
    expect(link).toHaveAttribute("href", "/testimonials");
  });

  it("renders the primary quote and attribution", () => {
    const { container } = render(<TestimonialsSection testimonials={data} />);
    // The quote's **bold** spans become separate <strong> elements, so the text is
    // split across nodes and only reassembles at the container level.
    expect(container.textContent).toContain(data.primary.text.replace(/\*\*/g, ""));
    expect(screen.getAllByText(data.primary.name).length).toBeGreaterThan(0);
    expect(screen.getByText(data.primary.role)).toBeInTheDocument();
  });

  it("renders every student quote with its name", () => {
    render(<TestimonialsSection testimonials={data} />);
    for (const quote of data.quotes) {
      // Names may repeat (e.g. "Oleksandra"), so assert presence rather than uniqueness.
      expect(screen.getAllByText(quote.name).length).toBeGreaterThan(0);
    }
  });

  it("renders **bold** spans as <strong> elements, without going through innerHTML", () => {
    const { container } = render(<TestimonialsSection testimonials={data} />);
    const strongs = Array.from(container.querySelectorAll("strong")).map((el) => el.textContent);
    expect(strongs).toContain("no previous coding experience");
    // The asterisks are markup and must never survive into the rendered text.
    expect(container.textContent).not.toContain("**");
  });
});
