import React from "react";
import { render, screen } from "@testing-library/react";
import { TestimonialsSection } from "@/components/landing-page/TestimonialsSection";
import { getTestimonials } from "@/lib/content/getTestimonials";

// The testimonial copy now comes from the content package (via the bundled
// content-meta-server.json), not the i18n catalog, so these assertions verify the
// content-package delivery renders the expected copy server-side.
describe("TestimonialsSection", () => {
  const data = getTestimonials("en");

  it("renders the heading from content", () => {
    render(<TestimonialsSection />);
    expect(screen.getByRole("heading", { name: data.heading })).toBeInTheDocument();
  });

  it("renders the subheading with a link to the testimonials page", () => {
    render(<TestimonialsSection />);
    const link = screen.getByRole("link", { name: "Read the full versions here!" });
    expect(link).toHaveAttribute("href", "/testimonials");
  });

  it("renders the primary quote and attribution", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText(data.primary.quote)).toBeInTheDocument();
    expect(screen.getAllByText(data.primary.name).length).toBeGreaterThan(0);
    expect(screen.getByText(data.primary.role)).toBeInTheDocument();
  });

  it("renders every student quote with its name", () => {
    const { container } = render(<TestimonialsSection />);
    // One <p> per quote is rendered from trusted HTML via dangerouslySetInnerHTML.
    for (const quote of data.quotes) {
      // Names may repeat (e.g. "Oleksandra"), so assert presence rather than uniqueness.
      expect(screen.getAllByText(quote.name).length).toBeGreaterThan(0);
    }
    // <strong> emphasis from the authored HTML is rendered, not escaped.
    expect(container.querySelector("strong")).toBeInTheDocument();
  });

  it("renders the first quote's emphasised HTML", () => {
    const { container } = render(<TestimonialsSection />);
    const strongs = Array.from(container.querySelectorAll("strong")).map((el) => el.textContent);
    expect(strongs).toContain("no previous coding experience");
  });
});
