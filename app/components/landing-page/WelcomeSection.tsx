"use client";

import Image from "next/image";
import Link from "next/link";
import ArrowIcon from "./icons/arrow-1.svg";
import RocketIcon from "./icons/rocket.svg";
import withRhodri from "./assets/with-rhodri.webp";
import styles from "./WelcomeSection.module.css";
import shared from "./shared.module.css";
import { MonthlyPrice } from "./MonthlyPrice";
import { useRoughAnnotations } from "./hooks/useRoughAnnotations";
import { useWavingHand } from "./hooks/useWavingHand";
import { useArrowAnimation } from "./hooks/useArrowAnimations";
import { useRocketLaunch } from "./hooks/useRocketLaunch";
import rocket from "./rocketLaunch.module.css";
import { SignupButton } from "./SignupButton";

export function WelcomeSection() {
  const annotationsRef = useRoughAnnotations();
  const wavingHandRef = useWavingHand();
  const rhodriRef = useArrowAnimation<HTMLSpanElement>("rhodri");
  const ctaLaunch = useRocketLaunch("/auth/signup");

  return (
    <section className={styles.welcome} ref={annotationsRef}>
      <div className={shared["md-container"]}>
        <div className="flex flex-col items-center gap-40">
          <div className="flex flex-col items-stretch">
            <h2 className="mb-12">
              <span className="font-semibold intro-aspiring-coder rough-highlight">Coding has changed.</span> The way
              you learn needs to change too.
            </h2>
            <p>
              In 2026, anyone can open Cursor and create a fully-functional product in minutes. Maybe you&apos;ve done
              it yourself! Something that would have taken you <strong>years to learn</strong> to make in the past is
              now available in seconds. So what does it mean to be a developer now? What does it mean to have a{" "}
              <strong>career in tech</strong>?
            </p>
            <p>
              Here&apos;s a secret no-one tells you.{" "}
              <span className="rough-highlight">
                <strong>Software engineering has never been about writing code.</strong>
              </span>{" "}
              Coding is how you communicate with the computer, but the real skill has always been in{" "}
              <strong>critical-thinking</strong>, in <strong>problem solving</strong>, in{" "}
              <strong>building and architecting</strong>. It&apos;s always been about taking ideas and{" "}
              <strong>turning them into reality</strong>.
            </p>
            <p>
              Thanks to LLMs{" "}
              <span className="rough-highlight">
                <strong>you don&apos;t have to spend years mastering coding</strong>
              </span>{" "}
              in order to be useful. But you still have a lot to learn! You still need to learn{" "}
              <strong>coding fundamentals</strong>. You need to learn{" "}
              <strong className="rough-highlight">how everything works</strong>. You need to learn{" "}
              <strong className="rough-highlight">how to build</strong>. But the journey is{" "}
              <strong>much more fun</strong> than it&apos;s ever been before. And I&apos;m here{" "}
              <strong className="font-medium">
                <span className="intro-you">to be your guide on that journey!</span>
              </strong>
            </p>
            <div className="flex flex-col items-center mt-8 mb-12 mr-80 scale-x-[-1]">
              <ArrowIcon className={styles["bootcamp-arrow-1"]} width={80} height={168} />
            </div>
          </div>
        </div>

        <h3>
          Hi there!{" "}
          <span className={styles["waving-hand"]} ref={wavingHandRef}>
            👋
          </span>{" "}
          I&apos;m Jeremy, and I&apos;ve helped over <div className="inline rough-highlight">two million people</div>{" "}
          level up their coding skills.
        </h3>
        <p>
          For 20 years, I&apos;ve been telling people that want to get into tech to get really good at writing code, and
          then start to work out how to make real apps. But now, thanks to LLMs -{" "}
          <strong>that advice is upside down</strong>.
        </p>
        <p>
          If you&apos;re starting out today then most of your work is going to be{" "}
          <strong>reading code, not writing it.</strong> And that means something that&apos;s a little sad for me to
          admit...
        </p>
        <h3>
          <strong>Getting good</strong> at writing code is{" "}
          <span className="inline rough-highlight">becoming irrelevant</span> 😢
        </h3>
        <p>
          You are never going to be better than an LLM at writing code. I have been coding for 34 years and LLMs are at
          my level. <strong>You won&apos;t catch up.</strong>
        </p>
        <p>
          BUT, and this is the big but, <strong>you don&apos;t need to!</strong> I almost never write code now. I let
          the LLMs do it for me, and you can too. Instead we get to{" "}
          <strong className="inline rough-highlight">do more of the actual interesting stuff</strong>. And that&apos;s
          what I&apos;m going to teach you in this course!
        </p>
        <p>
          I think it&apos;s <strong>incredibly exciting for you</strong> to be starting out today. You don&apos;t need
          to spend 10 years mastering a skill to be useful.{" "}
          <strong>You can start doing real things straight away!</strong>
        </p>
        <h3>
          <span className="inline rough-highlight">You learn by making stuff!</span>
        </h3>
        <p>
          I started coding when I was 8. Back then, YouTube didn&apos;t exist. There weren&apos;t any &quot;learn to
          code&quot; websites. I didn&apos;t even have the internet. There was basically only one way to learn.{" "}
          <strong>Make stuff. Lots of stuff!</strong>
        </p>
        <div className="sm:float-right mt-20 sm:ml-24 sm:mb-24 xl:mr-[-100px] mr-0">
          <div
            className="border-white border-[8px] rounded-[5px] lg:w-[300px] sm:w-[220px] w-full"
            style={{ boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)" }}
          >
            <Image
              className="w-[100%] border-[#aaa] border-[1px] rounded-[1px]"
              src={withRhodri}
              alt="Jeremy and Rhodri in 1998 making their first paid website"
              width={300}
              height={400}
            />
            <div className="text-14 text-center font-normal pt-8 px-8 leading-[140%]">
              <span className="lg:hidden inline">1998: Me making the first website I ever got paid for.</span>
              <span className="lg:inline hidden">
                1998: Me and Rhodri making the first website we ever got paid for.
              </span>
            </div>
          </div>
        </div>
        <p className="mt-16">
          And make stuff I did! I started making games and then graduated to making little bots to play against. And as
          I grew older I made websites for me and my friends, and{" "}
          <span className="sm:hidden inline">eventually for customers.</span>
          <span className="sm:inline hidden relative">
            <span className="rough-underline whitespace-nowrap" id="eventually-underline">
              eventually for customers.
            </span>
            <span className={styles["rhodri-arrow"]} ref={rhodriRef}></span>
          </span>
        </p>
        <p>I created, I played, I experimented. I had fun!</p>
        <p>
          And through this, I got really good. <strong>I learned the coder mindset,</strong> and I laid the foundations
          that I&apos;ve built my whole career on.
        </p>
        <h3>
          <span className="rough-highlight">The two parts</span> to learning programming today...
        </h3>
        <p>
          We&apos;ve made a different type of course. One that teaches you the fundamentals of programming differently,
          and gets you <strong>building fun things</strong> and solving interesting problems alongside me. It has two
          parts:
        </p>
        <ol className="my-12">
          <li>
            <strong>Learn coding fundamentals</strong>. We&apos;ll teach you the fundamentals of coding so you can
            understand what an LLM is building - as essential as ever.
          </li>
          <li>
            <strong>Learn how to build</strong>. Work alongside me as I make real projects with LLMs and show you
            everything you need to know to be a real developer. Join me for livestreams, ask questions, come and have
            fun making stuff!
          </li>
        </ol>
        <p>
          Within a few months, you&apos;ll go from zero to being able to build games like{" "}
          <strong>Space Invaders, Tic Tac Toe, and</strong> <strong>Breakout</strong> in code from scratch. And in
          parallel, you&apos;ll be learning how to make real-world projects, <strong>using databases</strong>, adding
          auth, using APIs, deploying websites... Doing all the real stuff that developers do!
        </p>
        <div className="grid grid-cols-4 gap-10 my-16">
          <video
            className="w-full border-2 border-bootcamp-purple rounded-[5px]"
            src="/static/images/landing-page/space-invaders.mp4"
            aria-label="Space Invaders game screenshot"
            width={400}
            height={300}
            autoPlay
            muted
            loop
            playsInline
          />
          <video
            className="w-full border-2 border-bootcamp-purple rounded-[5px]"
            src="/static/images/landing-page/tic-tac-toe.mp4"
            aria-label="Tic Tac Toe game screenshot"
            width={400}
            height={300}
            autoPlay
            muted
            loop
            playsInline
          />
          <video
            className="w-full border-2 border-bootcamp-purple rounded-[5px]"
            src="/static/images/landing-page/breakout.mp4"
            aria-label="Breakout game screenshot"
            width={400}
            height={300}
            autoPlay
            muted
            loop
            playsInline
          />
          <video
            className="w-full border-2 border-bootcamp-purple rounded-[5px]"
            src="/static/images/landing-page/maze.mp4"
            aria-label="Maze solving bot screenshot"
            width={400}
            height={300}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
        <h3 className="mt-32">Sound fun?</h3>
        <p>
          If all <strong className="rough-highlight">this sounds exciting</strong>, then I&apos;d love for you to join
          us! 💙
        </p>
        <p>
          The core &quot;learn to code&quot; curriculum is <strong>entirely free</strong> - over 200 hours of fun
          challenges to hone your skills. And the rest, where you get to follow me as I teach you how to build things,
          costs only{" "}
          <strong>
            <MonthlyPrice />
            /month
          </strong>{" "}
          (as cheap as we can make it and still pay the bills!)
        </p>
        <p>
          Want more details? Or to hear from others that I&apos;ve taught? Read on below for even more details or{" "}
          <Link href="/auth/signup" className="underline font-semibold text-blue-800">
            just sign up!
          </Link>
        </p>
        <div className={styles.ctaRow}>
          <span className={`${styles.ctaPointer} ${styles.ctaPointerRight}`} aria-hidden="true">
            👉
          </span>
          <Link
            href="/auth/signup"
            className={`ui-btn ui-btn-xlarge ui-btn-primary ${rocket.bounceOnHover}`}
            onClick={ctaLaunch.handleClick}
          >
            Enough with all the talking! Let&apos;s do this!{" "}
            <span
              className={`inline-block align-middle ${rocket.rocketWrapper} ${rocket.rocketWrapperLg} ${ctaLaunch.launching ? rocket.launching : ""}`}
            >
              <RocketIcon width={32} height={32} className={rocket.rocket} />
            </span>
          </Link>
          <span className={`${styles.ctaPointer} ${styles.ctaPointerLeft}`} aria-hidden="true">
            👈
          </span>
        </div>
        <div className={styles.ctaRowCompact}>
          <SignupButton />
        </div>
        {/* <h3>
          <span className="rough-highlight">Focusing on what matters.</span>
        </h3>
        <p>
          We&apos;ve worked really hard to build a course that focusses on the <strong>important stuff.</strong>{" "}
          We&apos;ve written our own programming language that gets out of your way and lets you focus on the actual
          coding.
        </p>
        <p>
          We&apos;ve made a <strong>kickass interface</strong> that&apos;s really fun and easy to use, but gets you
          coding fast. Everything is focused on giving you rock solid foundations, that will{" "}
          <strong className="rough-highlight">make it easy to learn any languages</strong> or technologies you want.
        </p>
        <div className="mt-20 mb-20">
          <div
            className="border-bootcamp-purple border-[8px] rounded-[5px] w-full"
            style={{ boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)" }}
          >
            <Image
              className="w-[100%] border-[#aaa] border-[1px] rounded-[1px]"
              src="/static/images/landing-page/editor.webp"
              alt="The Jiki coding interface"
              width={760}
              height={475}
            />
            <div className="text-17 text-center font-medium pt-16 pb-6 px-8 bg-bootcamp-purple text-white leading-[140%]">
              <span>Our specially designed interface that makes getting started easy!</span>
            </div>
          </div>
        </div>
        <h3 className="mt-32">
          <span className="rough-highlight">Taught in a way that makes sense</span>
        </h3>
        <p>
          I&apos;ll teach you coding concepts using analogy and imagery, that will mean your{" "}
          <strong>brain actually absorbs</strong> the information and understands what&apos;s going on.
        </p>
        <div className="sm:float-right sm:ml-24 sm:mb-24 xl:mr-[-100px] mr-0">
          <div
            className="border-white border-[8px] rounded-[5px] lg:w-[300px] sm:w-[220px] w-full"
            style={{ boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)" }}
          >
            <Image
              className="w-[100%] border-[#aaa] border-[1px] rounded-[1px]"
              src="/static/images/landing-page/jiki-slide.webp"
              alt="A slide explaining how Jiki runs your code"
              width={300}
              height={225}
            />
            <div className="text-14 text-center font-normal pt-8 px-8 leading-[140%]">
              <span>This is</span> <strong>Jiki.</strong> We learn in detail how he runs the code you write!
            </div>
          </div>
        </div>
        <p className="mt-20">
          There are no abstract concepts in this course. There&apos;s no hand-waving. If something is complex, I take my
          time breaking it down{" "}
          <span className="rough-underline whitespace-nowrap" id="jiki-underline">
            until it&apos;s clear.
          </span>
          <span className="sm:inline hidden relative">
            <span className={styles["jiki-arrow"]} ref={jikiRef}></span>
          </span>
        </p>
        <p>
          We&apos;ve put together over <strong>40 hours of live teaching</strong> for you to watch, where you can see me
          explaining the concepts of programming and answering questions from a real beginner audience.
        </p>
        <p>
          We have a great community of alumni and mentors who are there to help you when you get stuck. And I&apos;ll be
          there too, making sure you get the most out of the course!
        </p>
        <p>
          We&apos;ve designed the course for <strong>total beginners</strong> and it&apos;s entirely focused on{" "}
          <strong>learning by doing.</strong> You&apos;ll be coding from day one, and{" "}
          <strong className="font-semibold rough-highlight">you&apos;ll be coding a lot.</strong>
        </p>
        <p>
          It&apos;s also perfect if you&apos;ve <strong>been coding for a while</strong> but you don&apos;t feel like
          you&apos;ve got a solid grasp on everything yet. About 50% of our students are in that category and love the
          course.
        </p>
        <p>
          If that sounds exciting, then <strong>I&apos;d love for you to join us! 💙</strong>
        </p> */}
      </div>
    </section>
  );
}
