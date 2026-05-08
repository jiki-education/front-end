"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { annotate } from "rough-notation";
import styles from "./Hero.module.css";
import shared from "./shared.module.css";
import { useScrollingTestimonials } from "./hooks/useScrollingTestimonials";
import { useHamster } from "./hooks/useHamster";

export function Hero() {
  const { containerRef: marqueeContainerRef, ulRef } = useScrollingTestimonials();
  const { hamsterRef, smokeRef, containerRef: hamsterContainerRef } = useHamster();

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const can = headlineRef.current?.querySelector<HTMLElement>("[data-anim='underline-can']");
    const llm = taglineRef.current?.querySelector<HTMLElement>("[data-anim='highlight-llm']");

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

    let highlightTimer: ReturnType<typeof setTimeout> | undefined;
    if (llm) {
      highlightTimer = setTimeout(() => {
        const a = annotate(llm, {
          type: "highlight",
          color: "rgb(166 20 184)",
          strokeWidth: 50,
          animationDuration: 600,
          iterations: 2,
          padding: [16, 6],
          multiline: true,
          // @ts-expect-error rough-notation supports roughness even though its types omit it
          roughness: 0.5
        });
        a.show();
        annotations.push(a);
      }, 1200);
    }

    return () => {
      if (highlightTimer) clearTimeout(highlightTimer);
      annotations.forEach((a) => a.hide());
    };
  }, []);

  return (
    <div className={styles.hero}>
      <div className={shared["md-container"]}>
        <div className="text-center">
          <h1 ref={headlineRef} className={styles["rock-solid"]} data-rock-solid>
            Yes, you{" "}
            <strong data-anim="underline-can" className="inline-block">
              can
            </strong>{" "}
            still get into tech in 2026.
          </h1>
          <div ref={taglineRef} className={`${styles.tagline} max-w-[750px]`} data-tagline>
            The skills you need to{" "}
            <span data-anim="highlight-llm" className="inline">
              be relevant in the <strong className="font-semibold">LLM-era.</strong>
            </span>
          </div>
        </div>
        <div className={styles.bubbles}>
          <div className={styles.bubble}>
            <Image src="/static/images/landing-page/video-tutorial.svg" alt="" width={16} height={16} />
            <div className={styles.text}>
              Learn to <strong>Code</strong>
            </div>
          </div>
          <div className={styles.bubble}>
            <Image src="/static/images/landing-page/fun.svg" alt="" width={16} height={16} />
            <div className={styles.text}>
              <strong>Build</strong> with LLMs
            </div>
          </div>
          <div className={styles.bubble}>
            <Image src="/static/images/landing-page/globe.svg" alt="" width={16} height={16} />
            <div className={styles.text}>
              In your <strong>Language</strong>
            </div>
          </div>
        </div>
        <div className={styles["video-container"]} data-video-container>
          <MuxPlayer
            playbackId="v2kO7cS7n8IhguzE013jOmPHmkXrrIwFNcM5qgz1P17c"
            poster="https://assets.exercism.org/images/thumbnails/jiki-waiting.png"
            metadata={{ video_title: "Waiting Page 1" }}
            accentColor="#7c3aed"
            style={{ width: "100%", aspectRatio: "16/9" }}
          />
        </div>
      </div>
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
            <li>&quot;This bootcamp is pure gold.&quot;</li>
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
    </div>
  );
}
