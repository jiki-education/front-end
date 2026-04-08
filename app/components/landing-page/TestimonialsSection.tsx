import styles from "./TestimonialsSection.module.css";
import shared from "./shared.module.css";

export function TestimonialsSection() {
  return (
    <section className={styles["testimonial-section"]}>
      <div className={shared["lg-container"]}>
        <h2>What do our students think?</h2>
        <p className={styles.subheading}>
          These are some extracts from what our beta users said.{" "}
          <a className="underline font-semibold" href="/courses/testimonials">
            Read the full versions here!
          </a>
        </p>
        <div className={styles["primary-quote"]}>
          <div className={styles.words}>
            <img className={`${styles.mark} ${styles["left-mark"]}`} src="/static/images/landing-page/quote.png" />
            <span>
              Seeing how much effort, thought, and even love is put into this course, it&apos;s such a pleasure to be a
              student here. Every explanation, each exercise turn this course into a masterpiece. I really enjoy it.
              <img className={`${styles.mark} ${styles["right-mark"]}`} src="/static/images/landing-page/quote.png" />
            </span>
          </div>
          <div className={styles.person}>
            <div className={styles.text}>
              <div className={styles.name}>Oleksandra</div>
              <div className={styles.description}>Coding Newbie</div>
            </div>
            <img src="/static/images/landing-page/testimonials/oleksandra.jpg" />
          </div>
        </div>
        <div className={styles.quotes}>
          <Quote
            text={
              <p>
                As someone with <strong>no previous coding experience</strong> - I&apos;ve been blown away with the{" "}
                <strong>quality of this course</strong>. I&apos;ve <strong>come so far</strong> in the past weeks and
                reflecting on what I&apos;ve achieved and{" "}
                <strong>how much I&apos;ve learned has been phenomenal</strong>. My journey has been from a complete
                coding novice, to someone who is <strong>confident and excited to tackle complex logic problems</strong>{" "}
                in code!
              </p>
            }
            name="Fred"
            description="Total Beginner"
            img="/static/images/landing-page/testimonials/fred.png"
          />
          <Quote
            text={
              <p>
                I was brand new to coding and this course <strong>exceeded my wildest expectations</strong> and then
                some. In my humble opinion, it will be <strong>one of the best choices you will ever make!</strong>
              </p>
            }
            name="Shaun"
            description="Absolute Beginner"
            img="/static/images/landing-page/testimonials/shaun.jpg"
          />
          <Quote
            text={
              <p>
                From the moment I bought the course, I realized it would{" "}
                <strong>be different from anything I had ever experienced</strong> in terms of classes and studying.
                Learning while actually coding <strong>has made it pretty fun</strong>. Getting help and encouraging
                messages from the community, sharing their experiences, and knowing that you&apos;re not alone made
                things much easier. It&apos;s <strong>such a pleasure</strong> to be part of it!
              </p>
            }
            name="Lucas"
            description="Total Beginner"
            img="/static/images/landing-page/testimonials/lukas.webp"
          />
          <Quote
            text={
              <p>
                Getting into <strong>programming always felt overwhelming</strong>. I often quit before I really got
                started. However, the course has provided an <strong>excellent, guided path to self-sufficiency</strong>
                , and I now feel capable of growing and learning more in the field.
              </p>
            }
            name="Nolan Lounsbery"
            description="Beginner"
            img="/static/images/landing-page/testimonials/giantlemur.jpg"
          />
          <Quote
            text={
              <p>
                This course has pushed me past what I thought were personal limitations, and in doing so, has{" "}
                <strong>increased my confidence and motivation</strong>. Know that when you get the certificate at the
                end of the course, it will be because you EARNED it!
              </p>
            }
            name="@RedRobio"
            description="Junior Developer"
            img="/static/images/landing-page/testimonials/redrobio.jpg"
          />
          <Quote
            text={
              <p>
                I joined the course with some Python knowledge, looking to learn front-end languages. I&apos;d been{" "}
                <strong>struggling with self-paced learning</strong>, so I signed up for the structure and
                accountability. The teaching style — <strong>full of effective analogies</strong> — really clicked with
                me. In just 10 weeks, I&apos;ve learned new material and{" "}
                <strong>gained clarity on topics I thought I already understood</strong>. Fantastic mentors, teaching,
                community, and global cohort. The course has exceeded my expectations—I&apos;d highly recommend it!
              </p>
            }
            name="Matt"
            description="Python Dev"
            img="/static/images/landing-page/testimonials/github.png"
          />
          <Quote
            text={
              <p>
                The course provided me an opportunity to <strong>learn from a bonafide master</strong>. The purchasing
                power parity discount made it even more affordable. <strong>Thank you for making it accessible</strong>.
              </p>
            }
            name="@abhinav"
            description="Beginner"
            img="/static/images/landing-page/testimonials/abhinav.png"
          />
          <Quote
            text={
              <p>
                I&apos;d recommend this to anyone trying to become a better programmer. I have done a fair bit of
                tutorial material online to learn programming but this course{" "}
                <strong>does the best job in teaching you the fundamentals</strong>. This course has{" "}
                <strong>given me confidence in writing code and made it fun! 😄</strong>.
              </p>
            }
            name="Laura"
            description="Was in Tutorial Hell"
            img="/static/images/landing-page/testimonials/laura.webp"
          />
          <Quote
            text={
              <p>
                Before I started this course I didn&apos;t think I could do the exercises we do now.{" "}
                <strong>I thought I am not smart enough</strong>, that &quot;this is not for me&quot; and I didn&apos;t
                expect anything which required so much effort to be here in the fundamentals of programming. But in the
                end, <strong>Jeremy shows it&apos;s yet another skill that can be learnt</strong>, even in such a{" "}
                <strong>short period of time.</strong>
              </p>
            }
            name="Oleksandra"
            description="Beginner"
            img="/static/images/landing-page/testimonials/github.png"
          />
          <Quote
            text={
              <p>
                I had doubts that I would understand this kind of material, and yet as I look back to where I started, I
                have a deep appreciation for the incredible skills and knowledge I am now nurturing and growing.{" "}
                <strong>
                  How I think about thinking, and about problem solving in general, has changed dramatically
                </strong>{" "}
                since undertaking this course. I can&apos;t wait to see what&apos;s next!
              </p>
            }
            name="@Kazzybits"
            description="Beginner"
            img="/static/images/landing-page/testimonials/kazzybits.webp"
          />
          <Quote
            text={
              <p>
                I joined this course with <strong>some coding experience</strong>, but the clarity and structure{" "}
                <strong>made everything click like never before</strong> and the lessons are perfectly paced, building
                concepts step-by-step in a way that <strong>feels natural and engaging</strong>. It&apos;s a
                transformative learning experience that <strong>leaves you feeling motivated and excited</strong> to
                keep pushing your coding skills to the next level.
              </p>
            }
            name="Vignesh"
            description="Intermediate Dev"
            img="/static/images/landing-page/testimonials/vignesh.webp"
          />
          <Quote
            text={
              <p>
                Honestly, I had no expectations when I stumbled upon Exercism, but it turned out to be{" "}
                <strong>my greatest discovery of the year!</strong> Given the cost, I didn&apos;t hesitate to join and
                give it a try. I had no experience whatsoever, and <strong>I&apos;m very impressed with myself</strong>{" "}
                looking at what I can do! 100% recommended!
              </p>
            }
            name="Rick"
            description="Beginner"
            img="/static/images/landing-page/testimonials/ricksn.jpg"
          />
          <Quote
            text={
              <p>
                The course has been <strong>a game-changer for me</strong>.The pace is perfect:{" "}
                <strong>challenging yet not impossible</strong>. The exercises are very nice, and it is{" "}
                <strong>incredibly satisfying</strong> to see that in just a few weeks one can pass from simply moving a
                blob in a maze to program one that solve EVERY maze.
              </p>
            }
            name="@m_artigiani"
            description=""
            img="/static/images/landing-page/testimonials/m_artigiani.webp"
          />
          <Quote
            text={
              <p>
                This course hasn&apos;t just taught basic structures and logic for programming, but{" "}
                <strong>it instills some basic tenets of the coder&apos;s mindset</strong> that will be invaluable on
                your journey (<strong>how to start from a blank screen</strong>, breaking big impossible challenges into
                the smallest solvable pieces, creating more efficient, readable, and maintainable code).
              </p>
            }
            name="Robert"
            description="Junior Developer"
            img="/static/images/landing-page/testimonials/rob.jpg"
          />
          <Quote
            text={
              <p>
                I have next to no coding experience yet have found this course to be{" "}
                <strong>so intelligently scaffolded</strong>, with{" "}
                <strong>concepts clearly explained and logically built one after the other</strong>, making the
                information accessible to learn.
              </p>
            }
            name="Karen"
            description="Beginner"
            img="/static/images/landing-page/testimonials/github.png"
          />
          <Quote
            text={
              <p>
                This course gives you the <strong>tools to think through the process</strong> before even writing a
                single line of code which makes the actual coding part easier. Having{" "}
                <strong>a good mental model</strong> helps with understanding what&apos;s &apos;under the hood&apos;
              </p>
            }
            name="@kcash"
            description="Intermediate Dev"
            img="/static/images/landing-page/testimonials/kcash.webp"
          />
          <Quote
            text={
              <p>
                The <strong>resources are fantastic</strong> but it is Jeremy&apos;s knack of breaking things down into{" "}
                <strong>the smallest possible steps</strong> that has really helped things click for me. I&apos;ve{" "}
                <strong>learned an unbelievable amount</strong> in a few short weeks and I&apos;m now{" "}
                <strong>solving problems with code that I would never have thought possible!</strong>
              </p>
            }
            name="Cpt Drac"
            description="Total Beginner"
            img="/static/images/landing-page/testimonials/drac.webp"
          />
          <Quote
            text={
              <p>
                Jeremy and the mentors have created an amazing <strong>resource like no other</strong> on the web. From
                the <strong>fun and sleek interface</strong>, to the live classes and labs or the discord discussions,
                it all comes together to make <strong>a superb learning experience</strong>.
              </p>
            }
            name="@JJ"
            description="Junior Developer"
            img="/static/images/landing-page/testimonials/jj.webp"
          />
          <Quote
            text={
              <p>
                Enrolling in this programming course was one of the <strong>best decisions I&apos;ve ever made</strong>.
                The curriculum is well-structured, covering foundational programming concepts. The team is{" "}
                <strong>supportive, and truly invested</strong> in helping students succeed.
              </p>
            }
            name="@nanouss01"
            description="Beginner"
            img="/static/images/landing-page/testimonials/nanouss01.webp"
          />
          <Quote
            text={
              <p>
                You will not believe <strong>how fantastic this course is</strong>! You learn to write code by writing
                code to solve problems that match--and push--your abilities.{" "}
                <strong>Jeremy is a master teacher.</strong> Exercism is the perfect environment.
              </p>
            }
            name="Thom Chittom"
            description="Beginner"
            img="/static/images/landing-page/testimonials/thom.webp"
          />
          <Quote
            text={
              <p>
                For nearly a decade, <strong>I&apos;ve repeatedly started online coding courses</strong>, but every time
                I run up against something that didn&apos;t make sense or a problem I just couldn&apos;t solve which
                stopped me in my tracks, meaning I have never completed a course, but now after years of trying,
                suddenly, <strong>coding feels possible.</strong>
              </p>
            }
            name="Chris"
            description="Serial beginner"
            img="/static/images/landing-page/testimonials/sharpiemath.png"
          />
        </div>
      </div>
    </section>
  );
}

function Quote({
  text,
  name,
  description,
  img
}: {
  text: React.ReactNode;
  name: string;
  description: string;
  img: string;
}) {
  return (
    <div className={styles.quote}>
      <div className={styles.words}>
        <img className={`${styles.mark} ${styles["left-mark"]}`} src="/static/images/landing-page/quote.png" />
        <span>
          {text}
          <img className={`${styles.mark} ${styles["right-mark"]}`} src="/static/images/landing-page/quote.png" />
        </span>
      </div>
      <div className={styles.person}>
        <div className={styles.stars}></div>
        <div className="flex flex-row items-center justify-end gap-8">
          <div className={styles.text}>
            <div className={styles.name}>{name}</div>
            <div className={styles.description}>{description}</div>
          </div>
          <img src={img} />
        </div>
      </div>
    </div>
  );
}
