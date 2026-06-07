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
    date: "June 7, 2026",
    title: "Launched Jiki!",
    description: "Jiki is officially live (albeit in beta!)"
  }
];

export const phases: RoadmapPhase[] = [
  {
    label: "Now",
    timeframe: "June 2026",
    summary: "What we're focused on this month.",
    items: [
      {
        title: "Ironing out launch bugs",
        description:
          "Now that Jiki is live, we're spending June squashing bugs and smoothing rough edges as real learners use the platform. Expect a steady stream of small fixes and quality-of-life improvements across the app.",
        status: "in-progress"
      },
      {
        title: "Responding to early feedback",
        description:
          "We're reading every message, support thread, and suggestion that comes in. The most impactful pieces of feedback are being turned into tweaks and small features so the experience improves week by week.",
        status: "in-progress"
      },
      {
        title: "Stabilising the foundations",
        description:
          "Behind the scenes we're tightening up reliability, performance, and observability so we have a rock-solid base to build the next wave of features on. Less visible, but the most important work we can do right now.",
        status: "in-progress"
      }
    ]
  },
  {
    label: "Next",
    timeframe: "Q3 2026",
    summary: "Designed and queued up.",
    items: [
      {
        title: "Move from Beta to Fully Live",
        description:
          "Jiki is currently in beta. Once the launch dust settles, we'll drop the beta label and graduate to a fully-live product, with stronger guarantees around reliability, a clearer pricing story, and a polished onboarding flow. This is also when we'll send the launch email to the Exercism community and kick off promotional pushes with our partners.",
        status: "planned"
      },
      {
        title: "Launch Build with Jeremy",
        description:
          "Launching July 11th, this is a brand new series where Jeremy builds real, useful projects from scratch alongside learners. Each project will be broken down into bite-sized lessons, showing not just the code but the thinking, mistakes, and decisions that go into shipping software.",
        status: "planned"
      },
      {
        title: "Add Deep Dive Videos",
        description:
          "Long-form videos that go beyond the core lessons to explore concepts in real depth. Perfect for learners who want to understand the why behind the how, and to see how ideas connect to the wider world of programming.",
        status: "planned"
      },
      {
        title: "Add first translations to other languages",
        description:
          'Bringing Jiki to learners in their own language, starting with <strong class="font-semibold">European Portuguese</strong>, <strong class="font-semibold">Spanish</strong>, <strong class="font-semibold">Japanese</strong>, and <strong class="font-semibold">Brazilian Portuguese</strong>. The whole interface and curriculum will be translated, not just the marketing pages.',
        status: "planned"
      }
    ]
  },
  {
    label: "Future",
    timeframe: "Q4 2026",
    summary: "On the horizon. Subject to change as we learn.",
    items: [
      {
        title: "Launch Python version",
        description:
          "A fully-fledged Python track that mirrors the depth of our JavaScript curriculum. Same exercise philosophy, same step-through visualiser, same level of polish, but with Python as the language of instruction.",
        status: "planned"
      },
      {
        title: "Add 10 more languages",
        description:
          "Expanding Jiki to ten additional spoken languages so even more learners can use the platform in their native tongue. We'll prioritise based on demand from the community and where we can have the biggest impact.",
        status: "planned"
      }
    ]
  }
];
