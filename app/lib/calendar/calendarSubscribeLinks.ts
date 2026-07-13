import { SITE_URL } from "@/lib/site";

// The ICS feed route (app/calendar.ics/route.ts) serving upcoming livestreams.
const ICS_PATH = "/calendar.ics";

/**
 * A `webcal://` URL subscribes (rather than one-off imports): Apple Calendar
 * and most desktop clients keep polling it, so newly scheduled streams show up
 * without re-adding. The scheme is just https swapped for webcal.
 */
export const CALENDAR_WEBCAL_URL = `${SITE_URL.replace(/^https?:/, "webcal:")}${ICS_PATH}`;

/**
 * Google Calendar's "add by URL" endpoint. `cid` must be the URL-encoded feed
 * address; Google accepts the webcal:// form and subscribes to it.
 */
export const CALENDAR_GOOGLE_URL = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(
  CALENDAR_WEBCAL_URL
)}`;
