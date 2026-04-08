import styles from "./FAQs.module.css";

export function FAQs() {
  return (
    <section className={styles.faqs}>
      <div className={styles.background}></div>
      <div className={styles.container}>
        <h2>Frequently Asked Questions</h2>
        <p className={styles.intro}>
          These are the questions we get asked the most. Your question not answered here?{" "}
          <a href="mailto:bootcamp@exercism.org">Ping us an email!</a>
        </p>
        <div className={styles.faq}>
          <h4>How much will this cost? What&apos;s the price?</h4>
          <p>
            All of the videos and exercises on Jiki will be free. There will be Premium and Max options that adds
            features such as AI-help, an ad-free experience, exclusive live-streams and a extra projects.
          </p>
        </div>
        <div className={styles.faq}>
          <h4>How much time will I need to spend each week on the course?</h4>
          <p>
            You can spend as long or as little as you like. We&apos;ve designed the course so it can be completed in
            12-24 weeks by most people spending 5-10 hours per week. But it really comes down to how much time you can
            put in.
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
          <h4>When will Jiki launch?</h4>
          <p>
            Jiki is launching in April 2026. We&apos;ll be letting people in gradually throughout April and May as we
            add more languages.
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
        <div className={styles.faq}>
          <h4>How will I know when I can access Jiki?</h4>
          <p>We&apos;ll email you when it&apos;s your turn to access Jiki. Make sure to check your spam folder!</p>
        </div>
      </div>
    </section>
  );
}
