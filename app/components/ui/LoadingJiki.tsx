import Image from "next/image";
import AnimatedDots from "./AnimatedDots";
import styles from "./LoadingJiki.module.css";

interface LoadingJikiProps {
  delayed?: boolean;
}

export default function LoadingJiki({ delayed = false }: LoadingJikiProps) {
  return (
    <div className={`${styles.container} ${delayed ? styles.delayed : ""}`}>
      <div className={styles.imageWrapper}>
        <Image
          src="/static/images/graphics/jiki-wakeup.png"
          alt="Jiki character waking up"
          width={560}
          height={560}
          priority
        />
      </div>

      <div className={styles.text}>
        <h1 className={styles.title}>
          Waking up Jiki
          <AnimatedDots />
        </h1>
        <p className={styles.subtitle}>Preparing your learning experience</p>
      </div>
    </div>
  );
}
