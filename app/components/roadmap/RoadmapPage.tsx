"use client";

import HeaderLayout from "../layout/HeaderLayout";
import styles from "./RoadmapPage.module.css";
import {
  changelog,
  phases,
  type ChangelogEntry,
  type ItemStatus,
  type RoadmapItem,
  type RoadmapPhase
} from "./roadmap.data";

const statusLabels: Record<ItemStatus, string> = {
  shipped: "Shipped",
  "in-progress": "In progress",
  planned: "Planned"
};

export function RoadmapPage() {
  return (
    <HeaderLayout>
      <div className={styles["page-wrapper"]}>
        <header className={styles["page-header"]}>
          <h1 className={styles.heading}>Roadmap</h1>
          <p className={styles.subheading}>
            Where Jiki is heading. A quarter-by-quarter view of what we&apos;re shipping, what&apos;s next, and what
            we&apos;re still dreaming up.
          </p>
        </header>

        <div className={styles["main-content"]}>
          <ol className={styles.timeline}>
            {phases.map((phase) => (
              <PhaseBlock key={phase.label} phase={phase} />
            ))}
          </ol>

          <p className={styles.disclaimer}>
            This roadmap is a snapshot of our current plans. Priorities shift as we learn from our community, so dates
            and scope may change.
          </p>
        </div>
      </div>

      <div className={styles["changelog-wrapper"]}>
        <div className={styles["changelog-inner"]}>
          <section aria-labelledby="changelog-heading">
            <header className={styles["changelog-header"]}>
              <h2 id="changelog-heading" className={styles["changelog-title"]}>
                Changelog
              </h2>
              <p className={styles["changelog-subtitle"]}>Recent improvements we&apos;ve shipped to Jiki.</p>
            </header>
            <ul className={styles["changelog-list"]}>
              {changelog.map((entry, i) => (
                <ChangelogRow key={i} entry={entry} />
              ))}
            </ul>
          </section>
        </div>
      </div>
    </HeaderLayout>
  );
}

function ChangelogRow({ entry }: { entry: ChangelogEntry }) {
  return (
    <li className={styles["changelog-item"]}>
      <span className={styles["changelog-date"]}>{entry.date}</span>
      <div className={styles["changelog-body"]}>
        <h3 className={styles["changelog-item-title"]}>{entry.title}</h3>
        <p className={styles["changelog-desc"]}>{entry.description}</p>
      </div>
    </li>
  );
}

function PhaseBlock({ phase }: { phase: RoadmapPhase }) {
  return (
    <li className={styles.phase}>
      <div className={styles["phase-band"]}>
        <span className={styles["phase-label"]}>{phase.label}</span>
        <span className={styles["phase-timeframe"]}>{phase.timeframe}</span>
      </div>
      {phase.summary && <p className={styles["phase-summary"]}>{phase.summary}</p>}
      <ul className={styles["item-list"]}>
        {phase.items.map((item) => (
          <ItemCard key={item.title} item={item} />
        ))}
      </ul>
    </li>
  );
}

function ItemCard({ item }: { item: RoadmapItem }) {
  return (
    <li className={styles.item}>
      <span className={styles.dot} data-status={item.status} aria-hidden="true" />
      <div className={styles["item-body"]}>
        <div className={styles["item-head"]}>
          <h3 className={styles["item-title"]}>{item.title}</h3>
          <span className={styles.badge} data-status={item.status}>
            {statusLabels[item.status]}
          </span>
        </div>
        <p className={styles["item-desc"]} dangerouslySetInnerHTML={{ __html: item.description }} />
      </div>
    </li>
  );
}
