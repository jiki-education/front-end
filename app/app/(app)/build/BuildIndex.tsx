import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import LearningComputerIcon from "@/icons/learning-computer.svg";
import { getAllBuildSeries } from "@/lib/content";
import type { BuildSeriesMeta } from "@/lib/content/types";
import styles from "./BuildIndex.module.css";
import { UpcomingStreams } from "./UpcomingStreams";

export function BuildIndex() {
  const series = getAllBuildSeries("en");

  return (
    <PageHeader
      icon={<LearningComputerIcon />}
      title="Learn to Build"
      description="Join Jeremy as he builds real projects, deep-dives into how things work, and live Q&A sessions."
    >
      <div className={styles.layout}>
        <div className={styles.main}>
          {series.map((s) => (
            <SeriesCard key={s.slug} series={s} />
          ))}
        </div>
        <UpcomingStreams series={series} />
      </div>
    </PageHeader>
  );
}

function SeriesCard({ series }: { series: BuildSeriesMeta }) {
  const isPending = series.status === "pending";
  const cardClassName = `${styles.card} ${isPending ? styles.cardPending : ""}`;

  const content = (
    <>
      <Image
        src={`/static/images/build/series/${series.image}`}
        alt=""
        width={240}
        height={135}
        className={styles.cardImage}
      />
      <div className={styles.cardBody}>
        <h2 className={styles.cardTitle}>{series.title}</h2>
        <p className={styles.cardDescription}>{series.description}</p>
        <div className={styles.pillRow}>
          {series.audience && <span className={`${styles.pill} ${styles.pillAudience}`}>{series.audience}</span>}
          {series.cadence && <span className={`${styles.pill} ${styles.pillCadence}`}>{series.cadence}</span>}
        </div>
      </div>
      {isPending && (
        <div className={styles.comingSoonRibbon} aria-label="Coming soon">
          <span>Coming Soon</span>
        </div>
      )}
    </>
  );

  if (isPending) {
    return <div className={cardClassName}>{content}</div>;
  }

  return (
    <Link href={`/build/${series.slug}`} className={cardClassName}>
      {content}
    </Link>
  );
}
