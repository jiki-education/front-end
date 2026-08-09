import Image from "next/image";
import type { BlogPostMeta, TestimonialsData } from "@/lib/content/types";
import divider from "./assets/divider.webp";
import HeaderLayout from "../layout/HeaderLayout";
import { BootcampSection } from "./BootcampSection";
import { Exercism } from "./Exercism";
import { FAQs } from "./FAQs";
import { Hero } from "./Hero";
import { LatestNewsSection } from "./LatestNewsSection";
import { StickyNav } from "./StickyNav";
import styles from "./LandingPage.module.css";
import { SignupSection } from "./SignupSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { WelcomeSection } from "./WelcomeSection";

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
      <StickyNav />
      <HeaderLayout>
        <Hero marquee={marquee} />
        <WelcomeSection />
        <BootcampSection />
        {testimonials ? <TestimonialsSection testimonials={testimonials} /> : null}
        <SignupSection />
        <Image className={styles.divider} src={divider} alt="" width={100} height={100} />
        <Exercism />
        <Image className={styles.divider} src={divider} alt="" width={100} height={100} />
        <FAQs />
        <LatestNewsSection posts={latestPosts} />
      </HeaderLayout>
    </div>
  );
}
