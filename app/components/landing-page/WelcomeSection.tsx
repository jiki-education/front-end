"use client";

import Image from "next/image";
import styles from "./WelcomeSection.module.css";
import shared from "./shared.module.css";
import { useRoughAnnotations } from "./hooks/useRoughAnnotations";
import { useWavingHand } from "./hooks/useWavingHand";
import { useArrowAnimation } from "./hooks/useArrowAnimations";

export function WelcomeSection() {
  const annotationsRef = useRoughAnnotations();
  const wavingHandRef = useWavingHand();
  const rhodriRef = useArrowAnimation<HTMLSpanElement>("rhodri");
  const jikiRef = useArrowAnimation<HTMLSpanElement>("jiki");

  return (
    <section className={styles.welcome} ref={annotationsRef}>
      <div className={shared["md-container"]}>
        <div className="flex flex-col items-center gap-40">
          <div className="flex flex-col items-stretch">
            <h2 className="mb-12">
              Don&apos;t know where to start? Stuck in{" "}
              <span className="font-semibold intro-aspiring-coder rough-highlight">tutorial hell?</span>
            </h2>
            <p>
              <strong>You&apos;re not alone!</strong> If you&apos;ve tried learning from other websites or videos and
              found it&apos;s not sticking, or you just feel utterly overwhelmed knowing where to start, then
              you&apos;re not alone!
            </p>
            <p>
              The majority of courses out there <strong>suck.</strong> They promise you the world then massively
              underdeliver. They&apos;re <strong className="rough-highlight">boring, confusing,</strong> and they leave
              you feeling like <strong>you&apos;re not cut out for this.</strong>
            </p>
            <p>
              We made this course to fix that. If you&apos;re looking for something{" "}
              <strong className="font-regular intro-fun-and-creative rough-highlight">fun and creative</strong> where
              you learn by actually making things, with support when you need it, then this might just be{" "}
              <strong className="font-medium">
                <span className="intro-you">the course for you!</span>
              </strong>
            </p>
            <div className="flex flex-col items-center mt-8 mb-12 mr-80 scale-x-[-1]">
              <Image className={styles["bootcamp-arrow-1"]} src="/static/images/landing-page/arrow-1.svg" alt="" width={80} height={168} />
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
        <p>But over the last few years, I&apos;ve seen a really worrying trend...</p>
        <p>
          More and more people are trying to learn to code (🥳) but they seem to be{" "}
          <strong>struggling more than ever (😢).</strong> And they&apos;re struggling with things that should be pretty
          straightforward once you&apos;ve been learning for a while.{" "}
          <strong>People just don&apos;t seem to be grasping the fundamentals.</strong>
        </p>
        <p>So I started reading around to see if I could work out what was going on, and found a crazy statistic.</p>
        <h3>
          <span className="inline rough-highlight">96% of people who try to learn to code give up</span> 🤯
        </h3>
        <p>How could it be that so many people were trying to learn to code, but so few were actually succeeding?</p>
        <p>I went investigating… 🕵️</p>
        <p>
          I watched the <strong>most popular YouTube videos (🥱),</strong> tried the &quot;best&quot;{" "}
          <strong>online courses (😐),</strong> and even paid my friends to try to learn so I could see what happened (a
          mix of 😭😠🤬🙅‍♀️).
        </p>
        <p>
          I dug into formal research, spoke to my friends in education, and pretty quickly came to a simple
          conclusion...
        </p>
        <h3>
          <span className="inline rough-highlight">
            The way people are being taught to code is causing them to fail!
          </span>
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
              src="/static/images/landing-page/with-rhodri.jpg"
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
        <p>
          <strong className="rough-highlight">But that&apos;s not how these modern courses teach.</strong> Giving you a
          space to practice and play and experiment is hard. It&apos;s much easier to just give you a video to watch, a
          quiz to take, and a certificate to print out.
        </p>
        <p>
          But you won&apos;t learn that way. You&apos;ll be <strong>bored, frustrated,</strong> and like most other
          people, you&apos;ll <strong>probably quit 😞😡</strong>
        </p>
        <h3>
          <span className="rough-highlight">If you want to get good, master the basics</span>
        </h3>
        <p>
          The best coders <strong>are not</strong> the ones who know the most.
        </p>
        <p>
          The best coders are the ones who have{" "}
          <strong className="rough-highlight">gained a total mastery of the basics.</strong> Once you&apos;ve got the
          basics down, everything will become easy. You can go and learn whatever you want or need.
        </p>
        <p>And the way to master the basics? Practice, practice, practice.</p>
        <p>Take on different challenges. Solve different problems. And have fun learning your craft!</p>
        <h3>
          <span className="rough-highlight">Which is why we made this...</span>
        </h3>
        <p>
          We&apos;ve made a different type of course. One that teaches you the fundamentals of coding differently.
          It&apos;s focused on getting you <strong>building fun things,</strong> on solving interesting problems, on
          learning the coding mindset that will actually get you good at this.
        </p>
        <p>
          Within 12 weeks, you&apos;ll go from zero to building games like{" "}
          <strong>Space Invaders, Tic Tac Toe, and</strong> <strong>Breakout.</strong> You&apos;ll be building bots that
          can solve mazes, and talking to real APIs like <strong>ChatGPT</strong> to build useful real-world projects.
        </p>
        <div className="grid grid-cols-4 gap-10 my-16">
          <Image
            className="w-full border-2 border-bootcamp-purple rounded-[5px]"
            src="/static/images/landing-page/space-invaders.gif"
            alt="Space Invaders game screenshot"
            width={400}
            height={300}
            unoptimized
          />
          <Image
            className="w-full border-2 border-bootcamp-purple rounded-[5px]"
            src="/static/images/landing-page/tic-tac-toe.gif"
            alt="Tic Tac Toe game screenshot"
            width={400}
            height={300}
            unoptimized
          />
          <Image
            className="w-full border-2 border-bootcamp-purple rounded-[5px]"
            src="/static/images/landing-page/breakout.gif"
            alt="Breakout game screenshot"
            width={400}
            height={300}
            unoptimized
          />
          <Image
            className="w-full border-2 border-bootcamp-purple rounded-[5px]"
            src="/static/images/landing-page/maze.gif"
            alt="Maze solving bot screenshot"
            width={400}
            height={300}
            unoptimized
          />
        </div>
        <p>☝️☝️☝️ You&apos;ll make all these in the first 12 weeks!</p>
        <h3>
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
              src="/static/images/landing-page/editor.png"
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
              src="/static/images/landing-page/jiki-slide.png"
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
        </p>
      </div>
    </section>
  );
}
