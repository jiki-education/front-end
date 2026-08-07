import React from "react";
import { render, screen } from "@testing-library/react";
import { TestimonialsSection } from "@/components/landing-page/TestimonialsSection";
import enTestimonials from "../../../../../content/src/testimonials/en.json";

// The testimonial copy comes from the content package, not the i18n catalog, and
// reaches the component as a PROP: it is a fetched per-locale artifact now, so
// the page that renders this fetches it and passes it down. These assertions read
// the content package directly, which is the same source the artifact is built
// from, so they verify the rendering rather than the delivery.
describe("TestimonialsSection", () => {
  const data = enTestimonials;

  it("renders the heading from content", () => {
    render(<TestimonialsSection testimonials={enTestimonials} />);
    expect(screen.getByRole("heading", { name: data.heading })).toBeInTheDocument();
  });

  it("renders the subheading with a link to the testimonials page", () => {
    render(<TestimonialsSection testimonials={enTestimonials} />);
    const link = screen.getByRole("link", { name: "Read the full versions here!" });
    expect(link).toHaveAttribute("href", "/testimonials");
  });

  it("renders the primary quote and attribution", () => {
    render(<TestimonialsSection testimonials={enTestimonials} />);
    expect(screen.getByText(data.primary.quote)).toBeInTheDocument();
    expect(screen.getAllByText(data.primary.name).length).toBeGreaterThan(0);
    expect(screen.getByText(data.primary.role)).toBeInTheDocument();
  });

  it("renders every student quote with its name", () => {
    const { container } = render(<TestimonialsSection testimonials={enTestimonials} />);
    // One <p> per quote is rendered from trusted HTML via dangerouslySetInnerHTML.
    for (const quote of data.quotes) {
      // Names may repeat (e.g. "Oleksandra"), so assert presence rather than uniqueness.
      expect(screen.getAllByText(quote.name).length).toBeGreaterThan(0);
    }
    // <strong> emphasis from the authored HTML is rendered, not escaped.
    expect(container.querySelector("strong")).toBeInTheDocument();
  });

  it("renders the first quote's emphasised HTML", () => {
    const { container } = render(<TestimonialsSection testimonials={enTestimonials} />);
    const strongs = Array.from(container.querySelectorAll("strong")).map((el) => el.textContent);
    expect(strongs).toContain("no previous coding experience");
  });
});
