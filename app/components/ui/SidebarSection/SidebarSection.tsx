import type { ReactNode } from "react";
import styles from "./SidebarSection.module.css";

interface SidebarSectionProps {
  heading: string;
  description?: string;
  children: ReactNode;
}

/**
 * The heading-and-blurb chrome shared by the blocks in a right-hand sidebar
 * (Related Concepts, Related Exercises, Share this).
 *
 * Kept separate from the blocks themselves so a block doesn't carry a heading
 * style of its own: the same block appears in sidebars styled slightly
 * differently, and one that brought its own type scale would be right in one of
 * them and subtly wrong in the rest.
 */
export function SidebarSection({ heading, description, children }: SidebarSectionProps) {
  return (
    <div className={styles.section}>
      <h3 className={description ? `${styles.heading} ${styles.withDescription}` : styles.heading}>{heading}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </div>
  );
}
