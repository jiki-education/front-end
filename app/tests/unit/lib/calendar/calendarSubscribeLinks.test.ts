import { CALENDAR_GOOGLE_URL, CALENDAR_WEBCAL_URL } from "@/lib/calendar/calendarSubscribeLinks";

describe("calendarSubscribeLinks", () => {
  it("exposes the feed as a webcal:// subscription URL", () => {
    expect(CALENDAR_WEBCAL_URL).toBe("webcal://jiki.io/calendar.ics");
  });

  it("wraps the webcal URL in Google Calendar's add-by-URL endpoint", () => {
    expect(CALENDAR_GOOGLE_URL).toBe(
      `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(CALENDAR_WEBCAL_URL)}`
    );
    expect(CALENDAR_GOOGLE_URL).toContain("webcal%3A%2F%2Fjiki.io%2Fcalendar.ics");
  });
});
