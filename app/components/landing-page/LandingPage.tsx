"use client";

import Image from "next/image";
import { BootcampSection } from "./BootcampSection";
import { Exercism } from "./Exercism";
import { FAQs } from "./FAQs";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { useStickyNav } from "./hooks/useStickyNav";
import styles from "./LandingPage.module.css";
import { SignupSection } from "./SignupSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { WelcomeSection } from "./WelcomeSection";

export function LandingPage() {
  useStickyNav();

  return (
    <div className={styles.page}>
      <Header />
      <Hero />
      <WelcomeSection />
      <BootcampSection />
      <TestimonialsSection />
      <SignupSection />
      <Image className="w-[100px] mx-auto my-64" src="/static/images/landing-page/divider.png" alt="" width={100} height={100} />
      <Exercism />
      <Image className="w-[100px] mx-auto my-64" src="/static/images/landing-page/divider.png" alt="" width={100} height={100} />
      <FAQs />
    </div>
  );
}
