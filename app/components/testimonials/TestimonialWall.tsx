import type { Testimonial } from "@/lib/content/types";
import { avatars } from "./avatars";
import { StickyNote } from "./StickyNote";
import styles from "./TestimonialWall.module.css";

/**
 * The wall of pinned notes, shared by the landing section and the /testimonials
 * page so the two never drift apart. The surfaces differ in what sits above the
 * wall — a section heading on one, a page title on the other — not in the wall.
 */
export function TestimonialWall({ notes }: { notes: Testimonial[] }) {
  // Two explicit columns rather than CSS multi-column: multicol leaves each note's
  // absolutely-positioned tape behind when it reflows a note into the next column.
  const columns = [notes.filter((_, i) => i % 2 === 0), notes.filter((_, i) => i % 2 === 1)];

  return (
    <div className={styles.wall}>
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className={styles.column}>
          {column.map((note, i) => {
            // Position in the whole wall, not in this column, so the ring colours and
            // angles keep alternating across the two columns rather than repeating.
            const index = i * 2 + columnIndex;
            return (
              <StickyNote
                // The same person can appear twice (a long quote and a short one), so
                // the slug alone is not guaranteed unique within one wall.
                key={`${note.slug}-${index}`}
                text={note.text}
                name={note.name}
                role={note.role}
                avatar={avatars[note.image]}
                index={index}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
