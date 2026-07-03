"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
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
  const t = useTranslations("landing.welcome");
  const routes = useLocaleRoutes();
  const annotationsRef = useRoughAnnotations();
  const wavingHandRef = useWavingHand();
  const rhodriRef = useArrowAnimation<HTMLSpanElement>("rhodri");
  const ctaLaunch = useRocketLaunch(routes.authSignup());

  // Rich-text tag renderers preserving the prose's inline markup.
  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;
  const highlight = (chunks: React.ReactNode) => <span className="rough-highlight">{chunks}</span>;
  const strongHighlight = (chunks: React.ReactNode) => <strong className="rough-highlight">{chunks}</strong>;
  const you = (chunks: React.ReactNode) => <span className="intro-you">{chunks}</span>;

  return (
    <section className={styles.welcome} ref={annotationsRef}>
      <div className={shared["md-container"]}>
        <div className="flex flex-col items-center gap-40">
          <div className="flex flex-col items-stretch">
            <h2 className="mb-12">
              <span className="font-semibold intro-aspiring-coder rough-highlight">{t("headingHighlight")}</span>
              {t("headingRest")}
            </h2>
            <p>{t.rich("para1", { strong })}</p>
            <p>{t.rich("para2", { strong, highlight })}</p>
            <p>
              {t.rich("para3", {
                strong,
                highlight,
                strongHighlight,
                you
              })}
            </p>
            <div className="flex flex-col items-center mt-8 mb-12 mr-80 scale-x-[-1]">
              <ArrowIcon className={styles["bootcamp-arrow-1"]} width={80} height={168} />
            </div>
          </div>
        </div>

        <h3>
          {t.rich("hiThere", {
            wave: (chunks) => (
              <span className={styles["waving-hand"]} ref={wavingHandRef}>
                {chunks}
              </span>
            ),
            highlight: (chunks) => <div className="inline rough-highlight">{chunks}</div>
          })}
        </h3>
        <p>{t.rich("para4", { strong })}</p>
        <p>{t.rich("para5", { strong })}</p>
        <h3>
          {t.rich("heading2", {
            strong,
            highlight: (chunks) => <span className="inline rough-highlight">{chunks}</span>
          })}
        </h3>
        <p>{t.rich("para6", { strong })}</p>
        <p>
          {t.rich("para7", {
            strong,
            strongHighlight: (chunks) => <strong className="inline rough-highlight">{chunks}</strong>
          })}
        </p>
        <p>{t.rich("para8", { strong })}</p>
        <h3>
          {t.rich("heading3", { highlight: (chunks) => <span className="inline rough-highlight">{chunks}</span> })}
        </h3>
        <p>{t.rich("para9", { strong })}</p>
        <div className="sm:float-right mt-20 sm:ml-24 sm:mb-24 xl:mr-[-100px] mr-0">
          <div
            className="border-white border-[8px] rounded-[5px] lg:w-[300px] sm:w-[220px] w-full"
            style={{ boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)" }}
          >
            <Image
              className="w-[100%] border-[#aaa] border-[1px] rounded-[1px]"
              src={withRhodri}
              alt={t("rhodriAlt")}
              width={300}
              height={400}
            />
            <div className="text-14 text-center font-normal pt-8 px-8 leading-[140%]">
              <span className="lg:hidden inline">{t("captionShort")}</span>
              <span className="lg:inline hidden">{t("captionLong")}</span>
            </div>
          </div>
        </div>
        <p className="mt-16">
          {t("para10Prefix")}
          <span className="sm:hidden inline">{t("para10Eventually")}</span>
          <span className="sm:inline hidden relative">
            <span className="rough-underline whitespace-nowrap" id="eventually-underline">
              {t("para10Eventually")}
            </span>
            <span className={styles["rhodri-arrow"]} ref={rhodriRef}></span>
          </span>
        </p>
        <p>{t("para11")}</p>
        <p>{t.rich("para12", { strong })}</p>
        <h3>{t.rich("heading4", { highlight })}</h3>
        <p>{t.rich("para13", { strong })}</p>
        <ol className="my-12">
          <li>{t.rich("listItem1", { strong })}</li>
          <li>{t.rich("listItem2", { strong })}</li>
        </ol>
        <p>{t.rich("para14", { strong })}</p>
        <div className="grid grid-cols-4 gap-10 my-16">
          <video
            className="w-full border-2 border-bootcamp-purple rounded-[5px]"
            src="/static/images/landing-page/space-invaders.mp4"
            aria-label={t("spaceInvadersLabel")}
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
            aria-label={t("ticTacToeLabel")}
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
            aria-label={t("breakoutLabel")}
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
            aria-label={t("mazeLabel")}
            width={400}
            height={300}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
        <h3 className="mt-32">{t("heading5")}</h3>
        <p>{t.rich("para15", { highlight: strongHighlight })}</p>
        <p>
          {t.rich("para16Prefix", { strong })}
          <strong>
            <MonthlyPrice />
            {t("para16PerMonth")}
          </strong>
          {t("para16Suffix")}
        </p>
        <p>
          {t("para17Prefix")}
          <Link href={routes.authSignup()} className="underline font-semibold text-blue-800">
            {t("para17Link")}
          </Link>
        </p>
        <div className={styles.ctaRow}>
          <span className={`${styles.ctaPointer} ${styles.ctaPointerRight}`} aria-hidden="true">
            👉
          </span>
          <Link
            href={routes.authSignup()}
            className={`ui-btn ui-btn-xlarge ui-btn-primary ${rocket.bounceOnHover}`}
            onClick={ctaLaunch.handleClick}
          >
            {t("ctaButton")}
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
