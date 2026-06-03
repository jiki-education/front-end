import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import LearningComputerIcon from "@/icons/learning-computer.svg";
import { getAllBuildSeries } from "@/lib/content";
import type { BuildSeriesMeta } from "@/lib/content/types";
import styles from "./BuildIndex.module.css";
import { PlaceholderVideo } from "./PlaceholderVideo";
import { UpcomingStreams } from "./UpcomingStreams";


export function BuildIndex() {
  return (
    <PageHeader
      icon={<LearningComputerIcon />}
      title={title}
      description="Join Jeremy as he builds real projects, deep-dives into how things work, and live Q&A sessions."
    >
      <Content />
    </PageHeader>
  );
}

const title = (
  <>
    Learn to Build
    <span className={styles.titleBadge}>Launching July 11th</span>
  </>
);

function Content() {
  const series = getAllBuildSeries("en");
  return (
    <div className={styles.layout}>
      <div className={styles.main}>
      <PlaceholderVideo videoId="Qa0tAzbM3CE" />
        {/* {series.map((s) => (
          <SeriesCard key={s.slug} series={s} />
        ))} */}
      </div>
      <UpcomingStreams series={series} />
    </div>
  );
}

// Temporarily unused while the build index shows the placeholder video instead of series cards.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SeriesCard({ series }: { series: BuildSeriesMeta }) {
  return (
    <Link href={`/build/${series.slug}`} className={styles.card}>
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
    </Link>
  );
}
