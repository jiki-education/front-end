"use client";

import { useEffect, useState } from "react";
import styles from "./UpcomingStreams.module.css";
import type { ProjectMeta } from "@/lib/content/types";

interface UpcomingStreamsProps {
  projects: ProjectMeta[];
}

export function UpcomingStreams({ projects }: UpcomingStreamsProps) {
  const livestreamed = projects.filter((p) => p.livestream);

  if (livestreamed.length === 0) {
    return null;
  }

  return (
    <div className={styles.box}>
      <h3 className={styles.heading}>Upcoming Live Sessions</h3>
      <ul className={styles.streamsList}>
        {livestreamed.map((p) => (
          <li key={p.slug} className={styles.streamsItem}>
            <span className={styles.streamsItemBullet} aria-hidden="true" />
            <span className={styles.streamsItemBody}>
              <span className={styles.streamsProjectTitle}>{p.title}</span>
              <ProjectStreamDates streams={p.upcomingStreams} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectStreamDates({ streams }: { streams: string[] }) {
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
