import { useLocale } from "next-intl";
import Image from "next/image";
import type { BlogPostMeta } from "@/lib/content/types";
import { getTestimonials } from "@/lib/content/getTestimonials";
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
        <WelcomeSection />
        <BootcampSection />
        <TestimonialsSection />
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
