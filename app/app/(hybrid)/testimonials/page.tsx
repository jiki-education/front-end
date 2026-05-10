import type { Metadata } from "next";
import { TestimonialsPage } from "@/components/testimonials/TestimonialsPage";

export const metadata: Metadata = {
  title: "Testimonials - Jiki",
  description: "We asked our students if they'd enjoyed the course. Here's what they said."
};

export default function Page() {
  return <TestimonialsPage />;
}
