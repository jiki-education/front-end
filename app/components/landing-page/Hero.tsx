"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { annotate } from "rough-notation";
import styles from "./Hero.module.css";
import shared from "./shared.module.css";
import { useScrollingTestimonials } from "./hooks/useScrollingTestimonials";
import { useHamster } from "./hooks/useHamster";
import { SignupButton } from "./SignupButton";

export function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const audienceRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const can = headlineRef.current?.querySelector<HTMLElement>("[data-anim='underline-can']");

    const annotations: { hide: () => void }[] = [];

    if (can) {
      const a = annotate(can, {
        type: "underline",
        color: "#fff",
        strokeWidth: 7,
        animationDuration: 700,
        iterations: 1,
        padding: -6,
        multiline: true,
        // @ts-expect-error rough-notation supports roughness even though its types omit it
        roughness: 0.5
      });
      a.show();
      annotations.push(a);
    }

    let headlineTimer: ReturnType<typeof setTimeout> | undefined;
    const headlineTarget = headlineRef.current?.querySelector<HTMLElement>("[data-anim='highlight-headline']");
    if (headlineTarget) {
      const w = window.innerWidth;
      const isSmallHeadline = w < 640 || (w >= 1024 && w < 1190);
      const a = annotate(headlineTarget, {
        type: "underline",
        color: "#ce19e6",
        strokeWidth: isSmallHeadline ? 4 : 6,
        animationDuration: 800,
        iterations: 2,
        padding: isSmallHeadline ? [-10, 0] : [-13, 0],
        multiline: true,
        // @ts-expect-error rough-notation supports roughness even though its types omit it
        roughness: 1
      });
      headlineTimer = setTimeout(() => a.show(), 400);
      annotations.push(a);
    }

    const audienceTimers: ReturnType<typeof setTimeout>[] = [];
    const audienceTargets = audienceRef.current?.querySelectorAll<HTMLElement>("[data-anim='highlight-audience']");
    audienceTargets?.forEach((el, i) => {
      const t = setTimeout(
        () => {
          const a = annotate(el, {
            type: "underline",
            color: "#FFF176",
            strokeWidth: 3,
            animationDuration: 800,
            iterations: 1,
            padding: [-2, 6],
            multiline: true,
            // @ts-expect-error rough-notation supports roughness even though its types omit it
            roughness: 1
          });
          a.show();
          annotations.push(a);
        },
        2500 + i * 1000
      );
      audienceTimers.push(t);
    });

    return () => {
      if (headlineTimer) clearTimeout(headlineTimer);
      audienceTimers.forEach((t) => clearTimeout(t));
      annotations.forEach((a) => a.hide());
    };
  }, []);

  return (
    <div className={styles.hero}>
      <div className={[styles["container"], shared["lg-container"]].join(" ")}>
        <div className={styles["hero-lhs"]}>
          <h1 ref={headlineRef} className={styles["rock-solid"]} data-rock-solid>
            Learn to{" "}
            <span data-anim="highlight-headline" className="inline">
              code and build
            </span>{" "}
            in the LLM-era!
          </h1>
          <p ref={taglineRef} className={`${styles.tagline}`} data-tagline>
            Learn the skills you need to create awesome things, be productive, and{" "}
            <strong className="font-semibold">stay relevant in {new Date().getFullYear()}.</strong>
          </p>
          <p ref={audienceRef} className={`${styles.tagline} `}>
            Designed for{" "}
            <span data-anim="highlight-audience" className="font-medium text-white">
              people getting into tech
            </span>
            ,{" "}
            <span data-anim="highlight-audience" className="font-medium text-white">
              junior developers
            </span>{" "}
            who want to accelerate, and{" "}
            <span data-anim="highlight-audience" className="font-medium text-white">
              vibe-coders
            </span>{" "}
            wanting to do things properly!
          </p>
          <div className={styles["cta-wrapper"]}>
            <SignupButton />
            <div className={styles["cta-subtext"]}>...or read on to learn more!</div>
          </div>
        </div>
        <div className={styles["hero-rhs"]}>
          <div className={styles["video-container"]} data-video-container>
            <MuxPlayer
              playbackId="v2kO7cS7n8IhguzE013jOmPHmkXrrIwFNcM5qgz1P17c"
              poster="https://assets.exercism.org/images/thumbnails/jiki-waiting.png"
              metadata={{ video_title: "Waiting Page 1" }}
              accentColor="#7c3aed"
              style={{ display: "block", width: "100%", aspectRatio: "16/9" }}
            />
          </div>
          <WatchPrompt />
        </div>
      </div>
      <ScrollingTestimonials />
    </div>
  );
}

