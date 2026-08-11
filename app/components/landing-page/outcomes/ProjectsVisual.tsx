import Image from "next/image";
import { useTranslations } from "next-intl";
import dashboard from "../assets/project-screens/dashboard.webp";
import habitTracker from "../assets/project-screens/habit-tracker.webp";
import homepage from "../assets/project-screens/homepage.webp";
import recipeBox from "../assets/project-screens/recipe-box.webp";
import styles from "./ProjectsVisual.module.css";

// All four on show at once rather than cycling: the point of the outcome is that there
// are lots of them, which a set says faster than a carousel does.
const TILES = [
  { key: "habitTracker", src: habitTracker },
  { key: "homepage", src: homepage },
  { key: "recipeBox", src: recipeBox },
  { key: "dashboard", src: dashboard }
] as const;

export function ProjectsVisual() {
  const t = useTranslations("landing.outcomes");

  return (
    <ul className={styles.grid}>
      {TILES.map(({ key, src }) => (
        <li key={key} className={styles.tile}>
          <span className={styles.art}>
            <Image src={src} alt="" aria-hidden="true" sizes="180px" />
          </span>
          <span className={styles.cap}>{t(key)}</span>
        </li>
      ))}
    </ul>
  );
}
