import styles from "./GuideHero.module.css";

interface GuideHeroProps {
  title: string;
  intro?: string;
}

export default function GuideHero({ title, intro }: GuideHeroProps) {
  return (
    <div className={styles.hero}>
      <h1 className={styles.title}>{title}</h1>
      {intro && <p className={styles.intro}>{intro}</p>}
    </div>
  );
}
