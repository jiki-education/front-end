"use client";

/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */

import Image from "next/image";
import styles from "./BootcampSection.module.css";
import shared from "./shared.module.css";
import { useArrowAnimation } from "./hooks/useArrowAnimations";
import { useConfetti } from "./hooks/useConfetti";

export function BootcampSection() {
  const portfolioArrowRef = useArrowAnimation<HTMLDivElement>("portfolio-arrow");
  const buildingSectionArrowRef = useArrowAnimation<HTMLDivElement>("building-section-arrow");
  const certificateArrowRef = useArrowAnimation<HTMLDivElement>("certificate-arrow");
  const confettiRef = useConfetti();

  return (
    <section className={styles.bootcamp} data-bootcamp-section>
      <div className={shared["lg-container"]}>
        <div className={`${styles.container} ${styles.syllabus}`}>
          <div className={styles.tag}>What we cover</div>
          <h2>
            What&apos;s on the <strong>menu?</strong>
          </h2>
          <p className={`${styles.intro} mb-24 text-balance max-w-[820px]`}>
            The course has two strands: <strong>Coding Fundamentals</strong> and{" "}
            <strong>Building in the Age of LLMs</strong>.
          </p>
          <div className={styles.sections}>
            <div className={styles.section}>
              <div className="flex flex-row">
                <div className={styles.lhs}>
                  <h3 className="mb-8">
                    1. Coding Fundamentals 🧑‍🔬
                    <div className={styles.bubble}>Absolute Beginners</div>
                  </h3>
                  <div className={`${styles["part-intro"]} mb-20`}>
                    We&apos;re going to help you{" "}
                    <span className="rough-highlight font-medium">build rock solid coding foundations.</span> We&apos;ll
                    cover all the core concepts in programming and give you tons of exercises and projects to practice
                    with.
                  </div>
                  <ul>
                    <li>
                      <Image src="/static/images/landing-page/understanding.svg" alt="" width={20} height={20} />
                      <div className={styles.text}>
                        <strong>Build a solid understanding</strong> of core programming principles, including flow
                        control, conditionals, data types, functions, and much more, using a beginner-friendly version
                        of JavaScript.
                      </div>
                    </li>
                    <li>
                      <Image src="/static/images/landing-page/confidence.svg" alt="" width={20} height={20} />
                      <div className={styles.text}>
                        <strong>Gain the confidence</strong> to put your knowledge into practice, being able to solve a
                        wide variety of problems, using the right concept at the right time.
                      </div>
                    </li>
                    <li>
                      <Image src="/static/images/landing-page/coders-mind.svg" alt="" width={20} height={20} />
                      <div className={styles.text}>
                        <strong>Develop the Coder&apos;s Mind.</strong> You&apos;ll notice that your critical thinking,
                        problem solving, and logic skills are all improving.
                      </div>
                    </li>
                    <li>
                      <Image src="/static/images/landing-page/build.svg" alt="" width={20} height={20} />
                      <div className={styles.text}>
                        <strong>A base to build on</strong>. Whatever type of programming you want to do, this the base
                        you need, and one you can easily build on.
                      </div>
                    </li>
                  </ul>
                </div>
                <div className={styles.rhs}>
                  <div className={`${styles.dates} ${styles["h3-sideheading"]} relative`}>
                    <Image src="/static/images/landing-page/calendar.svg" alt="" width={20} height={20} />
                    Takes 12-20 weeks
                  </div>
                  <Image
                    className="w-[350px] -mr-32 -mt-[60px]"
                    src="/static/images/landing-page/part-1.png"
                    alt="Part 1"
                    width={350}
                    height={350}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={shared["lg-container"]}>
        <div className={`${styles.subcontainer} ${styles["portfolio-subsection"]} relative`}>
          <div className={styles["portfolio-arrow"]} ref={portfolioArrowRef}></div>
          <div className="flex flex-col mb-8 lg:flex-row">
            <h2 className="mr-auto">
              The <strong>Levels</strong> of Coding Fundamentals
            </h2>
            <div className={styles["h3-sideheading"]}>Students normally take 1-2 weeks per level.</div>
          </div>
          <p className="mb-8">
            From day one you&apos;ll be building fun things. You&apos;ll start by drawing, then animating, then making
            games, then building intelligence into your programs. Every level has lots of fun challenges!
          </p>
          <p className="mb-16">
            <strong>Here are just a few of the fun things you&apos;ll make! 👇</strong>
          </p>
          <div className={styles.levels}>
            <div className={styles.level}>
              <Image
                src="/static/images/landing-page/penguin.png"
                alt="Penguin drawing exercise"
                width={400}
                height={300}
              />
              <h4>
                In <strong>level 2</strong> you get familiar with <strong>coding basics</strong> through some drawing
                puzzles.
              </h4>
            </div>
            <div className={styles.level}>
              <Image
                src="/static/images/landing-page/golf.gif"
                alt="Golf animation exercise"
                width={400}
                height={300}
                unoptimized
              />
              <h4>
                In <strong>level 3</strong> you&apos;ll learn how to <strong>make things move</strong> for the first
                time.
              </h4>
            </div>
            <div className={styles.level}>
              <Image
                src="/static/images/landing-page/flower.gif"
                alt="Flower flipbook animation"
                width={400}
                height={300}
                unoptimized
              />
              <h4>
                Your first <strong>major project</strong> is to <strong>animate flipbook-style</strong> using variables
                and loops.
              </h4>
            </div>
            <div className={styles.level}>
              <Image
                src="/static/images/landing-page/space-invaders.gif"
                alt="Space invaders game"
                width={400}
                height={300}
                unoptimized
              />
              <h4>
                By <strong>level 7</strong> you&apos;ll start <strong>building some intelligence</strong> into your
                code.
              </h4>
            </div>
            <div className={styles.level}>
              <Image
                src="/static/images/landing-page/wall.gif"
                alt="Wall building exercise"
                width={400}
                height={300}
                unoptimized
              />
              <h4>
                In <strong>level 10</strong> you use <strong>repeatable chunks</strong> of code eliminate duplication.
              </h4>
            </div>
            <div className={styles.level}>
              <Image src="/static/images/landing-page/wordle.png" alt="Wordle game exercise" width={400} height={300} />
              <h4>
                <strong>Level 12</strong> introduces lists, your first <strong>compound data type,</strong> and Wordle!
              </h4>
            </div>
            <div className={styles.level}>
              <Image
                src="/static/images/landing-page/tic-tac-toe.gif"
                alt="Tic-tac-toe game"
                width={400}
                height={300}
                unoptimized
              />
              <h4>
                <strong>Level 14</strong> focusses on <strong>coding mindset</strong> and solving a hard project.
              </h4>
            </div>
            <div className={styles.level}>
              <img src="/static/images/landing-page/maze.gif" />
              <h4>
                In <strong>Level 16</strong> you unlock <strong>dictionaries</strong> making Emoji Collector possible.
              </h4>
            </div>
            {/* Intentional empty cell — spacer to align the next tile in the grid */}
            <div className={styles.level}></div>
            <div className={styles.level}>
              <img src="/static/images/landing-page/dreaming-house.gif" />
              <h4>
                By <strong>Level 20</strong> you&apos;re able to build <strong>complex programs</strong> with
                intertwining ideas.
              </h4>
            </div>
            <div className={styles.level}>
              <img src="/static/images/landing-page/breakout.gif" />
              <h4>
                And by the <strong>end of the course</strong> you&apos;re building games like <strong>Breakout!</strong>
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div className={shared["lg-container"]}>
        <div className={`${styles.container} ${styles.syllabus} ${styles["building-subsection"]} relative`}>
          <div className={styles["building-section-arrow"]} ref={buildingSectionArrowRef}></div>

          <div className={styles.tag}>What we cover</div>
          <h2 className="text-center">
            But learning to code <strong>isn&apos;t enough</strong>
          </h2>
          <p className={`${styles.intro} mb-24 text-balance max-w-[820px]`}>
            In the LLM-era, you also need to get up to speed on how to create things, how to work with an LLM safely.
            So...
          </p>
          <div className={styles.sections}>
            <div className={styles.section}>
              <div className="flex flex-row">
                <div className={styles.lhs}>
                  <h3 className="mb-8">
                    2. Building in the Age of LLMs 🚀
                    <div className={styles.bubble}>Beginners / Juniors</div>
                  </h3>
                  <div className={`${styles["part-intro"]} mb-20`}>
                    Alongside learning to code, we&apos;ll deep dive into how technology works. We&apos;ll{" "}
                    <span className="rough-highlight font-medium">build real projects together</span>, digging into
                    databases, creating secure auth, learning about frontends vs backends, and much much more.
                  </div>
                  <ul>
                    <li>
                      <Image src="/static/images/landing-page/understanding.svg" alt="" width={20} height={20} />
                      <div className={styles.text}>
                        <strong>Building From Scratch</strong>: Join me as I build a whole platform from scratch. Spin
                        up an LLM and you can follow along with your own project idea. I&apos;ll teach you how to make
                        good decisions and guide your LLM safely.
                      </div>
                    </li>
                    <li>
                      <Image src="/static/images/landing-page/confidence.svg" alt="" width={20} height={20} />
                      <div className={styles.text}>
                        <strong>Topic Deep Dives</strong>: I&apos;ll talk you through how complex platforms like
                        Exercism and Jiki work, deep-diving into the code we&apos;ve written and share my learnings with
                        you!
                      </div>
                    </li>
                    <li>
                      <Image src="/static/images/landing-page/coders-mind.svg" alt="" width={20} height={20} />
                      <div className={styles.text}>
                        <strong>Regular Q&A Livestreams</strong>. Something not clicking? Need help with your projects?
                        Submit your questions and I&apos;ll answer them with you on our regular livestreams.
                      </div>
                    </li>
                  </ul>
                </div>
                <div className={styles.rhs}>
                  <div className={`${styles.dates} ${styles["h3-sideheading"]} relative`}>
                    <Image src="/static/images/landing-page/calendar.svg" alt="" width={20} height={20} />
                    Regular New Episodes
                  </div>
                  <Image
                    className="w-[340px] -mr-32"
                    src="/static/images/landing-page/jeremy-livestream.webp"
                    alt="Jeremy livestreaming with tech logos"
                    width={900}
                    height={703}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={shared["lg-container"]}>
        <div className={styles.subcontainer}>
          <div className={styles["certificate-arrow"]} ref={certificateArrowRef}></div>
          <div className={styles["certificate-subsection"]}>
            <div className="flex lg:flex-row flex-col items-center gap-0">
              <div className={`${styles.lhs} flex flex-col items-start`}>
                <div className={styles.bubble}>Celebrate your new skills!</div>
                <h3 className="mb-8">Get a verified certificate</h3>
                <p className="text-16 mb-12">
                  At the end of the course, we&apos;ll issue you an official certificate to recognise your participation
                  and completion of the course.
                </p>
                <p className="text-16">
                  Show off your skills on your resume and in the Certifications section of your LinkedIn profile.
                </p>
              </div>
              <img
                className="w-[100px] self-middle mt-[100px] mb-10 mr-40 my-10 lg:block hidden"
                src="/static/images/landing-page/certificate-arrow.png"
              />
              <div className={`${styles.certificate} flex-shrink-0 mt-24 lg:mt-0`}>
                <img
                  className="lg:w-[350px] w-100 rounded-[5px]"
                  style={{ boxShadow: "0 0 20px rgba(0,0,0,0.4)" }}
                  src="/static/images/landing-page/certificate.png"
                />
              </div>
            </div>
            <div className={styles.linkedin} ref={confettiRef}>
              <img src="/static/images/landing-page/linkedin.png" />
              <span>Share your certificate in your network</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
