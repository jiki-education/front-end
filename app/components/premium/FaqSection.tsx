import styles from "./PremiumPage.module.css";
import { FAQ_ITEMS } from "./pricing.data";

export default function FaqSection() {
  return (
    <div className={styles["faq-section"]}>
      <div className={styles["faq-inner"]}>
        <h2 className={styles["faq-title"]}>Frequently asked questions</h2>
        <div className={styles["faq-list"]}>
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className={styles["faq-item"]}>
              <summary>{item.question}</summary>
              <div className={styles["faq-answer"]}>
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
