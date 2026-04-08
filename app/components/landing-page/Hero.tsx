"use client";

import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import styles from "./Hero.module.css";
import shared from "./shared.module.css";
import { useScrollingTestimonials } from "./hooks/useScrollingTestimonials";
import { useHamster } from "./hooks/useHamster";

export function Hero() {
  const { containerRef: marqueeContainerRef, ulRef } = useScrollingTestimonials();
  const { hamsterRef, smokeRef, containerRef: hamsterContainerRef } = useHamster();

  return (
    <div className={styles.hero}>
      <div className={shared["md-container"]}>
        <div className="text-center">
          <h1 className={styles["rock-solid"]} data-rock-solid>
            Master <strong>Coding Fundamentals</strong> with Jiki
          </h1>
          <div className={`${styles.tagline} max-w-[650px]`} data-tagline>
            The <em>ultimate</em> way to <strong className="font-semibold">Learn to Code.</strong>{" "}
            <span className="inline-block">
              <strong>Launching in</strong> February 2026.
            </span>
          </div>
        </div>
        <div className={styles.bubbles}>
          <div className={styles.bubble}>
            <Image src="/static/images/landing-page/video-tutorial.svg" alt="" width={16} height={16} />
            <div className={styles.text}>
              <strong>Video</strong> tutorials
            </div>
          </div>
          <div className={styles.bubble}>
            <Image src="/static/images/landing-page/fun.svg" alt="" width={16} height={16} />
            <div className={styles.text}>
              <strong>Fun</strong> projects
            </div>
          </div>
          <div className={styles.bubble}>
            <Image src="/static/images/landing-page/globe.svg" alt="" width={16} height={16} />
            <div className={styles.text}>
              <strong>40+</strong> languages
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
