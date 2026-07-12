import type { ProjectMeta } from "@/lib/content/types";
import { SITE_URL } from "@/lib/site";

// Stream durations aren't tracked in content data — every livestream is
// presumed to run 2 hours.
const STREAM_DURATION_MS = 2 * 60 * 60 * 1000;

/**
 * Builds an RFC 5545 ICS feed of upcoming Jiki livestreams, one VEVENT per
 * scheduled stream across all livestreamed projects.
 */
export function buildScheduleIcs(projects: ProjectMeta[], now: Date): string {
  const events = projects
    .filter((project) => project.livestream)
    .flatMap((project) => upcomingEventsForProject(project, now));

  return foldLines([
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Jiki//Jiki Livestreams//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Jiki Livestreams",
    "X-WR-CALDESC:Live coding sessions from Jiki.",
    ...events.flat(),
    "END:VCALENDAR"
  ]).join("\r\n");
}

function upcomingEventsForProject(project: ProjectMeta, now: Date): string[][] {
  return project.upcomingStreams
    .filter((iso) => Date.parse(iso) > now.getTime())
    .map((iso) => buildEvent(project, iso, now));
}

function buildEvent(project: ProjectMeta, iso: string, now: Date): string[] {
  const start = new Date(iso);
  const end = new Date(start.getTime() + STREAM_DURATION_MS);

  return [
    "BEGIN:VEVENT",
    `UID:${project.slug}-${start.getTime()}@jiki.io`,
    `DTSTAMP:${formatIcsUtc(now)}`,
    `DTSTART:${formatIcsUtc(start)}`,
    `DTEND:${formatIcsUtc(end)}`,
    `SUMMARY:${escapeIcsText(`${project.title} (Live)`)}`,
    `DESCRIPTION:${escapeIcsText(project.description)}`,
    `URL:${SITE_URL}/build`,
    "END:VEVENT"
  ];
}

function formatIcsUtc(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

// RFC 5545 requires content lines to be folded at 75 octets, continued on
// the next line with a leading space.
function foldLines(lines: string[]): string[] {
  return lines.flatMap((line) => {
    if (line.length <= 75) {
      return [line];
    }
    const folded = [line.slice(0, 75)];
    let rest = line.slice(75);
    while (rest.length > 74) {
      folded.push(` ${rest.slice(0, 74)}`);
      rest = rest.slice(74);
    }
    folded.push(` ${rest}`);
    return folded;
  });
}
