import { getAllProjects } from "@/lib/content/getAllProjects";
import { buildScheduleIcs } from "@/lib/calendar/buildScheduleIcs";

export function GET() {
  const projects = getAllProjects("en");
  const body = buildScheduleIcs(projects, new Date());

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": "inline; filename=jiki-livestreams.ics"
    }
  });
}
