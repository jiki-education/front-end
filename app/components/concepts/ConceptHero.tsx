import { marked } from "marked";
import styles from "./ConceptHero.module.css";

interface ConceptHeroProps {
  title: string;
  intro?: string;
}

export default function ConceptHero({ title, intro }: ConceptHeroProps) {
  const introHtml = intro ? marked.parseInline(intro) : null;

  return (
    <div className={styles.hero}>
      <h1 className={styles.title}>{title}</h1>

      {introHtml && <p className={styles.intro} dangerouslySetInnerHTML={{ __html: introHtml }} />}
    </div>
  );
}
