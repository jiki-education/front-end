"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import BuildIcon from "./icons/build.svg";
import CalendarIcon from "./icons/calendar.svg";
import CodersMindIcon from "./icons/coders-mind.svg";
import ConfidenceIcon from "./icons/confidence.svg";
import UnderstandingIcon from "./icons/understanding.svg";
import certificate from "./assets/certificate.webp";
import certificateArrow from "./assets/certificate-arrow.webp";
import jeremyLivestream from "./assets/jeremy-livestream.webp";
import linkedin from "./assets/linkedin.webp";
import part1 from "./assets/part-1.webp";
import penguin from "./assets/penguin.webp";
import wordle from "./assets/wordle.webp";
import styles from "./BootcampSection.module.css";
import shared from "./shared.module.css";
import { useArrowAnimation } from "./hooks/useArrowAnimations";
import { useConfetti } from "./hooks/useConfetti";

export function BootcampSection() {
  const t = useTranslations("landing.bootcamp");
  const routes = useLocaleRoutes();
  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;
  const highlight = (chunks: React.ReactNode) => <span className="rough-highlight font-medium">{chunks}</span>;
  const portfolioArrowRef = useArrowAnimation<HTMLDivElement>("portfolio-arrow");
  const buildingSectionArrowRef = useArrowAnimation<HTMLDivElement>("building-section-arrow");
  const certificateArrowRef = useArrowAnimation<HTMLDivElement>("certificate-arrow");
  const confettiRef = useConfetti();

  return (
    <section className={styles.bootcamp} data-bootcamp-section>
      <div className={shared["lg-container"]}>
        <div className={`${styles.container} ${styles.syllabus}`}>
          <div className={styles.tag}>{t("tagWhatWeCover")}</div>
          <h2>{t.rich("menuHeading", { strong })}</h2>
          <p className={`${styles.intro} mb-24 text-balance max-w-[820px]`}>{t.rich("menuIntro", { strong })}</p>
          <div className={styles.sections}>
            <div className={styles.section}>
              <div className="flex flex-row">
                <div className={styles.lhs}>
                  <h3 className="mb-8">
                    {t("part1Heading")}
                    <span className="ui-emoji">🧑‍🔬</span>
                    <div className={styles.bubble}>{t("part1Bubble")}</div>
                  </h3>
                  <div className={`${styles["part-intro"]} mb-20`}>{t.rich("part1Intro", { highlight })}</div>
                  <ul>
                    <li>
                      <UnderstandingIcon width={20} height={20} />
                      <div className={styles.text}>
                        {t.rich("part1Item1Prefix", { strong })}
                        <Link href={routes.concepts()} className="underline">
                          {t("part1Item1Link")}
                        </Link>
                        {t("part1Item1Suffix")}
                      </div>
                    </li>
                    <li>
                      <ConfidenceIcon width={20} height={20} />
                      <div className={styles.text}>{t.rich("part1Item2", { strong })}</div>
                    </li>
                    <li>
                      <CodersMindIcon width={20} height={20} />
                      <div className={styles.text}>{t.rich("part1Item3", { strong })}</div>
                    </li>
                    <li>
                      <BuildIcon width={20} height={20} />
                      <div className={styles.text}>{t.rich("part1Item4", { strong })}</div>
                    </li>
                  </ul>
                </div>
                <div className={styles.rhs}>
                  <div className={`${styles.dates} ${styles["h3-sideheading"]} relative`}>
                    <CalendarIcon width={20} height={20} />
                    {t("part1Duration")}
                  </div>
                  <Image
                    className="w-[350px] -mr-32 -mt-[60px]"
                    src={part1}
                    alt={t("part1Alt")}
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
            <h2 className="mr-auto">{t.rich("levelsHeading", { strong })}</h2>
            <div className={styles["h3-sideheading"]}>{t("levelsSideheading")}</div>
          </div>
          <p className="mb-8">{t("levelsIntro")}</p>
          <p className="mb-16">{t.rich("levelsSubIntro", { strong })}</p>
          <div className={styles.levels}>
            <div className={styles.level}>
              <Image src={penguin} alt={t("penguinAlt")} width={400} height={300} />
              <h4>{t.rich("level2", { strong })}</h4>
            </div>
            <div className={styles.level}>
              <video
                src="/static/images/landing-page/golf.mp4"
                aria-label={t("golfLabel")}
                width={400}
                height={300}
                autoPlay
                muted
                loop
                playsInline
              />
              <h4>{t.rich("level3", { strong })}</h4>
            </div>
            <div className={styles.level}>
              <video
                src="/static/images/landing-page/flower.mp4"
                aria-label={t("flowerLabel")}
                width={400}
                height={300}
                autoPlay
                muted
                loop
                playsInline
              />
              <h4>{t.rich("flowerLevel", { strong })}</h4>
            </div>
            <div className={styles.level}>
              <video
                src="/static/images/landing-page/space-invaders.mp4"
                aria-label={t("spaceInvadersLabel")}
                width={400}
                height={300}
                autoPlay
                muted
                loop
                playsInline
              />
              <h4>{t.rich("level7", { strong })}</h4>
            </div>
            <div className={styles.level}>
              <video
                src="/static/images/landing-page/wall.mp4"
                aria-label={t("wallLabel")}
                width={400}
                height={300}
                autoPlay
                muted
                loop
                playsInline
              />
              <h4>{t.rich("level10", { strong })}</h4>
            </div>
            <div className={styles.level}>
              <Image src={wordle} alt={t("wordleAlt")} width={400} height={300} />
              <h4>{t.rich("level12", { strong })}</h4>
            </div>
            <div className={styles.level}>
              <video
                src="/static/images/landing-page/tic-tac-toe.mp4"
                aria-label={t("ticTacToeLabel")}
                width={400}
                height={300}
                autoPlay
                muted
                loop
                playsInline
              />
              <h4>{t.rich("level14", { strong })}</h4>
            </div>
            <div className={styles.level}>
              <video
                src="/static/images/landing-page/maze.mp4"
                aria-label={t("mazeLabel")}
                autoPlay
                muted
                loop
                playsInline
              />
              <h4>{t.rich("level16", { strong })}</h4>
            </div>
            {/* Intentional empty cell — spacer to align the next tile in the grid */}
            <div className={styles.level}></div>
            <div className={styles.level}>
              <video
                src="/static/images/landing-page/dreaming-house.mp4"
                aria-label={t("dreamingHouseLabel")}
                autoPlay
                muted
                loop
                playsInline
              />
              <h4>{t.rich("level20", { strong })}</h4>
            </div>
            <div className={styles.level}>
              <video
                src="/static/images/landing-page/breakout.mp4"
                aria-label={t("breakoutLabel")}
                autoPlay
                muted
                loop
                playsInline
              />
              <h4>{t.rich("levelEnd", { strong })}</h4>
            </div>
          </div>
        </div>
      </div>
      <div className={shared["lg-container"]}>
        <div className={`${styles.container} ${styles.syllabus} ${styles["building-subsection"]} relative`}>
          <div className={styles["building-section-arrow"]} ref={buildingSectionArrowRef}></div>

          <div className={styles.tag}>{t("tagWhatWeCover")}</div>
          <h2 className="text-center">{t.rich("buildingHeading", { strong })}</h2>
          <p className={`${styles.intro} mb-24 text-balance max-w-[820px]`}>{t("buildingIntro")}</p>
          <div className={styles.sections}>
            <div className={styles.section}>
              <div className="flex flex-row">
                <div className={styles.lhs}>
                  <h3 className="mb-8">
                    {t("part2Heading")}
                    <div className={styles.bubble}>{t("part2Bubble")}</div>
                  </h3>
                  <div className={`${styles["part-intro"]} mb-20`}>{t.rich("part2Intro", { highlight })}</div>
                  <ul>
                    <li>
                      <UnderstandingIcon width={20} height={20} />
                      <div className={styles.text}>{t.rich("part2Item1", { strong })}</div>
                    </li>
                    <li>
                      <ConfidenceIcon width={20} height={20} />
                      <div className={styles.text}>{t.rich("part2Item2", { strong })}</div>
                    </li>
                    <li>
                      <CodersMindIcon width={20} height={20} />
                      <div className={styles.text}>{t.rich("part2Item3", { strong })}</div>
                    </li>
                  </ul>
                </div>
                <div className={styles.rhs}>
                  <div className={`${styles.dates} ${styles["h3-sideheading"]} relative`}>
                    <CalendarIcon width={20} height={20} />
                    {t("part2Duration")}
                  </div>
                  <Image
                    className="w-[350px] -mr-32 -mt-[46px]"
                    src={jeremyLivestream}
                    alt={t("jeremyLivestreamAlt")}
                    width={900}
                    height={851}
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
                <div className={styles.bubble}>{t("certificateBubble")}</div>
                <h3 className="mb-8">{t("certificateHeading")}</h3>
                <p className="text-16 mb-12">{t("certificatePara1")}</p>
                <p className="text-16">{t("certificatePara2")}</p>
              </div>
              <Image
                className="w-[100px] self-middle mt-[100px] mb-10 mr-40 my-10 lg:block hidden"
                src={certificateArrow}
                alt=""
              />
              <div className={`${styles.certificate} flex-shrink-0 mt-24 lg:mt-0`}>
                <Image
                  className="lg:w-[350px] rounded-[5px]"
                  style={{ boxShadow: "0 0 20px rgba(0,0,0,0.4)" }}
                  src={certificate}
                  alt={t("certificateAlt")}
                />
              </div>
            </div>
            <div className={styles.linkedin} ref={confettiRef}>
              <Image src={linkedin} alt={t("linkedinAlt")} />
              <span>{t("linkedinShare")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
