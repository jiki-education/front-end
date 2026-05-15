export type ItemStatus = "shipped" | "in-progress" | "planned";

export interface RoadmapItem {
  title: string;
  description: string;
  status: ItemStatus;
}

export interface RoadmapPhase {
  label: string;
  timeframe: string;
  summary?: string;
  items: RoadmapItem[];
}

export interface ChangelogEntry {
  date: string;
  title: string;
  description: string;
}

export const changelog: ChangelogEntry[] = [
  {
    date: "May 2026",
    title: "Premium tick on Projects nav",
    description: "Premium learners now see a badge on the Projects nav item, signalling their access at a glance."
  },
  {
    date: "May 2026",
    title: "Project page aligned with lesson flow",
    description: "Project pages now match the polished loading and submission experience of the lesson player."
  },
  {
    date: "May 2026",
    title: "Context-aware chat for projects",
    description: "The CodingExercise chat now understands which project you're on, giving more relevant guidance."
  },
  {
    date: "April 2026",
    title: "Surface lesson submission errors",
    description: "Errors from the lesson submission API are now shown directly in the UI instead of failing silently."
  },
  {
    date: "April 2026",
    title: "Faster project page load",
    description: "Project pages now match the lesson loading flow, with skeleton states and parallel data fetching."
  }
];

export const phases: RoadmapPhase[] = [
  {
    label: "Now",
    timeframe: "Q2 2026",
    summary: "What we're actively building right now.",
    items: [
      {
        title: "Project-based learning flow",
        description: "Full project pages with context-aware AI chat, lesson-style submission, and progress tracking.",
        status: "in-progress"
      },
      {
        title: "Premium tier rollout",
        description: "Unlimited AI support, full course library, and the new project library for Premium users.",
        status: "in-progress"
      },
      {
        title: "JikiScript exercises expansion",
        description: "Doubling the number of exercises in the foundational JikiScript course.",
        status: "shipped"
      }
    ]
  },
  {
    label: "Next",
    timeframe: "Q3 2026",
    summary: "Designed and queued up.",
    items: [
      {
        title: "Python course (beta)",
        description: "First fully-fledged Python track, mirroring the JavaScript curriculum's depth.",
        status: "planned"
      },
      {
        title: "Achievements and streaks",
        description: "Daily streaks, badges, and shareable milestones to keep learners coming back.",
        status: "planned"
      },
      {
        title: "Mobile-first lesson player",
        description: "A redesigned exercise UI that works well on phones and tablets.",
        status: "planned"
      }
    ]
  },
  {
    label: "Later",
    timeframe: "Q4 2026 +",
    summary: "On the horizon. Subject to change as we learn.",
    items: [
      {
        title: "Community projects",
        description: "Let learners share their solutions, fork others' work, and get peer feedback.",
        status: "planned"
      },
      {
        title: "Classroom mode",
        description: "Tools for teachers to assign exercises, monitor progress, and review submissions.",
        status: "planned"
      },
      {
        title: "Native desktop app",
        description: "An offline-capable desktop client for learners with patchy internet.",
        status: "planned"
      }
    ]
  }
];
