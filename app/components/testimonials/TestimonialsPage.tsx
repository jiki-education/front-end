/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */

import shared from "../landing-page/shared.module.css";
import HeaderLayout from "../layout/HeaderLayout";
import styles from "./TestimonialsPage.module.css";
import testimonials from "./testimonials.json";

interface Testimonial {
  text: string;
  name: string;
  role: string;
  image: string;
}

export function TestimonialsPage() {
  return (
    <HeaderLayout>
      <section className={styles.page}>
        <div className={shared["lg-container"]}>
          <header className={styles.header}>
            <h1>Testimonials</h1>
            <p className={styles.subtitle}>
              We asked our students if they&apos;d enjoyed the course. Here&apos;s what they said...
            </p>
          </header>
          <div className={styles.quotes}>
            {(testimonials as Testimonial[]).map((t, i) => (
              <Quote key={i} testimonial={t} />
            ))}
          </div>
        </div>
      </section>
    </HeaderLayout>
  );
}

function Quote({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className={styles.quote}>
      <div className={styles.words}>
        <img className={`${styles.mark} ${styles["left-mark"]}`} src="/static/images/landing-page/quote.webp" />
        <span>
          {renderParagraphs(testimonial.text)}
          <img className={`${styles.mark} ${styles["right-mark"]}`} src="/static/images/landing-page/quote.webp" />
        </span>
      </div>
      <div className={styles.person}>
        <div className={styles.stars}></div>
        <div className="flex flex-row items-center justify-end gap-8">
          <div className={styles.text}>
            <div className={styles.name}>{testimonial.name}</div>
            <div className={styles.description}>{testimonial.role}</div>
          </div>
          <img src={`/static/images/landing-page/testimonials/${testimonial.image}`} />
        </div>
      </div>
    </div>
  );
}

function renderParagraphs(text: string) {
  return text.split("\n\n").map((para, i) => <p key={i}>{renderBold(para)}</p>);
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}
