import { MonthlyPrice } from "./MonthlyPrice";
import styles from "./FAQs.module.css";

export function FAQs() {
  return (
    <section className={styles.faqs}>
      <div className={styles.background}></div>
      <div className={styles.container}>
        <h2>Frequently Asked Questions</h2>
        <p className={styles.intro}>
          These are the questions we get asked the most. Your question not answered here?{" "}
          <a href="mailto:hello@jiki.io">Ping us an email!</a>
        </p>
        <div className={styles.faq}>
          <h4>How much does it cost?</h4>
          <p>
            The <strong>Coding Fundamentals</strong> exercises &mdash; the core learn-to-code curriculum &mdash; are{" "}
            <strong>completely free</strong>. No card, no trial, no catch.
          </p>
          <p>
            <strong>Jiki Premium</strong> is{" "}
            <strong>
              <MonthlyPrice />
              /month
            </strong>{" "}
            (priced by country) and unlocks:
          </p>
          <ul>
            <li>
              Full access to <strong>Build with Jeremy</strong>
            </li>
            <li>
              Combine your skills in <strong>Jiki Projects</strong>
            </li>
            <li>
              Unlimited <strong>Ask Jiki</strong> AI support
            </li>
            <li>
              Regular <strong>Q&amp;A livestreams</strong> you can join
            </li>
            <li>
              Earn <strong>certificates</strong> for courses
            </li>
            <li>
              An <strong>ad-free</strong> learning experience
            </li>
            <li>
              <strong>Early access</strong> to new features
            </li>
          </ul>
        </div>
        <div className={styles.faq}>
          <h4>How much time will I need to spend each week on the course?</h4>
          <p>
            You can spend as long or as little as you like. Most people get through the{" "}
            <strong>Coding Fundamentals</strong> strand in 12&ndash;20 weeks at around 5&ndash;10 hours a week. The{" "}
            <strong>Build with Jeremy</strong> strand is ongoing &mdash; you can dip in and out as new episodes go up,
            and join livestreams when it suits you.
          </p>
        </div>
        <div className={styles.faq}>
          <h4>How hard is the course? How smart do I need to be?</h4>
          <p>
            The course is designed to be accessible to everyone, regardless of your background. We don&apos;t believe
            you need to be &quot;smart&quot; to learn to code. But you do need to put in the effort and be willing to be
            challenged.
          </p>
          <p>
            But if you put in the effort, ask for help when you get stuck, and embrace the challenge, you&apos;ll be
            amazed at how far you can go in a short time.
          </p>
        </div>
        <div className={styles.faq}>
          <h4>Is Jiki available now?</h4>
          <p>Yes &mdash; you can sign up and start the free Coding Fundamentals curriculum today.</p>
          <p>
            The first <strong>Build with Jeremy</strong> session will be in <strong>mid-June</strong>. You can sign up
            for a reminder once you&apos;re inside.
          </p>
        </div>
        <div className={styles.faq}>
          <h4>I already signed up to the Bootcamp - is this different?</h4>
          <p>
            Thanks for being part of the Bootcamp! Jiki is the next stage in the evolution of our Bootcamp. Most of the
            exercises you solved will appear in Jiki along with lots more. We&apos;ve also broken down the 3 hour videos
            into smaller, 5-10 minute chunks to make watching easier!
          </p>
          <p>
            As a member of the Bootcamp, you&apos;ll automatically get Jiki Premium for Life. This applies to both the
            initial Coding Fundamentals course and future courses.
          </p>
        </div>
      </div>
    </section>
  );
}
