"use client";

import Image from "next/image";
import type { BlogPostMeta } from "@/lib/content/types";
import divider from "./assets/divider.webp";
import HeaderLayout from "../layout/HeaderLayout";
import { BootcampSection } from "./BootcampSection";
import { Exercism } from "./Exercism";
import { FAQs } from "./FAQs";
import { Hero } from "./Hero";
import { LatestNewsSection } from "./LatestNewsSection";
import { useStickyNav } from "./hooks/useStickyNav";
import styles from "./LandingPage.module.css";
import { SignupSection } from "./SignupSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { WelcomeSection } from "./WelcomeSection";

interface LandingPageProps {
  latestPosts?: BlogPostMeta[];
}

export function LandingPage({ latestPosts = [] }: LandingPageProps) {
  useStickyNav();

  return (
    <div className={styles.page}>
      <HeaderLayout>
        <Hero />
        <WelcomeSection />
        <BootcampSection />
        <TestimonialsSection />
        <SignupSection />
        <Image className="w-[100px] mx-auto my-64" src={divider} alt="" width={100} height={100} />
        <Exercism />
        <Image className="w-[100px] mx-auto my-64" src={divider} alt="" width={100} height={100} />
        <FAQs />
        <LatestNewsSection posts={latestPosts} />
      </HeaderLayout>
    </div>
  );
}
