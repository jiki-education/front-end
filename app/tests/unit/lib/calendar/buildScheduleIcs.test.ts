import { buildScheduleIcs } from "@/lib/calendar/buildScheduleIcs";
import type { ProjectMeta } from "@/lib/content/types";

const NOW = new Date("2026-07-01T00:00:00.000Z");

function project(overrides: Partial<ProjectMeta> = {}): ProjectMeta {
  return {
    slug: "build-your-personal-homepage",
    order: 0,
    title: "Build your Personal Homepage",
    description: "Join Jeremy as he builds his own homepage from scratch.",
    tags: [],
    image: "cover.webp",
    livestream: true,
    upcomingStreams: [],
    episodeCount: 2,
    episodesIndexHash: "hash",
    locale: "en",
    ...overrides
  };
}

describe("buildScheduleIcs", () => {
  it("emits one VEVENT per upcoming stream, 2 hours long", () => {
    const ics = buildScheduleIcs([project({ upcomingStreams: ["2026-07-11T15:00:00Z"] })], NOW);

    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("DTSTART:20260711T150000Z");
    expect(ics).toContain("DTEND:20260711T170000Z");
    expect(ics).toContain("SUMMARY:Build your Personal Homepage (Live)");
    expect(ics).toContain("END:VEVENT");
  });

  it("excludes streams that have already happened", () => {
    const ics = buildScheduleIcs([project({ upcomingStreams: ["2026-01-01T00:00:00Z"] })], NOW);

    expect(ics).not.toContain("BEGIN:VEVENT");
  });

  it("excludes non-livestream projects", () => {
    const ics = buildScheduleIcs([project({ livestream: false, upcomingStreams: ["2026-07-11T15:00:00Z"] })], NOW);

    expect(ics).not.toContain("BEGIN:VEVENT");
  });

  it("gives each stream a stable, unique UID", () => {
    const ics = buildScheduleIcs([project({ upcomingStreams: ["2026-07-11T15:00:00Z", "2026-08-01T15:00:00Z"] })], NOW);

    expect(ics).toContain("UID:build-your-personal-homepage-1783782000000@jiki.io");
    expect(ics).toContain("UID:build-your-personal-homepage-1785596400000@jiki.io");
  });

  it("escapes commas and semicolons in text fields", () => {
    const ics = buildScheduleIcs(
      [
        project({
          title: "Build; Learn, Ship",
          upcomingStreams: ["2026-07-11T15:00:00Z"]
        })
      ],
      NOW
    );

    expect(ics).toContain("SUMMARY:Build\\; Learn\\, Ship (Live)");
  });

  it("always emits a well-formed VCALENDAR wrapper", () => {
    const ics = buildScheduleIcs([], NOW);

    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR")).toBe(true);
    expect(ics).toContain("X-WR-CALNAME:Jiki Livestreams");
  });
});
