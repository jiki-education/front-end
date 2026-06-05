"use client";

import { useEffect, useState } from "react";
import styles from "./BuildIndex.module.css";
import type { BuildSeriesMeta } from "@/lib/content/types";

interface UpcomingStreamsProps {
  series: BuildSeriesMeta[];
}

export function UpcomingStreams({ series }: UpcomingStreamsProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBox}>
        <h3 className={styles.sidebarHeading}>Upcoming Live Sessions</h3>
        <ul className={styles.streamsList}>
          {series.filter((s) => s.livestream).map((s) => (
            <li key={s.slug} className={styles.streamsItem}>
              <span className={styles.streamsItemBullet} aria-hidden="true" />
              <span className={styles.streamsItemBody}>
                <span className={styles.streamsSeriesTitle}>{s.title}</span>
                <SeriesStreamDates streams={s.upcomingStreams} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function SeriesStreamDates({ streams }: { streams: string[] }) {
  const upcoming = streams.filter((iso) => Date.parse(iso) > Date.now()).sort();

  if (upcoming.length === 0) {
    return <span className={styles.streamsTba}>To be announced</span>;
  }

  return (
    <>
      {upcoming.map((iso) => (
        <FormattedStreamDate key={iso} iso={iso} />
      ))}
    </>
  );
}

function FormattedStreamDate({ iso }: { iso: string }) {
  const [label, setLabel] = useState<string>(() => formatIsoUtc(iso));

  useEffect(() => {
    setLabel(formatIsoLocal(iso));
  }, [iso]);

  return <span className={styles.streamDate}>{label}</span>;
}

function formatIsoLocal(iso: string): string {
  const date = new Date(iso);
  const datePart = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short"
  }).format(date);
  const timePart = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
  const tzAbbr =
    new Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName")?.value ?? "";
  return `${datePart}, ${timePart}${tzAbbr ? ` ${tzAbbr}` : ""}`;
}

function formatIsoUtc(iso: string): string {
  const date = new Date(iso);
  const datePart = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC"
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC"
  }).format(date);
  return `${datePart}, ${timePart} UTC`;
}

