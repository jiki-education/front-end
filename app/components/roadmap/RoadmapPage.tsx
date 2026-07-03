import { useTranslations } from "next-intl";
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

const statusLabelKeys: Record<ItemStatus, string> = {
  shipped: "shipped",
  "in-progress": "inProgress",
  planned: "planned"
};

export function RoadmapPage() {
  const t = useTranslations("roadmap.page");
  return (
    <HeaderLayout>
      <div className={styles["page-wrapper"]}>
        <header className={styles["page-header"]}>
          <h1 className={styles.heading}>{t("heading")}</h1>
          <p className={styles.subheading}>{t("subheading")}</p>
        </header>

        <div className={styles["main-content"]}>
          <ol className={styles.timeline}>
            {phases.map((phase) => (
              <PhaseBlock key={phase.labelKey} phase={phase} />
            ))}
          </ol>

          <p className={styles.disclaimer}>{t("disclaimer")}</p>
        </div>
      </div>

      <div className={styles["changelog-wrapper"]}>
        <div className={styles["changelog-inner"]}>
          <ChangelogSection />
        </div>
      </div>
    </HeaderLayout>
  );
}

function ChangelogSection() {
  const t = useTranslations("roadmap.changelog");
  return (
    <section aria-labelledby="changelog-heading">
      <header className={styles["changelog-header"]}>
        <h2 id="changelog-heading" className={styles["changelog-title"]}>
          {t("title")}
        </h2>
        <p className={styles["changelog-subtitle"]}>{t("subtitle")}</p>
      </header>
      <ul className={styles["changelog-list"]}>
        {changelog.map((entry, i) => (
          <ChangelogRow key={i} entry={entry} />
        ))}
      </ul>
    </section>
  );
}

function ChangelogRow({ entry }: { entry: ChangelogEntry }) {
  const t = useTranslations("roadmap.changelog");
  return (
    <li className={styles["changelog-item"]}>
      <span className={styles["changelog-date"]}>{t(entry.dateKey as Parameters<typeof t>[0])}</span>
      <div className={styles["changelog-body"]}>
        <h3 className={styles["changelog-item-title"]}>{t(entry.titleKey as Parameters<typeof t>[0])}</h3>
        <p className={styles["changelog-desc"]}>{t(entry.descriptionKey as Parameters<typeof t>[0])}</p>
      </div>
    </li>
  );
}

function PhaseBlock({ phase }: { phase: RoadmapPhase }) {
  const t = useTranslations("roadmap.phases");
  return (
    <li className={styles.phase}>
      <div className={styles["phase-band"]}>
        <span className={styles["phase-label"]}>{t(phase.labelKey as Parameters<typeof t>[0])}</span>
        <span className={styles["phase-timeframe"]}>{t(phase.timeframeKey as Parameters<typeof t>[0])}</span>
      </div>
      {phase.summaryKey && <p className={styles["phase-summary"]}>{t(phase.summaryKey as Parameters<typeof t>[0])}</p>}
      <ul className={styles["item-list"]}>
        {phase.items.map((item) => (
          <ItemCard key={item.titleKey} item={item} />
        ))}
      </ul>
    </li>
  );
}

function ItemCard({ item }: { item: RoadmapItem }) {
  const t = useTranslations("roadmap.phases");
  const tStatus = useTranslations("roadmap.status");
  return (
    <li className={styles.item}>
      <span className={styles.dot} data-status={item.status} aria-hidden="true" />
      <div className={styles["item-body"]}>
        <div className={styles["item-head"]}>
          <h3 className={styles["item-title"]}>{t(item.titleKey as Parameters<typeof t>[0])}</h3>
          <span className={styles.badge} data-status={item.status}>
            {tStatus(statusLabelKeys[item.status] as Parameters<typeof tStatus>[0])}
          </span>
        </div>
        <p
          className={styles["item-desc"]}
          dangerouslySetInnerHTML={{ __html: t(item.descriptionKey as Parameters<typeof t>[0]) }}
        />
      </div>
    </li>
  );
}
