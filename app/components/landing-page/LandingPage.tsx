import type { BlogPostMeta, TestimonialsData } from "@/lib/content/types";
import HeaderLayout from "../layout/HeaderLayout";
import { Exercism } from "./Exercism";
import { FAQs } from "./FAQs";
import { Hero } from "./Hero";
import { LatestNewsSection } from "./LatestNewsSection";
import { MeetJeremy } from "./MeetJeremy";
import { OutcomesSection } from "./OutcomesSection";
import { PrintRow } from "./PrintRow";
import styles from "./LandingPage.module.css";
import { TestimonialsSection } from "./TestimonialsSection";
import { TrackCardsSection } from "./TrackCardsSection";
import { TwoHalves } from "./TwoHalves";

interface LandingPageProps {
  latestPosts?: BlogPostMeta[];
  /**
   * Fetched by the page that renders this, not read here: testimonials are a
   * per-locale artifact now rather than bundled data, and this component uses
   * hooks, so it cannot be async.
   */
  testimonials: TestimonialsData | null;
}

export function LandingPage({ latestPosts = [], testimonials }: LandingPageProps) {
  // The marquee blurbs go to the client-rendered Hero as a serialized prop, so
  // the content data never ships in the client bundle.
  const marquee = testimonials?.marquee ?? [];

  return (
    <div className={styles.page}>
      <HeaderLayout>
        <Hero marquee={marquee} />
        <TwoHalves />
        <TrackCardsSection />
        <OutcomesSection />
        <MeetJeremy />
        {/* A locale with no testimonial catalog renders none, by design (see getTestimonials). */}
        {testimonials ? <TestimonialsSection testimonials={testimonials} /> : null}
        <PrintRow />
        <Exercism />
        <FAQs />
        <LatestNewsSection posts={latestPosts} />
      </HeaderLayout>
    </div>
  );
}
