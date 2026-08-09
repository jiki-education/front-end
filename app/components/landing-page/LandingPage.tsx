import { useLocale } from "next-intl";
import type { BlogPostMeta } from "@/lib/content/types";
import { getTestimonials } from "@/lib/content/getTestimonials";
import HeaderLayout from "../layout/HeaderLayout";
import { Exercism } from "./Exercism";
import { FAQs } from "./FAQs";
import { Hero } from "./Hero";
import { LatestNewsSection } from "./LatestNewsSection";
import { MeetJeremy } from "./MeetJeremy";
import { OutcomesSection } from "./OutcomesSection";
import { PrintRow } from "./PrintRow";
import { StickyNav } from "./StickyNav";
import styles from "./LandingPage.module.css";
import { TestimonialsSection } from "./TestimonialsSection";
import { TrackCardsSection } from "./TrackCardsSection";
import { TwoHalves } from "./TwoHalves";

interface LandingPageProps {
  latestPosts?: BlogPostMeta[];
}

export function LandingPage({ latestPosts = [] }: LandingPageProps) {
  // Resolve testimonials server-side (synchronous, from the bundled content meta)
  // and hand the marquee blurbs to the client-rendered Hero as a serialized prop,
  // so the content data never ships in the client bundle.
  const { marquee } = getTestimonials(useLocale());

  return (
    <div className={styles.page}>
      <StickyNav />
      <HeaderLayout>
        <Hero marquee={marquee} />
        <TwoHalves />
        <TrackCardsSection />
        <OutcomesSection />
        <MeetJeremy />
        <TestimonialsSection />
        <PrintRow />
        <Exercism />
        <FAQs />
        <LatestNewsSection posts={latestPosts} />
      </HeaderLayout>
    </div>
  );
}