function WatchPrompt() {
  return (
    <div className={styles["watch-prompt"]}>
      <Image
        src="/static/images/landing-page/arrow-1.svg"
        alt=""
        width={48}
        height={100}
        className={styles["watch-arrow"]}
      />
      <p>
        (Reading not your thing? <span className="font-medium text-white">Click play</span> and I&apos;ll tell you
        everything you need to know!)
      </p>
    </div>
  );
}

function ScrollingTestimonials() {
  const { hamsterRef, smokeRef, containerRef: hamsterContainerRef } = useHamster();
  const { containerRef: marqueeContainerRef, ulRef } = useScrollingTestimonials(hamsterRef);

  return (
    <div className={styles["scrolling-testimonials"]} ref={hamsterContainerRef}>
      <div className={styles.hamster} ref={hamsterRef}></div>
      <div ref={smokeRef}></div>
      <div className={styles.inner} ref={marqueeContainerRef}>
        <ul ref={ulRef}>
          <li>&quot;Perfect mixture of challenge and fun&quot;</li>
          <li>&quot;Amazing value&quot;</li>
          <li>&quot;My best time investment for years&quot;</li>
          <li>&quot;Incredibly Fun!&quot;</li>
          <li>&quot;Its been transformative!&quot;</li>
          <li>&quot;You *will* learn to code&quot;</li>
          <li>&quot;Learning, as it should be!&quot;</li>
          <li>&quot;The best course I&apos;ve done&quot;</li>
          <li>&quot;Made learning a joy again&quot;</li>
          <li>&quot;This course is pure gold.&quot;</li>
          <li>&quot;A wonderful Learning Experience&quot;</li>
          <li>&quot;Proper Hands-on learning&quot;</li>
          <li>&quot;The knowledge you didn&apos;t think you needed&quot;</li>
          <li>&quot;100% recommended!&quot;</li>
          <li>&quot;So glad I stumbled on this&quot;</li>
          <li>&quot;A great way to learn!&quot;</li>
          <li>&quot;Fun exercises, clear explanations, cool hats&quot;</li>
          <li>&quot;Exceptional course, truly outstanding&quot;</li>
          <li>&quot;Addictive in a good way&quot;</li>
          <li>&quot;Amazing fun&quot;</li>
          <li>&quot;Fantastic community&quot;</li>
          <li>&quot;Zero coding experience required&quot;</li>
          <li>&quot;Fun and inspiring&quot;</li>
          <li>&quot;It&apos;s changed the way I think about learning&quot;</li>
          <li>&quot;An incredibly rewarding journey&quot;</li>
          <li>&quot;Insane value&quot;</li>
          <li>&quot;An opportunity to learn from a bonafide master&quot;</li>
          <li>&quot;It&apos;s really an amazing and lovely thing&quot;</li>
          <li>&quot;The best investment I made in myself this year&quot;</li>
          <li>&quot;Its massively increased my confidence and motivation&quot;</li>
          <li>&quot;Very supportive community!&quot;</li>
          <li>&quot;Even as a prior programmer, its transformative!&quot;</li>
        </ul>
      </div>
    </div>
  );
}
